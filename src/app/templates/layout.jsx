export const metadata = {
    title: "Free AI Resume Templates – 18+ ATS-Friendly Designs | CVGrid",
    description: "Browse 18+ free professional resume templates — Classic, Modern, Creative, Executive, Developer, Minimalist, Elegant, Nordic, Aurora, Midnight, Crimson and more. All ATS-optimized and free to download.",
    keywords: [
        "free resume templates", "ATS resume templates", "professional resume templates",
        "modern resume template", "classic resume template", "creative resume template",
        "executive resume template", "developer resume template", "minimalist resume template",
        "elegant resume template", "navy resume template", "emerald resume template",
        "AI resume template", "free CV template", "resume layout free download",
        "best resume templates 2025", "resume designs free",
    ],
    alternates: {
        canonical: "/templates",
    },
    openGraph: {
        title: "Free AI Resume Templates – 18+ ATS-Friendly Designs | CVGrid",
        description: "Browse 18+ free professional resume templates. All ATS-optimized. Pick a design and generate your resume with AI in seconds.",
        url: "https://nexfolio-ai.vercel.app/templates",
        type: "website",
        images: [
            {
                url: "https://nexfolio-ai.vercel.app/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Resume Templates",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "18+ Free ATS-Friendly Resume Templates – CVGrid",
        description: "Classic, Modern, Creative, Executive, Developer, Minimalist and many more. All ATS-optimized. Free to use.",
        images: ["https://nexfolio-ai.vercel.app/logo.png"],
    },
};

export default function TemplatesLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://nexfolio-ai.vercel.app/templates/#page",
        "url": "https://nexfolio-ai.vercel.app/templates",
        "name": "Free Resume Templates – CVGrid",
        "description": "Browse 18+ free, ATS-friendly resume templates. Choose from Classic, Modern, Creative, Executive, Developer, Minimalist, Elegant and more.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://nexfolio-ai.vercel.app",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Resume Templates",
                    "item": "https://nexfolio-ai.vercel.app/templates",
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
