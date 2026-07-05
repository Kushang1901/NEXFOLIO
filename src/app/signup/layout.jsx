export const metadata = {
    title: "Create Your Free AI Resume – Sign Up | CVGrid",
    description: "Sign up for free and start building your professional, ATS-friendly resume with AI. No credit card required. Join thousands of job seekers using CVGrid.",
    keywords: [
        "free resume builder sign up", "create AI resume free", "cvgrid register",
        "free resume account", "sign up resume maker",
    ],
    alternates: {
        canonical: "/signup",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Sign Up Free – CVGrid AI Resume Builder",
        description: "Create a free account and start building your professional resume with AI. No credit card required.",
        url: "https://nexfolio-ai.vercel.app/signup",
        type: "website",
    },
};

export default function SignupLayout({ children }) {
    return <>{children}</>;
}
