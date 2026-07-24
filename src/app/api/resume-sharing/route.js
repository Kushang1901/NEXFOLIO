import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import crypto from "crypto";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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
        const { action, resumeId, privacyOption, password, slug } = body;

        if (!resumeId) {
            return NextResponse.json(
                { error: "Resume ID is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        const db = await getDb();

        // 1. UPDATE SHARING SETTINGS
        if (action === "update_settings") {
            // Check ownership
            const checkOwner = await db`
                SELECT user_email FROM resumes WHERE id = ${resumeId}
            `;
            if (checkOwner.length === 0 || checkOwner[0].user_email !== authedEmail) {
                return NextResponse.json(
                    { error: "Unauthorized: You do not own this resume" },
                    { status: 403, headers: corsHeaders }
                );
            }

            let passwordHash = null;
            if (privacyOption === "password" && password) {
                passwordHash = crypto.createHash("sha256").update(password).digest("hex");
            }

            // Clean slug
            let finalSlug = null;
            if (slug) {
                finalSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, "").substring(0, 50);
                if (finalSlug) {
                    // Check if slug is taken by another resume
                    const checkSlug = await db`
                        SELECT id FROM resumes WHERE slug = ${finalSlug} AND id != ${resumeId}
                    `;
                    if (checkSlug.length > 0) {
                        return NextResponse.json(
                            { error: "Custom URL handle is already taken by another user." },
                            { status: 400, headers: corsHeaders }
                        );
                    }
                }
            }

            // Update DB
            await db`
                UPDATE resumes
                SET privacy_option = ${privacyOption || "public"},
                    password_hash = ${passwordHash},
                    slug = ${finalSlug || null},
                    is_public = ${privacyOption === "public" ? true : false},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${resumeId}
            `;

            return NextResponse.json({
                success: true,
                message: "Sharing settings updated successfully!",
                slug: finalSlug
            }, { headers: corsHeaders });
        }

        // 2. INCREMENT STATISTICS (VIEW / DOWNLOAD)
        if (action === "increment_stat") {
            const { statType } = body; // "view" or "download"

            if (statType === "view") {
                await db`
                    UPDATE resumes
                    SET view_count = view_count + 1,
                        last_viewed = CURRENT_TIMESTAMP
                    WHERE id = ${resumeId}
                `;
            } else if (statType === "download") {
                await db`
                    UPDATE resumes
                    SET download_count = download_count + 1
                    WHERE id = ${resumeId}
                `;
            }

            return NextResponse.json({ success: true }, { headers: corsHeaders });
        }

        return NextResponse.json(
            { error: "Invalid action" },
            { status: 400, headers: corsHeaders }
        );
    } catch (err) {
        console.error("❌ resume-sharing POST Route Error:", err);
        return NextResponse.json(
            { error: "Server error", details: err.message },
            { status: 500, headers: corsHeaders }
        );
    }
}

// GET endpoint to fetch sharing stats or check password protection
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const resumeId = searchParams.get("id");
        const slug = searchParams.get("slug");
        const password = searchParams.get("password");

        const db = await getDb();
        let resumes = [];

        if (resumeId) {
            resumes = await db`
                SELECT id, user_email AS "userEmail", resume_name AS "resumeName", 
                       privacy_option AS "privacyOption", password_hash AS "passwordHash", 
                       view_count AS "viewCount", download_count AS "downloadCount", 
                       last_viewed AS "lastViewed", slug, is_public AS "isPublic"
                FROM resumes
                WHERE id = ${resumeId}
            `;
        } else if (slug) {
            resumes = await db`
                SELECT id, user_email AS "userEmail", resume_name AS "resumeName", 
                       privacy_option AS "privacyOption", password_hash AS "passwordHash", 
                       view_count AS "viewCount", download_count AS "downloadCount", 
                       last_viewed AS "lastViewed", slug, is_public AS "isPublic"
                FROM resumes
                WHERE slug = ${slug.toLowerCase()}
            `;
        }

        if (resumes.length === 0) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404, headers: corsHeaders });
        }

        const resume = resumes[0];

        // If it is password protected, verify the password
        if (resume.privacyOption === "password") {
            if (!password) {
                return NextResponse.json({ 
                    isLocked: true, 
                    id: resume.id,
                    resumeName: resume.resumeName,
                    userEmail: resume.userEmail
                }, { headers: corsHeaders });
            }

            const inputHash = crypto.createHash("sha256").update(password).digest("hex");
            if (inputHash !== resume.passwordHash) {
                return NextResponse.json({ error: "Incorrect password" }, { status: 401, headers: corsHeaders });
            }
        }

        // Return resume metadata
        return NextResponse.json(resume, { headers: corsHeaders });
    } catch (err) {
        console.error("❌ resume-sharing GET Route Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500, headers: corsHeaders });
    }
}
