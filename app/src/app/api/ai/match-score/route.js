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
        const { fileBase64, resumeText, jobDesc, jobUrl } = await request.json();

        if (!fileBase64 && !resumeText) {
            return NextResponse.json(
                { error: "fileBase64 or resumeText is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!jobDesc && !jobUrl) {
            return NextResponse.json(
                { error: "jobDesc or jobUrl is required" },
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

        let finalJobDesc = jobDesc;

        if (jobUrl) {
            console.log(`🌐 Match Score Scraper: Fetching URL: ${jobUrl}`);
            try {
                const response = await fetch(jobUrl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch the URL (Status code: ${response.status})`);
                }
                const rawHtml = await response.text();
                
                // Clean HTML to save tokens
                const cleanText = rawHtml
                    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
                    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()
                    .substring(0, 30000);

                const genAI = new GoogleGenerativeAI(apiKey);
                const tempModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const extractPrompt = `
You are a job scraper assistant. Extract ONLY the job description text (including title, company, requirements, duties, skills) from this raw webpage text:

${cleanText}

Return only the clean extracted job description.
`;
                const tempRes = await tempModel.generateContent(extractPrompt);
                finalJobDesc = tempRes.response.text().trim();
                if (!finalJobDesc || finalJobDesc.length < 50) {
                    throw new Error("Could not extract a meaningful job description from the page content.");
                }
            } catch (err) {
                console.error("Scraping error:", err);
                return NextResponse.json(
                    { error: `Could not load job description from the URL. Please copy and paste the text directly. (Error: ${err.message})` },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        let result = null;
        let lastError = null;

        const prompt = `
You are an expert ATS (Applicant Tracking System) recruiter and career consultant. Compare the attached Resume (either PDF file or text) with the target Job Description below, calculate match scores, and provide detailed feedback.

Job Description:
${finalJobDesc}

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
    "List 3-4 actionable improvements (e.g. 'Add REST API Development', 'Mention JWT')"
  ],
  "rewriteSuggestions": [
    {
      "original": "A weak bullet point from the resume that could be improved",
      "suggested": "A rewritten, impact-driven version of that bullet point incorporating metrics and keywords"
    }
  ],
  "skillsComparison": [
    { "skill": "Skill Name 1", "matched": true },
    { "skill": "Skill Name 2", "matched": false }
  ],
  "recruiterSummary": "A short, 3-4 sentence professional hiring manager assessment of the candidate profile. E.g., 'This candidate matches approximately 88% of the job requirements...'",
  "interviewQuestions": [
    "Likely Interview Question 1",
    "Likely Interview Question 2",
    "Likely Interview Question 3"
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
