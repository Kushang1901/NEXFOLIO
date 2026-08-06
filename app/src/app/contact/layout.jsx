export const metadata = {
    title: "Contact Us & Customer Support | CVGrid",
    description: "Get in touch with the CVGrid support team for assistance.",
    keywords: [
        "contact CVGrid", "CVGrid support email", "resume builder customer service",
        "CVGrid customer support", "help with resume builder",
    ],
    alternates: {
        canonical: "/contact",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Contact CVGrid – Customer Support & Inquiries",
        description: "Get in touch with the CVGrid support team for assistance.",
        url: "https://app.cvgrid.in/contact",
        type: "website",
    },
};

export default function ContactLayout({ children }) {
    return <>{children}</>;
}

