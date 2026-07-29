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
        const { 
            fileBase64, 
            resumeText, 
            jobDesc, 
            jobUrl,
            interviewType = "Technical",
            experienceLevel = "0-2 Years",
            difficulty = "Medium",
            numQuestions = 10,
            companyType = "Product"
        } = await request.json();

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
            console.log(`🌐 Interview Prep Scraper: Fetching URL: ${jobUrl}`);
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
You are an expert ${interviewType} interviewer at a ${companyType} company. Generate a set of realistic interview questions based on the candidate's Resume (PDF or text) and the target Job Description below.

Job Description:
${finalJobDesc}

If resume text is provided directly, here it is:
${resumeText || ""}

Please tailor the generated questions using these specifications:
- Interview focus category: ${interviewType}
- Target difficulty level: ${difficulty}
- Candidate experience target: ${experienceLevel}
- Generate exactly ${Math.min(numQuestions, 10)} total questions (limit to 10 max for performance).

For each question:
1. Provide a suggested answer or tip.
2. Specify the probability rating (1-5 stars representing likelihood of being asked by recruiter).
3. If coding or technical, optionally include a "codingProblem" field with starter code, and solution.

Please output your response strictly in the following JSON format (no markdown codeblocks, no text before or after):
{
  "questions": [
    {
      "category": "${interviewType}",
      "question": "The interview question text",
      "answer": "Suggested ideal/expert answer or detailed tip",
      "difficulty": "${difficulty}",
      "probability": 5,
      "codingProblem": {
        "problem": "Write a function...",
        "solution": "const fn = () => ...",
        "timeLimit": "30 mins"
      }
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
