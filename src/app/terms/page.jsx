"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Script from "next/script";
import { Scale, Users, Ban, AlertTriangle, UserCheck, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    const [tailwindLoaded, setTailwindLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.tailwind) {
            setTailwindLoaded(true);
        }
    }, []);

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
                                "primary": "#b6c4ff",
                                "on-surface": "#dfe2ed",
                                "background": "#0f131b",
                                "surface-container-low": "#181c23",
                                "surface-variant": "#31353d",
                                "secondary": "#ffb3b0",
                                "surface-container-high": "#262a32",
                                "outline": "#8e90a0",
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
                }
                .glass-card {
                    background: rgba(28, 32, 39, 0.7) !important;
                    backdrop-filter: blur(16px) !important;
                    border: 1px solid rgba(142, 144, 160, 0.25) !important;
                    border-radius: 16px;
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

                <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative flex-grow w-full">
                    <div className="glow-circle top-10 right-10"></div>
                    
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Main Card */}
                    <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <header className="border-b border-outline-variant/30 pb-8 mb-8 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                                <Scale size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-3 tracking-tight">Terms of Service</h1>
                            <p className="text-on-surface-variant text-sm">Last updated: July 5, 2026</p>
                        </header>

                        <div className="space-y-8 text-on-surface-variant/90 leading-relaxed text-sm md:text-base">
                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <UserCheck size={18} className="text-indigo-400" /> 1. Acceptance of Terms
                                </h2>
                                <p>
                                    By accessing or using CVGrid (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use the Service. These terms apply to all visitors, users, and others who access the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <Users size={18} className="text-emerald-400" /> 2. User Accounts
                                </h2>
                                <p className="mb-3">
                                    To access certain features (like saving resumes to the cloud), you must create an account. You are responsible for:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Maintaining the confidentiality of your account credentials.</li>
                                    <li>All activities that occur under your account.</li>
                                    <li>Providing accurate, current, and complete profile information.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <Ban size={18} className="text-pink-400" /> 3. Acceptable Use Policy
                                </h2>
                                <p className="mb-3">
                                    You agree not to use CVGrid to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Upload or generate fraudulent, misleading, or plagiarized resume content.</li>
                                    <li>Infect the Service with viruses, malware, or automate builders using bot scrapers.</li>
                                    <li>Reverse engineer, copy, or distribute code assets from CVGrid without prior permission.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-amber-400" /> 4. Disclaimer & Limitation of Liability
                                </h2>
                                <p className="mb-3">
                                    CVGrid is provided on an "AS IS" and "AS AVAILABLE" basis:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>We do not guarantee job callback rates, recruiter selections, or hiring results from using our AI resume suggestions or templates.</li>
                                    <li>CVGrid shall not be held liable for any data loss, service interruptions, or employment outcomes resulting from using the Service.</li>
                                </ul>
                            </section>

                            <section className="border-t border-outline-variant/30 pt-6">
                                <h2 className="text-lg font-bold text-on-surface mb-2">5. Updates to Terms</h2>
                                <p>
                                    We reserve the right to modify these terms at any time. Your continued use of CVGrid following any changes constitutes acceptance of the new Terms of Service.
                                </p>
                            </section>
                        </div>
                    </div>
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
