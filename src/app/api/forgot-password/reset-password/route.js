import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { hashPassword } from "../../../../utils/crypto";

export async function POST(request) {
    try {
        const { email, otp, password } = await request.json();

        if (!email || !otp || !password) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required" },
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
                { error: "Unauthorized access: No OTP was requested" },
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
                { error: "Incorrect OTP. Cannot reset password." },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = hashPassword(password);

        // Update password and clear OTP columns
        await db`
            UPDATE users
            SET password = ${hashedPassword},
                otp_code = NULL,
                otp_expiry = NULL
            WHERE email = ${email}
        `;

        return NextResponse.json({
            message: "Password reset successfully."
        });

    } catch (err) {
        console.error("❌ Reset Password API Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
