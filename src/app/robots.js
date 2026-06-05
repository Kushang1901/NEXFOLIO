export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/templates"],
                disallow: ["/builder", "/preview", "/profile", "/login", "/signup", "/api/"],
            },
        ],
        sitemap: "https://resumecraft-ai.vercel.app/sitemap.xml",
    };
}
