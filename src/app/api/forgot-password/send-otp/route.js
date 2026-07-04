import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { sendOtpEmail } from "../../../../utils/sendOtpEmail";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
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

        // Generate 6-digit random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
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
