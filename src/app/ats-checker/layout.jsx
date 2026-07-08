export const metadata = {
    title: "Free AI ATS Resume Checker & Score Analyzer | CVGrid",
    description: "Check your resume's ATS score for free. Our AI-powered ATS checker scans formatting, keywords, sections, and length to help you optimize your CV for job applications.",
    keywords: [
        "free resume checker", "ATS score checker", "ATS resume scanner",
        "check resume ATS compatibility", "free ATS resume analyzer",
        "beat applicant tracking system", "resume keyword match tool",
        "best free ATS checker 2026", "AI resume checker",
        "resume checker online free", "applicant tracking system score",
    ],
    alternates: {
        canonical: "/ats-checker",
    },
    openGraph: {
        title: "Free AI ATS Resume Checker & Score Analyzer | CVGrid",
        description: "Check your resume's ATS score for free. Get detailed formatting feedback and keyword match scores instantly.",
        url: "https://cvgrid.in/ats-checker",
        type: "website",
        images: [
            {
                url: "https://cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid ATS Resume Checker",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI ATS Resume Checker & Score Analyzer – CVGrid",
        description: "Analyze your resume against ATS tracking systems for free. Optimize keywords and layout instantly.",
        images: ["https://cvgrid.in/logo.png"],
    },
};

export default function ATSCheckerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/ats-checker/#page",
        "url": "https://cvgrid.in/ats-checker",
        "name": "Free AI ATS Resume Checker & Score Analyzer – CVGrid",
        "description": "Check your resume's ATS score for free. Our AI-powered ATS checker scans formatting, keywords, sections, and length to help you optimize your CV for job applications.",
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
                    "name": "ATS Checker",
                    "item": "https://cvgrid.in/ats-checker",
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
