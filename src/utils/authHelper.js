import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "cvgrid-super-secret-key-123456";

/**
 * Generates a signed HS256 JWT for direct database fallback sessions.
 * Requires no external libraries.
 */
export function generateLocalToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const body = Buffer.from(JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days expiry
    })).toString("base64url");
    const signature = crypto
        .createHmac("sha256", JWT_SECRET)
        .update(`${header}.${body}`)
        .digest("base64url");

    return `${header}.${body}.${signature}`;
}

/**
 * Verifies our local custom fallback JWT.
 */
export function verifyLocalToken(token) {
    try {
        const [header, body, signature] = token.split(".");
        if (!header || !body || !signature) return null;

        const expectedSignature = crypto
            .createHmac("sha256", JWT_SECRET)
            .update(`${header}.${body}`)
            .digest("base64url");

        if (signature !== expectedSignature) {
            return null;
        }

        const decoded = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        
        // Check expiry
        if (decoded.exp && Date.now() / 1000 > decoded.exp) {
            return null;
        }

        return decoded;
    } catch {
        return null;
    }
}

// Cache for certificates to avoid fetching them on every request
let googleCertificatesCache = null;
let googleCertificatesExpiry = 0;

async function getGoogleCertificates() {
    if (googleCertificatesCache && Date.now() < googleCertificatesExpiry) {
        return googleCertificatesCache;
    }

    try {
        const res = await fetch(
            "https://www.googleapis.com/robot/v1/metadata/x509/securetoken-system@system.gserviceaccount.com",
            { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch Google public keys");
        
        const cacheControl = res.headers.get("cache-control");
        let maxAge = 3600; // default 1 hour cache
        if (cacheControl) {
            const match = cacheControl.match(/max-age=(\d+)/);
            if (match) maxAge = parseInt(match[1], 10);
        }

        const keys = await res.json();
        googleCertificatesCache = keys;
        googleCertificatesExpiry = Date.now() + (maxAge * 1000);
        return keys;
    } catch (err) {
        console.error("Error fetching Google public keys:", err);
        return null;
    }
}

/**
 * Verifies a Google Firebase ID Token.
 */
export async function verifyFirebaseToken(token) {
    try {
        const [headerB64, bodyB64, signatureB64] = token.split(".");
        if (!headerB64 || !bodyB64 || !signatureB64) return null;

        const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf8"));
        const body = JSON.parse(Buffer.from(bodyB64, "base64url").toString("utf8"));

        // 1. Verify standard claims
        if (body.iss !== `https://securetoken.google.com/resumecraft-e16fe`) {
            console.error("Firebase token check error: Invalid issuer:", body.iss);
            return null;
        }
        if (body.aud !== "resumecraft-e16fe") {
            console.error("Firebase token check error: Invalid audience:", body.aud);
            return null;
        }
        if (body.exp && Date.now() / 1000 > body.exp) {
            console.error("Firebase token check error: Token expired");
            return null;
        }

        // 2. Fetch Google certificates and find the one matching the kid in the header
        const certs = await getGoogleCertificates();
        if (!certs) return null;

        const cert = certs[header.kid];
        if (!cert) {
            console.error("Firebase token check error: Certificate not found for kid:", header.kid);
            return null;
        }

        // 3. Verify the signature using Node's crypto verify
        const verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(`${headerB64}.${bodyB64}`);
        const verified = verifier.verify(cert, signatureB64, "base64url");

        if (!verified) {
            console.error("Firebase token check error: Signature verification failed");
            return null;
        }

        return { email: body.email };
    } catch (err) {
        console.error("Firebase token check error:", err);
        return null;
    }
}

/**
 * Authenticates a request. Returns the user's verified email, or null.
 */
export async function verifyAuth(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    // 1. Try to verify as our custom local JWT fallback first (extremely fast)
    const localUser = verifyLocalToken(token);
    if (localUser && localUser.email) {
        return localUser.email;
    }

    // 2. Try to verify as a Google Firebase ID Token
    const firebaseUser = await verifyFirebaseToken(token);
    if (firebaseUser && firebaseUser.email) {
        return firebaseUser.email;
    }

    return null;
}
