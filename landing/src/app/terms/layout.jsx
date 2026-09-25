export const metadata = {
    title: "Terms of Service | CVGrid",
    description: "Review the terms and conditions governing the use of CVGrid's AI resume builder, career tools, and export services.",
    alternates: {
        canonical: "https://cvgrid.in/terms",
    },
    openGraph: {
        title: "Terms of Service – CVGrid",
        description: "Terms and conditions for using CVGrid's free and premium resume services.",
        url: "https://cvgrid.in/terms",
        type: "website",
    },
};

export default function TermsLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/terms/#webpage",
        "url": "https://cvgrid.in/terms",
        "name": "Terms of Service | CVGrid",
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
                    "name": "Terms of Service",
                    "item": "https://cvgrid.in/terms",
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
