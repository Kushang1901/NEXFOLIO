import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { checkRateLimit, getClientIp } from "../../../../utils/rateLimiter";
import crypto from "crypto";

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const otp = typeof body.otp === "string" ? body.otp.trim() : "";

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Anti-bruteforce: limit to 5 verification attempts per 5 minutes per IP/email
        const clientIp = getClientIp(request);
        const ipLimit = checkRateLimit(`verify-otp:ip:${clientIp}`, 10, 5 * 60 * 1000);
        const emailLimit = checkRateLimit(`verify-otp:email:${email}`, 5, 5 * 60 * 1000);

        if (!ipLimit.allowed || !emailLimit.allowed) {
            return NextResponse.json(
                { error: "Too many verification attempts. Please request a new OTP and try again later." },
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

        // Timing-safe comparison to prevent timing attacks
        const storedOtpBuffer = Buffer.from(String(user.otp_code));
        const inputOtpBuffer = Buffer.from(String(otp));
        const isMatch = storedOtpBuffer.length === inputOtpBuffer.length &&
                        crypto.timingSafeEqual(storedOtpBuffer, inputOtpBuffer);

        if (!isMatch) {
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
