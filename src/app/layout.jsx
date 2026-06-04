import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const viewport = {
    themeColor: "#000000",
};

export const metadata = {
    title: "ResumeCraft AI – Free AI Resume Builder for Students & Professionals",
    description: "ResumeCraft AI is a free AI-powered resume builder that helps students and professionals create ATS-friendly resumes instantly.",
    keywords: "AI Resume Builder, Resume Generator, ResumeCraft AI, Free Resume Builder, Student Resume Builder, Professional Resume Maker",
    authors: [{ name: "Kushang Acharya" }],
    icons: {
        icon: "https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png",
        apple: "/logo192.png",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* FontAwesome */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
                {/* reCAPTCHA Enterprise */}
                <script src="https://www.google.com/recaptcha/enterprise.js?render=6LfIrjQsAAAAANY4PBe_oGp6mIFkTwyeAB_DdG81" async defer></script>
                {/* Google tag (gtag.js) */}
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-J3TJ0ZE0GM"></script>
                <script dangerouslySetInnerHTML={{ __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-J3TJ0ZE0GM');
                `}} />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
