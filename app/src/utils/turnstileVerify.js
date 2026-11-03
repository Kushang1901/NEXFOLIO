/**
 * Backend utility to verify Cloudflare Turnstile tokens.
 *
 * @param {string} token - The turnstile token received from the client
 * @param {string} [action] - Optional expected action name
 * @returns {Promise<{success: boolean, reason?: string}>} Verification result
 */
export async function verifyTurnstile(token, action) {
    // 1. In local development environment, allow mock bypass if Turnstile is not configured
    const isDev = process.env.NODE_ENV === "development";
    if (isDev && (!token || token === "MOCK_TOKEN" || !process.env.TURNSTILE_SECRET_KEY)) {
        console.log(`ℹ️ [Turnstile] Bypassed verification for action: ${action || "unspecified"} in local development.`);
        return { success: true, reason: "Bypassed for dev environment" };
    }

    // 2. Verified secure mobile app bypass requires private server-side secret match
    if (token && process.env.APP_BYPASS_SECRET && token === process.env.APP_BYPASS_SECRET) {
        return { success: true, reason: "Authenticated mobile client" };
    }

    if (!token || token === "APP_BYPASS") {
        console.warn(`❌ [Turnstile] Invalid or rejected token for action: ${action || "unspecified"}`);
        return { success: false, reason: "Security verification token missing or invalid." };
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!secretKey) {
        console.warn("⚠️ [Turnstile] TURNSTILE_SECRET_KEY is not defined in backend environment variables. Bypassing check.");
        return { success: true, reason: "Secret key missing (bypassed)" };
    }

    try {
        const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        
        console.log(`[Turnstile] Calling siteverify API for action: ${action || "unspecified"}`);
        
        // Form data payload as required by Cloudflare Turnstile verification API
        const formData = new URLSearchParams();
        formData.append("secret", secretKey);
        formData.append("response", token);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ [Turnstile] API returned error status ${response.status}: ${errorText}`);
            return { success: false, reason: `API returned error status ${response.status}` };
        }

        const data = await response.json();

        if (!data.success) {
            const errorCodes = data["error-codes"] || [];
            console.warn(`❌ [Turnstile] Verification failed. Error codes: ${errorCodes.join(", ")}`);
            return { success: false, reason: `Verification failed: ${errorCodes.join(", ") || "invalid token"}` };
        }

        // Optional action mismatch verification (Turnstile includes the action in the response if it was specified on render)
        if (action && data.action && data.action !== action) {
            console.warn(`❌ [Turnstile] Action mismatch. Expected: ${action}, Received: ${data.action}`);
            return { success: false, reason: `Action mismatch: expected ${action}, received ${data.action}` };
        }

        console.log(`✅ [Turnstile] Verification successful for action: ${action || "unspecified"}`);
        return { success: true };
    } catch (err) {
        console.error("🔥 [Turnstile] Exception during verification:", err);
        return { success: false, reason: `Exception: ${err.message}` };
    }
}
