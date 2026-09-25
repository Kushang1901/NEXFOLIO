export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/llms.txt", "/llms-full.txt"],
                disallow: ["/api/"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/"],
                disallow: ["/api/"],
            },
            {
                userAgent: "Bingbot",
                allow: ["/"],
                disallow: ["/api/"],
            },
            {
                // AI Search & Answer Engine Bots (AEO / GEO)
                userAgent: [
                    "GPTBot",
                    "ChatGPT-User",
                    "PerplexityBot",
                    "ClaudeBot",
                    "Claude-Web",
                    "Google-Extended",
                    "Applebot-Extended",
                    "cohere-ai",
                    "Bytespider",
                ],
                allow: ["/", "/llms.txt", "/llms-full.txt", "/blog/"],
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
