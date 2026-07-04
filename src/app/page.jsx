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

            {/* ═══════ 3D ORB HERO ═══════ */}
            <header style={{ position:"relative", height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", overflow:"hidden", background:"#09090f", textAlign:"center", padding:"90px 20px 20px" }}>

                <style>{`
                    @keyframes rippleOut {
                        0%   { transform: scaleX(1) scaleY(1); opacity: 0.55; }
                        100% { transform: scaleX(2.8) scaleY(2.8); opacity: 0; }
                    }
                    @keyframes orbFloat {
                        0%,100% { transform: translateY(0px); }
                        50%      { transform: translateY(-14px); }
                    }
                    @keyframes orbPulse {
                        0%,100% { box-shadow: 0 0 80px 20px rgba(80,90,255,0.35), 0 0 160px 60px rgba(60,70,220,0.18), inset 0 0 40px rgba(120,140,255,0.12); }
                        50%      { box-shadow: 0 0 120px 40px rgba(80,90,255,0.55), 0 0 220px 90px rgba(60,70,220,0.3), inset 0 0 60px rgba(120,140,255,0.2); }
                    }
                    @keyframes heroIn {
                        from { opacity:0; transform: translateY(30px); }
                        to   { opacity:1; transform: translateY(0); }
                    }
                    @keyframes specularShimmer {
                        0%,100% { opacity: 0.8; }
                        50%      { opacity: 1; }
                    }
                    .hero-orb-wrap { animation: orbFloat 6s ease-in-out infinite; }
                    .hero-orb      { animation: orbPulse 4s ease-in-out infinite; }
                    .hero-text     { animation: heroIn 1s ease forwards; }
                    .ripple-ring   { animation: rippleOut 3.6s ease-out infinite; }
                    .rr2           { animation-delay: 1.2s; }
                    .rr3           { animation-delay: 2.4s; }
                    @media (max-width: 768px) {
                        .hero-orb { width: 180px !important; height: 180px !important; }
                        .hero-orb-stage { width: 260px !important; height: 260px !important; }
                    }
                    @media (max-height: 700px) {
                        .hero-orb { width: 180px !important; height: 180px !important; }
                        .hero-orb-stage { width: 260px !important; height: 260px !important; }
                    }
                `}</style>

                {/* ── Dark radial bg ── */}
                <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 55% at 50% 55%, rgba(30,35,120,0.55) 0%, transparent 70%)", pointerEvents:"none" }} />

                {/* ── Top announcement pill ── */}

                {/* ── Headline ── */}
                <div className="hero-text" style={{ animationDelay:"0.1s", zIndex:10, marginBottom:"6px" }}>
                    <h1 style={{ fontSize:"clamp(2.2rem, 5.5vw, 4rem)", fontWeight:"800", lineHeight:1.15, letterSpacing:"-0.03em", color:"#fff", maxWidth:"700px", margin:"0 auto" }}>
                        Build Your Professional Resume
                    </h1>
                </div>
                <div className="hero-text" style={{ animationDelay:"0.2s", zIndex:10, marginBottom:"15px" }}>
                    <h2 style={{ fontSize:"clamp(1.4rem, 3.2vw, 2.2rem)", fontWeight:"700", lineHeight:1.2, letterSpacing:"-0.02em", color:"rgba(180,185,230,0.75)", margin:"0 auto", maxWidth:"600px" }}>
                        with AI Resume Builder
                    </h2>
                </div>

                {/* ══════ 3D ORB + RIPPLE STAGE ══════ */}
                <div className="hero-orb-stage" style={{ position:"relative", width:"340px", height:"270px", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10 }}>

                    {/* Ripple rings — ellipses on the "floor" plane */}
                    <div style={{ position:"absolute", bottom:"0px", left:"50%", transform:"translateX(-50%)", width:"200px", height:"60px", zIndex:2, pointerEvents:"none" }}>
                        {[0,1,2].map(i => (
                            <div key={i} className={`ripple-ring rr${i+1}`} style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(90,100,255,0.5)", background:"transparent" }} />
                        ))}
                    </div>

                    {/* Orb wrapper (floating) */}
                    <div className="hero-orb-wrap" style={{ position:"relative", zIndex:5 }}>

                        {/* Shadow on floor */}
                        <div style={{ position:"absolute", bottom:"-30px", left:"50%", transform:"translateX(-50%)", width:"180px", height:"30px", borderRadius:"50%", background:"radial-gradient(ellipse, rgba(40,50,200,0.5) 0%, transparent 70%)", filter:"blur(12px)" }} />

                        {/* ── The Glass Orb ── */}
                        <div className="hero-orb" style={{
                            width:"260px", height:"260px", borderRadius:"50%",
                            background:"radial-gradient(circle at 35% 28%, rgba(200,210,255,0.18) 0%, rgba(100,115,255,0.95) 28%, rgba(40,55,200,1) 55%, rgba(15,20,100,1) 80%, rgba(5,8,40,1) 100%)",
                            position:"relative", overflow:"visible"
                        }}>
                            {/* Main specular highlight */}
                            <div style={{ position:"absolute", top:"13%", left:"20%", width:"55px", height:"40px", borderRadius:"50%", background:"radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(200,210,255,0.5) 50%, transparent 100%)", filter:"blur(4px)", animation:"specularShimmer 4s ease-in-out infinite" }} />
                            {/* Secondary small flare */}
                            <div style={{ position:"absolute", top:"22%", left:"28%", width:"18px", height:"14px", borderRadius:"50%", background:"rgba(255,255,255,0.85)", filter:"blur(2px)" }} />
                            {/* Core glow inside */}
                            <div style={{ position:"absolute", top:"30%", left:"25%", width:"90px", height:"90px", borderRadius:"50%", background:"radial-gradient(circle, rgba(130,150,255,0.5) 0%, transparent 70%)", filter:"blur(10px)" }} />
                            {/* Bottom rim reflection */}
                            <div style={{ position:"absolute", bottom:"8%", right:"12%", width:"40px", height:"20px", borderRadius:"50%", background:"rgba(80,100,255,0.3)", filter:"blur(5px)", transform:"rotate(-20deg)" }} />
                            {/* Equator gloss ring */}
                            <div style={{ position:"absolute", top:"42%", left:"5%", right:"5%", height:"12px", borderRadius:"50%", background:"linear-gradient(90deg, transparent, rgba(180,200,255,0.12), rgba(255,255,255,0.08), rgba(180,200,255,0.12), transparent)", filter:"blur(2px)" }} />
                        </div>

                    </div>
                </div>

                {/* ── CTA below orb ── */}
                <div className="hero-text" style={{ animationDelay:"0.35s", marginTop:"20px", zIndex:10 }}>
                    <button
                        onClick={handleStartResume}
                        style={{ padding:"14px 36px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:"10px", color:"rgba(255,255,255,0.9)", fontWeight:"700", fontSize:"1rem", cursor:"pointer", backdropFilter:"blur(10px)", transition:"all 0.2s", letterSpacing:"-0.01em" }}
                        onMouseEnter={e => { e.currentTarget.style.background="rgba(99,102,241,0.25)"; e.currentTarget.style.borderColor="rgba(99,102,241,0.6)"; e.currentTarget.style.color="#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.18)"; e.currentTarget.style.color="rgba(255,255,255,0.9)"; }}
                    >
                        Build Resume Now
                    </button>
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
                                Join thousands of job seekers using Nexfolio to land interviews. Start for free now.
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
                        <p className="text-white-50 fs-5">Everything you need to know about Nexfolio's free AI resume builder.</p>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {[
                                {
                                    q: "Is Nexfolio really free to use?",
                                    a: "Yes! Nexfolio is 100% free. You can create a resume, choose from 18+ premium templates, generate AI content, and download your resume as a PDF — all without paying anything or entering a credit card.",
                                },
                                {
                                    q: "Are the resume templates ATS-friendly?",
                                    a: "All resume templates on Nexfolio are designed to be ATS (Applicant Tracking System) friendly. They use clean formatting, standard section headings, and readable fonts that pass recruiter screening software.",
                                },
                                {
                                    q: "How does the AI resume builder work?",
                                    a: "Nexfolio uses Google Gemini AI to generate professional resume content based on your job role, experience, and skills. Simply enter your details, click generate, review the content, and download your finished resume.",
                                },
                                {
                                    q: "Can I download my resume as a PDF?",
                                    a: "Yes! Once you've built your resume, you can download it as a high-quality PDF or PNG image with a single click. No watermarks, no subscriptions — completely free.",
                                },
                                {
                                    q: "Does Nexfolio work for freshers and students?",
                                    a: "Absolutely. Nexfolio is specifically designed for students, freshers, and entry-level job seekers. The AI helps you write professional resume content even if you have limited work experience.",
                                },
                                {
                                    q: "How many resume templates are available?",
                                    a: "Nexfolio offers 18+ professionally designed resume templates including Classic, Modern, Creative, Executive, Developer, Minimalist, Elegant, Navy Elegance, Emerald, Aurora, Midnight, Nordic, Crimson, and more.",
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
                            &copy; 2026 Nexfolio. All rights reserved.
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
