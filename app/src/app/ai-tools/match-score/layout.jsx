export const metadata = {
    title: "AI Resume & Job Description Match Score Checker | CVGrid",
    description: "Calculate overall ATS alignment, skill gaps, and resume match score against any job description using advanced AI. Optimize your resume for ATS screening.",
    keywords: [
        "ATS match score", "resume alignment", "skill gap analysis",
        "job description match", "ATS compatibility checker", "resume score",
    ],
    alternates: {
        canonical: "/ai-tools/match-score",
    },
    openGraph: {
        title: "AI Resume & Job Description Match Score Checker | CVGrid",
        description: "Calculate overall ATS alignment, skill gaps, and resume match score against any job description using advanced AI. Optimize your resume for ATS screening.",
        url: "https://cvgrid.in/ai-tools/match-score",
        type: "website",
        images: [
            {
                url: "https://cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Match Score Checker",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Resume & Job Description Match Score Checker | CVGrid",
        description: "Calculate overall ATS alignment, skill gaps, and resume match score against any job description using advanced AI. Optimize your resume for ATS screening.",
        images: ["https://cvgrid.in/logo.png"],
    },
};

export default function MatchScoreLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/ai-tools/match-score/#page",
        "url": "https://cvgrid.in/ai-tools/match-score",
        "name": "AI Resume & Job Description Match Score Checker – CVGrid",
        "description": "Calculate overall ATS alignment, skill gaps, and resume match score against any job description using advanced AI.",
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
                    "name": "Match Score Checker",
                    "item": "https://cvgrid.in/ai-tools/match-score",
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
