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
        const { jobDesc, jobUrl, fileBase64, fileMimeType } = await request.json();

        if (!jobDesc && !jobUrl && !fileBase64) {
            return NextResponse.json(
                { error: "Either jobDesc, jobUrl, or fileBase64 is required" },
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
            console.log(`🌐 Job Analyzer: Fetching URL: ${jobUrl}`);
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
You are an expert recruiter AI. Analyze the target Job Description document attached or provided and extract structured information.

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

                const content = [];
                if (fileBase64 && fileMimeType) {
                    content.push({
                        inlineData: {
                            data: fileBase64,
                            mimeType: fileMimeType
                        }
                    });
                } else {
                    content.push(`Job Description Text:\n${finalJobDesc}`);
                }
                content.push(prompt);

                const response = await model.generateContent(content);
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
