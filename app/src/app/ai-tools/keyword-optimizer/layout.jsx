export const metadata = {
    title: "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
    description: "Find and optimize critical missing ATS keywords on your resume.",
    keywords: ["keywords highlighter","resume keywords highlighter","ATS keyword highlighter","resume keyword optimizer","ATS keywords","missing skills search","resume keyword finder","career optimizer","ATS optimization","best keyword generator","best resume keyword generator","free keywords generator","resume keywords optimizer","scan resume for keywords"],
    alternates: {
        canonical: "/ai-tools/keyword-optimizer",
    },
    openGraph: {
        title: "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
        description: "Find and optimize critical missing ATS keywords on your resume.",
        url: "https://app.cvgrid.in/ai-tools/keyword-optimizer",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid AI Resume Keywords Highlighter",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
        description: "Find and optimize critical missing ATS keywords on your resume.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function KeywordOptimizerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/keyword-optimizer/#page",
        "url": "https://app.cvgrid.in/ai-tools/keyword-optimizer",
        "name": "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
        "description": "Find and optimize critical missing ATS keywords on your resume.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
                    "item": "https://cvgrid.in",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Free AI Resume Keyword Optimizer & ATS Keywords Highlighter – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools/keyword-optimizer",
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
