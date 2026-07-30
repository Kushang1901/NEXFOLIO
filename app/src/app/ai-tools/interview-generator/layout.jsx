export const metadata = {
    title: "AI Interview Questions & Recommended Answers Generator | CVGrid",
    description: "Generate targeted technical and behavioral interview questions based on your resume and job description, along with recommended expert answers.",
    keywords: [
        "interview generator", "mock interview prep", "custom interview questions",
        "career prep", "AI interview helper", "interview questions and answers",
    ],
    alternates: {
        canonical: "/ai-tools/interview-generator",
    },
    openGraph: {
        title: "AI Interview Questions & Recommended Answers Generator | CVGrid",
        description: "Generate targeted technical and behavioral interview questions based on your resume and job description, along with recommended expert answers.",
        url: "https://app.cvgrid.in/ai-tools/interview-generator",
        type: "website",
        images: [
            {
                url: "https://app.cvgrid.in/logo.png",
                width: 1200,
                height: 630,
                alt: "CVGrid Interview Prep Helper",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Interview Questions & Recommended Answers Generator | CVGrid",
        description: "Generate targeted technical and behavioral interview questions based on your resume and job description, along with recommended expert answers.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function InterviewGeneratorLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/interview-generator/#page",
        "url": "https://app.cvgrid.in/ai-tools/interview-generator",
        "name": "AI Interview Q&A Prep Generator – CVGrid",
        "description": "Generate targeted technical and behavioral interview questions based on your resume and job description.",
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
                    "name": "Interview Preparation",
                    "item": "https://app.cvgrid.in/ai-tools/interview-generator",
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

