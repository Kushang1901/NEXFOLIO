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

async function generateUniqueSlug(db, fullName, resumeId = null) {
    if (!fullName) return null;
    let baseSlug = fullName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 40); // Leave room for suffixes

    if (!baseSlug) return null;

    let uniqueSlug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        const existing = resumeId 
            ? await db`SELECT id FROM resumes WHERE slug = ${uniqueSlug} AND id != ${resumeId}`
            : await db`SELECT id FROM resumes WHERE slug = ${uniqueSlug}`;
        
        if (existing.length === 0) {
            isUnique = true;
        } else {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
    }

    return uniqueSlug;
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
                       is_portfolio_paid AS "isPortfolioPaid", slug,
                       created_at AS "createdAt", updated_at AS "updatedAt"
                FROM resumes
                WHERE slug = ${id.toLowerCase()}
            ` : await db`
                SELECT id, user_email AS "userEmail", resume_name AS "resumeName", 
                       resume_data AS "resumeData", selected_template AS "selectedTemplate", 
                       is_public AS "isPublic", shareable_link AS "shareableLink",
                       is_paid AS "isPaid", privacy_option AS "privacyOption", password_hash AS "passwordHash",
                       is_portfolio_paid AS "isPortfolioPaid", slug,
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
                       is_paid AS "isPaid", is_portfolio_paid AS "isPortfolioPaid", slug,
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
            // Fetch existing resume to check slug and user_email
            const existingResume = await db`
                SELECT slug, is_public FROM resumes WHERE id = ${id} AND user_email = ${authedEmail}
            `;
            if (existingResume.length === 0) {
                return NextResponse.json(
                    { error: "Resume not found or unauthorized" },
                    { status: 404, headers: corsHeaders }
                );
            }
            
            let currentSlug = existingResume[0].slug;
            
            // If there's no slug, automatically generate one based on name
            if (!currentSlug) {
                const parsedData = typeof resumeData === "string" ? JSON.parse(resumeData) : resumeData;
                const fullName = parsedData?.fullName || parsedData?.personalInfo?.fullName;
                currentSlug = await generateUniqueSlug(db, fullName, id);
            }

            const isPublicPassed = isPublic !== undefined;
            const shareableLinkPassed = shareableLink !== undefined;

            // Generate clean slug-based shareable link if shareableLink is passed and public
            let finalShareableLink = shareableLink;
            if (shareableLinkPassed && isPublic) {
                const requestUrl = new URL(request.url);
                const baseUrl = requestUrl.origin;
                finalShareableLink = currentSlug ? `${baseUrl}/resume/${currentSlug}` : `${baseUrl}/resume/${id}`;
            }

            const result = await db`
                UPDATE resumes
                SET resume_name = ${resumeName || "My Resume"},
                    resume_data = ${JSON.stringify(resumeData)},
                    selected_template = ${selectedTemplate || "classic"},
                    is_public = CASE WHEN ${isPublicPassed} = FALSE THEN is_public ELSE ${isPublic} END,
                    shareable_link = CASE WHEN ${shareableLinkPassed} = FALSE THEN shareable_link ELSE ${finalShareableLink} END,
                    slug = ${currentSlug},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id} AND user_email = ${authedEmail}
                RETURNING id, slug
            `;

            return NextResponse.json({
                message: "Resume updated successfully",
                id: result[0].id,
                slug: result[0].slug,
                shareableLink: isPublic ? finalShareableLink : ""
            }, { headers: corsHeaders });
        } else {
            // Insert new resume for the authenticated user
            const parsedData = typeof resumeData === "string" ? JSON.parse(resumeData) : resumeData;
            const fullName = parsedData?.fullName || parsedData?.personalInfo?.fullName;
            const generatedSlug = await generateUniqueSlug(db, fullName);

            let finalShareableLink = shareableLink;
            if (shareableLink && isPublic) {
                const requestUrl = new URL(request.url);
                const baseUrl = requestUrl.origin;
                finalShareableLink = generatedSlug ? `${baseUrl}/resume/${generatedSlug}` : `${baseUrl}/resume/${id}`;
            }

            const result = await db`
                INSERT INTO resumes (user_email, resume_name, resume_data, selected_template, is_public, shareable_link, slug)
                VALUES (${authedEmail}, ${resumeName || "My Resume"}, ${JSON.stringify(resumeData)}, ${selectedTemplate || "classic"}, ${isPublic || false}, ${finalShareableLink || null}, ${generatedSlug})
                RETURNING id, slug
            `;

            let savedShareableLink = finalShareableLink;
            if (generatedSlug && isPublic) {
                const requestUrl = new URL(request.url);
                const baseUrl = requestUrl.origin;
                savedShareableLink = `${baseUrl}/resume/${generatedSlug}`;
                
                await db`
                    UPDATE resumes
                    SET shareable_link = ${savedShareableLink}
                    WHERE id = ${result[0].id}
                `;
            }

            return NextResponse.json({
                message: "Resume created successfully",
                id: result[0].id,
                slug: result[0].slug,
                shareableLink: savedShareableLink || ""
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
