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

                    /* ── Features Section ── */
                    .features-section-container {
                        background: radial-gradient(circle at center, #0e111d 0%, #060610 100%);
                        position: relative;
                        overflow: hidden;
                    }
                    .features-glow {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 800px;
                        height: 800px;
                        background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 70%);
                        pointer-events: none;
                        z-index: 1;
                    }
                    .feature-gradient-title {
                        background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .feature-card-custom {
                        background: rgba(15, 18, 36, 0.45);
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        backdrop-filter: blur(16px);
                        border-radius: 20px;
                        padding: 32px 28px;
                        height: 100%;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        z-index: 2;
                    }
                    .feature-card-custom::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        border-radius: 20px;
                        padding: 1.5px;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.01));
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor;
                        mask-composite: exclude;
                        pointer-events: none;
                        transition: all 0.3s ease;
                    }
                    .feature-card-custom:hover {
                        transform: translateY(-6px);
                        background: rgba(20, 24, 48, 0.65);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15);
                    }
                    .feature-card-custom:hover::before {
                        background: linear-gradient(135deg, #6366f1, #a78bfa);
                    }
                    .feature-icon-badge {
                        width: 60px;
                        height: 60px;
                        border-radius: 16px;
                        background: rgba(99, 102, 241, 0.08);
                        border: 1px solid rgba(99, 102, 241, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 24px;
                        color: #818cf8;
                        transition: all 0.3s ease;
                    }
                    .feature-card-custom:hover .feature-icon-badge {
                        background: linear-gradient(135deg, #6366f1, #818cf8);
                        color: #ffffff;
                        transform: scale(1.1) rotate(4deg);
                        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
                    }
                    .feature-title-text {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #ffffff;
                        margin-bottom: 14px;
                        letter-spacing: -0.01em;
                    }
                    .feature-desc-text {
                        font-size: 0.95rem;
                        line-height: 1.6;
                        color: rgba(255, 255, 255, 0.55);
                    }
                    
                    /* ── CTA Section ── */
                    .cta-section-container {
                        background: radial-gradient(circle at bottom, #111424 0%, #06070c 100%);
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                        position: relative;
                        overflow: hidden;
                    }
                    .cta-glow {
                        position: absolute;
                        bottom: -150px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 600px;
                        height: 400px;
                        background: radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
                        pointer-events: none;
                        z-index: 1;
                    }
                    .btn-cta-premium {
                        background: linear-gradient(135deg, #6366f1, #818cf8);
                        color: #fff;
                        font-weight: 700;
                        font-size: 1.1rem;
                        padding: 16px 42px;
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        box-shadow: 0 4px 24px rgba(99, 102, 241, 0.45);
                        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        text-decoration: none;
                    }
                    .btn-cta-premium:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.6);
                        background: linear-gradient(135deg, #818cf8, #6366f1);
                        color: #fff;
                    }
                    
                    /* ── FAQ Section ── */
                    .faq-section-container {
                        background: radial-gradient(circle at top, #0c0e18 0%, #06060c 100%);
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                        position: relative;
                        overflow: hidden;
                    }
                    .faq-glow {
                        position: absolute;
                        top: -150px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 700px;
                        height: 450px;
                        background: radial-gradient(ellipse, rgba(167, 139, 250, 0.08) 0%, rgba(167, 139, 250, 0) 70%);
                        pointer-events: none;
                        z-index: 1;
                    }
                    .faq-details-custom {
                        background: rgba(255, 255, 255, 0.02);
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        border-radius: 14px;
                        margin-bottom: 16px;
                        overflow: hidden;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        backdrop-filter: blur(12px);
                    }
                    .faq-details-custom:hover {
                        background: rgba(255, 255, 255, 0.04);
                        border-color: rgba(99, 102, 241, 0.3);
                        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);
                    }
                    .faq-details-custom[open] {
                        background: rgba(99, 102, 241, 0.04);
                        border-color: rgba(99, 102, 241, 0.4);
                        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.12);
                    }
                    .faq-summary-custom {
                        padding: 20px 24px;
                        font-weight: 600;
                        font-size: 1.05rem;
                        color: #ffffff;
                        list-style: none;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        user-select: none;
                        transition: color 0.2s ease;
                    }
                    .faq-summary-custom::-webkit-details-marker {
                        display: none;
                    }
                    .faq-summary-custom:hover {
                        color: #cbd5e1;
                    }
                    .faq-details-custom[open] .faq-summary-custom {
                        color: #818cf8;
                    }
                    .faq-icon-toggle {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 1.25rem;
                        font-weight: 400;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        flex-shrink: 0;
                    }
                    .faq-details-custom:hover .faq-icon-toggle {
                        border-color: rgba(99, 102, 241, 0.4);
                        color: #818cf8;
                    }
                    .faq-details-custom[open] .faq-icon-toggle {
                        background: #6366f1;
                        border-color: #6366f1;
                        color: #ffffff;
                        transform: rotate(45deg);
                    }
                    .faq-answer-custom {
                        padding: 0 24px 20px;
                        font-size: 0.95rem;
                        line-height: 1.65;
                        color: rgba(255, 255, 255, 0.65);
                        animation: faqFadeIn 0.3s ease-out;
                    }
                    @keyframes faqFadeIn {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
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
                                Create ATS-friendly resumes in minutes using <strong style={{ color: "rgba(200,205,230,0.85)", fontWeight: 600 }}>advanced AI models</strong>. Pick from 18+ premium templates, generate compelling content, and download as PDF — 100% free, forever.
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
                                <Link
                                    href="/templates"
                                    className="hero-cta-secondary"
                                    aria-label="View resume templates"
                                >
                                    <i className="fas fa-th-large" aria-hidden="true" />
                                    See Templates
                                </Link>
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
            <section className="features-section-container py-5 position-relative">
                <div className="features-glow" aria-hidden="true" />
                
                <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3 feature-gradient-title">The Best Free AI Resume Maker for Job Seekers</h2>
                        <p className="text-white-50 max-w-2xl mx-auto fs-5" style={{ maxWidth: "700px" }}>
                            Empower your job application process with smart builder tools tailored to pass recruitment screens.
                        </p>
                    </div>
                    
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4">
                            <div className="feature-card-custom">
                                <div className="feature-icon-badge">
                                    <i className="fas fa-robot fa-2x"></i>
                                </div>
                                <h3 className="feature-title-text">AI-Powered Resume Writer</h3>
                                <p className="feature-desc-text mb-0">
                                    Leverage advanced artificial intelligence to instantly draft compelling experience descriptions and bullet points that match your target role.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="feature-card-custom">
                                <div className="feature-icon-badge">
                                    <i className="fas fa-check-double fa-2x"></i>
                                </div>
                                <h3 className="feature-title-text">ATS-Friendly Resume Builder</h3>
                                <p className="feature-desc-text mb-0">
                                    Build beautiful, job-winning resumes in minutes using our intuitive interface and templates engineered to be fully scan-readable.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="feature-card-custom">
                                <div className="feature-icon-badge">
                                    <i className="fas fa-file-pdf fa-2x"></i>
                                </div>
                                <h3 className="feature-title-text">Free PDF & PNG Exports</h3>
                                <p className="feature-desc-text mb-0">
                                    Export your polished CV as a clean, professionally formatted PDF or high-res PNG image that maintains exact styling across all tracking systems.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section-container py-5 position-relative">
                <div className="cta-glow" aria-hidden="true" />
                
                <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h2 className="display-5 fw-bold mb-4 text-white">
                                Build Your ATS-Friendly Resume Today
                            </h2>
                            <p className="text-white-50 fs-5 mb-5 mx-auto" style={{ maxWidth: "600px" }}>
                                Join thousands of job seekers using CVGrid to land interviews. Start for free now.
                            </p>
                            <button
                                className="btn-cta-premium"
                                onClick={handleStartResume}
                            >
                                <i className="fas fa-bolt" aria-hidden="true" /> Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section — matches FAQPage JSON-LD for Google Featured Snippets */}
            <section className="faq-section-container py-5" id="faq">
                <div className="faq-glow" aria-hidden="true" />
                
                <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3 feature-gradient-title">Frequently Asked Questions</h2>
                        <p className="text-white-50 fs-5">Everything you need to know about CVGrid's free AI resume builder.</p>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xl-7">
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
                                    a: "CVGrid uses advanced AI models to generate professional resume content based on your job role, experience, and skills. Simply enter your details, click generate, review the content, and download your finished resume.",
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
                                    className="faq-details-custom"
                                >
                                    <summary className="faq-summary-custom">
                                        <span>{item.q}</span>
                                        <span className="faq-icon-toggle" aria-hidden="true">+</span>
                                    </summary>
                                    <div className="faq-answer-custom">
                                        {item.a}
                                    </div>
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
