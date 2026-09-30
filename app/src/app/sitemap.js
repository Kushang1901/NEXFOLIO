import { getDynamicSitemapRoutes } from "../lib/seoConfig";

/**
 * Dynamic XML Sitemap Generator for CVGrid Web App
 */
export const revalidate = 86400; // Dynamically revalidate every 24 hours

export default function sitemap() {
    const routes = getDynamicSitemapRoutes();

    return routes.map((route) => ({
        url: route.url,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        ...(route.images ? { images: route.images } : {}),
        ...(route.alternates ? { alternates: route.alternates } : {}),
    }));
}
