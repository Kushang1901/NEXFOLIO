import { NextResponse } from "next/server";

export function middleware(req) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Define main domains to exclude from subdomain routing
    const isLocalhost = hostname.includes("localhost");
    const isMainApp = hostname === "app.cvgrid.in" || (isLocalhost && hostname.startsWith("app."));

    // Allow requests to the main app dashboard, API, and static assets to pass through
    if (isMainApp || hostname === "cvgrid.in" || hostname === "www.cvgrid.in") {
        return NextResponse.next();
    }

    // Extract subdomain
    let subdomain = "";
    if (isLocalhost) {
        // Local dev: e.g. kushang.localhost:3000
        const parts = hostname.split(".");
        if (parts.length > 1 && parts[0] !== "localhost" && parts[0] !== "app" && parts[0] !== "www") {
            subdomain = parts[0];
        }
    } else {
        // Production: e.g. kushang.cvgrid.in
        const parts = hostname.split(".");
        if (parts.length > 2 && parts[0] !== "www" && parts[0] !== "app") {
            subdomain = parts[0];
        }
    }

    // Special rewrite for the docs subdomain (docs.cvgrid.in -> /docs)
    if (subdomain === "docs") {
        const path = url.pathname;
        if (
            path.startsWith("/api") || 
            path.startsWith("/_next") || 
            path.startsWith("/static") || 
            path.includes(".")
        ) {
            return NextResponse.next();
        }
        
        // If navigating to non-root pages (like /login, /signup, /templates) on the docs subdomain,
        // redirect them to the main app/domain.
        if (path !== "/") {
            const proto = isLocalhost ? "http" : "https";
            const targetHost = isLocalhost 
                ? hostname.replace("docs.localhost", "localhost") 
                : "app.cvgrid.in";
            return NextResponse.redirect(new URL(`${proto}://${targetHost}${path}${url.search}`, req.url));
        }

        // Rewrite root requests to /docs
        return NextResponse.rewrite(new URL("/docs", req.url));
    }

    // If we have a user subdomain (e.g. kushang.cvgrid.in)
    if (subdomain) {
        const path = url.pathname;
        
        // Exclude Next.js internals, public files, APIs, and static assets from rewrite
        if (
            path.startsWith("/api") || 
            path.startsWith("/_next") || 
            path.startsWith("/static") || 
            path.includes(".")
        ) {
            return NextResponse.next();
        }
        
        // Rewrite internally to /resume/[id]
        return NextResponse.rewrite(new URL(`/resume/${subdomain}${path}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
