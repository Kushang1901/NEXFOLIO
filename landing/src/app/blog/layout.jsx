export const metadata = {
    title: "Career Guides, ATS Tips & Resume Strategies | CVGrid Blog",
    description: "Expert guides on creating ATS-friendly resumes, writing elevator pitch summaries, formatting CVs, and acing job interviews with AI assistance.",
    alternates: {
        canonical: "https://cvgrid.in/blog",
    },
    openGraph: {
        title: "CVGrid Career Advice & ATS Resume Guides",
        description: "Explore in-depth articles on ATS parsing algorithms, resume design principles, and modern job search tactics.",
        url: "https://cvgrid.in/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CVGrid Career Advice & ATS Resume Guides",
        description: "Explore in-depth articles on ATS parsing algorithms, resume design principles, and modern job search tactics.",
    },
};

export default function BlogLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://cvgrid.in/blog/#webpage",
        "url": "https://cvgrid.in/blog",
        "name": "CVGrid Career Hub & Blog",
        "description": "Expert advice, formatting tutorials, and ATS strategies for career growth.",
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
                    "name": "Blog & Guides",
                    "item": "https://cvgrid.in/blog",
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
