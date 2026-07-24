export const metadata = {
    title: "AI Portfolio Website Generator & Code Downloader | CVGrid",
    description: "Generate stunning premium personal portfolios with custom animations, templates, and download the full source code for hosting. Elevate your online presence.",
    keywords: [
        "portfolio builder", "AI portfolio", "download portfolio code",
        "developer portfolio generator", "resume website builder", "portfolio layout",
    ],
    alternates: {
        canonical: "/ai-tools/portfolio-builder",
    },
    openGraph: {
        title: "AI Portfolio Website Generator & Code Downloader | CVGrid",
        description: "Generate stunning premium personal portfolios with custom animations, templates, and download the full source code for hosting. Elevate your online presence.",
        url: "https://cvgrid.in/ai-tools/portfolio-builder",
        type: "website",
        images: [
            {
                url: "https://cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid AI Portfolio Website Builder",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Portfolio Website Generator & Code Downloader | CVGrid",
        description: "Generate stunning premium personal portfolios with custom animations, templates, and download the full source code for hosting. Elevate your online presence.",
        images: ["https://cvgrid.in/logo.png"],
    },
};

export default function PortfolioBuilderLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/ai-tools/portfolio-builder/#page",
        "url": "https://cvgrid.in/ai-tools/portfolio-builder",
        "name": "AI Portfolio Website Generator & Code Downloader – CVGrid",
        "description": "Generate stunning premium personal portfolios with custom animations, templates, and download the full source code.",
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
                    "item": "https://cvgrid.in/ai-tools",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "AI Portfolio Builder",
                    "item": "https://cvgrid.in/ai-tools/portfolio-builder",
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
