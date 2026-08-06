export const metadata = {
    title: "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
    description: "Extract required experience, skills, and duties from job posts.",
    keywords: ["job parser","parse job description","extract tech stack","job requirement analyzer","key responsibilities extractor","ATS description extractor","ats job description analyzer"],
    alternates: {
        canonical: "/ai-tools/job-analyzer",
    },
    openGraph: {
        title: "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
        description: "Extract required experience, skills, and duties from job posts.",
        url: "https://app.cvgrid.in/ai-tools/job-analyzer",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Job Description Parser",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
        description: "Extract required experience, skills, and duties from job posts.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function JobAnalyzerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/job-analyzer/#page",
        "url": "https://app.cvgrid.in/ai-tools/job-analyzer",
        "name": "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
        "description": "Extract required experience, skills, and duties from job posts.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
                    "item": "https://cvgrid.in",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Free AI Job Description Parser & Job posting Analyzer – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools/job-analyzer",
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

