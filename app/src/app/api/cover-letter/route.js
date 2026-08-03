import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

function cleanJsonResponse(text) {
    // Strip markdown code fences if Gemini wraps in ```json ... ```
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) return fenceMatch[1].trim();
    // Strip leading/trailing whitespace
    return text.trim();
}

export async function POST(request) {
    try {
        const { 
            candidateInfo, 
            jobTitle, 
            companyName, 
            jobDescription, 
            hiringManager, 
            tone, 
            customInstructions,
            resumeData,
            resumeMimeType
        } = await request.json();

        if (!candidateInfo && !resumeData) {
            return NextResponse.json(
                { error: "Candidate info or resume data is required" },
                { status: 400 }
            );
        }

        if (!jobTitle || !jobDescription) {
            return NextResponse.json(
                { error: "Job title and job description are required" },
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
        const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest", "gemini-2.0-flash-lite", "gemini-flash-lite-latest"];
        let result = null;
        let lastError = null;

        if (resumeData) {
            // Generate from uploaded resume file
            const prompt = `
You are a highly skilled professional CV parser and recruitment writer. 
Analyze the candidate's resume attached in the file and write a high-converting, tailored cover letter based on it and the job details.

Target Job Information:
- Role: ${jobTitle}
- Company: ${companyName || "the company"}
- Hiring Manager: ${hiringManager || "Hiring Manager"}
- Job Description:
${jobDescription}

Selected Writing Tone: ${tone || "Professional"}
${customInstructions ? `\nAdditional Focus / Special Instructions:\n${customInstructions}\n` : ""}

Task:
1. Extract candidate contact info and professional details from the resume: name, email, phone, target/current role, and social links (specifically linkedin, github, or portfolio if available).
2. Write a highly tailored cover letter aligning the candidate's experience and achievements in the resume with the target job description. Do NOT include date or address fields. Ensure there are no placeholders.
3. Respond ONLY with a valid JSON object matching this schema:
{
  "basics": {
    "name": "Candidate Full Name",
    "email": "Candidate Email",
    "phone": "Candidate Phone Number",
    "role": "Candidate Professional Title",
    "links": {
      "linkedin": "LinkedIn profile URL (or empty string)",
      "github": "GitHub profile URL (or empty string)",
      "portfolio": "Portfolio/Personal website URL (or empty string)"
    }
  },
  "coverLetter": "Generated cover letter body text here"
}

Do NOT output markdown block wraps like \`\`\`json. Output raw JSON only.
`;
            const parts = [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: resumeMimeType || "application/pdf",
                        data: resumeData,
                    },
                },
            ];

            for (const m of models) {
                try {
                    console.log(`🤖 Attempting cover letter generation from file with model: ${m}`);
                    const model = genAI.getGenerativeModel({ model: m });
                    result = await model.generateContent(parts);
                    console.log(`✅ Cover letter generated from file with model: ${m}`);
                    break;
                } catch (err) {
                    console.warn(`⚠️ Cover letter generation from file failed with model ${m}:`, err.message);
                    lastError = err;
                }
            }

            if (!result) {
                throw lastError || new Error("All configured Gemini models failed to generate the cover letter.");
            }

            const rawText = result.response.text();
            const cleaned = cleanJsonResponse(rawText);
            
            try {
                const parsed = JSON.parse(cleaned);
                return NextResponse.json({
                    result: parsed.coverLetter || cleaned,
                    basics: parsed.basics || null
                });
            } catch (err) {
                console.warn("⚠️ Failed to parse JSON from Gemini response, returning raw response", err);
                return NextResponse.json({
                    result: cleaned,
                    basics: null
                });
            }

        } else {
            // Standard generation using candidateInfo
            const fullName = candidateInfo.fullName || "The Candidate";
            const currentRole = candidateInfo.role || "Professional";
            const professionalSummary = candidateInfo.professionalSummary || "";
            const skills = candidateInfo.skills || "";
            const achievements = candidateInfo.achievements || "";
            const projects = candidateInfo.projects || "";
            
            let experienceStr = "";
            if (candidateInfo.experience) {
                if (typeof candidateInfo.experience === "string") {
                    experienceStr = candidateInfo.experience;
                } else {
                    const exp = candidateInfo.experience;
                    experienceStr = `${exp.role} at ${exp.company} (${exp.startYear} - ${exp.ongoing ? 'Present' : exp.endYear}). Responsibilities: ${exp.description}`;
                }
            }

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
- Company: ${companyName || "the company"}
- Hiring Manager: ${hiringManager || "Hiring Manager"}
- Job Description:
${jobDescription}

Selected Writing Tone: ${tone || "Professional"}
${customInstructions ? `\nAdditional Focus / Special Instructions:\n${customInstructions}\n` : ""}

Requirements:
1. Address the cover letter directly to the Hiring Manager or Company.
2. Structure the letter with:
   - A warm, attention-grabbing opening paragraph stating the candidate's enthusiasm for the ${jobTitle} role${companyName ? ` at ${companyName}` : ""}.
   - 1-2 body paragraphs detailing exactly how the candidate's background, skills, and specific achievements (mentioning company experience/projects) make them a perfect fit. Do NOT just list tasks; focus on value and metrics where possible.
   - A polite, proactive closing paragraph with a clear call to action (e.g. requesting an interview).
   - A professional sign-off (e.g. Sincerely, \\n\\n${fullName}).
3. Do NOT include generic placeholder text like "[Insert Date]", "[Company Address]", or "[City, State]".
4. Return ONLY the final cover letter body text. Do NOT wrap the output in markdown codeblocks (no \`\`\` or \`\`\`text).
5. Ensure the style matches the specified tone: "${tone || 'Professional'}".
`;

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
        }

    } catch (err) {
        console.error("🔥 Gemini Cover Letter Error:", err);
        return NextResponse.json(
            { error: "Failed to generate cover letter", details: err.message },
            { status: 500 }
        );
    }
}
