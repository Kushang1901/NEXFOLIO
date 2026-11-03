import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { sendOtpEmail } from "../../../../utils/sendOtpEmail";
import { checkRateLimit, getClientIp } from "../../../../utils/rateLimiter";
import crypto from "crypto";

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Rate limit: Maximum 3 OTP requests per 10 minutes per IP/email
        const clientIp = getClientIp(request);
        const ipLimit = checkRateLimit(`send-otp:ip:${clientIp}`, 5, 10 * 60 * 1000);
        const emailLimit = checkRateLimit(`send-otp:email:${email}`, 3, 10 * 60 * 1000);

        if (!ipLimit.allowed || !emailLimit.allowed) {
            const waitSeconds = Math.max(ipLimit.resetInSeconds, emailLimit.resetInSeconds);
            return NextResponse.json(
                { error: `Too many OTP requests. Please wait ${Math.ceil(waitSeconds / 60)} minute(s) before trying again.` },
                { status: 429 }
            );
        }

        const db = await getDb();
        const users = await db`
            SELECT id, email FROM users WHERE email = ${email}
        `;

        if (users.length === 0) {
            return NextResponse.json(
                { error: "Account does not exist. Please sign up first!" },
                { status: 404 }
            );
        }

        // Generate cryptographically secure 6-digit random OTP
        const otp = crypto.randomInt(100000, 1000000).toString();
        // Set expiry to 5 minutes from now
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        // Update database with OTP details
        await db`
            UPDATE users
            SET otp_code = ${otp},
                otp_expiry = ${expiry}
            WHERE email = ${email}
        `;

        // Send OTP email
        const emailSent = await sendOtpEmail(email, otp);

        console.log(`🔑 Generated OTP for ${email}: ${otp}`);

        const responsePayload = {
            message: "OTP sent successfully to your email."
        };

        // Return devOtp in development if SMTP credentials are not set
        if (!emailSent && process.env.NODE_ENV !== "production") {
            responsePayload.devOtp = otp;
            responsePayload.message = "OTP generated successfully (check terminal or devOtp in response).";
        }

        return NextResponse.json(responsePayload);

    } catch (err) {
        console.error("❌ Send OTP API Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
