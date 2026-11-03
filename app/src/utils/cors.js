/**
 * Secure CORS validator for CVGrid API endpoints.
 * Validates request origin against allowed CVGrid domains rather than allowing wildcard '*'.
 */

const ALLOWED_ORIGIN_PATTERNS = [
    /^https:\/\/cvgrid\.in$/,
    /^https:\/\/www\.cvgrid\.in$/,
    /^https:\/\/app\.cvgrid\.in$/,
    /^https:\/\/convert\.cvgrid\.in$/,
    /^https:\/\/[a-zA-Z0-9-]+\.cvgrid\.in$/, // User custom subdomains
];

const DEV_ORIGIN_PATTERNS = [
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/[a-zA-Z0-9-]+\.localhost(:\d+)?$/,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/
];

/**
 * Validates whether an origin header is an authorized CVGrid domain.
 * @param {string|null} origin
 * @returns {boolean}
 */
export function isAllowedOrigin(origin) {
    if (!origin) return false;

    // Check production patterns
    if (ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin))) {
        return true;
    }

    // Check development patterns in non-production environments
    if (process.env.NODE_ENV !== "production") {
        if (DEV_ORIGIN_PATTERNS.some(pattern => pattern.test(origin))) {
            return true;
        }
    }

    return false;
}

/**
 * Returns secure CORS headers matching the incoming request origin.
 * @param {Request} request
 * @param {string[]} [allowedMethods]
 * @returns {Record<string, string>}
 */
export function getCorsHeaders(request, allowedMethods = ["GET", "POST", "OPTIONS"]) {
    const origin = request?.headers?.get("origin");
    const allowed = isAllowedOrigin(origin);

    const headers = {
        "Access-Control-Allow-Methods": allowedMethods.join(", "),
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin"
    };

    if (allowed && origin) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Credentials"] = "true";
    }

    return headers;
}

