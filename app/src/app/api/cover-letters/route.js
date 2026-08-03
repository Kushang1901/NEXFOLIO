import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(request) {
    try {
        const { verifyAuth } = await import("../../../utils/authHelper");
        const authedEmail = await verifyAuth(request);

        if (!authedEmail) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid or missing token" },
                { status: 401, headers: corsHeaders }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const db = await getDb();

        if (id) {
            const letters = await db`
                SELECT id, user_email AS "userEmail", letter_name AS "letterName", 
                       job_title AS "jobTitle", company_name AS "companyName", 
                       hiring_manager AS "hiringManager", tone, 
                       selected_template AS "selectedTemplate", letter_text AS "letterText", 
                       candidate_data AS "candidateData", is_paid AS "isPaid",
                       created_at AS "createdAt", updated_at AS "updatedAt"
                FROM cover_letters
                WHERE id = ${id} AND user_email = ${authedEmail}
            `;

            if (letters.length === 0) {
                return NextResponse.json(
                    { error: "Cover letter not found or unauthorized" },
                    { status: 404, headers: corsHeaders }
                );
            }

            return NextResponse.json(letters[0], { headers: corsHeaders });
        } else {
            const letters = await db`
                SELECT id, letter_name AS "letterName", 
                       job_title AS "jobTitle", company_name AS "companyName", 
                       hiring_manager AS "hiringManager", tone, 
                       selected_template AS "selectedTemplate", letter_text AS "letterText",
                       candidate_data AS "candidateData", is_paid AS "isPaid",
                       created_at AS "createdAt", updated_at AS "updatedAt"
                FROM cover_letters
                WHERE user_email = ${authedEmail}
                ORDER BY updated_at DESC
            `;

            return NextResponse.json(letters, { headers: corsHeaders });
        }
    } catch (err) {
        console.error("❌ Cover Letters GET Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500, headers: corsHeaders }
        );
    }
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

        const { id, letterName, jobTitle, companyName, hiringManager, tone, selectedTemplate, letterText, candidateData, isPaid } = await request.json();

        if (!jobTitle || !companyName || !letterText) {
            return NextResponse.json(
                { error: "Job title, company name, and letter text are required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();

        if (id) {
            // Update existing cover letter
            const result = await db`
                UPDATE cover_letters
                SET letter_name = ${letterName || "My Cover Letter"},
                    job_title = ${jobTitle},
                    company_name = ${companyName},
                    hiring_manager = ${hiringManager || null},
                    tone = ${tone || "Professional"},
                    selected_template = ${selectedTemplate || "classic"},
                    letter_text = ${letterText},
                    candidate_data = ${candidateData ? JSON.stringify(candidateData) : null},
                    is_paid = COALESCE(is_paid, FALSE) OR ${isPaid === true},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id} AND user_email = ${authedEmail}
                RETURNING id
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    { error: "Cover letter not found or unauthorized" },
                    { status: 404, headers: corsHeaders }
                );
            }

            return NextResponse.json({
                message: "Cover letter updated successfully",
                id: result[0].id
            }, { headers: corsHeaders });
        } else {
            // Insert new cover letter
            const result = await db`
                INSERT INTO cover_letters (user_email, letter_name, job_title, company_name, hiring_manager, tone, selected_template, letter_text, candidate_data, is_paid)
                VALUES (${authedEmail}, ${letterName || "My Cover Letter"}, ${jobTitle}, ${companyName}, ${hiringManager || null}, ${tone || "Professional"}, ${selectedTemplate || "classic"}, ${letterText}, ${candidateData ? JSON.stringify(candidateData) : null}, ${isPaid === true})
                RETURNING id
            `;

            return NextResponse.json({
                message: "Cover letter saved successfully",
                id: result[0].id
            }, { status: 201, headers: corsHeaders });
        }
    } catch (err) {
        console.error("❌ Cover Letters POST Route Error:", err);
        return NextResponse.json(
            { error: "Server error", details: err.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function DELETE(request) {
    try {
        const { verifyAuth } = await import("../../../utils/authHelper");
        const authedEmail = await verifyAuth(request);
        if (!authedEmail) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid or missing token" },
                { status: 401, headers: corsHeaders }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();
        const result = await db`
            DELETE FROM cover_letters
            WHERE id = ${id} AND user_email = ${authedEmail}
            RETURNING id
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Cover letter not found or unauthorized" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({ message: "Cover letter deleted successfully" }, { headers: corsHeaders });
    } catch (err) {
        console.error("❌ Cover Letters DELETE Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
