export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/api/", "/_next/"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/"],
                disallow: ["/api/", "/_next/"],
                crawlDelay: 0,
            },
        ],
        sitemap: "https://cvgrid.in/sitemap.xml",
        host: "https://cvgrid.in",
    };
}
