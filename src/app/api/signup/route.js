import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { verifyRecaptcha } from "../../../utils/recaptchaVerify";
import { hashPassword } from "../../../utils/crypto";

export async function POST(request) {
    try {
        const { firstName, lastName, email, provider, photoUrl, password, dateOfBirth, recaptchaToken } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Verify reCAPTCHA
        const recaptchaResult = await verifyRecaptcha(recaptchaToken, "SIGNUP");
        if (!recaptchaResult.success) {
            return NextResponse.json(
                { error: `reCAPTCHA verification failed: ${recaptchaResult.reason || "Bot activity detected."}` },
                { status: 403 }
            );
        }

        const db = await getDb();

        // 1. Check if user already exists
        const existingUsers = await db`
            SELECT id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", date_of_birth AS "dateOfBirth", created_at AS "createdAt", last_login AS "lastLogin"
            FROM users
            WHERE email = ${email}
        `;

        if (existingUsers.length > 0) {
            return NextResponse.json(
                {
                    message: "User already exists",
                    isNewUser: false,
                    user: existingUsers[0]
                },
                { status: 200 }
            );
        }

        // 2. Insert new user
        const hashedPassword = hashPassword(password);
        const newUsers = await db`
            INSERT INTO users (email, first_name, last_name, provider, photo_url, password, date_of_birth)
            VALUES (${email}, ${firstName || email.split("@")[0]}, ${lastName || "User"}, ${provider || "email"}, ${photoUrl || null}, ${hashedPassword}, ${dateOfBirth || null})
            RETURNING id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", date_of_birth AS "dateOfBirth", created_at AS "createdAt", last_login AS "lastLogin"
        `;

        return NextResponse.json(
            {
                message: "Signup successful",
                isNewUser: true,
                user: newUsers[0]
            },
            { status: 201 }
        );

    } catch (err) {
        // Handle race conditions where parallel requests trigger duplicate inserts
        if (err.code === "23505" || err.message?.includes("unique constraint")) {
            console.warn("ℹ️ Signup Route: Handled parallel signup race condition (duplicate key).");
            try {
                const db = await getDb();
                const existingUsers = await db`
                    SELECT id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", date_of_birth AS "dateOfBirth", created_at AS "createdAt", last_login AS "lastLogin"
                    FROM users
                    WHERE email = ${email}
                `;
                if (existingUsers.length > 0) {
                    return NextResponse.json(
                        {
                            message: "User already exists (race condition resolved)",
                            isNewUser: false,
                            user: existingUsers[0]
                        },
                        { status: 200 }
                    );
                }
            } catch (innerErr) {
                console.error("❌ Inner error resolving duplicate key:", innerErr);
            }
        }

        console.error("❌ Signup Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
