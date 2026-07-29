import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import crypto from "crypto";

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

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const db = await getDb();

        if (id) {
            // Fetch a specific resume (could be by ID or custom Slug, public, or owned by user)
            const isSlug = isNaN(Number(id));
            const resumes = isSlug ? await db`
                SELECT id, user_email AS "userEmail", resume_name AS "resumeName", 
                       resume_data AS "resumeData", selected_template AS "selectedTemplate", 
                       is_public AS "isPublic", shareable_link AS "shareableLink",
                       is_paid AS "isPaid", privacy_option AS "privacyOption", password_hash AS "passwordHash",
                       is_portfolio_paid AS "isPortfolioPaid",
                       created_at AS "createdAt", updated_at AS "updatedAt"
                FROM resumes
                WHERE slug = ${id.toLowerCase()}
            ` : await db`
                SELECT id, user_email AS "userEmail", resume_name AS "resumeName", 
                       resume_data AS "resumeData", selected_template AS "selectedTemplate", 
                       is_public AS "isPublic", shareable_link AS "shareableLink",
                       is_paid AS "isPaid", privacy_option AS "privacyOption", password_hash AS "passwordHash",
                       is_portfolio_paid AS "isPortfolioPaid",
                       created_at AS "createdAt", updated_at AS "updatedAt"
                FROM resumes
                WHERE id = ${parseInt(id)}
            `;

            if (resumes.length === 0) {
                return NextResponse.json(
                    { error: "Resume not found" },
                    { status: 404, headers: corsHeaders }
                );
            }

            const resume = resumes[0];
            const isOwner = resume.userEmail === authedEmail;

            // Enforce Private privacy setting
            if (resume.privacyOption === "private" && !isOwner) {
                return NextResponse.json(
                    { error: "Unauthorized: This resume is set to Private." },
                    { status: 401, headers: corsHeaders }
                );
            }

            // Enforce Password Protected privacy setting
            if (resume.privacyOption === "password" && !isOwner) {
                const passwordParam = searchParams.get("password");
                if (!passwordParam) {
                    return NextResponse.json(
                        { isLocked: true, id: resume.id, resumeName: resume.resumeName },
                        { headers: corsHeaders }
                    );
                }
                const inputHash = crypto.createHash("sha256").update(passwordParam).digest("hex");
                if (inputHash !== resume.passwordHash) {
                    return NextResponse.json(
                        { error: "Incorrect password" },
                        { status: 401, headers: corsHeaders }
                    );
                }
            }

            // Enforce general Public/Private state (if not password protected)
            if (resume.privacyOption !== "password" && !resume.isPublic && !isOwner) {
                return NextResponse.json(
                    { error: "Unauthorized: This resume is private." },
                    { status: 401, headers: corsHeaders }
                );
            }

            return NextResponse.json(resume, { headers: corsHeaders });
        } else {
            // If listing all, valid auth token is required
            if (!authedEmail) {
                return NextResponse.json(
                    { error: "Unauthorized access: Invalid or missing token" },
                    { status: 401, headers: corsHeaders }
                );
            }

            // List all resumes for this user (omit large resume_data details for speed)
            const resumes = await db`
                SELECT id, resume_name AS "resumeName", selected_template AS "selectedTemplate", 
                       resume_data AS "resumeData",
                       is_public AS "isPublic", shareable_link AS "shareableLink",
                       is_paid AS "isPaid", is_portfolio_paid AS "isPortfolioPaid",
                       created_at AS "createdAt", updated_at AS "updatedAt"
                FROM resumes
                WHERE user_email = ${authedEmail}
                ORDER BY updated_at DESC
            `;

            return NextResponse.json(resumes, { headers: corsHeaders });
        }
    } catch (err) {
        console.error("❌ Resumes GET Route Error:", err);
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

        const { id, resumeName, resumeData, selectedTemplate, isPublic, shareableLink } = await request.json();

        if (!resumeData) {
            return NextResponse.json(
                { error: "Resume data is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();

        if (id) {
            // Update existing resume (only if it belongs to the authenticated user)
            const isPublicPassed = isPublic !== undefined;
            const shareableLinkPassed = shareableLink !== undefined;

            const result = await db`
                UPDATE resumes
                SET resume_name = ${resumeName || "My Resume"},
                    resume_data = ${JSON.stringify(resumeData)},
                    selected_template = ${selectedTemplate || "classic"},
                    is_public = CASE WHEN ${isPublicPassed} = FALSE THEN is_public ELSE ${isPublic} END,
                    shareable_link = CASE WHEN ${shareableLinkPassed} = FALSE THEN shareable_link ELSE ${shareableLink} END,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id} AND user_email = ${authedEmail}
                RETURNING id
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    { error: "Resume not found or unauthorized" },
                    { status: 404, headers: corsHeaders }
                );
            }

            return NextResponse.json({
                message: "Resume updated successfully",
                id: result[0].id
            }, { headers: corsHeaders });
        } else {
            // Insert new resume for the authenticated user
            const result = await db`
                INSERT INTO resumes (user_email, resume_name, resume_data, selected_template, is_public, shareable_link)
                VALUES (${authedEmail}, ${resumeName || "My Resume"}, ${JSON.stringify(resumeData)}, ${selectedTemplate || "classic"}, ${isPublic || false}, ${shareableLink || null})
                RETURNING id
            `;

            return NextResponse.json({
                message: "Resume created successfully",
                id: result[0].id
            }, { status: 201, headers: corsHeaders });
        }
    } catch (err) {
        console.error("❌ Resumes POST Route Error:", err);
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
            DELETE FROM resumes
            WHERE id = ${id} AND user_email = ${authedEmail}
            RETURNING id
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Resume not found or unauthorized" },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json({ message: "Resume deleted successfully" }, { headers: corsHeaders });
    } catch (err) {
        console.error("❌ Resumes DELETE Route Error:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500, headers: corsHeaders }
        );
    }
}
