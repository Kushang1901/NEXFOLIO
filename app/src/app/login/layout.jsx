export const metadata = {
    title: "Sign In to CVGrid – Access Your Saved Resumes",
    description: "Log in to your CVGrid account to access your saved resumes, edit your AI-generated resume, and download your professional PDF. Free AI resume builder.",
    alternates: {
        canonical: "https://app.cvgrid.in/login",
    },
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: "Sign In – CVGrid AI Resume Builder",
        description: "Access your CVGrid account to manage and download your professional AI-generated resumes.",
        url: "https://app.cvgrid.in/login",
        type: "website",
    },
};

export default function LoginLayout({ children }) {
    return <>{children}</>;
}
