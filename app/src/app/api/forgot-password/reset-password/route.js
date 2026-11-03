import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { hashPassword } from "../../../../utils/crypto";
import { checkRateLimit, getClientIp } from "../../../../utils/rateLimiter";
import crypto from "crypto";

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const otp = typeof body.otp === "string" ? body.otp.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (!email || !otp || !password) {
            return NextResponse.json(
                { error: "Email, OTP, and new password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Anti-bruteforce rate limit
        const clientIp = getClientIp(request);
        const ipLimit = checkRateLimit(`reset-pwd:ip:${clientIp}`, 5, 10 * 60 * 1000);
        const emailLimit = checkRateLimit(`reset-pwd:email:${email}`, 5, 10 * 60 * 1000);

        if (!ipLimit.allowed || !emailLimit.allowed) {
            return NextResponse.json(
                { error: "Too many reset attempts. Please request a new OTP and try again later." },
                { status: 429 }
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

        // Timing-safe match check
        const storedOtpBuffer = Buffer.from(String(user.otp_code));
        const inputOtpBuffer = Buffer.from(String(otp));
        const isMatch = storedOtpBuffer.length === inputOtpBuffer.length &&
                        crypto.timingSafeEqual(storedOtpBuffer, inputOtpBuffer);

        if (!isMatch) {
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
