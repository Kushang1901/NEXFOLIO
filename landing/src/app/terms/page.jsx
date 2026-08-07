"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Scale, Users, Ban, AlertTriangle, UserCheck, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    background-color: #050508 !important;
                    color: #dfe2ed !important;
                    font-family: var(--font-inter), sans-serif !important;
                }
                .glass-card {
                    background: rgba(13, 13, 22, 0.7) !important;
                    backdrop-filter: blur(16px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 16px;
                }
                .glow-circle {
                    position: absolute !important;
                    width: 500px !important;
                    height: 500px !important;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(5, 5, 8, 0) 70%) !important;
                    z-index: -1 !important;
                    filter: blur(50px) !important;
                    pointer-events: none !important;
                }
            ` }} />

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative flex-grow w-full">
                    <div className="glow-circle top-10 right-10"></div>
                    
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Main Card */}
                    <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <header className="border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-550/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                                <Scale size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Terms of Service</h1>
                            <p className="text-slate-400 text-sm">Last updated: August 7, 2026</p>
                        </header>

                        <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <UserCheck size={18} className="text-indigo-400" /> 1. Acceptance of Terms
                                </h2>
                                <p>
                                    By accessing or using CVGrid (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not use the Service. These terms apply to all visitors, users, and others who access the Service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
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
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
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
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
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

                            <section className="border-t border-white/10 pt-6">
                                <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>5. Updates to Terms</h2>
                                <p>
                                    We reserve the right to modify these terms at any time. Your continued use of CVGrid following any changes constitutes acceptance of the new Terms of Service.
                                </p>
                            </section>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
