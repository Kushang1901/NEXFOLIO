export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/templates"],
                disallow: ["/builder", "/preview", "/profile", "/login", "/signup", "/api/"],
            },
        ],
        sitemap: "https://nexfolio.vercel.app/sitemap.xml",
    };
}
