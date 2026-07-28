import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const checkExistenceOnly = searchParams.get("checkExistenceOnly") === "true";

        if (checkExistenceOnly && email) {
            const db = await getDb();
            const users = await db`
                SELECT id FROM users WHERE email = ${email}
            `;
            return NextResponse.json({ exists: users.length > 0 });
        }

        const { verifyAuth } = await import("../../../utils/authHelper");
        const authedEmail = await verifyAuth(request);
        if (!authedEmail) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid or missing token" },
                { status: 401 }
            );
        }

        const db = await getDb();
        const users = await db`
            SELECT first_name AS "firstName", last_name AS "lastName", photo_url AS "photoUrl", date_of_birth AS "dateOfBirth"
            FROM users
            WHERE email = ${authedEmail}
        `;

        if (users.length === 0) {
            console.log(`ℹ️ Auto-registering authenticated user in GET /api/user: ${authedEmail}`);
            const defaultFirstName = authedEmail.split("@")[0];
            const newUsers = await db`
                INSERT INTO users (email, first_name, last_name, provider)
                VALUES (${authedEmail}, ${defaultFirstName}, 'User', 'email')
                RETURNING first_name AS "firstName", last_name AS "lastName", photo_url AS "photoUrl", date_of_birth AS "dateOfBirth"
            `;
            return NextResponse.json(newUsers[0]);
        }

        return NextResponse.json(users[0]);
    } catch (err) {
        console.error("❌ User GET Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { verifyAuth } = await import("../../../utils/authHelper");
        const authedEmail = await verifyAuth(request);
        if (!authedEmail) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid or missing token" },
                { status: 401 }
            );
        }

        const { firstName, lastName, photoUrl, dateOfBirth } = await request.json();

        const db = await getDb();
        await db`
            UPDATE users
            SET first_name = ${firstName || null},
                last_name = ${lastName || null},
                photo_url = ${photoUrl || null},
                date_of_birth = ${dateOfBirth || null}
            WHERE email = ${authedEmail}
        `;

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("❌ User POST Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { verifyAuth } = await import("../../../utils/authHelper");
        const authedEmail = await verifyAuth(request);
        if (!authedEmail) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid or missing token" },
                { status: 401 }
            );
        }

        const db = await getDb();
        await db`
            DELETE FROM users
            WHERE email = ${authedEmail}
        `;

        return NextResponse.json({ message: "User deleted successfully from database" });
    } catch (err) {
        console.error("❌ User DELETE Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

