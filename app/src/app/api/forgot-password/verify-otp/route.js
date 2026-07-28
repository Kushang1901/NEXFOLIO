import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const users = await db`
            SELECT otp_code, otp_expiry
            FROM users
            WHERE email = ${email}
        `;

        if (users.length === 0) {
            return NextResponse.json(
                { error: "Account does not exist" },
                { status: 404 }
            );
        }

        const user = users[0];

        if (!user.otp_code || !user.otp_expiry) {
            return NextResponse.json(
                { error: "No OTP was requested for this email" },
                { status: 400 }
            );
        }

        // Check expiration
        const now = new Date();
        const expiry = new Date(user.otp_expiry);

        if (now > expiry) {
            return NextResponse.json(
                { error: "OTP has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Check match
        if (user.otp_code !== otp.trim()) {
            return NextResponse.json(
                { error: "Incorrect OTP. Please check and try again." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: "OTP verified successfully."
        });

    } catch (err) {
        console.error("❌ Verify OTP API Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
