export const metadata = {
    title: "Terms of Service – CVGrid",
    description: "Read the terms and conditions for using CVGrid's resume builder.",
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
        description: "Read the terms and conditions for using CVGrid's resume builder.",
        url: "https://app.cvgrid.in/terms",
        type: "website",
    },
};

export default function TermsLayout({ children }) {
    return <>{children}</>;
}

