export const metadata = {
    title: "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
    description: "Check your resume match score and alignment against any job post.",
    keywords: ["ATS match score","resume alignment","skill gap analysis","job description match","ATS compatibility checker","resume score","check resume fit for job description"],
    alternates: {
        canonical: "/ai-tools/match-score",
    },
    openGraph: {
        title: "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
        description: "Check your resume match score and alignment against any job post.",
        url: "https://app.cvgrid.in/ai-tools/match-score",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Match Score Checker",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
        description: "Check your resume match score and alignment against any job post.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function MatchScoreLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/match-score/#page",
        "url": "https://app.cvgrid.in/ai-tools/match-score",
        "name": "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
        "description": "Check your resume match score and alignment against any job post.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
                    "item": "https://cvgrid.in",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Free AI Resume Match Score Checker & ATS Alignment Scorer – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools/match-score",
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

