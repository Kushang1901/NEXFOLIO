import { BASE_URL, formatSlug } from "./seoConfig";

export const SITE_NAME = "CVGrid";
export const LOGO_URL = `${BASE_URL}/logo.png`;
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Generates Schema.org BreadcrumbList markup
 * Synchronized with canonical URLs and customizable slugs.
 *
 * @param {Array<{ name: string, slug?: string }>} items - Array of breadcrumb steps
 * @returns {object} JSON-LD BreadcrumbList object
 */
export function generateBreadcrumbSchema(items = []) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => {
            const cleanSlug = item.slug ? formatSlug(item.slug) : "";
            const itemUrl = cleanSlug ? `${BASE_URL}/${cleanSlug}` : BASE_URL;

            return {
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": itemUrl,
            };
        }),
    };
}

/**
 * Generates Schema.org BlogPosting / Article markup
 * Directly synchronized with the post slug and canonical URL in the sitemap.
 *
 * @param {object} post - The blog post data object
 * @param {string} slug - The customizable slug
 * @returns {object} JSON-LD BlogPosting object
 */
export function generateArticleSchema(post, slug) {
    const cleanSlug = formatSlug(slug || post.slug);
    const canonicalUrl = `${BASE_URL}/blog/${cleanSlug}`;

    let isoDate = new Date().toISOString().split("T")[0];
    try {
        if (post.date) {
            const parsed = new Date(post.date);
            if (!isNaN(parsed.getTime())) {
                isoDate = parsed.toISOString().split("T")[0];
            }
        }
    } catch {}

    const postImage = post.image
        ? (post.image.startsWith("http") ? post.image : `${BASE_URL}${post.image.startsWith("/") ? "" : "/"}${post.image}`)
        : DEFAULT_OG_IMAGE;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl,
        },
        "headline": post.title,
        "description": post.description,
        "image": postImage,
        "inLanguage": "en-US",
        "datePublished": isoDate,
        "dateModified": isoDate,
        "author": {
            "@type": "Person",
            "name": post.author || "Kushang Acharya",
            "url": "https://kushangacharya.vercel.app",
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": BASE_URL,
            "logo": {
                "@type": "ImageObject",
                "url": LOGO_URL,
                "width": 512,
                "height": 512,
            },
        },
        ...(post.category ? { "articleSection": post.category } : {}),
        ...(post.readTime ? { "timeRequired": post.readTime } : {}),
    };
}

/**
 * Generates Schema.org SoftwareApplication markup for the CVGrid SaaS tool.
 */
export function generateSoftwareApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/#software`,
        "name": SITE_NAME,
        "alternateName": [
            "CVGrid Resume Builder",
            "Free AI Resume Maker",
            "AI CV Builder",
            "CVGrid AI Resume",
        ],
        "url": BASE_URL,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All modern web browsers, Windows, macOS, Linux, iOS, Android",
        "description":
            "CVGrid is an AI-powered resume builder that helps students and professionals create ATS-friendly resumes in minutes. Choose from 18+ templates, generate AI content, and export instantly.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "category": "Free",
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "url": BASE_URL,
            "logo": LOGO_URL,
        },
    };
}

/**
 * Generates Schema.org WebPage markup for standard marketing and legal pages.
 */
export function generateWebPageSchema({ title, description, slug, datePublished, dateModified }) {
    const cleanSlug = formatSlug(slug);
    const canonicalUrl = cleanSlug ? `${BASE_URL}/${cleanSlug}` : BASE_URL;

    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": title,
        "description": description,
        "inLanguage": "en-US",
        "isPartOf": {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            "name": SITE_NAME,
            "url": BASE_URL,
        },
        ...(datePublished ? { "datePublished": datePublished } : {}),
        ...(dateModified ? { "dateModified": dateModified } : {}),
    };
}

/**
 * Generates Schema.org FAQPage markup for FAQs on landing or tool pages.
 */
export function generateFaqSchema(faqs = []) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    };
}
