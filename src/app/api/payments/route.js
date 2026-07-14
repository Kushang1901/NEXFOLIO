import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import crypto from "crypto";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request) {
    try {
        const { verifyAuth } = await import("../../../utils/authHelper");
        const authedEmail = await verifyAuth(request);
        
        if (!authedEmail) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid or missing token" },
                { status: 401, headers: corsHeaders }
            );
        }

        const body = await request.json();
        const { action, resumeId } = body;

        if (!resumeId) {
            return NextResponse.json(
                { error: "Resume ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();

        // 1. CREATE RAZORPAY ORDER ACTION
        if (action === "create_order") {
            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SsUweEky8qbyAL";
            const keySecret = process.env.RAZORPAY_KEY_SECRET || "rkpHwK2w8V4TTQkzWtTlsYRq";

            const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

            const response = await fetch("https://api.razorpay.com/v1/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${authString}`
                },
                body: JSON.stringify({
                    amount: 15000, // ₹150 in paise
                    currency: "INR",
                    receipt: `receipt_resume_${resumeId}`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Razorpay Order Creation Failed:", errorData);
                return NextResponse.json(
                    { error: "Failed to create Razorpay order", details: errorData },
                    { status: 500, headers: corsHeaders }
                );
            }

            const order = await response.json();
            return NextResponse.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            }, { headers: corsHeaders });
        }

        // 2. VERIFY RAZORPAY PAYMENT ACTION
        if (action === "verify_payment") {
            const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

            if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
                return NextResponse.json(
                    { error: "Missing required Razorpay payment fields" },
                    { status: 400, headers: corsHeaders }
                );
            }

            const keySecret = process.env.RAZORPAY_KEY_SECRET || "rkpHwK2w8V4TTQkzWtTlsYRq";

            // Verify the Razorpay signature
            const hmac = crypto.createHmac("sha256", keySecret);
            hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
            const generatedSignature = hmac.digest("hex");

            if (generatedSignature !== razorpaySignature) {
                console.error("Razorpay Signature Verification Failed");
                return NextResponse.json(
                    { error: "Signature verification failed" },
                    { status: 400, headers: corsHeaders }
                );
            }

            // Update resume status in Neon Database to paid
            const result = await db`
                UPDATE resumes
                SET is_paid = TRUE,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${resumeId} AND user_email = ${authedEmail}
                RETURNING id
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    { error: "Resume not found or unauthorized to update" },
                    { status: 404, headers: corsHeaders }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Payment successfully verified and resume upgraded to premium!"
            }, { headers: corsHeaders });
        }

        return NextResponse.json(
            { error: "Invalid action specified" },
            { status: 400, headers: corsHeaders }
        );

    } catch (err) {
        console.error("❌ Payments POST Route Error:", err);
        return NextResponse.json(
            { error: "Server error", details: err.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
