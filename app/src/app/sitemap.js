export default function sitemap() {
    const baseUrl = "https://app.cvgrid.in";
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
            url: `${baseUrl}/ai-tools/match-score`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ai-tools/keyword-optimizer`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ai-tools/job-analyzer`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ai-tools/interview-generator`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ai-tools/portfolio-builder`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ai-tools/resume-sharing`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];
}
