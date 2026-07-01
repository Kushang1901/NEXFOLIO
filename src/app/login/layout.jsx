export const metadata = {
    title: "Log In to Nexfolio – Free AI Resume Builder",
    description: "Log in to your Nexfolio account to access your saved resumes, edit your AI-generated resume, and download your professional PDF. Free AI resume builder.",
    alternates: {
        canonical: "/login",
    },
    robots: {
        index: true,
        follow: false,
    },
    openGraph: {
        title: "Log In – Nexfolio Free AI Resume Builder",
        description: "Access your Nexfolio account to manage and download your professional AI-generated resumes.",
        url: "https://nexfolio-ai.vercel.app/login",
        type: "website",
    },
};

export default function LoginLayout({ children }) {
    return <>{children}</>;
}
