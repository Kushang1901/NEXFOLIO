export const metadata = {
    title: "Privacy Policy | CVGrid – Data Protection & Security",
    description: "Read how CVGrid protects your privacy, personal information, and uploaded resume data with enterprise encryption and zero data selling.",
    alternates: {
        canonical: "https://cvgrid.in/privacy",
    },
    openGraph: {
        title: "Privacy Policy – CVGrid",
        description: "CVGrid data security and privacy commitment to job seekers.",
        url: "https://cvgrid.in/privacy",
        type: "website",
    },
};

export default function PrivacyLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://cvgrid.in/privacy/#webpage",
        "url": "https://cvgrid.in/privacy",
        "name": "Privacy Policy | CVGrid",
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
                    "name": "Privacy Policy",
                    "item": "https://cvgrid.in/privacy",
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
