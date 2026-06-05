import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import ToastContainer from "../components/Toast";

export const viewport = {
    themeColor: "#000000",
};

export const metadata = {
    title: "ResumeCraft AI – Free AI Resume Builder for Students & Professionals",
    description: "Create ATS-friendly resumes instantly with ResumeCraft AI. Our free AI resume builder helps students and professionals craft polished, professional resumes in minutes.",
    keywords: [
        "AI Resume Builder", "Free AI Resume Maker", "Resume Generator", "ResumeCraft AI", 
        "Free Resume Builder", "Student Resume Builder", "Professional Resume Maker", 
        "ATS Friendly Resume", "Online Resume Builder", "AI CV Maker"
    ],
    authors: [{ name: "Kushang Acharya", url: "https://kushangacharya.vercel.app" }],
    metadataBase: new URL("https://resumecraft-ai.vercel.app"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "ResumeCraft AI – Free AI Resume Builder for Students & Professionals",
        description: "Create ATS-friendly resumes instantly with ResumeCraft AI. Our free AI resume builder helps students and professionals craft polished, professional resumes in minutes.",
        url: "https://resumecraft-ai.vercel.app",
        siteName: "ResumeCraft AI",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png",
                width: 800,
                height: 600,
                alt: "ResumeCraft AI Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "ResumeCraft AI – Free AI Resume Builder",
        description: "Create ATS-friendly resumes instantly with ResumeCraft AI. Our free AI resume builder helps students and professionals craft polished, professional resumes in minutes.",
        images: ["https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png",
        apple: "/logo192.png",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "ResumeCraft AI",
        "alternateName": "ResumeCraft",
        "url": "https://resumecraft-ai.vercel.app",
        "logo": "https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png",
        "description": "ResumeCraft AI is a free AI-powered resume builder that helps students and professionals create ATS-friendly resumes instantly.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 support",
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Person",
            "name": "Kushang Acharya",
            "url": "https://kushangacharya.vercel.app"
        }
    };

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
                {/* Structured JSON-LD Schema */}
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <ToastContainer />
                {children}
            </body>
        </html>
    );
}
