export default function sitemap() {
    const baseUrl = "https://cvgrid.in";
    const today = new Date().toISOString().split("T")[0];

    return [
        {
            url: baseUrl,
            lastModified: today,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/templates`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.95,
        },
        {
            url: `${baseUrl}/builder`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.85,
        },
        {
            url: `${baseUrl}/cover-letter`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ats-checker`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ai-tools`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];
}
