import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import ToastContainer from "../components/Toast";
import PageLoader from "../components/PageLoader";

export const viewport = {
    themeColor: "#000000",
    width: "device-width",
    initialScale: 1,
};

const BASE_URL = "https://nexfolio-ai.vercel.app";

export const metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Free Resume Maker & AI Resume Builder – Nexfolio",
        template: "%s | Nexfolio – Free AI Resume Builder",
    },
    description: "Create a professional, ATS-friendly resume in minutes with Nexfolio's free AI resume builder. Choose from 18+ premium templates, generate AI content, and download as PDF — 100% free.",
    keywords: [
        // Primary commercial intent
        "free resume maker", "AI resume builder", "free AI resume builder",
        "online resume maker", "resume generator free", "AI CV maker",
        // ATS specific
        "ATS friendly resume", "ATS resume builder", "ATS optimized resume",
        "applicant tracking system resume", "beat ATS resume",
        // Feature specific
        "resume builder PDF download", "resume templates free download",
        "professional resume templates", "AI resume writer",
        // Audience specific
        "resume builder for students", "fresher resume maker",
        "resume builder for freshers", "college student resume builder",
        "entry level resume maker", "free resume builder no sign up",
        // Brand
        "Nexfolio", "Nexfolio resume builder", "nexfolio AI",
        // Long-tail
        "make resume online free no watermark", "best free AI resume maker 2025",
        "free professional resume builder with AI", "resume maker with PDF export free",
    ],
    authors: [{ name: "Kushang Acharya", url: "https://kushangacharya.vercel.app" }],
    creator: "Kushang Acharya",
    publisher: "Nexfolio",
    category: "Technology",
    classification: "Resume Builder, AI Tools, Career Tools",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Free Resume Maker & AI Resume Builder – Nexfolio",
        description: "Create a professional, ATS-friendly resume in minutes. AI-powered content, 18+ premium templates, free PDF export — no watermark, no credit card.",
        url: BASE_URL,
        siteName: "Nexfolio",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: `${BASE_URL}/logo.png`,
                width: 1200,
                height: 630,
                alt: "Nexfolio – Free AI Resume Builder",
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@nexfolio",
        creator: "@kushangacharya",
        title: "Free Resume Maker & AI Resume Builder – Nexfolio",
        description: "Build a professional, ATS-friendly resume in minutes with free AI. 18+ premium templates. Download as PDF free — no watermark.",
        images: [`${BASE_URL}/logo.png`],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.png", type: "image/png" },
        ],
        shortcut: "/favicon.png",
        apple: [
            { url: "/logo192.png", sizes: "192x192", type: "image/png" },
        ],
        other: [
            { rel: "mask-icon", url: "/favicon.ico" },
        ],
    },
    manifest: "/manifest.json",
    other: {
        "google-site-verification": "add-your-google-search-console-verification-token-here",
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "@id": "https://nexfolio-ai.vercel.app/#software",
                "name": "Nexfolio",
                "alternateName": ["Nexfolio Resume Builder", "Free AI Resume Maker", "AI CV Builder"],
                "url": "https://nexfolio-ai.vercel.app",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://nexfolio-ai.vercel.app/logo.png",
                    "width": 512,
                    "height": 512,
                },
                "description": "Nexfolio is a free AI-powered resume builder that helps students and professionals create ATS-friendly resumes in minutes. Choose from 18+ premium templates, generate AI content, and download as PDF — completely free.",
                "applicationCategory": "BusinessApplication",
                "applicationSubCategory": "Resume Builder",
                "operatingSystem": "Web Browser",
                "browserRequirements": "Requires a modern HTML5 browser",
                "inLanguage": "en",
                "isAccessibleForFree": true,
                "offers": {
                    "@type": "Offer",
                    "price": "0.00",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "description": "Nexfolio is completely free to use. No credit card required.",
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "1200",
                    "bestRating": "5",
                    "worstRating": "1",
                },
                "featureList": [
                    "AI-powered resume content generation",
                    "ATS-friendly resume formatting",
                    "18+ professional resume templates",
                    "Free PDF resume download",
                    "Free PNG resume export",
                    "AI cover letter generator",
                    "Resume parsing from uploaded PDF",
                    "No watermark on exports",
                    "Secure cloud resume storage",
                ],
                "screenshot": "https://nexfolio-ai.vercel.app/logo.png",
                "author": {
                    "@type": "Person",
                    "@id": "https://nexfolio-ai.vercel.app/#author",
                    "name": "Kushang Acharya",
                    "url": "https://kushangacharya.vercel.app",
                },
                "publisher": {
                    "@id": "https://nexfolio-ai.vercel.app/#organization",
                },
            },
            {
                "@type": "Organization",
                "@id": "https://nexfolio-ai.vercel.app/#organization",
                "name": "Nexfolio",
                "url": "https://nexfolio-ai.vercel.app",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://nexfolio-ai.vercel.app/logo.png",
                    "width": 512,
                    "height": 512,
                },
                "description": "Nexfolio provides a free AI-powered resume builder with 18+ professional templates for students and job seekers.",
                "sameAs": [
                    "https://nexfolio-ai.vercel.app",
                ],
                "founder": {
                    "@id": "https://nexfolio-ai.vercel.app/#author",
                },
            },
            {
                "@type": "WebSite",
                "@id": "https://nexfolio-ai.vercel.app/#website",
                "url": "https://nexfolio-ai.vercel.app",
                "name": "Nexfolio – Free AI Resume Builder",
                "description": "Build professional ATS-friendly resumes with AI. Free PDF export. 18+ templates.",
                "publisher": {
                    "@id": "https://nexfolio-ai.vercel.app/#organization",
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://nexfolio-ai.vercel.app/templates?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                },
            },
            {
                "@type": "FAQPage",
                "@id": "https://nexfolio-ai.vercel.app/#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Is Nexfolio really free to use?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! Nexfolio is 100% free. You can create a resume, choose from 18+ premium templates, generate AI content, and download your resume as a PDF — all without paying anything or entering a credit card.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Are the resume templates ATS-friendly?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "All resume templates on Nexfolio are designed to be ATS (Applicant Tracking System) friendly. They use clean formatting, standard section headings, and readable fonts that pass recruiter screening software.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How does the AI resume builder work?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Nexfolio uses Google Gemini AI to generate professional resume content based on your job role, experience, and skills. Simply enter your details, click generate, review the content, and download your finished resume.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Can I download my resume as a PDF?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! Once you've built your resume, you can download it as a high-quality PDF or PNG image with a single click. No watermarks, no subscriptions — completely free.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Does Nexfolio work for freshers and students?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Absolutely. Nexfolio is specifically designed for students, freshers, and entry-level job seekers. The AI helps you write professional resume content even if you have limited work experience.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How many resume templates are available?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Nexfolio offers 18+ professionally designed resume templates including Classic, Modern, Creative, Executive, Developer, Minimalist, Elegant, Navy Elegance, Emerald, Aurora, Midnight, Nordic, Crimson, and more.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* FontAwesome */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
                {/* Google Fonts - Space Grotesk */}
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
                {/* Preconnect for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
                {/* Structured JSON-LD Schema — multi-graph */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <PageLoader />
                <ToastContainer />
                {children}
            </body>
        </html>
    );
}

