export const metadata = {
    title: "AI Resume Sharing URL, Passcode Protection & Tracking | CVGrid",
    description: "Share your resume via a secure custom URL with passcode protection, and track views, downloads, and location analytics in real-time.",
    keywords: [
        "resume sharing", "track resume views", "passcode protected resume",
        "public resume url", "resume analytics", "job tracker",
    ],
    alternates: {
        canonical: "/ai-tools/resume-sharing",
    },
    openGraph: {
        title: "AI Resume Sharing URL, Passcode Protection & Tracking | CVGrid",
        description: "Share your resume via a secure custom URL with passcode protection, and track views, downloads, and location analytics in real-time.",
        url: "https://app.cvgrid.in/ai-tools/resume-sharing",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid AI Resume Sharing & Tracking",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Resume Sharing URL, Passcode Protection & Tracking | CVGrid",
        description: "Share your resume via a secure custom URL with passcode protection, and track views, downloads, and location analytics in real-time.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function ResumeSharingLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/resume-sharing/#page",
        "url": "https://app.cvgrid.in/ai-tools/resume-sharing",
        "name": "AI Resume Sharing & Tracking – CVGrid",
        "description": "Share your resume via a secure custom URL with passcode protection, and track views, downloads, and location analytics in real-time.",
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
                    "name": "Resume Sharing & Analytics",
                    "item": "https://app.cvgrid.in/ai-tools/resume-sharing",
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

