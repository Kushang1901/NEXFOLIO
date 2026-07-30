import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const state = searchParams.get("state") || "";

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    // Extract resumeId from state if present (state format: random___resumeId)
    const stateParts = state.split("___");
    const resumeId = stateParts[1] || "";

    const builderUrl = new URL("/builder", request.url);
    if (resumeId) {
        builderUrl.searchParams.set("id", resumeId);
    }

    if (error) {
        console.error("❌ LinkedIn auth error:", error, errorDescription);
        builderUrl.searchParams.set("error", errorDescription || "Auth cancelled by user");
        return NextResponse.redirect(builderUrl.toString());
    }

    if (!code) {
        return NextResponse.json({ error: "Authorization code not provided" }, { status: 400 });
    }

    try {
        // 1. Exchange auth code for access token
        const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!tokenResponse.ok) {
            const tokenErr = await tokenResponse.text();
            console.error("❌ LinkedIn token exchange failed:", tokenErr);
            builderUrl.searchParams.set("error", "Failed to authenticate with LinkedIn");
            return NextResponse.redirect(builderUrl.toString());
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Fetch user profile from OIDC userinfo endpoint
        const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!profileResponse.ok) {
            const profileErr = await profileResponse.text();
            console.error("❌ LinkedIn profile fetch failed:", profileErr);
            builderUrl.searchParams.set("error", "Failed to retrieve LinkedIn profile details");
            return NextResponse.redirect(builderUrl.toString());
        }

        const profileData = await profileResponse.json();

        // 3. Redirect back to builder page with user details
        builderUrl.searchParams.set("linkedin_import", "true");
        builderUrl.searchParams.set("first", profileData.given_name || "");
        builderUrl.searchParams.set("last", profileData.family_name || "");
        builderUrl.searchParams.set("email", profileData.email || "");
        builderUrl.searchParams.set("photo", profileData.picture || "");

        return NextResponse.redirect(builderUrl.toString());
    } catch (err) {
        console.error("❌ LinkedIn callback error:", err);
        builderUrl.searchParams.set("error", "An unexpected error occurred during import");
        return NextResponse.redirect(builderUrl.toString());
    }
}
