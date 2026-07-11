import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, x-app-request",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        console.log("📥 Next.js /api/ats: Received resume ATS check request");
        const { fileBase64, jobDesc } = await request.json();

        if (!fileBase64) {
            return NextResponse.json(
                { error: "fileBase64 is required" },
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
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
        let result = null;
        let lastError = null;

        const prompt = `
You are an expert Applicant Tracking System (ATS) optimization AI. Your task is to analyze the attached resume document and the target Job Description below, calculate an ATS compatibility score, conduct a detailed section-by-section analysis, and provide top actionable suggestions for improvements.

Target Job Description:
${jobDesc || "(None provided. Conduct a general ATS-best-practices check against industry standard formatting, sections, contact information, and quantified achievements.)"}

Please output your response strictly in the following JSON format:
{
  "score": 85, 
  "grade": "A", 
  "gradeColor": "#22c55e", 
  "sections": [
    {
      "label": "Contact Info",
      "status": "pass", 
      "detail": "Email and phone number detected ✓"
    },
    {
      "label": "Work Experience",
      "status": "pass",
      "detail": "Structured roles and durations detected ✓"
    },
    {
      "label": "Education",
      "status": "pass",
      "detail": "Clear degree and institution headings detected ✓"
    },
    {
      "label": "Keywords Match",
      "status": "warn",
      "detail": "Missing some core keywords like 'React' or 'TypeScript'"
    },
    {
      "label": "Quantified Achievements",
      "status": "fail",
      "detail": "Bullet points lack metrics/numbers to prove impact"
    }
  ],
  "improvements": [
    "Add a dedicated 'Skills' section with standard headings",
    "Include measurable metrics (e.g. 'increased load times by 20%')",
    "Add missing keyword skills from the job description"
  ]
}

Ensure the sections array evaluates:
1. "Contact Info" (Email, Phone, Location status)
2. "Work Experience" (Roles, durations)
3. "Education" (Degrees, institutions)
4. "Keywords Match" (Check for exact matching keyword terms based on the job description, or general best keywords)
5. "Quantified Achievements" (Check for metrics, percentages, dollar figures or numbers in description bullet points)

Return ONLY the raw JSON object. Do not wrap it in markdown block quotes or text.
`;

        const filePart = {
            inlineData: {
                data: fileBase64.split(",")[1] || fileBase64,
                mimeType: "application/pdf" // default parser mimetype
            }
        };

        for (const modelName of models) {
            try {
                console.log(`🤖 ATS: Trying model ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const response = await model.generateContent([prompt, filePart]);
                const responseText = response.response.text();

                // Clean JSON formatting if wrapped in code blocks
                const jsonText = responseText
                    .replace(/^```json\s*/i, "")
                    .replace(/```\s*$/, "")
                    .trim();

                const parsed = JSON.parse(jsonText);
                if (parsed && typeof parsed.score === "number") {
                    result = parsed;
                    console.log(`✨ ATS Score successfully computed: ${parsed.score}% using ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Model ${modelName} failed or returned invalid JSON:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All configured Gemini models failed to check the resume.");
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Gemini ATS Check Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to analyze resume ATS compatibility" },
            { status: 500, headers: corsHeaders }
        );
    }
}
