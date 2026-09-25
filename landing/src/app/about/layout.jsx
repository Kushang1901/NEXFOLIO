export const metadata = {
    title: "About CVGrid – Empowering Careers with Free AI Tools",
    description: "Learn about CVGrid's mission to make AI resume building, ATS scoring, and career tools accessible and free for job seekers, students, and professionals worldwide.",
    alternates: {
        canonical: "https://cvgrid.in/about",
    },
    openGraph: {
        title: "About CVGrid – AI Resume Builder & Career Suite",
        description: "Democratizing career advancement with intelligent ATS resume tools and modern design.",
        url: "https://cvgrid.in/about",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About CVGrid – AI Resume Builder",
        description: "Democratizing career advancement with intelligent ATS resume tools and modern design.",
    },
};

export default function AboutLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://cvgrid.in/about/#webpage",
        "url": "https://cvgrid.in/about",
        "name": "About CVGrid",
        "description": "Learn about CVGrid's mission to make AI resume building, ATS scoring, and career tools accessible and free for job seekers worldwide.",
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
                    "name": "About Us",
                    "item": "https://cvgrid.in/about",
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
