"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../authState";

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [tailwindLoaded, setTailwindLoaded] = useState(false);

    // Testimonials State
    const [testimonials, setTestimonials] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);

    // Typewriter effect state
    const phrases = ["Career", "ATS Resume", "Job Search", "Professional CV"];
    const [typewriterIndex, setTypewriterIndex] = useState(0);
    const [typewriterText, setTypewriterText] = useState("Career");
    const [isTypewriterDeleting, setIsTypewriterDeleting] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.tailwind) {
            setTailwindLoaded(true);
        }
    }, []);

    useEffect(() => {
        let timer;
        const currentPhrase = phrases[typewriterIndex];
        const speed = isTypewriterDeleting ? 40 : 80;

        if (isTypewriterDeleting) {
            timer = setTimeout(() => {
                setTypewriterText(prev => prev.slice(0, -1));
            }, speed);
        } else {
            timer = setTimeout(() => {
                setTypewriterText(currentPhrase.slice(0, typewriterText.length + 1));
            }, speed);
        }

        if (!isTypewriterDeleting && typewriterText === currentPhrase) {
            timer = setTimeout(() => setIsTypewriterDeleting(true), 2200);
        } else if (isTypewriterDeleting && typewriterText === "") {
            setIsTypewriterDeleting(false);
            setTypewriterIndex(prev => (prev + 1) % phrases.length);
        }

        return () => clearTimeout(timer);
    }, [typewriterText, isTypewriterDeleting, typewriterIndex]);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((loggedUser) => {
            setUser(loggedUser);
            setLoadingAuth(false);

            // Check if redirect triggered the auth modal
            if (!loggedUser && typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                if (params.get("triggerAuth") === "true") {
                    triggerAuthPopup();
                }
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, [router]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch("/api/testimonials");
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data);
                }
            } catch (err) {
                console.error("Error fetching testimonials:", err);
            } finally {
                setLoadingTestimonials(false);
            }
        };
        fetchTestimonials();
    }, []);

    const triggerAuthPopup = () => {
        setShowAuthModal(true);
        let timer = 3;
        setCountdown(3);
        const interval = setInterval(() => {
            timer -= 1;
            setCountdown(timer);
            if (timer <= 0) {
                clearInterval(interval);
                router.push("/signup");
            }
        }, 1000);
    };

    const handleStartResume = (e) => {
        e.preventDefault();
        if (loadingAuth) return;

        if (user) {
            router.push("/templates");
        } else {
            triggerAuthPopup();
        }
    };

    return (
        <>
            <Script
                src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
                strategy="afterInteractive"
                onLoad={() => setTailwindLoaded(true)}
            />
            <Script id="tailwind-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
                window.tailwind = window.tailwind || {};
                window.tailwind.config = {
                    darkMode: "class",
                    theme: {
                        extend: {
                            "colors": {
                                "surface-dim": "#12121d",
                                "on-secondary-container": "#a8afff",
                                "secondary-fixed": "#e0e0ff",
                                "secondary": "#bdc2ff",
                                "on-primary": "#1000a9",
                                "on-tertiary-container": "#400071",
                                "surface-container-highest": "#343440",
                                "error-container": "#93000a",
                                "surface": "#12121d",
                                "primary": "#c0c1ff",
                                "surface-tint": "#c0c1ff",
                                "inverse-surface": "#e4e0f1",
                                "tertiary-fixed": "#f0dbff",
                                "inverse-primary": "#494bd6",
                                "error": "#ffb4ab",
                                "on-tertiary": "#490080",
                                "surface-container-high": "#292935",
                                "background": "#12121d",
                                "on-background": "#e4e0f1",
                                "on-secondary": "#131e8c",
                                "on-surface-variant": "#c7c4d7",
                                "outline-variant": "#464554",
                                "on-primary-container": "#0d0096",
                                "secondary-container": "#2f3aa3",
                                "surface-card": "#11111E",
                                "on-secondary-fixed": "#000767",
                                "on-error": "#690005",
                                "surface-container-low": "#1b1a26",
                                "on-primary-fixed-variant": "#2f2ebe",
                                "outline": "#908fa0",
                                "on-tertiary-fixed-variant": "#6900b3",
                                "inverse-on-surface": "#302f3b",
                                "on-primary-fixed": "#07006c",
                                "on-secondary-fixed-variant": "#2f3aa3",
                                "tertiary-container": "#b76dff",
                                "glow-blue": "rgba(99, 102, 241, 0.4)",
                                "primary-fixed": "#e1e0ff",
                                "surface-variant": "#343440",
                                "secondary-fixed-dim": "#bdc2ff",
                                "surface-bright": "#393844",
                                "tertiary": "#ddb7ff",
                                "surface-container-lowest": "#0d0d18",
                                "ai-gradient-start": "#6366F1",
                                "on-surface": "#e4e0f1",
                                "ai-gradient-end": "#A855F7",
                                "surface-container": "#1f1e2a",
                                "primary-fixed-dim": "#c0c1ff",
                                "on-tertiary-fixed": "#2c0051",
                                "tertiary-fixed-dim": "#ddb7ff",
                                "primary-container": "#8083ff",
                                "on-error-container": "#ffdad6",
                                "glass-stroke": "rgba(255, 255, 255, 0.1)"
                            },
                            "borderRadius": {
                                "DEFAULT": "0.25rem",
                                "lg": "0.5rem",
                                "xl": "0.75rem",
                                "full": "9999px"
                            },
                            "spacing": {
                                "container-max": "1280px",
                                "stack-sm": "8px",
                                "section-gap": "120px",
                                "margin-mobile": "16px",
                                "stack-lg": "32px",
                                "stack-md": "16px",
                                "gutter": "24px"
                            },
                            "fontFamily": {
                                "body-md": ["Inter"],
                                "label-sm": ["Inter"],
                                "headline-lg": ["Space Grotesk"],
                                "headline-md": ["Space Grotesk"],
                                "display-lg-mobile": ["Space Grotesk"],
                                "display-lg": ["Space Grotesk"],
                                "label-md": ["Inter"],
                                "body-lg": ["Inter"]
                            }
                        },
                    },
                }
            ` }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;400;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
            
            <style>{`
                body {
                    background-color: #12121d !important;
                    color: #e4e0f1 !important;
                    overflow-x: hidden;
                }
                .ai-gradient-text {
                    background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .ai-gradient-bg {
                    background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
                }
                .glass-card {
                    background: rgba(17, 17, 30, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .glow-hover:hover {
                    box-shadow: 0 0 25px rgba(99, 102, 241, 0.3);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                }
                .float-ui {
                    animation: float 6s infinite ease-in-out;
                }
                .gradient-blur {
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
                    filter: blur(40px);
                }
                .typewriter-cursor {
                    animation: cursorBlink 0.8s infinite;
                }
                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                details[open] summary .faq-icon-toggle {
                    transform: rotate(45deg);
                }
                .faq-icon-toggle {
                    transition: transform 0.2s ease;
                }
                .grid-bg {
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
                    background-size: 50px 50px;
                    background-position: center center;
                }
                .cta-text-align {
                    text-align: center;
                }
                @media (min-width: 768px) {
                    .cta-text-align {
                        text-align: left !important;
                    }
                }
            `}</style>

            <div className="bg-[#12121d] text-[#e4e0f1] min-h-screen" style={{ opacity: tailwindLoaded ? 1 : 0, transition: "opacity 0.25s ease-in" }}>
                <Navbar />

                <main className="relative">
                    {/* Hero Section: Editorial Layout */}
                    <section className="relative min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] flex items-center px-4 md:px-8 pt-6 pb-6 lg:py-0 overflow-hidden grid-bg">
                        {/* Background Elements */}
                        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] gradient-blur rounded-full opacity-60 pointer-events-none"></div>
                        <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] gradient-blur rounded-full opacity-40 pointer-events-none"></div>
                        
                        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            
                            {/* Content Left */}
                            <div className="lg:col-span-7 z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-[#12121d] bg-[#1f1e2a] flex items-center justify-center text-[10px] font-bold">JD</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-[#12121d] bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold">MK</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-[#12121d] bg-purple-500/20 flex items-center justify-center text-[10px] font-bold">AS</div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex text-yellow-400">
                                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        </div>
                                        <span className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-widest">Trusted by 10k+ Seekers</span>
                                    </div>
                                </div>

                                <h1 className="text-[40px] md:text-[60px] leading-[1.05] mb-4 font-bold tracking-tight text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                    The <span className="font-light italic">Future</span> of your <br/>
                                    <span className="font-bold ai-gradient-text">{typewriterText}</span> starts here.
                                </h1>
                                
                                <p className="text-base md:text-lg text-[#c7c4d7] mb-6 max-w-[580px]" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Engineered for modern recruitment. Use our neural-powered engine to generate ATS-proof resumes that recruiters actually want to read.
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                                    <button 
                                        onClick={handleStartResume}
                                        className="ai-gradient-bg text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 group glow-hover transition-all active:scale-95 border-0"
                                    >
                                        <span className="text-base">Build My Resume</span>
                                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">trending_flat</span>
                                    </button>
                                    <div className="flex items-center gap-4 px-6 py-2 border-l border-[rgba(255,255,255,0.1)]">
                                        <span className="material-symbols-outlined text-[#c0c1ff]">verified</span>
                                        <span className="text-sm text-[#c7c4d7] leading-tight">Free PDF Export<br/>(with watermark)</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                                    <div className="flex items-center gap-2"><span className="font-bold text-lg tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>FORBES</span></div>
                                    <div className="flex items-center gap-2"><span className="font-bold text-lg tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>WIRED</span></div>
                                    <div className="flex items-center gap-2"><span className="font-bold text-lg tracking-tighter" style={{ fontFamily: "Space Grotesk, sans-serif" }}>TECHCRUNCH</span></div>
                                </div>
                            </div>

                            {/* Visual Right */}
                            <div className="lg:col-span-5 relative h-full flex items-center justify-center lg:justify-end">
                                <div className="relative w-full max-w-[480px]">
                                    {/* Abstract UI Mockup */}
                                    <div className="float-ui glass-card rounded-2xl p-6 border-indigo-500/30 shadow-2xl relative z-20">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold uppercase tracking-wider">AI Optimizer active</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-4 w-3/4 bg-white/5 rounded-full"></div>
                                            <div className="h-32 w-full bg-white/5 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#c0c1ff]/40 text-4xl">auto_awesome</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-white/5 rounded-full"></div>
                                                <div className="h-3 w-5/6 bg-white/5 rounded-full"></div>
                                                <div className="h-3 w-4/6 bg-white/5 rounded-full"></div>
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <div className="h-8 w-24 ai-gradient-bg rounded-lg opacity-80"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary floating element */}
                                    <div className="absolute -bottom-8 -left-12 float-ui z-30 glass-card p-4 rounded-xl border-purple-500/20 shadow-xl hidden md:block" style={{ animationDelay: "-3s" }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-bold">ATS Score: 98%</div>
                                                <div className="text-[10px] text-[#c7c4d7]">Highly compatible</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating AI Skills match badge - Top Right */}
                                    <div className="absolute -top-10 -right-6 float-ui z-30 glass-card px-4 py-3 rounded-xl border-indigo-500/20 shadow-lg hidden md:block" style={{ animationDelay: "-1.5s" }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></div>
                                            <div className="text-[11px] font-bold text-[#c0c1ff] uppercase tracking-wider">AI Skill Match: 95%</div>
                                        </div>
                                    </div>

                                    {/* Floating PDF download toast - Left */}
                                    <div className="absolute top-1/4 -left-20 float-ui z-30 glass-card px-3 py-2 rounded-xl border-white/10 shadow-lg hidden md:block" style={{ animationDelay: "-4.5s" }}>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-400 text-sm">picture_as_pdf</span>
                                            <span className="text-[11px] font-semibold text-[#e4e0f1]">Format: PDF / Docx</span>
                                        </div>
                                    </div>

                                    {/* Decorative circles */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[#c0c1ff]/10 rounded-full -z-10"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-[#c0c1ff]/5 rounded-full -z-10"></div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* Bento Features */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Precision Tools for Professionals</h2>
                            <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>Our toolkit is designed to bypass filters and get your profile in front of hiring managers.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Card 1 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">psychology</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>AI Resume Writer</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Generate impactful summaries and action-oriented bullet points using models trained on successful job applications.
                                </p>
                                <button onClick={handleStartResume} className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold bg-transparent border-0 p-0 group-hover:gap-4 transition-all" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Start Writing <span className="material-symbols-outlined text-[18px]">east</span>
                                </button>
                            </div>

                            {/* Card 2 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 border-indigo-500/20 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">fact_check</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>ATS Optimization</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Every template is tested against leading recruitment software to ensure your content is never garbled or ignored.
                                </p>
                                <Link href="/ats-checker" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all text-decoration-none" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Scan My CV <span className="material-symbols-outlined text-[18px]">east</span>
                                </Link>
                            </div>

                            {/* Card 3 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">download</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Export &amp; Share</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Download pixel-perfect PDFs or generate a private link to share your live portfolio directly with employers.
                                </p>
                                <Link href="/templates" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all text-decoration-none" style={{ fontFamily: "Inter, sans-serif" }}>
                                    View Formats <span className="material-symbols-outlined text-[18px]">east</span>
                                </Link>
                            </div>

                        </div>
                    </section>

                    {/* Testimonials Section (Wall of Love) */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto border-t border-white/5">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                                Loved by Career Builders
                            </h2>
                            <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
                                See how CVGrid helps freshers and professionals optimize their resumes and land interviews.
                            </p>
                        </div>

                        {loadingTestimonials ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c0c1ff]"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {(testimonials.length > 0 
                                    ? [...testimonials, ...[
                                        {
                                            userName: "Anish Sharma",
                                            role: "Software Engineer",
                                            rating: 5,
                                            feedback: "CVGrid is incredible. The AI bullet point rephraser helped me highlight my achievements. Landed 3 interviews in a week!"
                                        },
                                        {
                                            userName: "Priya Patel",
                                            role: "Product Manager",
                                            rating: 5,
                                            feedback: "I loved the classic template. The ATS optimization feature is a lifesaver. Extremely clean and professional UI."
                                        },
                                        {
                                            userName: "Rahul Verma",
                                            role: "College Graduate",
                                            rating: 5,
                                            feedback: "The PDF export was super fast and clean. No hidden charges or watermarks on the premium version. Highly recommend!"
                                        }
                                    ]].slice(0, 6)
                                    : [
                                        {
                                            userName: "Anish Sharma",
                                            role: "Software Engineer",
                                            rating: 5,
                                            feedback: "CVGrid is incredible. The AI bullet point rephraser helped me highlight my achievements. Landed 3 interviews in a week!"
                                        },
                                        {
                                            userName: "Priya Patel",
                                            role: "Product Manager",
                                            rating: 5,
                                            feedback: "I loved the classic template. The ATS optimization feature is a lifesaver. Extremely clean and professional UI."
                                        },
                                        {
                                            userName: "Rahul Verma",
                                            role: "College Graduate",
                                            rating: 5,
                                            feedback: "The PDF export was super fast and clean. No hidden charges or watermarks on the premium version. Highly recommend!"
                                        }
                                    ]
                                ).map((item, i) => (
                                    <div key={item.id || i} className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 border border-indigo-500/10 hover:border-[#c0c1ff] transition-all group duration-300">
                                        <div>
                                            {/* Stars */}
                                            <div className="flex gap-1 mb-4 text-[#ffb400]">
                                                {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                                                    <span key={idx} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                ))}
                                            </div>
                                            {/* Feedback */}
                                            <p className="text-[#e4e0f1] text-[15px] leading-relaxed italic" style={{ fontFamily: "Inter, sans-serif" }}>
                                                "{item.feedback}"
                                            </p>
                                        </div>
                                        {/* User Details */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                            <div className="w-9 h-9 rounded-full bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] font-bold text-sm">
                                                {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-white">{item.userName || "Verified User"}</div>
                                                <div className="text-[11px] text-[#c7c4d7]">{item.role || "Job Seeker"}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Final CTA Section */}
                    <section className="px-4 md:px-8 py-16">
                        <div className="max-w-[1280px] mx-auto ai-gradient-bg rounded-[32px] p-12 md:p-20 relative overflow-hidden cta-text-align">
                            <div className="absolute right-0 top-0 w-full h-full bg-black/20 backdrop-blur-[2px] -z-0"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Ready to land your dream interview?</h2>
                                    <p className="text-white/80 text-lg md:text-xl mb-0" style={{ fontFamily: "Inter, sans-serif" }}>
                                        Join 10,000+ job seekers who leveled up their career with CVGrid. Create your resume now.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-6">
                                    <button 
                                        onClick={handleStartResume}
                                        className="bg-white text-[#12121d] font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95 border-0"
                                    >
                                        Get Started Now
                                    </button>
                                    <div className="flex items-center gap-2 text-white/70 text-sm">
                                        <span className="material-symbols-outlined text-[18px]">lock</span>
                                        No credit card required
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="px-4 md:px-8 py-16 max-w-3xl mx-auto" id="faq">
                        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>FAQs</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "Is CVGrid free to use?",
                                    a: "Yes! CVGrid offers a generous free tier. You can create your resume, choose from our templates, and download your CV with a subtle watermark. We offer a premium upgrade (INR 150) for completely watermark-free premium downloads (PDF, DOCX, PNG).",
                                },
                                {
                                    q: "Are the resume templates ATS-friendly?",
                                    a: "Absolutely. All resume templates on CVGrid are rigorously tested against leading Applicant Tracking Systems (ATS) to ensure your content parses perfectly and is never scrambled or ignored by recruiters.",
                                },
                                {
                                    q: "Will recruiters know I used AI?",
                                    a: "No. Our AI model is fine-tuned to write professional, impact-driven sentences that sound natural. It helps rephrase and optimize your real experience to highlight key achievements.",
                                },
                                {
                                    q: "How does the AI resume builder work?",
                                    a: "Simply input your professional details, click the 'Generate AI Content' helper, and our AI will draft descriptions, executive summaries, and action-oriented bullet points matching your industry and target job description.",
                                },
                                {
                                    q: "Can I download my resume as a PDF?",
                                    a: "Yes. Once you're done editing, you can immediately download your CV as a high-quality PDF, Word document (.docx), or high-res PNG image. Free downloads contain a watermark; premium exports are clean.",
                                },
                                {
                                    q: "Does CVGrid work for freshers and students?",
                                    a: "Yes. The builder has custom sections for internships, projects, and achievements. The AI writer is optimized to highlight transferable skills, making it perfect for students and career switchers.",
                                },
                            ].map((item, i) => (
                                <details key={i} className="group glass-card rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] transition-all">
                                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                        <span className="font-semibold text-white text-base md:text-lg" style={{ fontFamily: "Inter, sans-serif" }}>{item.q}</span>
                                        <span className="material-symbols-outlined faq-icon-toggle text-[#c0c1ff]">expand_more</span>
                                    </summary>
                                    <div className="p-6 pt-0 text-[#c7c4d7] border-t border-[rgba(255,255,255,0.1)]/30 text-sm md:text-base leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>

            {/* AUTH REQUIRED MODAL */}
            {showAuthModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(10, 14, 21, 0.8)",
                    backdropFilter: "blur(8px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.3s ease"
                }}>
                    <div className="card text-center p-5 text-white animate-fade-in" style={{
                        maxWidth: "450px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(142, 144, 160, 0.25)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}>
                        <div className="card-body">
                            <div className="mb-4">
                                <i className="fas fa-lock text-[#c0c1ff]" style={{ fontSize: "3rem" }}></i>
                            </div>
                            <h3 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>Sign Up First</h3>
                            <p className="text-white-50 mb-4" style={{ fontSize: "1.05rem", lineHeight: "1.5" }}>
                                You have to sign up first to create your professional resume.
                            </p>
                            <div className="d-flex align-items-center justify-content-center gap-2 text-[#c0c1ff] fw-semibold">
                                <i className="fas fa-sync fa-spin"></i>
                                <span>Redirecting you to Sign Up in {countdown}s...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
