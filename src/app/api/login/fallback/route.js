import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { hashPassword } from "../../../../utils/crypto";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const users = await db`
            SELECT first_name AS "firstName", last_name AS "lastName", password
            FROM users
            WHERE email = ${email}
        `;

        if (users.length === 0) {
            return NextResponse.json(
                { error: "Account does not exist in local database" },
                { status: 404 }
            );
        }

        const user = users[0];
        if (!user.password) {
            return NextResponse.json(
                { error: "This account has not set a password locally (it may have been created via Google sign-in)" },
                { status: 400 }
            );
        }

        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 401 }
            );
        }

        // Generate signed token for local authentication sessions
        const { generateLocalToken } = await import("../../../../utils/authHelper");
        const token = generateLocalToken({ email: email });

        // Return user details for mock login bypass
        return NextResponse.json({
            message: "Login fallback validation successful",
            firstName: user.firstName,
            lastName: user.lastName,
            email: email,
            token: token
        });

    } catch (err) {
        console.error("❌ Fallback Login Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
