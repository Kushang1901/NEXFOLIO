import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { verifyTurnstile } from "../../../utils/turnstileVerify";

export async function POST(request) {
    try {
        const { firstName, lastName, email, provider, photoUrl, turnstileToken } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Verify Turnstile
        const turnstileResult = await verifyTurnstile(turnstileToken, "login");
        if (!turnstileResult.success) {
            return NextResponse.json(
                { error: `Security verification failed: ${turnstileResult.reason || "Bot activity detected."}` },
                { status: 403 }
            );
        }

        const db = await getDb();

        // 1. Check if user already exists
        const existingUsers = await db`
            SELECT id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", created_at AS "createdAt", last_login AS "lastLogin"
            FROM users
            WHERE email = ${email}
        `;

        if (existingUsers.length > 0) {
            // Update last login timestamp and compile details
            const updatedUsers = await db`
                UPDATE users
                SET last_login = CURRENT_TIMESTAMP,
                    first_name = COALESCE(NULLIF(${firstName}, ''), first_name),
                    last_name = COALESCE(NULLIF(${lastName}, ''), last_name),
                    photo_url = COALESCE(NULLIF(${photoUrl}, ''), photo_url)
                WHERE email = ${email}
                RETURNING id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", created_at AS "createdAt", last_login AS "lastLogin"
            `;
            const { generateLocalToken } = await import("../../../utils/authHelper");
            const token = generateLocalToken({ email: email });

            return NextResponse.json(
                {
                    message: "Login successful",
                    isNewUser: false,
                    user: updatedUsers[0],
                    token: token
                },
                { status: 200 }
            );
        }

        // 2. If user doesn't exist, automatically register/insert them (to ensure login always succeeds)
        const newUsers = await db`
            INSERT INTO users (email, first_name, last_name, provider, photo_url)
            VALUES (${email}, ${firstName || email.split("@")[0]}, ${lastName || "User"}, ${provider || "email"}, ${photoUrl || null})
            RETURNING id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", created_at AS "createdAt", last_login AS "lastLogin"
        `;

        const { generateLocalToken } = await import("../../../utils/authHelper");
        const token = generateLocalToken({ email: email });

        return NextResponse.json(
            {
                message: "Login successful (auto-registered)",
                isNewUser: true,
                user: newUsers[0],
                token: token
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("❌ Login Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
