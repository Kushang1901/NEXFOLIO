export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/builder", "/preview", "/profile", "/api/", "/_next/", "/resume/", "/forgot-password", "/my-resumes"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/"],
                disallow: ["/builder", "/preview", "/profile", "/api/", "/_next/", "/resume/", "/forgot-password", "/my-resumes"],
                crawlDelay: 0,
            },
        ],
        sitemap: "https://cvgrid.in/sitemap.xml",
        host: "https://cvgrid.in",
    };
}

