import { NextResponse } from "next/server";

export async function GET(request) {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
        return NextResponse.json(
            { error: "LinkedIn credentials are not configured on the server." },
            { status: 500 }
        );
    }
    
    // Parse any existing resume ID from request parameters
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get("id") || "";
    
    // Generate a random state parameter and attach the resume ID
    const randomState = Math.random().toString(36).substring(2, 15);
    const state = `${randomState}___${resumeId}`;
    
    // Construct the LinkedIn Authorization URL
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=openid%20profile%20email`;
    
    // Redirect the user to LinkedIn
    return NextResponse.redirect(authUrl);
}
