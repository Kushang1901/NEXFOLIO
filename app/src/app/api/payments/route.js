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
        const { action, resumeId, coverLetterId, type } = body;

        const isPortfolio = type === "portfolio";
        const isCoverLetter = type === "cover_letter";

        if (!resumeId && !coverLetterId) {
            return NextResponse.json(
                { error: "Resume ID or Cover Letter ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();
        const orderAmount = isPortfolio ? 49900 : isCoverLetter ? 9900 : 15000;
        const receiptId = isPortfolio 
            ? `receipt_portfolio_${resumeId}` 
            : isCoverLetter 
                ? `receipt_cl_${coverLetterId}` 
                : `receipt_resume_${resumeId}`;

        // 1. CREATE RAZORPAY ORDER ACTION
        if (action === "create_order") {
            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;

            if (!keyId || !keySecret) {
                console.error("Missing Razorpay Keys in server environment");
                return NextResponse.json(
                    { error: "Payment gateway is not configured on the server." },
                    { status: 500, headers: corsHeaders }
                );
            }

            const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

            const response = await fetch("https://api.razorpay.com/v1/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${authString}`
                },
                body: JSON.stringify({
                    amount: orderAmount,
                    currency: "INR",
                    receipt: receiptId
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

            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            if (!keySecret) {
                console.error("Missing Razorpay Secret Key in server environment");
                return NextResponse.json(
                    { error: "Payment verification configuration error on the server" },
                    { status: 500, headers: corsHeaders }
                );
            }

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

            // Update status in Neon Database based on payment type
            let result;
            if (isPortfolio) {
                result = await db`
                    UPDATE resumes
                    SET is_portfolio_paid = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${resumeId} AND user_email = ${authedEmail}
                    RETURNING id
                `;
            } else if (isCoverLetter) {
                result = await db`
                    UPDATE cover_letters
                    SET is_paid = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${coverLetterId} AND user_email = ${authedEmail}
                    RETURNING id
                `;
            } else {
                result = await db`
                    UPDATE resumes
                    SET is_paid = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${resumeId} AND user_email = ${authedEmail}
                    RETURNING id
                `;
            }

            if (result.length === 0) {
                return NextResponse.json(
                    { error: (isCoverLetter ? "Cover letter" : "Resume") + " not found or unauthorized to update" },
                    { status: 404, headers: corsHeaders }
                );
            }

            try {
                // Record the payment details in the payments table
                const userResult = await db`
                    SELECT id FROM users WHERE email = ${authedEmail}
                `;
                const userId = userResult[0]?.id;

                if (userId) {
                    const pricePaid = isPortfolio ? 499.00 : isCoverLetter ? 99.00 : 150.00;
                    if (isCoverLetter) {
                        await db`
                            INSERT INTO payments (cover_letter_id, resume_id, user_id, payment_status, payment_id, order_id, amount)
                            VALUES (${coverLetterId}, NULL, ${userId}, 'paid', ${razorpayPaymentId}, ${razorpayOrderId}, ${pricePaid})
                            ON CONFLICT (payment_id) DO NOTHING
                        `;
                    } else {
                        await db`
                            INSERT INTO payments (resume_id, user_id, payment_status, payment_id, order_id, amount)
                            VALUES (${resumeId}, ${userId}, 'paid', ${razorpayPaymentId}, ${razorpayOrderId}, ${pricePaid})
                            ON CONFLICT (payment_id) DO NOTHING
                        `;
                    }
                }
            } catch (payErr) {
                console.error("⚠️ Failed to record payment details in database:", payErr);
            }

            return NextResponse.json({
                success: true,
                message: isPortfolio 
                    ? "Payment successfully verified and premium portfolio builder unlocked!" 
                    : isCoverLetter
                        ? "Payment successfully verified and premium cover letter template unlocked!"
                        : "Payment successfully verified and resume upgraded to premium!"
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
