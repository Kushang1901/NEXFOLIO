import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyTurnstile } from "../../../utils/turnstileVerify";
import { checkRateLimit, getClientIp } from "../../../utils/rateLimiter";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { prompt, turnstileToken } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Prompt is required and must be a string" },
                { status: 400 }
            );
        }

        // Limit maximum prompt length to prevent excessive token abuse
        if (prompt.length > 15000) {
            return NextResponse.json(
                { error: "Prompt exceeds maximum allowed length (15,000 characters)." },
                { status: 413 }
            );
        }

        // Rate limit: 20 generations per 10 minutes per IP
        const clientIp = getClientIp(request);
        const rateCheck = checkRateLimit(`ai-generate:ip:${clientIp}`, 20, 10 * 60 * 1000);
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: "Too many AI generation requests. Please wait a few minutes before trying again." },
                { status: 429 }
            );
        }

        // Verify Turnstile security token
        const turnstileResult = await verifyTurnstile(turnstileToken, "generate_resume");
        if (!turnstileResult.success) {
            return NextResponse.json(
                { error: `Security verification failed: ${turnstileResult.reason || "Bot activity detected."}` },
                { status: 403 }
            );
        }

        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing on server environment");
            return NextResponse.json(
                { error: "AI configuration error on the server" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-lite-latest"];
        let result = null;
        let lastError = null;

        for (const m of models) {
            try {
                console.log(`🤖 Attempting AI generation with model: ${m}`);
                const model = genAI.getGenerativeModel({ model: m });
                result = await model.generateContent(prompt);
                console.log(`✅ AI generation succeeded with model: ${m}`);
                break;
            } catch (err) {
                console.warn(`⚠️ AI generation failed with model ${m}:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All configured Gemini models failed to generate content.");
        }

        const text = result.response.text();
        return NextResponse.json({ result: text });

    } catch (err) {
        console.error("🔥 Gemini API Error:", err);
        return NextResponse.json(
            { error: "AI request failed", details: err.message },
            { status: 500 }
        );
    }
}
