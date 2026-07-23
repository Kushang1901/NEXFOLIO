import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const { action, jobTitle, companyName, candidateInfo, jobDescription } = await request.json();

        if (!action) {
            return NextResponse.json(
                { error: "Action parameter is required" },
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

        let prompt = "";

        if (action === "job-description") {
            if (!jobTitle || !companyName) {
                return NextResponse.json(
                    { error: "Job title and company name are required to generate a job description" },
                    { status: 400 }
                );
            }
            prompt = `
You are an expert HR manager. Write a realistic, professional job description for the following position:
- Job Title: ${jobTitle}
- Company: ${companyName}

Provide 3-4 key responsibilities and requirements that would typically be expected for this role.
Keep it concise, realistic, and formatted in clear bullet points (using hyphens or asterisks). Do NOT include any markdown codeblocks, greeting, or introduction text. Return only the bullet points.
`;
        } else if (action === "focus-instructions") {
            if (!candidateInfo) {
                return NextResponse.json(
                    { error: "Candidate info is required to generate focus instructions" },
                    { status: 400 }
                );
            }

            const fullName = candidateInfo.fullName || candidateInfo.basics?.name || "The Candidate";
            const currentRole = candidateInfo.role || candidateInfo.basics?.role || "Professional";
            const skills = candidateInfo.skills || "";
            
            let experienceStr = "";
            if (candidateInfo.experience) {
                if (typeof candidateInfo.experience === "string") {
                    experienceStr = candidateInfo.experience;
                } else if (Array.isArray(candidateInfo.experience)) {
                    experienceStr = candidateInfo.experience.map(exp => 
                        `${exp.role || exp.position} at ${exp.company} (${exp.startYear || exp.startDate} - ${exp.ongoing ? 'Present' : (exp.endYear || exp.endDate)}).`
                    ).join(" ");
                } else {
                    const exp = candidateInfo.experience;
                    experienceStr = `${exp.role || exp.position} at ${exp.company} (${exp.startYear || exp.startDate} - ${exp.ongoing ? 'Present' : (exp.endYear || exp.endDate)}).`;
                }
            }

            prompt = `
You are a professional resume advisor. Based on the candidate's profile and the target job below, suggest 2-3 specific, tailored focus instructions (actionable advice) that the candidate should use to guide their cover letter generation.

Candidate Profile:
- Name: ${fullName}
- Title: ${currentRole}
- Skills: ${skills}
- Experience: ${experienceStr}

Target Job Details:
- Title: ${jobTitle || "Not specified"}
- Company: ${companyName || "Not specified"}
- Job Description:
${jobDescription || "Not provided"}

Identify the strongest matches between the candidate's background and the target role.
Suggest what specific experience, skills, or projects the candidate should highlight in their cover letter.
Keep the advice short, direct, and actionable (e.g. "Focus on your React migration work at Company X, as it directly matches their frontend requirements").
Keep the output under 100 words in total. Do NOT include markdown codeblocks, greeting, or introduction text. Return only the direct advice.
`;
        } else {
            return NextResponse.json(
                { error: "Invalid action. Supported actions are 'job-description' and 'focus-instructions'" },
                { status: 400 }
            );
        }

        for (const m of models) {
            try {
                console.log(`🤖 Attempting AI helper with model: ${m}`);
                const model = genAI.getGenerativeModel({ model: m });
                result = await model.generateContent(prompt);
                console.log(`✅ AI helper generated content with model: ${m}`);
                break;
            } catch (err) {
                console.warn(`⚠️ AI helper failed with model ${m}:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All configured Gemini models failed to run.");
        }

        const text = result.response.text();
        return NextResponse.json({ result: text.trim() });

    } catch (err) {
        console.error("🔥 Gemini AI Helper Error:", err);
        return NextResponse.json(
            { error: "Failed to generate helper content", details: err.message },
            { status: 500 }
        );
    }
}
