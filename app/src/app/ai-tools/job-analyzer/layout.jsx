export const metadata = {
    title: "AI Job Description Parser & ATS Stack Extractor | CVGrid",
    description: "Instantly extract required experience, technical tools, responsibilities, and key challenges from any job posting with our advanced AI parser.",
    keywords: [
        "job parser", "parse job description", "extract tech stack",
        "job requirement analyzer", "key responsibilities extractor", "ATS description extractor",
    ],
    alternates: {
        canonical: "/ai-tools/job-analyzer",
    },
    openGraph: {
        title: "AI Job Description Parser & ATS Stack Extractor | CVGrid",
        description: "Instantly extract required experience, technical tools, responsibilities, and key challenges from any job posting with our advanced AI parser.",
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
        title: "AI Job Description Parser & ATS Stack Extractor | CVGrid",
        description: "Instantly extract required experience, technical tools, responsibilities, and key challenges from any job posting with our advanced AI parser.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function JobAnalyzerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/job-analyzer/#page",
        "url": "https://app.cvgrid.in/ai-tools/job-analyzer",
        "name": "AI Job Description Parser – CVGrid",
        "description": "Instantly extract required experience, technical tools, responsibilities, and key challenges from any job posting with our advanced AI parser.",
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
                    "name": "Job Parser & Analyzer",
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

