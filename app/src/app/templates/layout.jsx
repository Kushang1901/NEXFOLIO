export const metadata = {
    title: "ATS Resume Templates – 18+ Free & Premium Designs | CVGrid",
    description: "Browse 18+ free & premium ATS-optimized resume templates.",
    keywords: [
        "free resume templates", "ATS resume templates", "professional resume templates",
        "modern resume template", "classic resume template", "creative resume template",
        "executive resume template", "developer resume template", "minimalist resume template",
        "elegant resume template", "navy resume template", "emerald resume template",
        "AI resume template", "free CV template", "resume layout free download",
        "best resume templates 2026", "resume designs free",
    ],
    alternates: {
        canonical: "/templates",
    },
    openGraph: {
        title: "ATS Resume Templates – 18+ Free & Premium Designs | CVGrid",
        description: "Browse 18+ free & premium ATS-optimized resume templates.",
        url: "https://app.cvgrid.in/templates",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Resume Templates",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "18+ Professional ATS Resume Templates – CVGrid",
        description: "Browse 18+ free & premium ATS-optimized resume templates.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function TemplatesLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://app.cvgrid.in/templates/#page",
        "url": "https://app.cvgrid.in/templates",
        "name": "ATS Resume Templates – CVGrid",
        "description": "Browse 18+ free & premium ATS-optimized resume templates.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://cvgrid.in",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Resume Templates",
                    "item": "https://app.cvgrid.in/templates",
                },
            ],
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": "Free Resume Templates",
            "numberOfItems": 18,
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Classic Resume Template" },
                { "@type": "ListItem", "position": 2, "name": "Modern Resume Template" },
                { "@type": "ListItem", "position": 3, "name": "Creative Resume Template" },
                { "@type": "ListItem", "position": 4, "name": "Minimalist Resume Template" },
                { "@type": "ListItem", "position": 5, "name": "Executive Resume Template" },
                { "@type": "ListItem", "position": 6, "name": "Developer Resume Template" },
                { "@type": "ListItem", "position": 7, "name": "Elegant Resume Template" },
                { "@type": "ListItem", "position": 8, "name": "Accent Resume Template" },
                { "@type": "ListItem", "position": 9, "name": "Navy Elegance Resume Template" },
                { "@type": "ListItem", "position": 10, "name": "Modern Minimalist Resume Template" },
                { "@type": "ListItem", "position": 11, "name": "Emerald Resume Template" },
                { "@type": "ListItem", "position": 12, "name": "Slate Two-Column Resume Template" },
                { "@type": "ListItem", "position": 13, "name": "Sunrise Resume Template" },
                { "@type": "ListItem", "position": 14, "name": "Midnight Resume Template" },
                { "@type": "ListItem", "position": 15, "name": "Nordic Resume Template" },
                { "@type": "ListItem", "position": 16, "name": "Crimson Resume Template" },
                { "@type": "ListItem", "position": 17, "name": "Aurora Resume Template" },
                { "@type": "ListItem", "position": 18, "name": "Timeline Resume Template" },
            ],
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}

