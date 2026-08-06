export const metadata = {
    title: "Free AI Resume & Career Tools Suite | CVGrid",
    description: "Explore CVGrid's suite of free AI resume and career prep tools.",
    keywords: [
        "AI resume tools", "free career tools", "AI cover letter generator",
        "free ATS checker", "PDF resume parser", "CVGrid AI tools",
        "free AI resume maker", "online resume writer", "best AI career suite",
    ],
    alternates: {
        canonical: "/ai-tools",
    },
    openGraph: {
        title: "Free AI Resume & Career Tools Suite | CVGrid",
        description: "Explore CVGrid's suite of free AI resume and career prep tools.",
        url: "https://app.cvgrid.in/ai-tools",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid AI Career Suite",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Resume & Career Tools Suite – CVGrid",
        description: "Explore CVGrid's suite of free AI resume and career prep tools.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function AIToolsLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/#page",
        "url": "https://app.cvgrid.in/ai-tools",
        "name": "Free AI Resume & Career Tools Suite – CVGrid",
        "description": "Explore CVGrid's suite of free AI resume and career prep tools.",
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

