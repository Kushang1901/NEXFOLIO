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
        console.log("📥 Next.js /api/ai/match-score: Received request");
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
You are an expert ATS (Applicant Tracking System) recruiter and career consultant. Compare the attached Resume (either PDF file or text) with the pasted Job Description below, calculate match scores, and provide detailed feedback.

Job Description:
${jobDesc}

If resume text is provided directly, here it is:
${resumeText || ""}

Please output your analysis strictly in the following JSON format (no markdown blocks, no text before or after):
{
  "overallMatchScore": 85,
  "atsScore": 88,
  "skillsMatch": 80,
  "experienceMatch": 90,
  "educationMatch": 100,
  "projectMatch": 75,
  "keywordMatch": 70,
  "strengths": [
    "List 3-4 strengths, keep each bullet short and punchy"
  ],
  "missingSkills": [
    "List 3-4 key missing skills or technologies found in job description but not in resume"
  ],
  "weaknesses": [
    "List 2-3 areas of weakness in the resume (e.g. lack of metrics, gaps)"
  ],
  "suggestions": [
    "List 3-4 actionable improvements"
  ],
  "rewriteSuggestions": [
    {
      "original": "A weak bullet point from the resume that could be improved",
      "suggested": "A rewritten, impact-driven version of that bullet point incorporating metrics and keywords"
    },
    {
      "original": "Another bullet point",
      "suggested": "Rewritten version"
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
                console.log(`🤖 Match Score: Trying model ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const response = await model.generateContent(promptParts);
                const responseText = response.response.text().trim();

                const parsed = JSON.parse(responseText);
                if (parsed && typeof parsed.overallMatchScore === "number") {
                    result = parsed;
                    console.log(`✨ Match Score computed successfully: ${parsed.overallMatchScore}% using ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Model ${modelName} failed or returned invalid JSON:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models failed to run match score analysis.");
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Match Score API Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to analyze match score" },
            { status: 500, headers: corsHeaders }
        );
    }
}
