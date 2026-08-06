export const metadata = {
    title: "Privacy Policy – CVGrid",
    description: "Read CVGrid's privacy policy and learn how we protect your personal data.",
    keywords: [
        "CVGrid privacy policy", "data privacy resume builder", "resume safety CVGrid",
    ],
    alternates: {
        canonical: "/privacy",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Privacy Policy – CVGrid AI Resume Builder",
        description: "Read CVGrid's privacy policy and learn how we protect your personal data.",
        url: "https://app.cvgrid.in/privacy",
        type: "website",
    },
};

export default function PrivacyLayout({ children }) {
    return <>{children}</>;
}

