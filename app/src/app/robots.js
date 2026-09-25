export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/templates",
                    "/ats-checker",
                    "/cover-letter",
                    "/ai-tools",
                    "/ai-tools/",
                    "/llms.txt",
                    "/llms-full.txt",
                ],
                disallow: [
                    "/builder",
                    "/preview",
                    "/profile",
                    "/api/",
                    "/_next/",
                    "/resume/",
                    "/forgot-password",
                    "/my-resumes",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: [
                    "/",
                    "/templates",
                    "/ats-checker",
                    "/cover-letter",
                    "/ai-tools",
                    "/ai-tools/",
                    "/login",
                    "/signup",
                ],
                disallow: [
                    "/builder",
                    "/preview",
                    "/profile",
                    "/api/",
                    "/_next/",
                    "/resume/",
                    "/forgot-password",
                    "/my-resumes",
                ],
            },
            {
                // AI search & answer engines
                userAgent: [
                    "GPTBot",
                    "ChatGPT-User",
                    "PerplexityBot",
                    "ClaudeBot",
                    "Claude-Web",
                    "Google-Extended",
                    "Applebot-Extended",
                ],
                allow: [
                    "/",
                    "/templates",
                    "/ats-checker",
                    "/cover-letter",
                    "/ai-tools",
                    "/ai-tools/",
                    "/llms.txt",
                    "/llms-full.txt",
                ],
                disallow: [
                    "/builder",
                    "/preview",
                    "/profile",
                    "/api/",
                    "/resume/",
                    "/my-resumes",
                ],
            },
        ],
        sitemap: "https://app.cvgrid.in/sitemap.xml",
        host: "https://app.cvgrid.in",
    };
}
