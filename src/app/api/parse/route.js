import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request) {
    try {
        const { fileBase64 } = await request.json();

        if (!fileBase64) {
            return NextResponse.json(
                { error: "fileBase64 is required" },
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

        const prompt = `
You are an expert resume parsing AI. Analyze the attached resume PDF document and extract its structured details into the JSON format specified below.

JSON schema:
{
  "fullName": "Name of the person",
  "role": "Current or target job role (e.g. Senior Software Engineer)",
  "email": "Email address",
  "phone": "Phone number",
  "portfolio": "Portfolio link or website if any",
  "linkedin": "LinkedIn profile link if any",
  "github": "GitHub profile link if any",
  "professionalSummary": "A concise professional summary or bio",
  "graduation": {
    "course": "Degree and field of study (e.g., Bachelor of Science in Computer Science)",
    "startMonth": "Start month (full name, e.g. August)",
    "startYear": "Start year (4-digit, e.g. 2018)",
    "endMonth": "End month (full name, e.g. May)",
    "endYear": "End year (4-digit, e.g. 2022)"
  },
  "hasPostGraduation": true/false,
  "postGraduation": {
    "course": "Degree and field of study (e.g., Master of Science in Data Science)",
    "startMonth": "Start month",
    "startYear": "Start year",
    "endMonth": "End month",
    "endYear": "End year"
  },
  "hasPhd": true/false,
  "phd": {
    "course": "Field of study",
    "startMonth": "Start month",
    "startYear": "Start year",
    "endMonth": "End month",
    "endYear": "End year"
  },
  "hasInternship": true/false,
  "internship": {
    "field": "Internship role (e.g. Frontend Web Developer Intern)",
    "company": "Company name",
    "ongoing": true/false,
    "startMonth": "Start month",
    "startYear": "Start year",
    "endMonth": "End month (leave empty if ongoing)",
    "endYear": "End year (leave empty if ongoing)"
  },
  "hasExperience": true/false,
  "experience": {
    "company": "Company name",
    "location": "Location (City, State/Country)",
    "role": "Job Title",
    "salary": "Salary if mentioned, otherwise leave empty",
    "ongoing": true/false,
    "startMonth": "Start month",
    "startYear": "Start year",
    "endMonth": "End month (leave empty if ongoing)",
    "endYear": "End year (leave empty if ongoing)",
    "description": "A bulleted or paragraph description of responsibilities and achievements"
  },
  "projects": "A list of projects with details, formatted cleanly (e.g., Project Name\\n- Bullet point details)",
  "achievements": "A list of achievements/certifications, formatted cleanly",
  "skills": "A comma-separated list of technical/professional skills"
}

Strict requirements:
1. Return ONLY the valid JSON object. Do not wrap it in markdown codeblocks.
2. Ensure types match (booleans for hasPostGraduation, hasPhd, hasInternship, hasExperience, ongoing).
3. If a field is not found in the resume, leave it as an empty string "" or false (for booleans).
4. Translate shorthand months (e.g. "Aug", "08") to full month names (e.g. "August").
5. Translate two-digit years (e.g. "'22") to four-digit years (e.g. "2022"). StartYear/EndYear should be strings representing 4-digit years (e.g., "2020").
`;

        for (const m of models) {
            try {
                console.log(`🤖 Attempting resume parsing with model: ${m}`);
                const model = genAI.getGenerativeModel({
                    model: m,
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                });

                result = await model.generateContent([
                    {
                        inlineData: {
                            data: fileBase64,
                            mimeType: "application/pdf"
                        }
                    },
                    prompt
                ]);

                console.log(`✅ Resume parsed successfully with model: ${m}`);
                break;
            } catch (err) {
                console.warn(`⚠️ Resume parsing failed with model ${m}:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All configured Gemini models failed to parse the resume.");
        }

        const parsedJson = JSON.parse(result.response.text().trim());
        return NextResponse.json(parsedJson);

    } catch (err) {
        console.error("🔥 Gemini API Parse Error:", err);
        return NextResponse.json(
            { error: "Failed to parse resume", details: err.message },
            { status: 500 }
        );
    }
}
