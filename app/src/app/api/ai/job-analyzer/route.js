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
        console.log("📥 Next.js /api/ai/job-analyzer: Received request");
        const { jobDesc } = await request.json();

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
You are an expert recruiter AI. Analyze the target Job Description below and extract structured information.

Job Description:
${jobDesc}

Please output your analysis strictly in the following JSON format (no markdown codeblocks, no text before or after):
{
  "jobSummary": "A concise 2-3 sentence overview of the role",
  "requiredSkills": ["Skill 1", "Skill 2"],
  "preferredSkills": ["Skill 1", "Skill 2"],
  "experienceRequired": "Summary of experience required (e.g. 3+ years)",
  "educationRequirements": "Summary of education required (e.g. Bachelor's in CS)",
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "technologies": ["Tech 1", "Tech 2"],
  "softSkills": ["Soft Skill 1", "Soft Skill 2"],
  "importantAtsKeywords": ["Keyword 1", "Keyword 2"],
  "seniorityLevel": "Junior / Mid-Level / Senior / Lead"
}
`;

        for (const modelName of models) {
            try {
                console.log(`🤖 Job Analyzer: Trying model ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const response = await model.generateContent(prompt);
                const responseText = response.response.text().trim();

                const parsed = JSON.parse(responseText);
                if (parsed && parsed.jobSummary) {
                    result = parsed;
                    console.log(`✨ Job Description successfully analyzed using ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Model ${modelName} failed or returned invalid JSON:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models failed to analyze job description.");
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Job Analyzer API Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to analyze job description" },
            { status: 500, headers: corsHeaders }
        );
    }
}
