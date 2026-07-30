import { NextResponse } from "next/server";

export function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const hostname = req.headers.get("host") || "";

    // Pass through root page, Next.js internal files, static/public files, and API routes
    if (
        pathname === "/" ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/static") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const isLocalhost = hostname.includes("localhost");
    const proto = isLocalhost ? "http" : "https";
    
    // In local development, redirect to app.localhost:<port>
    // In production, redirect to app.cvgrid.in
    const targetHost = isLocalhost 
        ? hostname.replace("localhost", "app.localhost") 
        : "app.cvgrid.in";

    const targetUrl = new URL(`${proto}://${targetHost}${pathname}${url.search}`);
    
    // 308 Permanent Redirect tells browsers and search engines to cache the redirect
    // and update their search listings permanently.
    return NextResponse.redirect(targetUrl, 308);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
