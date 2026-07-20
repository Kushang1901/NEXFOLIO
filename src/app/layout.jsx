import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import ToastContainer from "../components/Toast";
import PageLoader from "../components/PageLoader";
import CookieConsent from "../components/CookieConsent";
import BackToTop from "../components/BackToTop";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-space-grotesk",
});

// ─────────────────────────────────────────────
// SITE CONSTANTS
// ─────────────────────────────────────────────
const BASE_URL = "https://cvgrid.in";
const SITE_NAME = "CVGrid";
const SITE_TITLE = "Best Free AI Resume Builder & CV Maker Online – CVGrid";
const SITE_DESC =
    "Build your career with CVGrid, the best free AI resume builder and professional CV maker online. Create an ATS-friendly resume in minutes. Choose from 18+ templates, generate AI content, and download instantly.";
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const LOGO = `${BASE_URL}/logo.png`;

// ─────────────────────────────────────────────
// VIEWPORT (separate export per Next.js 14+)
// ─────────────────────────────────────────────
export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#060610" },
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    colorScheme: "dark",
};

// ─────────────────────────────────────────────
// NEXT.JS METADATA EXPORT — Maximum Coverage
// ─────────────────────────────────────────────
export const metadata = {
    // ── Core ──────────────────────────────────
    metadataBase: new URL(BASE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME} – Free AI Resume Builder`,
    },
    description: SITE_DESC,

    // ── Keywords (broad + long-tail + LSI) ────
    keywords: [
        // Primary
        "free resume maker", "AI resume builder", "free AI resume builder",
        "online resume maker", "resume generator free", "AI CV maker",
        "resume creator online", "create resume online free",
        // ATS
        "ATS friendly resume", "ATS resume builder", "ATS optimized resume",
        "applicant tracking system resume", "beat ATS resume",
        "ATS resume checker", "ATS score resume",
        // Features
        "resume builder PDF download", "resume templates free download",
        "professional resume templates", "AI resume writer",
        "AI cover letter generator", "resume parser",
        "resume with AI", "AI resume builder", "automated resume builder",
        // Audience
        "resume builder for students", "fresher resume maker",
        "resume builder for freshers", "college student resume builder",
        "entry level resume maker", "free resume builder no sign up",
        "resume builder for freshers India", "resume for first job",
        // Long-tail
        "make resume online free no watermark",
        "best free AI resume maker 2025", "best free AI resume maker 2026",
        "free professional resume builder with AI",
        "resume maker with PDF export free",
        "how to make a resume with AI for free",
        "AI resume builder no credit card",
        "free resume builder download PDF",
        "resume builder with AI content generation",
        // Brand
        "CVGrid", "CVGrid resume builder", "CVGrid AI",
        "cvgrid.in", "cvgrid free resume",
        // Templates
        "modern resume template", "professional resume template free",
        "creative resume template", "minimalist resume template",
        "executive resume template", "developer resume template",
    ],

    // ── Authors & Publisher ────────────────────
    authors: [{ name: "Kushang Acharya", url: "https://kushangacharya.vercel.app" }],
    creator: "Kushang Acharya",
    publisher: SITE_NAME,
    generator: "Next.js",

    // ── Classification ────────────────────────
    category: "Technology",
    classification: "Resume Builder, AI Tools, Career Tools, Job Search",
    applicationName: SITE_NAME,

    // ── Canonical & Alternates ────────────────
    alternates: {
        canonical: "/",
        languages: {
            "en-US": "/",
            "en-IN": "/",
            "en-GB": "/",
        },
    },

    // ── Open Graph (maximum fields) ───────────
    openGraph: {
        title: SITE_TITLE,
        description:
            "Create a professional, ATS-friendly resume in minutes. AI-powered content, 18+ templates, and instant download. Free and premium watermark-free options available.",
        url: BASE_URL,
        siteName: SITE_NAME,
        locale: "en_US",
        alternateLocale: ["en_IN", "en_GB"],
        type: "website",
        countryName: "India",
        emails: [],
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} – Free AI Resume Builder | Build ATS-Friendly Resumes`,
                type: "image/png",
                secureUrl: OG_IMAGE,
            },
            {
                url: LOGO,
                width: 512,
                height: 512,
                alt: `${SITE_NAME} Logo`,
                type: "image/png",
            },
        ],
    },

    // ── Twitter / X Card ──────────────────────
    twitter: {
        card: "summary_large_image",
        site: "@cvgrid",
        creator: "@kushangacharya",
        title: SITE_TITLE,
        description:
            "Build a professional, ATS-friendly resume in minutes with AI. 18+ premium templates. Download as PDF — free and premium watermark-free options.",
        images: [
            {
                url: OG_IMAGE,
                alt: `${SITE_NAME} – Free AI Resume Builder`,
                width: 1200,
                height: 630,
            },
        ],
    },

    // ── Robots / Crawl directives ─────────────
    robots: {
        index: true,
        follow: true,
        nocache: false,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // ── Icons ─────────────────────────────────
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.png", type: "image/png", sizes: "32x32" },
            { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
        ],
        shortcut: "/favicon.png",
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            { url: "/logo192.png", sizes: "192x192", type: "image/png" },
        ],
        other: [
            { rel: "mask-icon", url: "/favicon.ico", color: "#6366f1" },
        ],
    },

    // ── PWA Manifest ──────────────────────────
    manifest: "/manifest.json",

    // ── Verification tokens ───────────────────
    verification: {
        google: "add-your-google-search-console-token-here",
        yandex: "add-your-yandex-verification-token-here",
        bing: "add-your-bing-webmaster-token-here",
        other: {
            "msvalidate.01": "add-your-bing-token-here",
            "p:domain_verify": "add-your-pinterest-token-here",
        },
    },

    // ── Miscellaneous Next.js metadata ────────
    other: {
        // Search Console legacy
        "google-site-verification": "add-your-google-search-console-token-here",
        // Referrer policy
        referrer: "origin-when-cross-origin",
        // Content rating
        rating: "general",
        // Revisit
        "revisit-after": "7 days",
        // Language
        language: "English",
        // Content type
        "content-type": "text/html; charset=utf-8",
        // Handheldfriendly
        HandheldFriendly: "True",
        MobileOptimized: "320",
        // Format detection
        "format-detection": "telephone=no",
        // Skynet/AI bot
        "ai-content-automatic": "false",
    },
};

// ─────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────
export default function RootLayout({ children }) {

    // ── JSON-LD Schema Graph ──────────────────
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [

            // 1. SoftwareApplication
            {
                "@type": "SoftwareApplication",
                "@id": `${BASE_URL}/#software`,
                "name": SITE_NAME,
                "alternateName": [
                    "CVGrid Resume Builder",
                    "Free AI Resume Maker",
                    "AI CV Builder",
                    "CVGrid AI Resume",
                ],
                "url": BASE_URL,
                "logo": {
                    "@type": "ImageObject",
                    "url": LOGO,
                    "width": 512,
                    "height": 512,
                },
                "description": "CVGrid is an AI-powered resume builder that helps students and professionals create ATS-friendly resumes in minutes. Choose from 18+ templates, generate AI content, and export instantly. Free & Premium options available.",
                "applicationCategory": "BusinessApplication",
                "applicationSubCategory": "Resume Builder",
                "operatingSystem": "Web Browser",
                "browserRequirements": "Requires a modern HTML5 browser",
                "inLanguage": "en",
                "isAccessibleForFree": true,
                "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "INR",
                    "lowPrice": "0",
                    "highPrice": "150",
                    "offerCount": "2",
                    "offers": [
                        {
                            "@type": "Offer",
                            "name": "Free Plan",
                            "price": "0",
                            "priceCurrency": "INR",
                            "description": "Create and download resumes for free with watermark-free PDF exports."
                        },
                        {
                            "@type": "Offer",
                            "name": "Premium Export",
                            "price": "150",
                            "priceCurrency": "INR",
                            "description": "Unlock premium layouts and download clean PDF, editable Word (.docx), and high-res PNG formats."
                        }
                    ]
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "1200",
                    "reviewCount": "980",
                    "bestRating": "5",
                    "worstRating": "1",
                },
                "review": [
                    {
                        "@type": "Review",
                        "author": {
                            "@type": "Person",
                            "name": "Sarah Miller"
                        },
                        "datePublished": "2024-05-15",
                        "reviewBody": "This AI resume builder helped me create an ATS-friendly resume in less than 5 minutes. The AI content writer is exceptionally smart!",
                        "reviewRating": {
                            "@type": "Rating",
                            "ratingValue": "5",
                            "bestRating": "5",
                            "worstRating": "1"
                        }
                    }
                ],
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
                    "Real-time resume preview",
                    "ATS score checker",
                ],
                "screenshot": OG_IMAGE,
                "author": {
                    "@type": "Person",
                    "@id": `${BASE_URL}/#author`,
                    "name": "Kushang Acharya",
                    "url": "https://kushangacharya.vercel.app",
                },
                "publisher": {
                    "@id": `${BASE_URL}/#organization`,
                },
                "datePublished": "2024-01-01",
                "dateModified": new Date().toISOString().split("T")[0],
            },

            // 2. Organization
            {
                "@type": "Organization",
                "@id": `${BASE_URL}/#organization`,
                "name": SITE_NAME,
                "url": BASE_URL,
                "logo": LOGO,
                "image": LOGO,
                "description": "CVGrid provides a free AI-powered resume builder with 18+ professional templates for students and job seekers.",
                "sameAs": [
                    BASE_URL,
                    "https://github.com/Kushang1901",
                ],
                "founder": {
                    "@id": `${BASE_URL}/#author`,
                },
                "foundingDate": "2024",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-97242-36385",
                    "contactType": "customer support",
                    "availableLanguage": ["English"],
                },
            },

            // 3. Person (Author)
            {
                "@type": "Person",
                "@id": `${BASE_URL}/#author`,
                "name": "Kushang Acharya",
                "url": "https://kushangacharya.vercel.app",
                "jobTitle": "Full Stack Developer",
                "worksFor": {
                    "@id": `${BASE_URL}/#organization`,
                },
            },

            // 4. WebSite
            {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                "url": BASE_URL,
                "name": "CVGrid",
                "alternateName": ["CVGrid AI", "CV Grid", "cvgrid.in"],
                "description": "Build professional ATS-friendly resumes with AI. Free PDF export. 18+ templates.",
                "publisher": {
                    "@id": `${BASE_URL}/#organization`,
                },
                "inLanguage": "en-US",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${BASE_URL}/templates?q={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                },
            },

            // 5. WebPage
            {
                "@type": "WebPage",
                "@id": `${BASE_URL}/#webpage`,
                "url": BASE_URL,
                "name": SITE_TITLE,
                "description": SITE_DESC,
                "isPartOf": { "@id": `${BASE_URL}/#website` },
                "about": { "@id": `${BASE_URL}/#software` },
                "breadcrumb": { "@id": `${BASE_URL}/#breadcrumb` },
                "inLanguage": "en-US",
                "datePublished": "2024-01-01",
                "dateModified": new Date().toISOString().split("T")[0],
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": OG_IMAGE,
                    "width": 1200,
                    "height": 630,
                },
            },

            // 6. BreadcrumbList
            {
                "@type": "BreadcrumbList",
                "@id": `${BASE_URL}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": BASE_URL,
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Resume Templates",
                        "item": `${BASE_URL}/templates`,
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Resume Builder",
                        "item": `${BASE_URL}/builder`,
                    },
                ],
            },

            // 7. HowTo — "How to build a free resume with AI"
            {
                "@type": "HowTo",
                "@id": `${BASE_URL}/#howto`,
                "name": "How to Build a Free Professional Resume with AI",
                "description": "Step-by-step guide to creating an ATS-friendly resume using CVGrid's free AI resume builder in under 5 minutes.",
                "totalTime": "PT5M",
                "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "USD",
                    "value": "0",
                },
                "tool": [
                    { "@type": "HowToTool", "name": "CVGrid AI Resume Builder" },
                    { "@type": "HowToTool", "name": "Web Browser" },
                ],
                "step": [
                    {
                        "@type": "HowToStep",
                        "position": 1,
                        "name": "Sign Up for Free",
                        "text": "Create a free CVGrid account — no credit card required. Just your email and a password.",
                        "url": `${BASE_URL}/signup`,
                    },
                    {
                        "@type": "HowToStep",
                        "position": 2,
                        "name": "Choose a Template",
                        "text": "Browse 18+ ATS-friendly professional resume templates and choose one that fits your industry.",
                        "url": `${BASE_URL}/templates`,
                    },
                    {
                        "@type": "HowToStep",
                        "position": 3,
                        "name": "Fill In Your Details",
                        "text": "Enter your personal details, work experience, education, and skills into the intuitive resume builder.",
                        "url": `${BASE_URL}/builder`,
                    },
                    {
                        "@type": "HowToStep",
                        "position": 4,
                        "name": "Generate AI Content",
                        "text": "Click the AI Generate button to let our AI writer write professional resume descriptions tailored to your target job role.",
                        "url": `${BASE_URL}/builder`,
                    },
                    {
                        "@type": "HowToStep",
                        "position": 5,
                        "name": "Download as PDF",
                        "text": "Preview your completed resume and download it as a high-quality PDF — free, with no watermark.",
                        "url": `${BASE_URL}/preview`,
                    },
                ],
            },

            // 8. ItemList — Resume Templates
            {
                "@type": "ItemList",
                "@id": `${BASE_URL}/#templates`,
                "name": "Free Professional Resume Templates",
                "description": "Browse 18+ ATS-friendly resume templates available on CVGrid, free to use.",
                "numberOfItems": 18,
                "url": `${BASE_URL}/templates`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Classic Resume Template", "url": `${BASE_URL}/templates#classic` },
                    { "@type": "ListItem", "position": 2, "name": "Modern Resume Template", "url": `${BASE_URL}/templates#modern` },
                    { "@type": "ListItem", "position": 3, "name": "Creative Resume Template", "url": `${BASE_URL}/templates#creative` },
                    { "@type": "ListItem", "position": 4, "name": "Executive Resume Template", "url": `${BASE_URL}/templates#executive` },
                    { "@type": "ListItem", "position": 5, "name": "Developer Resume Template", "url": `${BASE_URL}/templates#developer` },
                    { "@type": "ListItem", "position": 6, "name": "Minimalist Resume Template", "url": `${BASE_URL}/templates#minimalist` },
                    { "@type": "ListItem", "position": 7, "name": "Elegant Resume Template", "url": `${BASE_URL}/templates#elegant` },
                    { "@type": "ListItem", "position": 8, "name": "Navy Elegance Resume Template", "url": `${BASE_URL}/templates#navy-elegance` },
                ],
            },

            // 9. FAQPage
            {
                "@type": "FAQPage",
                "@id": `${BASE_URL}/#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Is CVGrid really free to use?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! CVGrid offers a generous free tier. You can create your resume and download it completely free and watermark-free using any of our free templates. Premium templates are available for a one-time upgrade charge of ₹150.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Are the resume templates ATS-friendly?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "All resume templates on CVGrid are designed to be ATS (Applicant Tracking System) friendly. They use clean formatting, standard section headings, and readable fonts that pass recruiter screening software.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How does the AI resume builder work?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "CVGrid uses advanced AI models to generate professional resume content based on your job role, experience, and skills. Simply enter your details, click generate, review the content, and download your finished resume.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Can I download my resume as a PDF?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! Once you've built your resume, you can download it as a high-quality PDF, Word doc, or PNG. Free templates are completely watermark-free and free to download; premium templates are unlocked with a single one-time payment.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Does CVGrid work for freshers and students?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Absolutely. CVGrid is specifically designed for students, freshers, and entry-level job seekers. The AI helps you write professional resume content even if you have limited work experience.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How many resume templates are available?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "CVGrid offers 18+ professionally designed resume templates including Classic, Modern, Creative, Executive, Developer, Minimalist, Elegant, Navy Elegance, Emerald, Aurora, Midnight, Nordic, Crimson, and more.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is there an ATS checker in CVGrid?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! CVGrid includes a built-in AI-powered ATS checker that analyzes your resume against a job description and gives you an ATS compatibility score with detailed suggestions to improve your chances.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Can CVGrid generate a cover letter too?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! CVGrid has a free AI cover letter generator. Just enter your job title, company, and key highlights — and the AI will write a compelling, personalized cover letter in seconds.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
            <head>
                {/* ── Performance: Preconnect ─────────────────── */}
                <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />

                {/* ── FontAwesome ─────────────────────────────── */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
                    crossOrigin="anonymous"
                    media="print"
                    onLoad="this.media='all'"
                />

                {/* ════════════════════════════════════════════════
                    MANUAL META TAGS
                    (covering everything Next.js metadata doesn't emit)
                ════════════════════════════════════════════════ */}

                {/* ── Dublin Core Metadata ────────────────────── */}
                <meta name="DC.title" content={SITE_TITLE} />
                <meta name="DC.description" content={SITE_DESC} />
                <meta name="DC.creator" content="Kushang Acharya" />
                <meta name="DC.publisher" content={SITE_NAME} />
                <meta name="DC.language" content="en" />
                <meta name="DC.type" content="InteractiveResource" />
                <meta name="DC.format" content="text/html" />
                <meta name="DC.identifier" content={BASE_URL} />
                <meta name="DC.rights" content={`Copyright 2026 ${SITE_NAME}`} />
                <meta name="DC.subject" content="Resume Builder, AI Resume, ATS Friendly Resume, Free CV Maker" />
                <meta name="DC.date" content="2024-01-01" />
                <meta name="DC.coverage" content="Worldwide" />
                <meta name="DC.relation" content={`${BASE_URL}/templates`} />

                {/* ── Geographic / Geo Tags ───────────────────── */}
                <meta name="geo.region" content="IN" />
                <meta name="geo.placename" content="India" />
                <meta name="geo.position" content="20.5937;78.9629" />
                <meta name="ICBM" content="20.5937, 78.9629" />

                {/* ── Apple / PWA / Mobile ────────────────────── */}
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
                <meta name="mobile-web-app-capable" content="yes" />

                {/* ── Content & Behaviour ─────────────────────── */}
                <meta name="rating" content="general" />
                <meta name="revisit-after" content="7 days" />
                <meta name="language" content="English" />
                <meta name="content-language" content="en" />
                <meta name="audience" content="all" />
                <meta name="target" content="all" />
                <meta name="coverage" content="Worldwide" />
                <meta name="distribution" content="Global" />
                <meta name="HandheldFriendly" content="True" />
                <meta name="MobileOptimized" content="320" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="referrer" content="origin-when-cross-origin" />

                {/* ── Site Category / Abstract ────────────────── */}
                <meta name="abstract" content="AI resume builder with 18+ ATS-friendly templates. Build, customize, and download your professional resume. Free & Premium options available." />
                <meta name="topic" content="Resume Builder, AI Resume, Career Tools, Job Search" />
                <meta name="summary" content="CVGrid is an AI-powered resume builder for students and job seekers with free and premium options." />
                <meta name="Classification" content="Resume Builder" />
                <meta name="category" content="Technology, AI Tools, Career" />
                <meta name="pagename" content={SITE_TITLE} />
                <meta name="owner" content="Kushang Acharya" />
                <meta name="url" content={BASE_URL} />
                <meta name="identifier-URL" content={BASE_URL} />
                <meta name="directory" content="submission" />

                {/* ── Bing / Microsoft ────────────────────────── */}
                <meta name="msapplication-TileColor" content="#6366f1" />
                <meta name="msapplication-TileImage" content="/logo192.png" />
                <meta name="msapplication-navbutton-color" content="#6366f1" />
                <meta name="msapplication-starturl" content="/" />
                <meta name="msapplication-task" content="name=Build Resume;action-uri=/builder;icon-uri=/favicon.png" />

                {/* ── Pinterest ───────────────────────────────── */}
                <meta name="pinterest-rich-pin" content="true" />
                <meta property="article:author" content="Kushang Acharya" />

                {/* ── Additional Open Graph ───────────────────── */}
                <meta property="og:updated_time" content={new Date().toISOString()} />
                <meta property="og:price:amount" content="0" />
                <meta property="og:price:currency" content="USD" />
                <meta property="og:availability" content="instock" />

                {/* ── Structured Data: JSON-LD ────────────────── */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                {/* ── reCAPTCHA Enterprise ────────────────────── */}
                <Script
                    src="https://www.google.com/recaptcha/enterprise.js?render=6LfIrjQsAAAAANY4PBe_oGp6mIFkTwyeAB_DdG81"
                    strategy="afterInteractive"
                />

                {/* ── Google Analytics (gtag.js) ──────────────── */}
                <Script id="ga-consent" strategy="afterInteractive" dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        
                        var savedConsent = null;
                        try {
                            savedConsent = localStorage.getItem("cookie-consent-status");
                        } catch(e) {}
                        if (!savedConsent) {
                            var match = document.cookie.match(new RegExp('(^| )cookie-consent-status=([^;]+)'));
                            if (match) savedConsent = match[2];
                        }
                        
                        gtag('consent', 'default', {
                            'analytics_storage': savedConsent === 'accepted' ? 'granted' : 'denied'
                        });
                    `
                }} />
                <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-J3TJ0ZE0GM" />
                <Script id="ga-config" strategy="afterInteractive" dangerouslySetInnerHTML={{
                    __html: `
                        gtag('js', new Date());
                        gtag('config', 'G-J3TJ0ZE0GM', { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
                    `
                }} />
            </head>
            <body>
                <PageLoader />
                <ToastContainer />
                {children}
                <CookieConsent />
                <BackToTop />
            </body>
        </html>
    );
}
