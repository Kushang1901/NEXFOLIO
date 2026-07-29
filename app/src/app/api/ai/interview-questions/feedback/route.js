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
        console.log("📥 Next.js /api/ai/interview-questions/feedback: Received request");
        const { question, userAnswer, expertAnswer } = await request.json();

        if (!question || !userAnswer) {
            return NextResponse.json(
                { error: "question and userAnswer are required" },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "AI configuration error on the server" },
                { status: 500, headers: corsHeaders }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
You are an expert technical recruiter evaluating an applicant's answer to an interview question.

Question:
${question}

Candidate's Answer:
${userAnswer}

Reference Expert/Ideal Answer details (if any):
${expertAnswer || ""}

Please evaluate the candidate's answer and output your evaluation strictly in the following JSON format (no markdown blocks, no text before or after):
{
  "score": 8.5,
  "confidence": "High / Medium / Low",
  "missingPoints": [
    "List 2-3 key technical points, terms, or concepts that the candidate missed in their answer"
  ],
  "feedback": "A concise 2-3 sentence constructive feedback on how they can improve their response"
}
`;

        const response = await model.generateContent(prompt);
        const responseText = response.response.text().trim();
        const parsed = JSON.parse(responseText);

        return NextResponse.json(parsed, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Interview Feedback API Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to evaluate answer" },
            { status: 500, headers: corsHeaders }
        );
    }
}
