import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function POST(request) {
    try {
        const { name, phone, subject, message } = await request.json();

        if (!name || !phone || !message) {
            return NextResponse.json(
                { error: "Name, Phone Number, and Message are required." },
                { status: 400 }
            );
        }

        // Validate SMTP credentials
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("⚠️ EMAIL_USER or EMAIL_PASS environment variables are not set. Contact email not sent.");
            return NextResponse.json(
                { error: "Email configuration missing on the server. Please check environment variables." },
                { status: 500 }
            );
        }

        const adminEmail = "kushangacharya8830@gmail.com";

        // Send Email to Admin
        await transporter.sendMail({
            from: `"CVGrid Support" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `📞 New Contact Request: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 25px; color: #1e2227; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5; border-bottom: 2px solid #e5e7eb; pb: 10px; margin-bottom: 20px;">New Message from CVGrid Contact Form 👋</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Sender Name:</td>
                            <td style="padding: 8px 0; color: #4b5563;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
                            <td style="padding: 8px 0; color: #4b5563;"><a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                            <td style="padding: 8px 0; color: #4b5563;">${subject}</td>
                        </tr>
                    </table>
                    <div style="background-color: #ffffff; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 4px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                        <p style="margin: 0; font-weight: bold; margin-bottom: 8px; color: #1f2937;">Message Details:</p>
                        <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                    <br />
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
                        This notification was generated automatically by the CVGrid website contact portal.
                    </p>
                </div>
            `
        });

        console.log(`✅ Contact request from ${name} (${phone}) sent successfully to ${adminEmail}`);
        return NextResponse.json({ message: "Message sent successfully!" });

    } catch (err) {
        console.error("❌ Contact Support API Error:", err);
        return NextResponse.json(
            { error: "Server failed to process and send the contact message." },
            { status: 500 }
        );
    }
}
