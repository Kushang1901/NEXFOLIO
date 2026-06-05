import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const users = await db`
            SELECT first_name AS "firstName", last_name AS "lastName", photo_url AS "photoUrl"
            FROM users
            WHERE email = ${email}
        `;

        if (users.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
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
        const { email, firstName, lastName, photoUrl } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        await db`
            UPDATE users
            SET first_name = ${firstName || null},
                last_name = ${lastName || null},
                photo_url = ${photoUrl || null}
            WHERE email = ${email}
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
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        await db`
            DELETE FROM users
            WHERE email = ${email}
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

