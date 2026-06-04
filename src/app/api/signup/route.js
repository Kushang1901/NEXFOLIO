import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function POST(request) {
    try {
        const { firstName, lastName, email, provider, photoUrl } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
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
        const newUsers = await db`
            INSERT INTO users (email, first_name, last_name, provider, photo_url)
            VALUES (${email}, ${firstName || email.split("@")[0]}, ${lastName || "User"}, ${provider || "email"}, ${photoUrl || null})
            RETURNING id, email, first_name AS "firstName", last_name AS "lastName", provider, photo_url AS "photoUrl", created_at AS "createdAt", last_login AS "lastLogin"
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
        console.error("❌ Signup Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
