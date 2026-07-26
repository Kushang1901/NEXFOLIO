import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// ─── SITE KNOWLEDGE BASE FOR GRIVO ────────────────────────────────────────────
const GRIVO_SYSTEM_PROMPT = `
You are GRIVO, the official AI assistant for CVGrid (cvgrid.in) — a premium AI-powered resume builder platform.
You are friendly, professional, concise, and helpful. You have deep knowledge of all CVGrid features.

## CVGrid Features & Routes (IMPORTANT):
1. **Resume Builder** - Route: /builder - Build AI-powered resumes from scratch with 18+ templates
2. **ATS Checker** - Route: /ats-checker - Score your resume against ATS systems, get keyword analysis
3. **Templates** - Route: /templates - Browse 18+ premium resume templates
4. **Keyword Optimizer** - Route: /ai-tools/keyword-optimizer - Find missing keywords from job descriptions
5. **Cover Letter Generator** - Route: /cover-letter - Generate professional cover letters with AI
6. **Match Score** - Route: /ai-tools/match-score - Check how well your resume matches a job description
7. **Interview Generator** - Route: /ai-tools/interview-generator - Get AI interview questions based on your resume
8. **Job Analyzer** - Route: /ai-tools/job-analyzer - Analyze job descriptions for requirements
9. **Portfolio Builder** - Route: /ai-tools/portfolio-builder - Build a professional portfolio page
10. **Resume Sharing** - Route: /ai-tools/resume-sharing - Share your resume with a unique link
11. **My Resumes** - Route: /my-resumes - Manage all your saved resumes
12. **Profile** - Route: /profile - Manage your CVGrid account

## Your Behavior Rules:
- NEVER use static templated responses. Each reply must be contextually generated.
- Keep responses concise (2-4 sentences unless resume analysis).
- When a user asks about a feature, explain it and include a navigation action.
- When analyzing a resume, give specific, actionable feedback.
- If the user seems to have a weak resume, encourage them to use the Resume Builder.
- If keywords are missing, guide them to Keyword Optimizer — never say "keywords are missing", instead say something natural.
- Always be encouraging and positive.
- Do NOT hallucinate features that don't exist.
- Use emojis sparingly for a premium feel.

## Response Format:
You MUST respond with valid JSON in this exact format:
{
  "message": "Your conversational reply text here",
  "action": null | { "type": "navigate", "route": "/route-path", "label": "Button label text", "icon": "emoji" }
}

Only include action when relevant (e.g., user asks about ATS → action to /ats-checker).
The "label" should be short and actionable like "Open ATS Checker" or "Try Keyword Optimizer".
`;

const RESUME_ANALYSIS_PROMPT = `
You are GRIVO, analyzing a resume for a CVGrid user. Provide specific, actionable feedback.

Analyze the resume and respond ONLY with valid JSON:
{
  "message": "Your analysis message here (3-5 sentences, specific and helpful)",
  "issues": ["issue 1", "issue 2"], 
  "strengths": ["strength 1", "strength 2"],
  "action": null | { "type": "navigate", "route": "/route-path", "label": "Button label", "icon": "emoji" }
}

Be specific about what you see. If the resume is weak, suggest the builder. If keywords seem generic, suggest keyword optimizer.
If formatting looks off, suggest ATS checker. Always pick the most relevant single action.
`;

const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash-lite",
];

async function tryModels(genAI, modelFn) {
    let lastError = null;
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            return await modelFn(model);
        } catch (err) {
            console.warn(`⚠️ GRIVO: Model ${modelName} failed:`, err.message);
            lastError = err;
        }
    }
    throw lastError || new Error("All Gemini models failed");
}

function cleanJsonResponse(text) {
    // Strip markdown code fences if Gemini wraps in ```json ... ```
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) return fenceMatch[1].trim();
    // Strip leading/trailing whitespace
    return text.trim();
}

export async function POST(request) {
    try {
        if (!apiKey) {
            return NextResponse.json({ error: "AI configuration error" }, { status: 500 });
        }

        const body = await request.json();
        const { mode, messages, resumeData, resumeMimeType, userInfo } = body;

        const genAI = new GoogleGenerativeAI(apiKey);

        // ── RESUME ANALYSIS MODE ────────────────────────────────────
        if (mode === "resume") {
            if (!resumeData) {
                return NextResponse.json({ error: "No resume data provided" }, { status: 400 });
            }

            const result = await tryModels(genAI, async (model) => {
                const parts = [
                    { text: RESUME_ANALYSIS_PROMPT },
                    {
                        inlineData: {
                            mimeType: resumeMimeType || "application/pdf",
                            data: resumeData,
                        },
                    },
                ];
                return await model.generateContent(parts);
            });

            const rawText = result.response.text();
            const cleaned = cleanJsonResponse(rawText);

            let parsed;
            try {
                parsed = JSON.parse(cleaned);
            } catch {
                // Fallback if Gemini doesn't return valid JSON
                parsed = {
                    message: cleaned.slice(0, 500),
                    issues: [],
                    strengths: [],
                    action: { type: "navigate", route: "/builder", label: "Rebuild with AI", icon: "✨" },
                };
            }

            return NextResponse.json({ success: true, ...parsed });
        }

        // ── CHAT MODE ───────────────────────────────────────────────
        const conversationMessages = messages || [];
        const userGreeting = userInfo?.name ? `The user's name is ${userInfo.name}.` : "";

        const systemContext = `${GRIVO_SYSTEM_PROMPT}\n${userGreeting}`;

        // Build chat history for Gemini (exclude last message, that's the current)
        const history = conversationMessages.slice(0, -1).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const lastMessage = conversationMessages[conversationMessages.length - 1];
        if (!lastMessage || lastMessage.role !== "user") {
            return NextResponse.json({ error: "No user message found" }, { status: 400 });
        }

        const result = await tryModels(genAI, async (model) => {
            const chat = model.startChat({
                history: history.length > 0 ? history : undefined,
                systemInstruction: systemContext,
            });
            return await chat.sendMessage(lastMessage.content);
        });

        const rawText = result.response.text();
        const cleaned = cleanJsonResponse(rawText);

        let parsed;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            // Fallback: treat as plain message
            parsed = { message: rawText.slice(0, 800), action: null };
        }

        return NextResponse.json({ success: true, ...parsed });

    } catch (err) {
        console.error("🔥 GRIVO API Error:", err);
        return NextResponse.json(
            { error: "GRIVO is having trouble right now. Please try again!", details: err.message },
            { status: 500 }
        );
    }
}
