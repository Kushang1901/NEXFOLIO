export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/templates", "/cover-letter", "/signup", "/login"],
                disallow: ["/builder", "/preview", "/profile", "/api/", "/_next/", "/resume/"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/", "/templates", "/cover-letter", "/signup", "/login"],
                disallow: ["/builder", "/preview", "/profile", "/api/"],
                crawlDelay: 0,
            },
        ],
        sitemap: "https://cvgrid.in/sitemap.xml",
        host: "https://cvgrid.in",
    };
}
