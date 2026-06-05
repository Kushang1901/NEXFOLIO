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

            {/* Hero Section */}
            <header className="bg-black py-5">
                <div className="container py-5">
                    <div className="row justify-content-center text-center py-5">
                        <div className="col-lg-8">
                            <div className="text-primary fw-bold text-uppercase mb-2" style={{ letterSpacing: "0.15em", fontSize: "0.95rem" }}>
                                ResumeCraft AI
                            </div>
                            <h1
                                className="display-2 fw-bold mb-4"
                                style={{ letterSpacing: '-0.02em', lineHeight: "1.2" }}
                            >
                                Free Resume Maker & <br className="d-none d-md-inline" /> AI Resume Builder
                            </h1>
                            <p className="lead fs-4 text-white-50 mb-5">
                                Create professional, ATS-friendly resumes instantly with our free AI resume maker. Leverage advanced artificial intelligence to craft compelling resume content that stands out to top recruiters.
                            </p>

                            <button
                                onClick={handleStartResume}
                                className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
                                style={{
                                    fontSize: "1.1rem",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 15px rgba(13, 110, 253, 0.4)"
                                }}
                            >
                                Build Resume Now
                            </button>

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
                                Join thousands of job seekers using ResumeCraft AI to land interviews. Start for free now.
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

            {/* Footer */}
            <footer className="bg-black border-top border-secondary py-4">
                <div className="container">
                    <div className="text-center text-white-50">
                        <p className="mb-1">
                            &copy; 2026 ResumeCraft AI. All rights reserved.
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
