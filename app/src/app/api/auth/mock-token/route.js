import { NextResponse } from "next/server";
import { generateLocalToken } from "../../../../utils/authHelper";

// Only allow mock tokens for specific demo accounts during development or provider fallback
const ALLOWED_MOCK_EMAILS = new Set([
    "google-demo@cvgrid.in",
    "github-demo@cvgrid.in"
]);

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Security check: strictly restrict mock tokens to designated demo accounts
        if (!ALLOWED_MOCK_EMAILS.has(email)) {
            console.warn(`🚨 [Security Alert] Unauthorized attempt to request mock token for: ${email}`);
            return NextResponse.json(
                { error: "Forbidden: Mock tokens are strictly restricted to designated demo accounts." },
                { status: 403 }
            );
        }

        // Generate fallback token signed using backend secret
        const token = generateLocalToken({ email });

        return NextResponse.json({ token });
    } catch (err) {
        console.error("❌ Mock Token Route Error:", err);
        return NextResponse.json(
            { error: "Server error generating token" },
            { status: 500 }
        );
    }
}
