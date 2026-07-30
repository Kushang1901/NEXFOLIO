export const metadata = {
    title: "Terms of Service – CVGrid",
    description: "Read the terms and conditions for using CVGrid's AI resume builder and professional career services.",
    keywords: [
        "CVGrid terms of service", "terms and conditions resume builder", "CVGrid usage terms",
    ],
    alternates: {
        canonical: "/terms",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Terms of Service – CVGrid AI Resume Builder",
        description: "Review the terms and conditions for building and downloading resumes on CVGrid.",
        url: "https://app.cvgrid.in/terms",
        type: "website",
    },
};

export default function TermsLayout({ children }) {
    return <>{children}</>;
}

