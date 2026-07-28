import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        console.log("📥 Next.js /api/ai/interview-questions: Received request");
        const { fileBase64, resumeText, jobDesc } = await request.json();

        if (!fileBase64 && !resumeText) {
            return NextResponse.json(
                { error: "fileBase64 or resumeText is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!jobDesc) {
            return NextResponse.json(
                { error: "jobDesc is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing on server environment");
            return NextResponse.json(
                { error: "AI configuration error on the server" },
                { status: 500, headers: corsHeaders }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        let result = null;
        let lastError = null;

        const prompt = `
You are an expert technical interviewer. Generate a set of realistic interview questions based on the candidate's Resume (PDF or text) and the target Job Description below.

Job Description:
${jobDesc}

If resume text is provided directly, here it is:
${resumeText || ""}

Generate 6-8 total questions covering the following categories:
- HR Questions
- Technical Questions
- Project-based Questions
- Behavioral Questions
- Scenario-based Questions
- Coding Questions (if applicable to the job description)

For each question, provide a suggested answer, category, and difficulty level.

Please output your response strictly in the following JSON format (no markdown codeblocks, no text before or after):
{
  "questions": [
    {
      "category": "HR / Technical / Project-based / Behavioral / Scenario-based / Coding",
      "question": "The interview question text",
      "answer": "Suggested answer guidelines or complete answer text",
      "difficulty": "Easy / Medium / Hard"
    }
  ]
}
`;

        const promptParts = [prompt];
        if (fileBase64) {
            promptParts.push({
                inlineData: {
                    data: fileBase64.split(",")[1] || fileBase64,
                    mimeType: "application/pdf"
                }
            });
        }

        for (const modelName of models) {
            try {
                console.log(`🤖 Interview Questions: Trying model ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const response = await model.generateContent(promptParts);
                const responseText = response.response.text().trim();

                const parsed = JSON.parse(responseText);
                if (parsed && Array.isArray(parsed.questions)) {
                    result = parsed;
                    console.log(`✨ Interview Questions generated successfully using ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Model ${modelName} failed or returned invalid JSON:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models failed to generate interview questions.");
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Interview Questions API Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate interview questions" },
            { status: 500, headers: corsHeaders }
        );
    }
}
