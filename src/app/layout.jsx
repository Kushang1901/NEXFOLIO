import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import ToastContainer from "../components/Toast";

export const viewport = {
    themeColor: "#000000",
};

export const metadata = {
    title: "Free Resume Maker & AI Resume Builder – Nexfolio",
    description: "Create professional ATS-friendly resumes instantly with Nexfolio. Our free AI resume maker helps students and professionals craft polished resumes in minutes.",
    keywords: [
        "Free Resume Maker", "AI Resume Maker", "Free AI Resume Builder", "Resume Generator", 
        "Nexfolio", "Best Free Resume Builder", "ATS Friendly Resume", "Online Resume Builder", 
        "Free AI Resume Generator", "AI CV Maker Free", "Student Resume Creator"
    ],
    authors: [{ name: "Kushang Acharya", url: "https://kushangacharya.vercel.app" }],
    metadataBase: new URL("https://nexfolio.vercel.app"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Free Resume Maker & AI Resume Builder – Nexfolio",
        description: "Create professional ATS-friendly resumes instantly with Nexfolio. Our free AI resume maker helps students and professionals craft polished resumes in minutes.",
        url: "https://nexfolio.vercel.app",
        siteName: "Nexfolio",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png",
                width: 800,
                height: 600,
                alt: "Nexfolio Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Resume Maker & AI Resume Builder – Nexfolio",
        description: "Create professional ATS-friendly resumes instantly with Nexfolio. Our free AI resume maker helps students and professionals craft polished resumes in minutes.",
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
        "name": "Nexfolio",
        "alternateName": ["Nexfolio", "Free AI Resume Builder", "AI Resume Maker", "Free Resume Maker"],
        "url": "https://nexfolio.vercel.app",
        "logo": "https://res.cloudinary.com/dn45xyazy/image/upload/v1766464118/favicon_ahissk.png",
        "description": "Nexfolio is a free AI-powered resume maker that helps students and professionals create ATS-friendly resumes instantly.",
        "applicationCategory": "BusinessApplication, EducationalApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires HTML5 support",
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        },
        "featureList": [
            "AI Resume Content Generation",
            "ATS-Friendly Format Optimization",
            "Free PDF Resume Download",
            "High-Resolution PNG Resume Export",
            "Premium Resume Templates",
            "No Hidden Fees Resume Maker"
        ],
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
