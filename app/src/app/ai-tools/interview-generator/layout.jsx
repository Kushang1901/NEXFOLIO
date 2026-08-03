export const metadata = {
    title: "Free AI Mock Interview Questions & Answers Generator – CVGrid",
    description: "Generate targeted technical and behavioral interview questions and expert answers based on your resume and target job description using AI.",
    keywords: ["interview generator","mock interview prep","custom interview questions","career prep","AI interview helper","interview questions and answers","behavioral interview prep generator","technical interview answers ai"],
    alternates: {
        canonical: "/ai-tools/interview-generator",
    },
    openGraph: {
        title: "Free AI Mock Interview Questions & Answers Generator – CVGrid",
        description: "Generate targeted technical and behavioral interview questions and expert answers based on your resume and target job description using AI.",
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
        title: "Free AI Mock Interview Questions & Answers Generator – CVGrid",
        description: "Generate targeted technical and behavioral interview questions and expert answers based on your resume and target job description using AI.",
        images: ["https://app.cvgrid.in/logo.png"],
    },
};

export default function InterviewGeneratorLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://app.cvgrid.in/ai-tools/interview-generator/#page",
        "url": "https://app.cvgrid.in/ai-tools/interview-generator",
        "name": "Free AI Mock Interview Questions & Answers Generator – CVGrid",
        "description": "Generate targeted technical and behavioral interview questions and expert answers based on your resume and target job description using AI.",
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Free AI Mock Interview Questions & Answers Generator – CVGrid",
                    "item": "https://cvgrid.in",
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Free AI Mock Interview Questions & Answers Generator – CVGrid",
                    "item": "https://app.cvgrid.in/ai-tools",
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Free AI Mock Interview Questions & Answers Generator – CVGrid",
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

