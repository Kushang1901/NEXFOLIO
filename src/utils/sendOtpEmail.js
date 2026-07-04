import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendOtpEmail(to, otp) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ EMAIL_USER or EMAIL_PASS environment variables are not set. E-mail not sent.");
        return false;
    }
    try {
        await transporter.sendMail({
            from: `"Nexfolio" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your Password Reset OTP - Nexfolio",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e2227;">
                    <h2>Password Reset Request 👋</h2>
                    <p>We received a request to reset your password. Use the following One-Time Password (OTP) to complete the process:</p>
                    <div style="background-color: #f0f4ff; border: 1px solid #4a72f3; border-radius: 8px; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #4a72f3; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in <b>5 minutes</b>.</p>
                    <p>If you did not request this reset, you can safely ignore this email.</p>
                    <br />
                    <strong>– Nexfolio Team</strong>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error("❌ Failed to send OTP email via nodemailer:", error);
        return false;
    }
}
