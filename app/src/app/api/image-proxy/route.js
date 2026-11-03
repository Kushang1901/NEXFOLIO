import { NextResponse } from "next/server";

// SSRF Protection: validate that the target URL is safe to fetch
function isAllowedUrl(targetUrlString) {
    try {
        const parsed = new URL(targetUrlString);
        
        // 1. Only allow standard HTTP / HTTPS
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return { safe: false, reason: "Invalid protocol. Only HTTP and HTTPS are permitted." };
        }

        const hostname = parsed.hostname.toLowerCase();

        // 2. Reject localhost & loopback addresses
        if (
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "::1" ||
            hostname === "0.0.0.0" ||
            hostname.endsWith(".localhost") ||
            hostname.endsWith(".local") ||
            hostname.endsWith(".internal")
        ) {
            return { safe: false, reason: "Loopback and internal hostnames are prohibited." };
        }

        // 3. Reject cloud metadata IP and domains
        if (
            hostname === "169.254.169.254" ||
            hostname === "metadata.google.internal" ||
            hostname.startsWith("169.254.")
        ) {
            return { safe: false, reason: "Cloud metadata endpoints are prohibited." };
        }

        // 4. Reject IPv4 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8)
        const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
        if (ipv4Match) {
            const octet1 = parseInt(ipv4Match[1], 10);
            const octet2 = parseInt(ipv4Match[2], 10);

            if (
                octet1 === 10 ||
                octet1 === 127 ||
                octet1 === 0 ||
                (octet1 === 172 && octet2 >= 16 && octet2 <= 31) ||
                (octet1 === 192 && octet2 === 168)
            ) {
                return { safe: false, reason: "Private network IP addresses are prohibited." };
            }
        }

        return { safe: true, url: parsed.toString() };
    } catch {
        return { safe: false, reason: "Malformed URL provided." };
    }
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB max
const ALLOWED_CONTENT_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/avif"
]);

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // SSRF Safety Check
        const urlCheck = isAllowedUrl(url);
        if (!urlCheck.safe) {
            console.warn(`🚨 [SSRF Warning] Blocked suspicious image proxy request: ${url} (Reason: ${urlCheck.reason})`);
            return NextResponse.json({ error: `Forbidden: ${urlCheck.reason}` }, { status: 403 });
        }

        // Fetch with a 6-second timeout to prevent hanging connections
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        let res;
        try {
            res = await fetch(urlCheck.url, {
                signal: controller.signal,
                headers: {
                    "User-Agent": "CVGrid-ImageProxy/1.0",
                    "Accept": "image/webp,image/png,image/jpeg,image/*"
                }
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch remote image" }, { status: res.status });
        }

        // Validate content-type
        const rawContentType = res.headers.get("content-type") || "";
        const cleanContentType = rawContentType.split(";")[0].trim().toLowerCase();

        if (!ALLOWED_CONTENT_TYPES.has(cleanContentType) && !cleanContentType.startsWith("image/")) {
            return NextResponse.json(
                { error: "Forbidden: Remote URL does not return a supported image format." },
                { status: 415 }
            );
        }

        // Validate content length header if provided
        const contentLengthHeader = res.headers.get("content-length");
        if (contentLengthHeader && parseInt(contentLengthHeader, 10) > MAX_IMAGE_SIZE_BYTES) {
            return NextResponse.json({ error: "Image exceeds maximum allowed size (5MB)." }, { status: 413 });
        }

        const buffer = await res.arrayBuffer();
        if (buffer.byteLength > MAX_IMAGE_SIZE_BYTES) {
            return NextResponse.json({ error: "Image exceeds maximum allowed size (5MB)." }, { status: 413 });
        }

        return new Response(buffer, {
            headers: {
                "Content-Type": cleanContentType,
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
                "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
                "X-Frame-Options": "DENY"
            }
        });
    } catch (err) {
        if (err.name === "AbortError") {
            return NextResponse.json({ error: "Image download timed out." }, { status: 504 });
        }
        console.error("Image Proxy Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
