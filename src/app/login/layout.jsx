export const metadata = {
    title: "Log In to CVGrid – Free AI Resume Builder",
    description: "Log in to your CVGrid account to access your saved resumes, edit your AI-generated resume, and download your professional PDF. Free AI resume builder.",
    alternates: {
        canonical: "/login",
    },
    robots: {
        index: true,
        follow: false,
    },
    openGraph: {
        title: "Log In – CVGrid Free AI Resume Builder",
        description: "Access your CVGrid account to manage and download your professional AI-generated resumes.",
        url: "https://cvgrid.in/login",
        type: "website",
    },
};

export default function LoginLayout({ children }) {
    return <>{children}</>;
}
