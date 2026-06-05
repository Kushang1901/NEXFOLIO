import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const { resumeData, targetLanguage } = await request.json();

        if (!resumeData) {
            return NextResponse.json(
                { error: "Resume data is required" },
                { status: 400 }
            );
        }

        if (!targetLanguage) {
            return NextResponse.json(
                { error: "Target language is required" },
                { status: 400 }
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

        const prompt = `
You are an expert multi-language translator. Translate the text fields in the provided Resume JSON object into the target language: "${targetLanguage}".

Rules:
1. Translate all human-readable string values (like fullName, role, professionalSummary, course, field, company, location, description, projects, achievements, skills, and dates/months).
2. DO NOT translate technical key names (like "fullName", "graduation", "course", "startMonth", "hasPostGraduation", "ongoing", etc.). Keep the JSON keys exactly the same.
3. Keep structural booleans (like hasPostGraduation, hasPhd, hasInternship, hasExperience, ongoing) as booleans. Do NOT convert them to strings.
4. Maintain exactly the same JSON structure.
5. Return ONLY the translated JSON object matching the input structure.

Input Resume JSON:
${JSON.stringify(resumeData)}
`;

        for (const m of models) {
            try {
                console.log(`🤖 Attempting resume translation with model: ${m}`);
                const model = genAI.getGenerativeModel({
                    model: m,
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                });

                result = await model.generateContent(prompt);
                console.log(`✅ Resume translated successfully with model: ${m}`);
                break;
            } catch (err) {
                console.warn(`⚠️ Resume translation failed with model ${m}:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All configured Gemini models failed to translate the resume.");
        }

        const parsedJson = JSON.parse(result.response.text().trim());
        return NextResponse.json(parsedJson);

    } catch (err) {
        console.error("🔥 Gemini API Translate Error:", err);
        return NextResponse.json(
            { error: "Failed to translate resume", details: err.message },
            { status: 500 }
        );
    }
}
