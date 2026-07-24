export const metadata = {
    title: "AI Resume Keyword Optimizer – Find & Inject ATS Keywords | CVGrid",
    description: "Identify missing critical ATS keywords and automatically optimize your resume with contextual AI suggestions. Boost your interview callback rates.",
    keywords: [
        "resume keyword optimizer", "ATS keywords", "missing skills search",
        "resume keyword finder", "career optimizer", "ATS optimization",
    ],
    alternates: {
        canonical: "/ai-tools/keyword-optimizer",
    },
    openGraph: {
        title: "AI Resume Keyword Optimizer – Find & Inject ATS Keywords | CVGrid",
        description: "Identify missing critical ATS keywords and automatically optimize your resume with contextual AI suggestions. Boost your interview callback rates.",
        url: "https://cvgrid.in/ai-tools/keyword-optimizer",
        type: "website",
        images: [
            {
                url: "https://cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Keyword Optimizer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Resume Keyword Optimizer – Find & Inject ATS Keywords | CVGrid",
        description: "Identify missing critical ATS keywords and automatically optimize your resume with contextual AI suggestions. Boost your interview callback rates.",
        images: ["https://cvgrid.in/logo.png"],
    },
};

export default function KeywordOptimizerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/ai-tools/keyword-optimizer/#page",
        "url": "https://cvgrid.in/ai-tools/keyword-optimizer",
        "name": "AI Resume Keyword Optimizer – CVGrid",
        "description": "Identify missing critical ATS keywords and automatically optimize your resume with contextual AI suggestions.",
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
                    "name": "Keyword Optimizer",
                    "item": "https://cvgrid.in/ai-tools/keyword-optimizer",
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
