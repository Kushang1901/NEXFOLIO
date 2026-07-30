export const metadata = {
    title: "AI Cover Letter Generator – Free & Professional | CVGrid",
    description: "Generate a compelling, personalized AI cover letter in seconds. CVGrid's free AI cover letter generator helps you write tailored letters that match job descriptions and impress recruiters.",
    keywords: [
        "free cover letter generator", "AI cover letter writer", "cover letter maker free",
        "professional cover letter generator", "AI cover letter for job application",
        "automated cover letter generator", "free cover letter builder",
        "cover letter with AI", "best cover letter generator 2025",
        "cover letter generator no sign up",
    ],
    alternates: {
        canonical: "/cover-letter",
    },
    openGraph: {
        title: "AI Cover Letter Generator – Free & Professional | CVGrid",
        description: "Generate a tailored, professional cover letter in seconds using AI. Free, no watermark, download instantly.",
        url: "https://app.cvgrid.in/cover-letter",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid AI Cover Letter Generator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Cover Letter Generator – CVGrid",
        description: "Write a professional, personalized cover letter instantly with AI. 100% free.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function CoverLetterLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/cover-letter/#page",
        "url": "https://app.cvgrid.in/cover-letter",
        "name": "Free AI Cover Letter Generator – CVGrid",
        "description": "Generate professional, personalized cover letters with AI in seconds. Free to use, no credit card required.",
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
                    "name": "AI Cover Letter Generator",
                    "item": "https://app.cvgrid.in/cover-letter",
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

