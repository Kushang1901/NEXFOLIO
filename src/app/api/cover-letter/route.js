import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const { candidateInfo, jobTitle, companyName, jobDescription, hiringManager, tone, customInstructions } = await request.json();

        if (!candidateInfo) {
            return NextResponse.json(
                { error: "Candidate info is required" },
                { status: 400 }
            );
        }

        if (!jobTitle || !companyName || !jobDescription) {
            return NextResponse.json(
                { error: "Job title, company name, and job description are required" },
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

        // Format candidate experiences, projects, skills, education for prompt
        const fullName = candidateInfo.fullName || "The Candidate";
        const currentRole = candidateInfo.role || "Professional";
        const professionalSummary = candidateInfo.professionalSummary || "";
        const skills = candidateInfo.skills || "";
        const achievements = candidateInfo.achievements || "";
        const projects = candidateInfo.projects || "";
        
        // Experience parsing
        let experienceStr = "";
        if (candidateInfo.experience) {
            if (typeof candidateInfo.experience === "string") {
                experienceStr = candidateInfo.experience;
            } else {
                const exp = candidateInfo.experience;
                experienceStr = `${exp.role} at ${exp.company} (${exp.startYear} - ${exp.ongoing ? 'Present' : exp.endYear}). Responsibilities: ${exp.description}`;
            }
        }

        // Education parsing
        let educationStr = "";
        if (candidateInfo.graduation) {
            educationStr += `Graduation: ${candidateInfo.graduation.course} (${candidateInfo.graduation.startYear} - ${candidateInfo.graduation.endYear}). `;
        }
        if (candidateInfo.hasPostGraduation && candidateInfo.postGraduation) {
            educationStr += `Post-Graduation: ${candidateInfo.postGraduation.course} (${candidateInfo.postGraduation.startYear} - ${candidateInfo.postGraduation.endYear}). `;
        }

        const prompt = `
You are a highly skilled recruitment writer. Draft a polished, high-converting, and compelling cover letter tailored to the candidate's professional achievements and the target job description.

Candidate Information:
- Name: ${fullName}
- Current/Target Role: ${currentRole}
- Professional Summary: ${professionalSummary}
- Skills: ${skills}
- Work Experience: ${experienceStr}
- Projects: ${projects}
- Achievements: ${achievements}
- Education: ${educationStr}

Target Job Information:
- Role: ${jobTitle}
- Company: ${companyName}
- Hiring Manager: ${hiringManager || "Hiring Manager"}
- Job Description:
${jobDescription}

Selected Writing Tone: ${tone || "Professional"}
${customInstructions ? `\nAdditional Focus / Special Instructions:\n${customInstructions}\n` : ""}

Requirements:
1. Address the cover letter directly to the Hiring Manager or Company.
2. Structure the letter with:
   - A warm, attention-grabbing opening paragraph stating the candidate's enthusiasm for the ${jobTitle} role at ${companyName}.
   - 1-2 body paragraphs detailing exactly how the candidate's background, skills, and specific achievements (mentioning company experience/projects) make them a perfect fit. Do NOT just list tasks; focus on value and metrics where possible.
   - A polite, proactive closing paragraph with a clear call to action (e.g. requesting an interview).
   - A professional sign-off (e.g. Sincerely, \\n\\n${fullName}).
3. Do NOT include generic placeholder text like "[Insert Date]", "[Company Address]", or "[City, State]".
4. Return ONLY the final cover letter body text. Do NOT wrap the output in markdown codeblocks (no \`\`\` or \`\`\`text).
5. Ensure the style matches the specified tone: "${tone || 'Professional'}".
`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-lite-latest"];
        let result = null;
        let lastError = null;

        for (const m of models) {
            try {
                console.log(`🤖 Attempting cover letter generation with model: ${m}`);
                const model = genAI.getGenerativeModel({ model: m });
                result = await model.generateContent(prompt);
                console.log(`✅ Cover letter generated with model: ${m}`);
                break;
            } catch (err) {
                console.warn(`⚠️ Cover letter generation failed with model ${m}:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All configured Gemini models failed to generate the cover letter.");
        }

        const text = result.response.text();
        return NextResponse.json({ result: text.trim() });

    } catch (err) {
        console.error("🔥 Gemini Cover Letter Error:", err);
        return NextResponse.json(
            { error: "Failed to generate cover letter", details: err.message },
            { status: 500 }
        );
    }
}
