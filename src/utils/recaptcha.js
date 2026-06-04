export async function getRecaptchaToken(action) {
    if (!window.grecaptcha || !window.grecaptcha.enterprise) {
        throw new Error("reCAPTCHA not loaded");
    }

    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LfIrjQsAAAAANY4PBe_oGp6mIFkTwyeAB_DdG81";
    return await window.grecaptcha.enterprise.execute(
        siteKey,
        { action }
    );
}
