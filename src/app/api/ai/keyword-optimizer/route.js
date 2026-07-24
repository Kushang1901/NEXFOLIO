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
        console.log("📥 Next.js /api/ai/keyword-optimizer: Received request");
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
You are an expert ATS Optimization AI. Analyze the attached Resume (either PDF or text) and the Job Description below to do keyword matching, gap analysis, and density calculation.

Job Description:
${jobDesc}

If resume text is provided directly, here it is:
${resumeText || ""}

Please output your response strictly in the following JSON format (no markdown codeblocks, no text before or after):
{
  "keywordsFound": [
    { "keyword": "React", "count": 3 },
    { "keyword": "JavaScript", "count": 2 }
  ],
  "missingKeywords": [
    "Docker", "AWS", "CI/CD"
  ],
  "suggestedKeywords": [
    "Typescript", "Next.js", "Redis"
  ],
  "keywordDensity": [
    { "keyword": "React", "density": 4.5 },
    { "keyword": "JavaScript", "density": 3.0 },
    { "keyword": "CSS", "density": 1.5 }
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
                console.log(`🤖 Keyword Optimizer: Trying model ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const response = await model.generateContent(promptParts);
                const responseText = response.response.text().trim();

                const parsed = JSON.parse(responseText);
                if (parsed && Array.isArray(parsed.keywordsFound)) {
                    result = parsed;
                    console.log(`✨ Keywords analyzed successfully using ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Model ${modelName} failed or returned invalid JSON:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models failed to run keyword optimization.");
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Keyword Optimizer API Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to analyze keywords" },
            { status: 500, headers: corsHeaders }
        );
    }
}
