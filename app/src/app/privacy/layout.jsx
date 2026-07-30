export const metadata = {
    title: "Privacy Policy – CVGrid",
    description: "Read the CVGrid privacy policy. Learn how we handle your personal data, secure your resumes, and protect your privacy.",
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
        description: "Learn how CVGrid protects your privacy and handles personal resume data securely.",
        url: "https://app.cvgrid.in/privacy",
        type: "website",
    },
};

export default function PrivacyLayout({ children }) {
    return <>{children}</>;
}

