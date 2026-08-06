export const metadata = {
    title: "Free AI ATS Resume Checker & Scorer Online | Check Resume Score Free – CVGrid",
    description: "Scan your resume to check its ATS compatibility score for free.",
    keywords: ["best ats scorer","best ats score checker","free resume checker","ATS score checker","ATS resume scanner","check resume ATS compatibility","free ATS resume analyzer","beat applicant tracking system","resume keyword match tool","best free ATS checker 2026","AI resume checker","resume checker online free","applicant tracking system score","best ATS score analyzer","check resume ats rating online"],
    alternates: {
        canonical: "/ats-checker",
    },
    openGraph: {
        title: "Free AI ATS Resume Checker & Scorer Online | Check Resume Score Free – CVGrid",
        description: "Scan your resume to check its ATS compatibility score for free.",
        url: "https://app.cvgrid.in/ats-checker",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid ATS Resume Checker & Scorer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI ATS Resume Checker & Scorer Online | Check Resume Score Free – CVGrid",
        description: "Scan your resume to check its ATS compatibility score for free.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function ATSCheckerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ats-checker/#page",
        "url": "https://app.cvgrid.in/ats-checker",
        "name": "Free AI ATS Resume Checker & Scorer Online | Check Resume Score Free – CVGrid",
        "description": "Scan your resume to check its ATS compatibility score for free.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Free AI ATS Resume Checker & Scorer Online | Check Resume Score Free – CVGrid",
                    "item": "https://cvgrid.in",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Free AI ATS Resume Checker & Scorer Online | Check Resume Score Free – CVGrid",
                    "item": "https://app.cvgrid.in/ats-checker",
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
