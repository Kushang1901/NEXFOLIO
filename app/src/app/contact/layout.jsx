export const metadata = {
    title: "Contact Us & Customer Support | CVGrid",
    description: "Get in touch with the CVGrid support team. Contact us for inquiries, feedback, or technical assistance with our AI resume builder.",
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
        description: "Have questions or need help? Contact CVGrid customer support. We are here to help you build your professional career.",
        url: "https://app.cvgrid.in/contact",
        type: "website",
    },
};

export default function ContactLayout({ children }) {
    return <>{children}</>;
}

