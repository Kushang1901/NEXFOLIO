/**
 * Backend utility to verify Google reCAPTCHA Enterprise tokens.
 *
 * @param {string} token - The recaptcha token received from the client
 * @param {string} action - The expected action name (e.g. 'SIGNUP', 'LOGIN', 'GENERATE_RESUME')
 * @returns {Promise<boolean>} True if valid and score is above threshold, otherwise false.
 */
export async function verifyRecaptcha(token, action) {
    // 1. Bypass validation in development or for mobile app client requests (passing "APP_BYPASS")
    if (token === "APP_BYPASS" || (process.env.NODE_ENV === "development" && (!token || token === "MOCK_TOKEN" || !process.env.RECAPTCHA_API_KEY))) {
        console.log(`ℹ️ [reCAPTCHA Bypass] Bypassed verification for action: ${action} in development/mobile client.`);
        return { success: true, reason: "Bypassed for mobile client or dev environment" };
    }

    if (!token) {
        console.warn(`❌ [reCAPTCHA] No token provided for action: ${action}`);
        return { success: false, reason: "No token provided" };
    }

    const projectId = process.env.GCP_PROJECT_ID || "resumecraft-e16fe";
    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LfIrjQsAAAAANY4PBe_oGp6mIFkTwyeAB_DdG81";
    const apiKey = process.env.RECAPTCHA_API_KEY;

    if (!apiKey) {
        console.warn("⚠️ [reCAPTCHA] RECAPTCHA_API_KEY is not defined in backend environment variables. Bypassing check.");
        return { success: true, reason: "API key missing (bypassed)" };
    }

    try {
        const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;
        
        console.log(`[reCAPTCHA] Calling assessments API for action: ${action}`);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event: {
                    token: token,
                    siteKey: siteKey,
                    expectedAction: action
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ [reCAPTCHA] API returned error status ${response.status}: ${errorText}`);
            return { success: false, reason: `API returned error status ${response.status}: ${errorText}` };
        }

        const data = await response.json();

        // Validate token properties
        if (!data.tokenProperties || !data.tokenProperties.valid) {
            const invalidReason = data.tokenProperties?.invalidReason;
            console.warn(`❌ [reCAPTCHA] Invalid token. Reason: ${invalidReason}`);
            
            // If the invalidReason is BROWSER_ERROR, it's a retriable client-side network or ad-blocker issue.
            // To prevent locking out legitimate users with ad blockers, DNS blocklists (like Pi-hole), or network issues,
            // we log a warning but allow the request to proceed.
            if (invalidReason === "BROWSER_ERROR") {
                console.warn("⚠️ [reCAPTCHA] Allowing request despite BROWSER_ERROR to prevent user lockout.");
                return { success: true, reason: "BROWSER_ERROR (allowed)", score: 1.0 };
            }

            return { success: false, reason: `Invalid token properties: ${invalidReason || "malformed"}` };
        }

        // Check for expected action mismatch
        if (data.tokenProperties.action !== action) {
            console.warn(`❌ [reCAPTCHA] Action mismatch. Expected: ${action}, Received: ${data.tokenProperties.action}`);
            return { success: false, reason: `Action mismatch: expected ${action}, received ${data.tokenProperties.action}` };
        }

        // Verify risk score
        const score = data.riskAnalysis?.score ?? 0;
        const threshold = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5");
        
        console.log(`🤖 [reCAPTCHA] Assessment score: ${score} (threshold: ${threshold}) for action: ${action}`);

        if (data.riskAnalysis?.reasons && data.riskAnalysis.reasons.length > 0) {
            data.riskAnalysis.reasons.forEach((reason) => {
                console.log(`[reCAPTCHA Reason] ${reason}`);
            });
        }

        if (score < threshold) {
            console.warn(`❌ [reCAPTCHA] Score ${score} is below threshold ${threshold}`);
            return { success: false, reason: `Score ${score} is below threshold ${threshold}`, score };
        }

        return { success: true, score };
    } catch (err) {
        console.error("🔥 [reCAPTCHA] Exception during verification:", err);
        return { success: false, reason: `Exception: ${err.message}` };
    }
}
