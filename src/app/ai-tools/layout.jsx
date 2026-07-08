export const metadata = {
    title: "Free AI Resume & Career Tools Suite | CVGrid",
    description: "Explore CVGrid's full suite of free AI tools for job seekers. Build an ATS-friendly resume, check your ATS score, generate cover letters, and parse PDF resumes for free.",
    keywords: [
        "AI resume tools", "free career tools", "AI cover letter generator",
        "free ATS checker", "PDF resume parser", "CVGrid AI tools",
        "free AI resume maker", "online resume writer", "best AI career suite",
    ],
    alternates: {
        canonical: "/ai-tools",
    },
    openGraph: {
        title: "Free AI Resume & Career Tools Suite | CVGrid",
        description: "Explore CVGrid's full suite of free AI tools. Build an ATS-friendly resume, check your ATS score, generate cover letters, and parse PDF resumes for free.",
        url: "https://cvgrid.in/ai-tools",
        type: "website",
        images: [
            {
                url: "https://cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid AI Career Suite",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free AI Resume & Career Tools Suite – CVGrid",
        description: "Access our suite of AI tools: Resume Builder, ATS Score Checker, Cover Letter Generator, and PDF Parser. 100% free.",
        images: ["https://cvgrid.in/logo.png"],
    },
};

export default function AIToolsLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/ai-tools/#page",
        "url": "https://cvgrid.in/ai-tools",
        "name": "Free AI Resume & Career Tools Suite – CVGrid",
        "description": "Explore CVGrid's full suite of free AI tools for job seekers. Build an ATS-friendly resume, check your ATS score, generate cover letters, and parse PDF resumes for free.",
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
