export const BASE_URL = "https://app.cvgrid.in";

/**
 * Respected SEO Priority Hierarchy for CVGrid Web App
 */
export const SEO_PRIORITY = {
    TEMPLATES: 1.0,           // Resume templates catalog & interactive gallery
    ATS_CHECKER: 0.95,        // Free ATS resume scanner & scoring tool
    AI_TOOLS_HUB: 0.90,       // AI Career & Resume optimization hub
    COVER_LETTER: 0.90,       // AI Cover letter generator
    AI_TOOL_DETAIL: 0.85,     // Specific AI tools (Keyword Optimizer, Match Score, Job Analyzer, etc.)
    DOCS: 0.70,               // User guides & documentation
    LEGAL: 0.50,              // Legal & terms
};

export const CHANGE_FREQUENCY = {
    ALWAYS: "always",
    HOURLY: "hourly",
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
    NEVER: "never",
};

/**
 * Sanitizes and normalizes any slug into a clean URL-safe format
 */
export function formatSlug(rawSlug) {
    if (!rawSlug && rawSlug !== 0) return "";
    return String(rawSlug)
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "")
        .replace(/[_\s]+/g, "-")
        .replace(/[^a-z0-9\-/]/g, "")
        .replace(/-+/g, "-");
}

/**
 * Creates a validated sitemap entry object
 */
export function createSitemapEntry({
    slug = "",
    priority = SEO_PRIORITY.AI_TOOL_DETAIL,
    changeFrequency = CHANGE_FREQUENCY.WEEKLY,
    lastModified = new Date(),
    images = [],
    alternates = null,
}) {
    const cleanSlug = formatSlug(slug);
    const fullUrl = cleanSlug ? `${BASE_URL}/${cleanSlug}` : BASE_URL;

    let isoDate;
    try {
        if (lastModified instanceof Date && !isNaN(lastModified.getTime())) {
            isoDate = lastModified.toISOString().split("T")[0];
        } else if (typeof lastModified === "string" && lastModified) {
            const parsed = new Date(lastModified);
            isoDate = !isNaN(parsed.getTime())
                ? parsed.toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];
        } else {
            isoDate = new Date().toISOString().split("T")[0];
        }
    } catch {
        isoDate = new Date().toISOString().split("T")[0];
    }

    const validImages = Array.isArray(images)
        ? images
              .filter(Boolean)
              .map((img) => (img.startsWith("http") ? img : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`))
        : [];

    return {
        url: fullUrl,
        slug: cleanSlug,
        priority: Math.min(1.0, Math.max(0.1, Number(priority) || 0.7)),
        changeFrequency,
        lastModified: isoDate,
        ...(validImages.length > 0 ? { images: validImages } : {}),
        ...(alternates ? { alternates } : {}),
    };
}

const customRoutesRegistry = [];

export function registerCustomRoute(routeConfig) {
    if (!routeConfig) return;
    customRoutesRegistry.push(routeConfig);
}

/**
 * Dynamic route generator for app.cvgrid.in
 */
export function getDynamicSitemapRoutes() {
    const today = new Date().toISOString().split("T")[0];

    const coreRoutes = [
        createSitemapEntry({
            slug: "templates",
            priority: SEO_PRIORITY.TEMPLATES,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ats-checker",
            priority: SEO_PRIORITY.ATS_CHECKER,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "cover-letter",
            priority: SEO_PRIORITY.COVER_LETTER,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools",
            priority: SEO_PRIORITY.AI_TOOLS_HUB,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools/match-score",
            priority: SEO_PRIORITY.AI_TOOL_DETAIL,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools/keyword-optimizer",
            priority: SEO_PRIORITY.AI_TOOL_DETAIL,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools/job-analyzer",
            priority: SEO_PRIORITY.AI_TOOL_DETAIL,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools/interview-generator",
            priority: SEO_PRIORITY.AI_TOOL_DETAIL,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools/portfolio-builder",
            priority: SEO_PRIORITY.AI_TOOL_DETAIL,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "ai-tools/resume-sharing",
            priority: SEO_PRIORITY.AI_TOOL_DETAIL,
            changeFrequency: CHANGE_FREQUENCY.WEEKLY,
            lastModified: today,
        }),
    ];

    const customRoutes = customRoutesRegistry.map((cfg) => createSitemapEntry(cfg));

    return [...coreRoutes, ...customRoutes];
}
