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
        const { resumeData, templateType, accentColor, customInstructions } = await request.json();

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

        const templateInstructions = {
            bento_grid: `Dribbble/Apple style modern Bento Grid layout.
- Use a 3-column modular bento grid on desktop, cascading gracefully to single-column on mobile.
- Use frosted translucent dark cards, subtle gradient borders, and stat highlight pills.
- Include interactive tech stack pills, project cards with demo/code links, and a clean timeline.`,
            dev_terminal: `Cyberpunk / Developer Terminal CLI layout.
- Styled like a modern interactive Unix terminal workstation (Fira Code or JetBrains Mono font).
- Window top bar with red/yellow/green circle buttons and user@workstation title.
- Sections formatted as commands: "whoami --verbose", "cat skills.json", "ls -la ./projects", "git log --experience".
- Dark hacker aesthetic (#0a0e14) with green (#22c55e) and cyan/accent neon accents, plus a blinking prompt cursor.`,
            dark_glass: `Sleek dark-theme glassmorphic layout.
- Translucent frosted glass cards (backdrop-filter: blur), ambient gradient spheres, and glowing hover states.
- Clean typography using Inter/Plus Jakarta Sans.
- Rich hover animations, smooth scrolling, and elegant badges.`,
            minimalist: `Ultra-clean Scandinavian minimalist layout.
- Generous whitespace, high-contrast dark text on a clean light-gray background (#f8fafc).
- Clean borders, monospace labels (JetBrains Mono) combined with sans-serif body text.
- Focused on pure content clarity and lightning-fast recruiter readability without unnecessary shadows or heavy gradients.`,
            classic: `Executive corporate serif layout.
- Refined editorial typography using Playfair Display for headings and clean sans-serif for body text.
- Timeless borders, centered header with contact bar, structured timeline for experience, and clean executive project cards.
- Suitable for senior executives, directors, consultants, and legal/finance professionals.`
        };

        const chosenStyleDesc = templateInstructions[templateType] || templateInstructions.dark_glass;

        const prompt = `
You are an elite, award-winning frontend developer and UI/UX designer.
Generate a complete, fully functional, responsive, recruiter-ready personal portfolio website for the candidate based on the resume data provided below.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Selected Template Style: "${templateType || "dark_glass"}"
Design Guidelines for this style:
${chosenStyleDesc}

Preferred Theme Accent Color: "${accentColor || "#6366f1"}"
${customInstructions ? `Special User Instructions to Incorporate: "${customInstructions}"` : ""}

Mandatory Requirements:
1. Complete Semantic HTML5 Structure:
   - Proper <head> with responsive meta tags, Google Fonts, and meta description.
   - Accessible navigation with logo/name, links to sections (#about, #projects, #experience, #skills, #contact), and mobile-responsive layout.
   - High-impact Hero section with name, current role/title, value proposition summary, and CTA buttons ("View Projects", "Contact Me").
   - Projects Section: Render each project with its title, concise description, tech stack tags, and demo/code links.
   - Experience Section: Timeline or structured cards showing role, company, dates, and bulleted achievements.
   - Skills Section: Categorized or badged competencies with modern pill styling.
   - Education Section: Degree, institution, year, and honors.
   - Contact Section: Direct email link, phone, location, and social links (GitHub, LinkedIn, Twitter if available).
   - Clean Footer with copyright.

2. Production-Grade CSS (style.css):
   - Modern CSS variables for colors, fonts, spacing, and border-radius.
   - Responsive design with fluid layouts and media queries for desktop, tablet, and mobile.
   - Smooth transitions, subtle hover transformations, and crisp layout hierarchy.
   - Do NOT rely on external build tools; write pure, modern vanilla CSS.

3. Interactive Vanilla JavaScript (script.js):
   - Smooth scrolling for internal anchor links.
   - Responsive mobile navigation toggle.
   - Interactive touches (such as dynamic year in footer, interactive project tag filtering, or copy-to-clipboard email feedback).

Return your response strictly in the following JSON format:
{
  "html": "Write the full index.html content here. Link to style.css in <head> and script.js before </body>.",
  "css": "Write the complete style.css stylesheet here.",
  "js": "Write the complete script.js here."
}

Do NOT wrap the response in markdown blocks or include any introductory text. Return ONLY valid JSON.
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
