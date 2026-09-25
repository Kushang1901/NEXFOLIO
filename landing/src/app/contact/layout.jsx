export const metadata = {
    title: "Contact CVGrid – Customer Support & Partnerships",
    description: "Get in touch with the CVGrid team. We are here to help with resume questions, technical support, feature suggestions, or business inquiries.",
    alternates: {
        canonical: "https://cvgrid.in/contact",
    },
    openGraph: {
        title: "Contact CVGrid – Customer Support & Inquiries",
        description: "Reach out to the CVGrid team for assistance with our free AI resume builder and career tools.",
        url: "https://cvgrid.in/contact",
        type: "website",
    },
};

export default function ContactLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://cvgrid.in/contact/#webpage",
        "url": "https://cvgrid.in/contact",
        "name": "Contact CVGrid",
        "description": "Contact CVGrid support and team.",
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
                    "name": "Contact",
                    "item": "https://cvgrid.in/contact",
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
