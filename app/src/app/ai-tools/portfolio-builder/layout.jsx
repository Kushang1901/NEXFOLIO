export const metadata = {
    title: "Affordable AI Portfolio Builder & Website Generator | CVGrid",
    description: "Generate and download professional personal portfolio websites.",
    keywords: [
        "less expensive portfolio builder", "affordable portfolio builder", "cheap portfolio builder",
        "portfolio builder", "AI portfolio", "download portfolio code",
        "developer portfolio generator", "resume website builder", "portfolio layout",
    ],
    alternates: {
        canonical: "/ai-tools/portfolio-builder",
    },
    openGraph: {
        title: "Affordable AI Portfolio Builder & Website Generator | CVGrid",
        description: "Generate and download professional personal portfolio websites.",
        url: "https://app.cvgrid.in/ai-tools/portfolio-builder",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Affordable AI Portfolio Website Builder",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Affordable AI Portfolio Builder & Website Generator | CVGrid",
        description: "Generate and download professional personal portfolio websites.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function PortfolioBuilderLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/portfolio-builder/#page",
        "url": "https://app.cvgrid.in/ai-tools/portfolio-builder",
        "name": "Affordable AI Portfolio Builder & Website Generator | CVGrid",
        "description": "Generate and download professional personal portfolio websites.",
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
                    "name": "AI Tools",
                    "item": "https://app.cvgrid.in/ai-tools",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "AI Portfolio Builder",
                    "item": "https://app.cvgrid.in/ai-tools/portfolio-builder",
                },
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

