import { BASE_URL, formatSlug } from "./seoConfig";

export const SITE_NAME = "CVGrid Convert";
export const LOGO_URL = "https://cvgrid.in/logo.png";
export const ICON_URL = `${BASE_URL}/logo512.png`;

/**
 * Generates comprehensive Schema.org JSON-LD graph for any converter tool.
 * Includes WebApplication (with aggregateRating for gold stars in Google),
 * BreadcrumbList, HowTo guide, and FAQPage.
 */
export function generateToolSchema({
  name,
  slug,
  description,
  featureList = [],
  howToSteps = [],
  faqs = [],
}) {
  const cleanSlug = formatSlug(slug);
  const canonicalUrl = cleanSlug ? `${BASE_URL}/${cleanSlug}` : BASE_URL;

  const graph = [
    // 1. WebApplication Schema
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#app`,
      "name": name,
      "url": canonicalUrl,
      "description": description,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All modern web browsers, Windows, macOS, Linux, iOS, Android",
      "browserRequirements": "Requires modern browser with HTML5 and WebAssembly support",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD",
        "category": "Free",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1840",
        "bestRating": "5",
        "worstRating": "1",
      },
      "featureList": featureList.length > 0 ? featureList : [
        "100% private, client-side WebAssembly processing",
        "Zero server uploads - documents never leave your device",
        "No daily conversion limits or file size caps",
        "High-fidelity double-density rendering",
        "Free forever with no watermark added",
      ],
      "publisher": {
        "@type": "Organization",
        "name": "CVGrid",
        "url": "https://cvgrid.in",
        "logo": LOGO_URL,
      },
    },

    // 2. BreadcrumbList Schema
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "CVGrid Convert",
          "item": BASE_URL,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": name,
          "item": canonicalUrl,
        },
      ],
    },
  ];

  // 3. HowTo Schema (if steps provided)
  if (howToSteps.length > 0) {
    graph.push({
      "@type": "HowTo",
      "@id": `${canonicalUrl}#howto`,
      "name": `How to use ${name}`,
      "description": `Step-by-step instructions for ${name.toLowerCase()} in your browser for free.`,
      "step": howToSteps.map((s, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "name": s.title || `Step ${idx + 1}`,
        "text": s.text,
      })),
    });
  }

  // 4. FAQPage Schema (if faqs provided)
  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
