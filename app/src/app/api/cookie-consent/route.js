import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function POST(request) {
    try {
        const { consentId, consentStatus, userEmail } = await request.json();

        if (!consentId || !consentStatus) {
            return NextResponse.json(
                { error: "consentId and consentStatus are required" },
                { status: 400 }
            );
        }

        const userAgent = request.headers.get("user-agent") || "unknown";
        // Retrieve IP address from standard headers, with fallback to local IP
        const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "127.0.0.1";

        const db = await getDb();
        await db`
            INSERT INTO cookie_consents (consent_id, user_email, consent_status, user_agent, ip_address)
            VALUES (${consentId}, ${userEmail || null}, ${consentStatus}, ${userAgent}, ${ipAddress})
            ON CONFLICT (consent_id)
            DO UPDATE SET
                consent_status = EXCLUDED.consent_status,
                user_email = COALESCE(EXCLUDED.user_email, cookie_consents.user_email),
                user_agent = EXCLUDED.user_agent,
                ip_address = EXCLUDED.ip_address,
                updated_at = CURRENT_TIMESTAMP
        `;

        return NextResponse.json({ message: "Cookie preference stored successfully" });
    } catch (err) {
        console.error("❌ Cookie Consent POST Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
