export default function sitemap() {
    const baseUrl = "https://nexfolio.vercel.app";
    return [
        {
            url: baseUrl,
            lastModified: "2026-06-05",
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/templates`,
            lastModified: "2026-06-05",
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];
}
