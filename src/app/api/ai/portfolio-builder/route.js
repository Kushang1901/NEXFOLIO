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
        console.log("📥 Next.js /api/ai/portfolio-builder: Received request");
        const { resumeData, templateType } = await request.json();

        if (!resumeData) {
            return NextResponse.json(
                { error: "resumeData is required" },
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
You are a premium frontend developer AI. Generate a professional, modern, fully responsive recruiter-friendly portfolio website based on the resume data provided below.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Selected Template Type: ${templateType || "modern"}

Instructions for the template type:
1. "classic": Make it extremely elegant, use refined serif headers (like Playfair Display), clean borders, ample spacing, standard profile grids, perfect mobile responsiveness, and light/medium colors.
2. "dark_glass" (or "modern"): Make a stunning, modern dark-theme website with glassmorphism (backdrop-filter: blur), vibrant gradient highlights (indigo to purple), hover animations, and a smooth scrolling layout.
3. "dev_terminal": Make a retro-developer monospace terminal layout (green/cyan text on #0f131a background), mimicking a shell interface. Include terminal prompts for sections (e.g. "guest@cvgrid:~$ cat experience.txt"), a blinking cursor, and tab/sidebar navigation.

Ensure the generated code includes:
- An introduction / hero section with name and role.
- About Me / Profile summary.
- Experience / Internship details formatted beautifully.
- Education details.
- Projects list with mock buttons or descriptions.
- Skills categorized and displayed in nice badges.
- Contact form or details (with email/phone/github/linkedin).

Return your response strictly in the following JSON format:
{
  "html": "Write the index.html content here. Do NOT include inline CSS or script blocks. Use semantic markup. Link style.css and script.js.",
  "css": "Write the style.css stylesheet here. Include premium fonts, custom resets, layouts, hover transformations, scroll animations, and CSS custom variables.",
  "js": "Write the script.js here. Add simple interactions, animations, active navbar highlighting, theme switches, or terminal typewriters."
}

Do NOT wrap the response in markdown blocks or include any additional text. Return raw JSON.
`;

        for (const modelName of models) {
            try {
                console.log(`🤖 Portfolio Builder: Trying model ${modelName}...`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });
                const response = await model.generateContent(prompt);
                const responseText = response.response.text().trim();

                const parsed = JSON.parse(responseText);
                if (parsed && parsed.html && parsed.css) {
                    result = parsed;
                    console.log(`✨ Portfolio code successfully generated using ${modelName}`);
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Model ${modelName} failed or returned invalid JSON:`, err.message);
                lastError = err;
            }
        }

        if (!result) {
            throw lastError || new Error("All Gemini models failed to generate portfolio site.");
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("🔥 Portfolio Builder API Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to build portfolio website" },
            { status: 500, headers: corsHeaders }
        );
    }
}
