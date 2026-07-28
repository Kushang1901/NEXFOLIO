import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

export async function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}

// GET: Fetch approved public testimonials for the homepage
export async function GET(request) {
    try {
        const db = await getDb();
        
        // Fetch testimonials with 4 or 5 stars that are marked public
        const testimonials = await db`
            SELECT id, user_name AS "userName", rating, feedback, created_at AS "createdAt"
            FROM testimonials
            WHERE rating >= 4 AND is_public = TRUE
            ORDER BY created_at DESC
            LIMIT 12
        `;
        
        return NextResponse.json(testimonials, { headers: corsHeaders });
    } catch (err) {
        console.error("❌ GET Testimonials API Error:", err);
        return NextResponse.json(
            { error: "Failed to retrieve testimonials." },
            { status: 500, headers: corsHeaders }
        );
    }
}

// POST: Submit a new testimonial
export async function POST(request) {
    try {
        const { name, email, rating, feedback, isPublic } = await request.json();

        // Basic validation
        if (!name || !rating) {
            return NextResponse.json(
                { error: "Name and Rating are required." },
                { status: 400, headers: corsHeaders }
            );
        }

        const ratingVal = parseInt(rating, 10);
        if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
            return NextResponse.json(
                { error: "Rating must be an integer between 1 and 5." },
                { status: 400, headers: corsHeaders }
            );
        }

        // For rating <= 3, force is_public to false so negative reviews are kept private
        const finalizedIsPublic = ratingVal <= 3 ? false : (isPublic !== undefined ? isPublic : true);

        const db = await getDb();

        const result = await db`
            INSERT INTO testimonials (user_name, user_email, rating, feedback, is_public)
            VALUES (${name.trim()}, ${email ? email.trim() : null}, ${ratingVal}, ${feedback ? feedback.trim() : null}, ${finalizedIsPublic})
            RETURNING id
        `;

        console.log(`✅ New testimonial created with ID: ${result[0].id} (Rating: ${ratingVal})`);
        return NextResponse.json(
            { message: "Feedback submitted successfully!", id: result[0].id },
            { status: 201, headers: corsHeaders }
        );
    } catch (err) {
        console.error("❌ POST Testimonials API Error:", err);
        return NextResponse.json(
            { error: "Failed to submit feedback." },
            { status: 500, headers: corsHeaders }
        );
    }
}
