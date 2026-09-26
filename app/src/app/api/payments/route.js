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
        const body = await request.json().catch(() => ({}));
        const { action, resumeId, coverLetterId, type, email: bodyEmail } = body;

        let authedEmail = null;
        try {
            const { verifyAuth } = await import("../../../utils/authHelper");
            authedEmail = await verifyAuth(request);
        } catch (authErr) {
            console.warn("Auth token check skipped or error:", authErr?.message);
        }

        const isPortfolio = type === "portfolio";
        const isCoverLetter = type === "cover_letter";

        if (!isCoverLetter && !resumeId) {
            return NextResponse.json(
                { error: "Resume ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();

        // Resolve effective email from auth token, request body, or database record
        let effectiveEmail = authedEmail || bodyEmail || null;
        if (!effectiveEmail && resumeId) {
            try {
                const rOwner = await db`SELECT user_email FROM resumes WHERE id = ${resumeId}`;
                if (rOwner.length > 0) {
                    effectiveEmail = rOwner[0].user_email;
                }
            } catch (e) {}
        }
        if (!effectiveEmail && coverLetterId) {
            try {
                const clOwner = await db`SELECT user_email FROM cover_letters WHERE id = ${coverLetterId}`;
                if (clOwner.length > 0) {
                    effectiveEmail = clOwner[0].user_email;
                }
            } catch (e) {}
        }

        const orderAmount = isPortfolio ? 49900 : isCoverLetter ? 9900 : 15000;
        const receiptId = isPortfolio 
            ? `receipt_portfolio_${resumeId}` 
            : isCoverLetter 
                ? `receipt_cl_${coverLetterId || "session_" + Date.now()}` 
                : `receipt_resume_${resumeId}`;

        // 1. CREATE RAZORPAY ORDER ACTION
        if (action === "create_order") {
            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TDTM6sBKdckc4Y";
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

            // Cryptographically verify the Razorpay HMAC-SHA256 signature
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
                    WHERE id = ${resumeId}
                    RETURNING id
                `;
            } else if (isCoverLetter) {
                if (coverLetterId) {
                    result = await db`
                        UPDATE cover_letters
                        SET is_paid = TRUE,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE id = ${coverLetterId}
                        RETURNING id
                    `;
                } else {
                    result = [{ id: null }];
                }
            } else {
                result = await db`
                    UPDATE resumes
                    SET is_paid = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${resumeId}
                    RETURNING id
                `;
            }

            if (result.length === 0) {
                return NextResponse.json(
                    { error: (isCoverLetter ? "Cover letter" : "Resume") + " not found" },
                    { status: 404, headers: corsHeaders }
                );
            }

            try {
                // Record the payment details in the payments table
                const payerEmail = effectiveEmail || "customer@cvgrid.in";
                let userResult = await db`
                    SELECT id FROM users WHERE email = ${payerEmail}
                `;
                let userId = userResult[0]?.id;

                if (!userId && payerEmail) {
                    const newUser = await db`
                        INSERT INTO users (email, first_name, last_name, provider)
                        VALUES (${payerEmail}, ${payerEmail.split("@")[0]}, 'User', 'razorpay')
                        ON CONFLICT (email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
                        RETURNING id
                    `;
                    userId = newUser[0]?.id;
                }

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
