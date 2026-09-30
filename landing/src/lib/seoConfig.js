import { BLOG_POSTS } from "../data/blogPosts";

export const BASE_URL = "https://cvgrid.in";

/**
 * Respected SEO Priority Hierarchy for CVGrid
 * Weighted strategically according to search intent, commercial value, and crawler prioritization.
 */
export const SEO_PRIORITY = {
    HOME: 1.0,               // Core SaaS conversion funnel & primary brand landing
    BLOG_INDEX: 0.90,        // Career guides directory & educational content hub
    BLOG_POST_PILLAR: 0.85,  // High-search-volume pillar guides (e.g., ATS formats, resume keywords)
    BLOG_POST_STANDARD: 0.80,// Standard tactical guides & interview prep articles
    ABOUT: 0.75,             // E-E-A-T, brand transparency & founder credentials
    CONTACT: 0.70,           // Contact, feedback, and user support channels
    LEGAL: 0.50,             // Privacy policy, Terms of service & Disclaimer compliance
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
 * Normalizes and sanitizes any given slug into a clean, canonical URL-safe format.
 * - Converts to lowercase
 * - Replaces spaces and underscores with hyphens
 * - Removes disallowed characters
 * - Deduplicates hyphens
 * - Trims leading and trailing slashes
 */
export function formatSlug(rawSlug) {
    if (!rawSlug && rawSlug !== 0) return "";
    return String(rawSlug)
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "")          // Strip leading and trailing slashes
        .replace(/[_\s]+/g, "-")           // Convert spaces and underscores to hyphens
        .replace(/[^a-z0-9\-/]/g, "")      // Strip invalid characters, keep hyphens and forward-slashes
        .replace(/-+/g, "-");              // Remove repeated hyphens
}

/**
 * Creates a validated, standardized sitemap entry object.
 * Guarantees proper URL formatting, slug handling, priority bounds, and date validation.
 */
export function createSitemapEntry({
    slug = "",
    priority = SEO_PRIORITY.BLOG_POST_STANDARD,
    changeFrequency = CHANGE_FREQUENCY.MONTHLY,
    lastModified = new Date(),
    images = [],
    alternates = null,
}) {
    const cleanSlug = formatSlug(slug);
    const fullUrl = cleanSlug ? `${BASE_URL}/${cleanSlug}` : BASE_URL;

    // Format last modified date into YYYY-MM-DD
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

/**
 * In-memory registry for ad-hoc or dynamic custom routes.
 * Enables adding customizable URLs with custom slugs and priorities on the fly.
 */
const customRoutesRegistry = [];

export function registerCustomRoute(routeConfig) {
    if (!routeConfig) return;
    customRoutesRegistry.push(routeConfig);
}

export function clearCustomRoutes() {
    customRoutesRegistry.length = 0;
}

/**
 * Builds the complete dynamic list of sitemap routes with respected priorities.
 * Evaluates core landing routes, dynamic blog articles, and any custom registered routes.
 */
export function getDynamicSitemapRoutes() {
    const today = new Date().toISOString().split("T")[0];

    // 1. Core static routes with respected priorities
    const coreRoutes = [
        createSitemapEntry({
            slug: "",
            priority: SEO_PRIORITY.HOME,
            changeFrequency: CHANGE_FREQUENCY.DAILY,
            lastModified: today,
            images: ["/og-image.png", "/logo.png"],
        }),
        createSitemapEntry({
            slug: "blog",
            priority: SEO_PRIORITY.BLOG_INDEX,
            changeFrequency: CHANGE_FREQUENCY.DAILY,
            lastModified: today,
            images: ["/og-image.png"],
        }),
        createSitemapEntry({
            slug: "about",
            priority: SEO_PRIORITY.ABOUT,
            changeFrequency: CHANGE_FREQUENCY.MONTHLY,
            lastModified: today,
            images: ["/og-image.png"],
        }),
        createSitemapEntry({
            slug: "contact",
            priority: SEO_PRIORITY.CONTACT,
            changeFrequency: CHANGE_FREQUENCY.MONTHLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "privacy",
            priority: SEO_PRIORITY.LEGAL,
            changeFrequency: CHANGE_FREQUENCY.YEARLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "terms",
            priority: SEO_PRIORITY.LEGAL,
            changeFrequency: CHANGE_FREQUENCY.YEARLY,
            lastModified: today,
        }),
        createSitemapEntry({
            slug: "disclaimer",
            priority: SEO_PRIORITY.LEGAL,
            changeFrequency: CHANGE_FREQUENCY.YEARLY,
            lastModified: today,
        }),
    ];

    // 2. Dynamic blog routes with customizable slugs and respected priorities
    const pillarKeywords = ["ats", "format", "summary", "keywords", "templates", "skills", "freshers"];

    const blogRoutes = BLOG_POSTS.map((post) => {
        const cleanPostSlug = formatSlug(post.slug);
        
        // Assign higher pillar priority if the post covers core high-traffic search intents
        const isPillar = pillarKeywords.some((kw) => cleanPostSlug.includes(kw));
        const postPriority = isPillar ? SEO_PRIORITY.BLOG_POST_PILLAR : SEO_PRIORITY.BLOG_POST_STANDARD;

        const postImage = post.image || "/og-image.png";

        return createSitemapEntry({
            slug: `blog/${cleanPostSlug}`,
            priority: postPriority,
            changeFrequency: CHANGE_FREQUENCY.MONTHLY,
            lastModified: post.date || today,
            images: [postImage],
        });
    });

    // 3. Any dynamically registered custom routes
    const customRoutes = customRoutesRegistry.map((cfg) => createSitemapEntry(cfg));

    return [...coreRoutes, ...blogRoutes, ...customRoutes];
}
