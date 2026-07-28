export default function sitemap() {
    const today = new Date().toISOString().split("T")[0];

    return [
        {
            url: "https://cvgrid.in",
            lastModified: today,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: "https://app.cvgrid.in/templates",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.95,
        },
        {
            url: "https://app.cvgrid.in/cover-letter",
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ats-checker",
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ai-tools",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: "https://app.cvgrid.in/ai-tools/match-score",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ai-tools/keyword-optimizer",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ai-tools/job-analyzer",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ai-tools/interview-generator",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ai-tools/portfolio-builder",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://app.cvgrid.in/ai-tools/resume-sharing",
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];
}
