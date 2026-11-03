/**
 * Production-ready in-memory sliding-window rate limiter for sensitive endpoints.
 * Automatically evicts expired timestamps to prevent memory leaks.
 */

const hitMap = new Map();

// Periodic cleanup every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredEntries(now) {
    for (const [key, record] of hitMap.entries()) {
        if (record.resetTime <= now) {
            hitMap.delete(key);
        }
    }
}

/**
 * Checks if a given key has exceeded the allowed request limit within the window.
 *
 * @param {string} key - Unique rate-limiting key (e.g., `otp:email@example.com` or `login:ip`)
 * @param {number} limit - Maximum allowed requests in the time window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetInSeconds: number }}
 */
export function checkRateLimit(key, limit, windowMs) {
    const now = Date.now();

    // Trigger cleanup if interval elapsed
    if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
        purgeExpiredEntries(now);
        lastCleanup = now;
    }

    let record = hitMap.get(key);

    if (!record || record.resetTime <= now) {
        record = {
            count: 1,
            resetTime: now + windowMs
        };
        hitMap.set(key, record);
        return {
            allowed: true,
            remaining: limit - 1,
            resetInSeconds: Math.ceil(windowMs / 1000)
        };
    }

    record.count += 1;

    const remaining = Math.max(0, limit - record.count);
    const resetInSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

    if (record.count > limit) {
        return {
            allowed: false,
            remaining: 0,
            resetInSeconds
        };
    }

    return {
        allowed: true,
        remaining,
        resetInSeconds
    };
}

/**
 * Helper to extract client IP address from Next.js request headers.
 */
export function getClientIp(request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    return request.headers.get("cf-connecting-ip") ||
           request.headers.get("x-real-ip") ||
           "127.0.0.1";
}

