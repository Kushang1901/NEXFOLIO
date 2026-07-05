"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Script from "next/script";
import { Sparkles, ScanLine, FileText, UploadCloud, CheckCircle, ArrowRight, ShieldCheck, Cpu, Target, Eye } from "lucide-react";

export default function AIToolsHub() {
    const [tailwindLoaded, setTailwindLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.tailwind) {
            setTailwindLoaded(true);
        }
    }, []);

    // Ambient floating particles effect
    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            const p = document.createElement("div");
            p.style.position = "fixed";
            p.style.width = Math.random() * 5 + 3 + "px";
            p.style.height = p.style.width;
            p.style.background = "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.05) 100%)";
            p.style.borderRadius = "50%";
            p.style.left = Math.random() * 100 + "vw";
            p.style.top = "100vh";
            p.style.pointerEvents = "none";
            p.style.zIndex = "1";
            document.body.appendChild(p);

            const duration = Math.random() * 4000 + 4000;
            p.animate([
                { opacity: 0, transform: "translateY(0) scale(0.5)" },
                { opacity: 0.6, transform: "translateY(-50vh) scale(1.2)" },
                { opacity: 0, transform: "translateY(-100vh) scale(0.8)" }
            ], {
                duration: duration,
                easing: "ease-out"
            });

            setTimeout(() => p.remove(), duration);
        }, 600);

        return () => clearInterval(interval);
    }, []);

    const tools = [
        {
            title: "Gemini AI Resume Builder",
            description: "Generate highly professional summaries, work experience bullet points, and customized skills based on your target job description. Powered by Google Gemini AI.",
            details: [
                "Tailored summaries & content",
                "18+ ATS-optimized templates",
                "100% free PDF download"
            ],
            Icon: Sparkles,
            ctaText: "Build Resume Now",
            ctaLink: "/templates",
            badge: "Most Popular",
            color: "#6366f1", // Indigo
            bgColor: "rgba(99, 102, 241, 0.08)",
            borderColor: "rgba(99, 102, 241, 0.2)"
        },
        {
            title: "ATS Score & Match Checker",
            description: "Check your resume's compatibility score against any job description instantly. Get detailed feedback on keyword density, missing keywords, and layout structure.",
            details: [
                "Instant match scoring (0-100%)",
                "Keyword gap identification",
                "Actionable layout suggestions"
            ],
            Icon: Target,
            ctaText: "Check ATS Score",
            ctaLink: "/ats-checker",
            badge: "Career Booster",
            color: "#10b981", // Emerald
            bgColor: "rgba(16, 185, 129, 0.08)",
            borderColor: "rgba(16, 185, 129, 0.2)"
        },
        {
            title: "AI Cover Letter Generator",
            description: "Create a highly personalized, compelling cover letter in seconds. Tailor the tone and content directly to the job description to grab recruiter attention immediately.",
            details: [
                "Matches any job description",
                "Adjustable tone profiles",
                "Saves directly to your profile"
            ],
            Icon: FileText,
            ctaText: "Generate Cover Letter",
            ctaLink: "/cover-letter",
            badge: "Time Saver",
            color: "#ec4899", // Pink
            bgColor: "rgba(236, 72, 153, 0.08)",
            borderColor: "rgba(236, 72, 153, 0.2)"
        },
        {
            title: "Smart PDF Resume Parser",
            description: "Already have a resume? Upload it to our parser and let AI automatically extract your profile information to pre-fill the builder, upgrading your template in seconds.",
            details: [
                "Extracts text & structure",
                "Quick template transitions",
                "No manual typing required"
            ],
            Icon: UploadCloud,
            ctaText: "Import Resume PDF",
            ctaLink: "/builder",
            badge: "Instant Upload",
            color: "#f59e0b", // Amber
            bgColor: "rgba(245, 158, 11, 0.08)",
            borderColor: "rgba(245, 158, 11, 0.2)"
        }
    ];

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
                                "surface-container-lowest": "#0a0e15",
                                "tertiary-fixed-dim": "#c3c6cd",
                                "surface-container-highest": "#31353d",
                                "primary": "#b6c4ff",
                                "on-surface": "#dfe2ed",
                                "background": "#0f131b",
                                "primary-container": "#6789ff",
                                "surface-container-low": "#181c23",
                                "surface-variant": "#31353d",
                                "secondary": "#ffb3b0",
                                "tertiary": "#c3c6cd",
                                "surface-container-high": "#262a32",
                                "outline": "#8e90a0",
                                "primary-fixed": "#dce1ff",
                                "on-surface-variant": "#c4c5d7",
                                "outline-variant": "#434654",
                                "surface-container": "#1c2027",
                                "surface": "#0f131b",
                            }
                        }
                    }
                }
            ` }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
            
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    background-color: #0f131b !important;
                    color: #dfe2ed !important;
                    font-family: 'Inter', sans-serif !important;
                    overflow-x: hidden !important;
                }
                .glass-card {
                    background: rgba(28, 32, 39, 0.7) !important;
                    backdrop-filter: blur(16px) !important;
                    border: 1px solid rgba(67, 70, 84, 0.4) !important;
                }
                .glow-circle {
                    position: absolute !important;
                    width: 500px !important;
                    height: 500px !important;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(15, 19, 27, 0) 70%) !important;
                    z-index: -1 !important;
                    filter: blur(50px) !important;
                    pointer-events: none !important;
                }
                .initial-loader-container {
                    position: fixed;
                    inset: 0;
                    background-color: #0f131b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                }
                .initial-loader-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid rgba(99, 102, 241, 0.15);
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            ` }} />

            {!tailwindLoaded && (
                <div className="initial-loader-container">
                    <div className="initial-loader-spinner"></div>
                </div>
            )}

            <div className="min-h-screen flex flex-col" style={{ opacity: tailwindLoaded ? 1 : 0, transition: "opacity 0.2s ease-in" }}>
                <Navbar />

                {/* Hero Section */}
                <header className="relative pt-36 pb-20 px-6 text-center overflow-hidden">
                    <div className="glow-circle top-0 left-1/2 -translate-x-1/2"></div>
                    <div className="max-w-4xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-6 tracking-wide uppercase">
                            <Cpu size={14} className="animate-pulse" /> Advanced Career Suite
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-tight mb-6">
                            Supercharge Your Career Search <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Powered by Next-Gen AI
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10">
                            Discover our comprehensive suite of career tools designed to get you past automated tracking systems, write professional content, and secure callbacks.
                        </p>
                    </div>
                </header>

                {/* Tools Grid */}
                <main className="max-w-7xl mx-auto px-6 pb-24 relative flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {tools.map((tool, idx) => {
                            const IconComponent = tool.Icon;
                            return (
                                <section 
                                    key={idx} 
                                    className="glass-card rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-opacity-65 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative group overflow-hidden"
                                    style={{ borderColor: tool.borderColor }}
                                >
                                    {/* Accent background glow */}
                                    <div 
                                        className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-300 group-hover:scale-125"
                                        style={{ background: tool.color, opacity: 0.15 }}
                                    ></div>

                                    <div>
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div 
                                                className="w-14 h-14 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                                                style={{ 
                                                    backgroundColor: tool.bgColor, 
                                                    borderColor: tool.borderColor,
                                                    color: tool.color 
                                                }}
                                            >
                                                <IconComponent size={28} />
                                            </div>
                                            <span 
                                                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                                                style={{ 
                                                    color: tool.color, 
                                                    borderColor: tool.borderColor,
                                                    backgroundColor: tool.bgColor
                                                }}
                                            >
                                                {tool.badge}
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <h2 className="text-2xl font-bold text-on-surface mb-3 group-hover:text-white transition-colors duration-200">
                                            {tool.title}
                                        </h2>
                                        <p className="text-on-surface-variant mb-6 text-sm md:text-base leading-relaxed">
                                            {tool.description}
                                        </p>

                                        {/* Checklist features */}
                                        <ul className="space-y-3 mb-8">
                                            {tool.details.map((detail, dIdx) => (
                                                <li key={dIdx} className="flex items-center gap-3 text-sm text-on-surface-variant/90">
                                                    <CheckCircle size={16} className="flex-shrink-0" style={{ color: tool.color }} />
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action button */}
                                    <Link 
                                        href={tool.ctaLink}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 shadow-lg cursor-pointer text-sm"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${tool.color}, rgba(0, 0, 0, 0.2))`,
                                            boxShadow: `0 4px 20px -2px ${tool.color}35`
                                        }}
                                    >
                                        {tool.ctaText} <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                                    </Link>
                                </section>
                            );
                        })}
                    </div>

                    {/* Trust Block / Why CVGrid */}
                    <section className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                        <h3 className="text-3xl font-bold mb-4">Why Job Seekers Choose CVGrid</h3>
                        <p className="text-on-surface-variant max-w-xl mx-auto mb-10 text-sm md:text-base">
                            We build premium tools designed with one goal: helping you land your next role without paywalls or watermarks.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
                                <ShieldCheck className="text-indigo-400 mt-0.5 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold mb-1 text-sm text-on-surface">100% Free & Open</h4>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">No hidden fees, no subscriptions, and zero watermarks on your PDF downloads.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
                                <ScanLine className="text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold mb-1 text-sm text-on-surface">ATS Compatibility</h4>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">Our templates are strictly designed to pass parse checks by top company systems.</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-start">
                                <Eye className="text-pink-400 mt-0.5 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-bold mb-1 text-sm text-on-surface">Secure Cloud Sync</h4>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">Your data belongs to you. Keep it stored securely and access it anywhere anytime.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4 border-t border-outline-variant bg-surface-container-lowest">
                    <div className="font-label-bold text-label-bold text-on-surface font-semibold">CVGrid</div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <span className="text-sm text-tertiary-fixed-dim">© 2026 CVGrid. All rights reserved.</span>
                        <div className="flex gap-6">
                            <Link className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="/privacy">Privacy Policy</Link>
                            <Link className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="/terms">Terms of Service</Link>
                            <Link className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-200" href="/contact">Contact Support</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
