import { TOOLS } from "../data/toolsData";

export const BASE_URL = "https://convert.cvgrid.in";

/**
 * Respected SEO Priority Hierarchy for CVGrid Convert
 * Calibrated against high-volume file conversion search intent.
 */
export const SEO_PRIORITY = {
  HOME: 1.0,               // Suite index & domain root
  CORE_CONVERTERS: 0.95,   // High-volume tools: PDF to JPG, JPG to PDF, Compress, Merge
  SECONDARY_CONVERTERS: 0.90, // Lossless & batch tools: PDF to PNG, PNG to PDF, Multi-image
  UTILITIES: 0.85,          // Page extractors & splitters
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
 * Sanitizes and normalizes raw slug input into a clean, canonical URL format.
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
 * Creates a validated sitemap entry object.
 */
export function createSitemapEntry({
  slug = "",
  priority = SEO_PRIORITY.SECONDARY_CONVERTERS,
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
 * Aggregates all sitemap entries dynamically with respected priorities and images.
 */
export function getDynamicSitemapRoutes() {
  const today = new Date().toISOString().split("T")[0];

  const homeRoute = createSitemapEntry({
    slug: "",
    priority: SEO_PRIORITY.HOME,
    changeFrequency: CHANGE_FREQUENCY.DAILY,
    lastModified: today,
    images: ["/logo512.png"],
  });

  const toolRoutes = TOOLS.map((tool) => {
    return createSitemapEntry({
      slug: tool.slug || tool.href.replace(/^\//, ""),
      priority: tool.priority || SEO_PRIORITY.SECONDARY_CONVERTERS,
      changeFrequency: CHANGE_FREQUENCY.WEEKLY,
      lastModified: today,
      images: ["/logo512.png"],
    });
  });

  const customRoutes = customRoutesRegistry.map((cfg) => createSitemapEntry(cfg));

  return [homeRoute, ...toolRoutes, ...customRoutes];
}
