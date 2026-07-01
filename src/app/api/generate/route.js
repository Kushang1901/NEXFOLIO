import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyRecaptcha } from "../../../utils/recaptchaVerify";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const { prompt, recaptchaToken } = await request.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Prompt is required and must be a string" },
                { status: 400 }
            );
        }

        // Verify reCAPTCHA
        const recaptchaResult = await verifyRecaptcha(recaptchaToken, "GENERATE_RESUME");
        if (!recaptchaResult.success) {
            return NextResponse.json(
                { error: `reCAPTCHA verification failed: ${recaptchaResult.reason || "Bot activity detected."}` },
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
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
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
