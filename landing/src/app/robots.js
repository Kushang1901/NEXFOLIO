export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/api/"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/"],
                disallow: ["/api/"],
            },
            {
                userAgent: "Mediapartners-Google",
                allow: ["/"],
            },
        ],
        sitemap: "https://cvgrid.in/sitemap.xml",
        host: "https://cvgrid.in",
    };
}

