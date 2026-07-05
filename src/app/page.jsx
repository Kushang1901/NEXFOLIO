"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../authState";

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [countdown, setCountdown] = useState(3);

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
        return () => unsubscribe();
    }, [router]);

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
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            {/* ═══════════════════════════════════════════
                HERO SECTION — Professional & SEO-Optimised
            ═══════════════════════════════════════════ */}
            <header id="hero" style={{ position: "relative", overflow: "hidden", background: "#060610", padding: "55px 0 35px" }}>

                <style>{`
                    /* ── Hero keyframes ── */
                    @keyframes hFadeUp {
                        from { opacity: 0; transform: translateY(28px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes hGlow {
                        0%,100% { opacity: 0.55; }
                        50%      { opacity: 0.85; }
                    }
                    @keyframes hGridScroll {
                        from { background-position: 0 0; }
                        to   { background-position: 0 60px; }
                    }
                    @keyframes hBadgePulse {
                        0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.45); }
                        50%      { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
                    }
                    @keyframes hStarSpin {
                        0%   { transform: rotate(0deg) scale(1); }
                        50%  { transform: rotate(10deg) scale(1.15); }
                        100% { transform: rotate(0deg) scale(1); }
                    }

                    /* ── Hero element styles ── */
                    .h-fade-1  { animation: hFadeUp 0.7s ease both; animation-delay: 0.05s; }
                    .h-fade-2  { animation: hFadeUp 0.7s ease both; animation-delay: 0.18s; }
                    .h-fade-3  { animation: hFadeUp 0.7s ease both; animation-delay: 0.30s; }
                    .h-fade-4  { animation: hFadeUp 0.7s ease both; animation-delay: 0.42s; }
                    .h-fade-5  { animation: hFadeUp 0.7s ease both; animation-delay: 0.54s; }

                    .hero-pill {
                        display: inline-flex; align-items: center; gap: 7px;
                        background: rgba(255,255,255,0.04);
                        border: 1px solid rgba(255,255,255,0.10);
                        border-radius: 999px;
                        padding: 6px 14px;
                        font-size: 0.78rem;
                        font-weight: 600;
                        color: rgba(255,255,255,0.7);
                        letter-spacing: 0.04em;
                        text-transform: uppercase;
                        animation: hBadgePulse 3s ease-in-out infinite;
                    }
                    .hero-pill-dot {
                        width: 7px; height: 7px; border-radius: 50%;
                        background: #4ade80;
                        box-shadow: 0 0 8px #4ade80;
                    }

                    .hero-h1 {
                        font-size: clamp(2.5rem, 5.5vw, 4.2rem);
                        font-weight: 800;
                        line-height: 1.12;
                        letter-spacing: -0.03em;
                        color: #fff;
                    }
                    .hero-h1 .h1-accent {
                        background: linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .hero-sub {
                        font-size: clamp(1rem, 2vw, 1.2rem);
                        color: rgba(200,205,230,0.65);
                        line-height: 1.75;
                        max-width: 600px;
                        margin: 0 auto;
                    }

                    .hero-cta-primary {
                        display: inline-flex; align-items: center; gap: 9px;
                        background: linear-gradient(135deg, #6366f1, #818cf8);
                        color: #fff;
                        font-weight: 700;
                        font-size: 1.05rem;
                        padding: 14px 32px;
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                        box-shadow: 0 4px 24px rgba(99,102,241,0.45);
                        transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
                        text-decoration: none;
                    }
                    .hero-cta-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 32px rgba(99,102,241,0.6);
                        background: linear-gradient(135deg, #818cf8, #6366f1);
                        color: #fff;
                    }
                    .hero-cta-secondary {
                        display: inline-flex; align-items: center; gap: 8px;
                        background: transparent;
                        color: rgba(255,255,255,0.75);
                        font-weight: 600;
                        font-size: 1rem;
                        padding: 14px 28px;
                        border: 1px solid rgba(255,255,255,0.15);
                        border-radius: 10px;
                        cursor: pointer;
                        transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
                        text-decoration: none;
                    }
                    .hero-cta-secondary:hover {
                        border-color: rgba(99,102,241,0.5);
                        color: #fff;
                        background: rgba(99,102,241,0.08);
                    }

                    .hero-trust {
                        display: flex; align-items: center; justify-content: center;
                        gap: 6px; flex-wrap: wrap;
                        font-size: 0.88rem;
                        color: rgba(200,205,230,0.55);
                    }
                    .hero-trust-stars { color: #fbbf24; letter-spacing: 1px; }
                    .hero-trust-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.15); }

                    .hero-feature-tags {
                        display: flex; align-items: center; justify-content: center;
                        flex-wrap: wrap; gap: 10px;
                    }
                    .hero-tag {
                        display: inline-flex; align-items: center; gap: 6px;
                        background: rgba(99,102,241,0.08);
                        border: 1px solid rgba(99,102,241,0.22);
                        border-radius: 8px;
                        padding: 6px 13px;
                        font-size: 0.82rem;
                        font-weight: 600;
                        color: rgba(180,185,255,0.85);
                        transition: background 0.15s, border-color 0.15s;
                    }
                    .hero-tag:hover {
                        background: rgba(99,102,241,0.16);
                        border-color: rgba(99,102,241,0.45);
                    }
                    .hero-tag-icon { font-size: 0.75rem; }

                    /* Background mesh / grid */
                    .hero-bg-grid {
                        position: absolute; inset: 0; pointer-events: none; z-index: 0;
                        background-image:
                            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
                        background-size: 48px 48px;
                        animation: hGridScroll 12s linear infinite;
                        mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%);
                    }
                    .hero-glow-left {
                        position: absolute; top: -100px; left: -120px;
                        width: 600px; height: 600px; border-radius: 50%;
                        background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
                        pointer-events: none; z-index: 0;
                        animation: hGlow 6s ease-in-out infinite;
                    }
                    .hero-glow-right {
                        position: absolute; bottom: -100px; right: -100px;
                        width: 500px; height: 500px; border-radius: 50%;
                        background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
                        pointer-events: none; z-index: 0;
                        animation: hGlow 8s ease-in-out infinite reverse;
                    }

                    @media (max-width: 576px) {
                        .hero-cta-wrap { flex-direction: column; align-items: stretch; }
                        .hero-cta-primary, .hero-cta-secondary { justify-content: center; }
                        .hero-trust { font-size: 0.8rem; }
                    }
                `}</style>

                {/* Background elements */}
                <div className="hero-bg-grid" aria-hidden="true" />
                <div className="hero-glow-left" aria-hidden="true" />
                <div className="hero-glow-right" aria-hidden="true" />

                {/* Content */}
                <div className="container" style={{ position: "relative", zIndex: 1 }}>
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-9 col-xl-8">

                            {/* Live badge */}
                            <div className="h-fade-1 mb-4">
                                <span className="hero-pill">
                                    <span className="hero-pill-dot" aria-hidden="true" />
                                    Free · No Credit Card · No Watermark
                                </span>
                            </div>

                            {/* H1 — primary SEO target */}
                            <h1 className="hero-h1 h-fade-2 mb-4">
                                Build a <span className="h1-accent">Professional Resume</span>
                                <br />with Free AI Resume Builder
                            </h1>

                            {/* Sub-headline */}
                            <p className="hero-sub h-fade-3 mb-5">
                                Create ATS-friendly resumes in minutes using <strong style={{ color: "rgba(200,205,230,0.85)", fontWeight: 600 }}>Google Gemini AI</strong>. Pick from 18+ premium templates, generate compelling content, and download as PDF — 100% free, forever.
                            </p>

                            {/* CTA buttons */}
                            <div className="hero-cta-wrap h-fade-4 mb-4 d-flex align-items-center justify-content-center gap-3 flex-wrap">
                                <button
                                    id="hero-build-resume-btn"
                                    onClick={handleStartResume}
                                    className="hero-cta-primary"
                                    aria-label="Start building your free resume now"
                                >
                                    <i className="fas fa-bolt" aria-hidden="true" />
                                    Build My Resume — Free
                                </button>
                                <a
                                    href="#templates-preview"
                                    className="hero-cta-secondary"
                                    aria-label="View resume templates"
                                >
                                    <i className="fas fa-th-large" aria-hidden="true" />
                                    See Templates
                                </a>
                            </div>

                            {/* Trust signals */}
                            <div className="hero-trust h-fade-4 mb-5" aria-label="Social proof">
                                <span className="hero-trust-stars" aria-label="4.9 out of 5 stars">★★★★★</span>
                                <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>4.9/5</span>
                                <div className="hero-trust-sep" aria-hidden="true" />
                                <span>Trusted by <strong style={{ color: "rgba(255,255,255,0.75)" }}>10,000+</strong> job seekers</span>
                                <div className="hero-trust-sep" aria-hidden="true" />
                                <span><i className="fas fa-lock" style={{ fontSize: "0.7rem", marginRight: "3px" }} aria-hidden="true" />Secure &amp; Private</span>
                            </div>

                            {/* Feature tags */}
                            <div className="hero-feature-tags h-fade-5" aria-label="Key features">
                                {[
                                    { icon: "fa-robot",      label: "AI Content Writer"       },
                                    { icon: "fa-check-double", label: "ATS Optimized"          },
                                    { icon: "fa-file-pdf",   label: "Free PDF Export"          },
                                    { icon: "fa-layer-group", label: "18+ Templates"           },
                                    { icon: "fa-envelope",   label: "AI Cover Letter"          },
                                ].map(({ icon, label }) => (
                                    <span key={label} className="hero-tag">
                                        <i className={`fas ${icon} hero-tag-icon`} aria-hidden="true" />
                                        {label}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </header>




            {/* Features Section */}
            <section className="py-5 bg-dark">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-6 fw-bold mb-3">The Best Free AI Resume Maker for Job Seekers</h2>
                        <p className="text-white-50 max-w-2xl mx-auto fs-5">
                            Empower your job application process with smart builder tools tailored to pass recruitment screens.
                        </p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div
                                className="card bg-black border-secondary h-100"
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="card-body p-4 text-center">
                                    <h3 className="h5 fw-bold mb-3">AI-Powered Resume Writer</h3>
                                    <p className="text-white-50 mb-0">
                                        Leverage advanced artificial intelligence to instantly draft compelling experience descriptions and bullet points that match your target role.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="card bg-black border-secondary h-100"
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="card-body p-4 text-center">
                                    <h3 className="h5 fw-bold mb-3">ATS-Friendly Resume Builder</h3>
                                    <p className="text-white-50 mb-0">
                                        Build beautiful, job-winning resumes in minutes using our intuitive interface and templates engineered to be fully scan-readable.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="card bg-black border-secondary h-100"
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                <div className="card-body p-4 text-center">
                                    <h3 className="h5 fw-bold mb-3">Free PDF & PNG Exports</h3>
                                    <p className="text-white-50 mb-0">
                                        Export your polished CV as a clean, professionally formatted PDF or high-res PNG image that maintains exact styling across all tracking systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-black">
                <div className="container py-5">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-6">
                            <h2 className="display-5 fw-bold mb-4">
                                Build Your ATS-Friendly Resume Today
                            </h2>
                            <p className="text-white-50 fs-5 mb-4">
                                Join thousands of job seekers using CVGrid to land interviews. Start for free now.
                            </p>
                             <button
                                className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                                style={{
                                    fontSize: "1.1rem",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 15px rgba(13, 110, 253, 0.4)"
                                }}
                                onClick={handleStartResume}
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section — matches FAQPage JSON-LD for Google Featured Snippets */}
            <section className="py-5 bg-dark" id="faq">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="display-6 fw-bold mb-3">Frequently Asked Questions</h2>
                        <p className="text-white-50 fs-5">Everything you need to know about CVGrid's free AI resume builder.</p>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {[
                                {
                                    q: "Is CVGrid really free to use?",
                                    a: "Yes! CVGrid is 100% free. You can create a resume, choose from 18+ premium templates, generate AI content, and download your resume as a PDF — all without paying anything or entering a credit card.",
                                },
                                {
                                    q: "Are the resume templates ATS-friendly?",
                                    a: "All resume templates on CVGrid are designed to be ATS (Applicant Tracking System) friendly. They use clean formatting, standard section headings, and readable fonts that pass recruiter screening software.",
                                },
                                {
                                    q: "How does the AI resume builder work?",
                                    a: "CVGrid uses Google Gemini AI to generate professional resume content based on your job role, experience, and skills. Simply enter your details, click generate, review the content, and download your finished resume.",
                                },
                                {
                                    q: "Can I download my resume as a PDF?",
                                    a: "Yes! Once you've built your resume, you can download it as a high-quality PDF or PNG image with a single click. No watermarks, no subscriptions — completely free.",
                                },
                                {
                                    q: "Does CVGrid work for freshers and students?",
                                    a: "Absolutely. CVGrid is specifically designed for students, freshers, and entry-level job seekers. The AI helps you write professional resume content even if you have limited work experience.",
                                },
                                {
                                    q: "How many resume templates are available?",
                                    a: "CVGrid offers 18+ professionally designed resume templates including Classic, Modern, Creative, Executive, Developer, Minimalist, Elegant, Navy Elegance, Emerald, Aurora, Midnight, Nordic, Crimson, and more.",
                                },
                            ].map((item, i) => (
                                <details
                                    key={i}
                                    className="mb-3"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "10px",
                                        padding: "1rem 1.25rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <summary
                                        className="fw-semibold text-white"
                                        style={{ fontSize: "1rem", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                    >
                                        {item.q}
                                        <span className="text-primary ms-3" style={{ fontSize: "1.25rem", flexShrink: 0 }}>+</span>
                                    </summary>
                                    <p className="text-white-50 mb-0 mt-3" style={{ fontSize: "0.97rem", lineHeight: "1.65" }}>
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black border-top border-secondary py-4">
                <div className="container">
                    <div className="text-center text-white-50">
                        <p className="mb-1">
                            &copy; 2026 CVGrid. All rights reserved.
                        </p>
                        <p className="mb-0">
                            Designed &amp; Developed by{" "}
                            <a
                                href="https://kushangacharya.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-info fw-semibold text-decoration-none"
                            >
                                Kushang Acharya
                            </a>
                        </p>
                    </div>
                </div>
            </footer>

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
                                <i className="fas fa-lock text-primary" style={{ fontSize: "3rem" }}></i>
                            </div>
                            <h3 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>Sign Up First</h3>
                            <p className="text-white-50 mb-4" style={{ fontSize: "1.05rem", lineHeight: "1.5" }}>
                                You have to sign up first to create your professional resume.
                            </p>
                            <div className="d-flex align-items-center justify-content-center gap-2 text-primary fw-semibold">
                                <i className="fas fa-sync fa-spin"></i>
                                <span>Redirecting you to Sign Up in {countdown}s...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
