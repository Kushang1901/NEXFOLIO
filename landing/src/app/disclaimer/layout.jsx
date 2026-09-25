export const metadata = {
    title: "Disclaimer | CVGrid – Free AI Resume Builder",
    description: "Read the CVGrid disclaimer regarding our AI-generated resume content, career tools, third-party links, and information accuracy.",
    alternates: {
        canonical: "https://cvgrid.in/disclaimer",
    },
    openGraph: {
        title: "Disclaimer – CVGrid",
        description: "CVGrid legal disclaimer regarding career guidance and AI-assisted content creation.",
        url: "https://cvgrid.in/disclaimer",
        type: "website",
    },
};

export default function DisclaimerLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/disclaimer/#webpage",
        "url": "https://cvgrid.in/disclaimer",
        "name": "Disclaimer | CVGrid",
        "description": "CVGrid disclaimer regarding AI tools and content generation.",
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
                    "name": "Disclaimer",
                    "item": "https://cvgrid.in/disclaimer",
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
