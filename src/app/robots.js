export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/builder", "/preview", "/profile", "/api/", "/_next/", "/resume/"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/"],
                disallow: ["/builder", "/preview", "/profile", "/api/", "/_next/", "/resume/"],
                crawlDelay: 0,
            },
        ],
        sitemap: "https://cvgrid.in/sitemap.xml",
        host: "https://cvgrid.in",
    };
}

