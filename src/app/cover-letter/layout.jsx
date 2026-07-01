export const metadata = {
    title: "AI Cover Letter Generator – Free & Professional | Nexfolio",
    description: "Generate a compelling, personalized AI cover letter in seconds. Nexfolio's free AI cover letter generator helps you write tailored letters that match job descriptions and impress recruiters.",
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
        title: "AI Cover Letter Generator – Free & Professional | Nexfolio",
        description: "Generate a tailored, professional cover letter in seconds using AI. Free, no watermark, download instantly.",
        url: "https://nexfolio-ai.vercel.app/cover-letter",
        type: "website",
        images: [
            {
                url: "https://nexfolio-ai.vercel.app/logo.png",
                width: 1200,
                height: 630,
                alt: "Nexfolio AI Cover Letter Generator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Cover Letter Generator – Nexfolio",
        description: "Write a professional, personalized cover letter instantly with AI. 100% free.",
        images: ["https://nexfolio-ai.vercel.app/logo.png"],
    },
};

export default function CoverLetterLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://nexfolio-ai.vercel.app/cover-letter/#page",
        "url": "https://nexfolio-ai.vercel.app/cover-letter",
        "name": "Free AI Cover Letter Generator – Nexfolio",
        "description": "Generate professional, personalized cover letters with AI in seconds. Free to use, no credit card required.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://nexfolio-ai.vercel.app",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "AI Cover Letter Generator",
                    "item": "https://nexfolio-ai.vercel.app/cover-letter",
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
