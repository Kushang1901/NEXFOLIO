"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Script from "next/script";
import { Shield, Eye, Lock, FileText, ArrowLeft, Cpu } from "lucide-react";

export default function PrivacyPolicy() {
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
                    <div className="glow-circle top-10 left-10"></div>
                    
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Main Card */}
                    <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <header className="border-b border-outline-variant/30 pb-8 mb-8 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                                <Shield size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-3 tracking-tight">Privacy Policy</h1>
                            <p className="text-on-surface-variant text-sm">Last updated: July 5, 2026</p>
                        </header>

                        <div className="space-y-8 text-on-surface-variant/90 leading-relaxed text-sm md:text-base">
                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <Eye size={18} className="text-indigo-400" /> 1. Information We Collect
                                </h2>
                                <p className="mb-3">
                                    We collect information to provide a better, more customized resume building experience. This includes:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Account Information:</strong> When you sign up, we collect your email address, name, and profile picture (if using Google Authentication).</li>
                                    <li><strong>Resume Data:</strong> Any information you enter while building your resume (such as contact info, job history, education, skills, and projects).</li>
                                    <li><strong>Uploaded PDFs:</strong> If you upload a PDF resume for parsing, we temporarily process it to extract text content.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <Lock size={18} className="text-emerald-400" /> 2. How We Protect Your Data
                                </h2>
                                <p className="mb-3">
                                    Your data security is our top priority. We implement modern, high-grade security practices to keep your account safe:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>We use secure, SSL-encrypted connections (HTTPS) for all data transfers.</li>
                                    <li>Credentials and user information are stored in secure databases protected by access control policies.</li>
                                    <li>We use Firebase Authentication to securely manage logins without directly storing your plaintext password.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <Cpu size={18} className="text-pink-400" /> 3. How We Use Your Information
                                </h2>
                                <p className="mb-3">
                                    The information we collect is strictly used to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Enable you to edit, save, and access your resumes from any device.</li>
                                    <li>Process your inputs with our integrated AI writing models (such as generating resume summaries and experience points).</li>
                                    <li>Improve our resume templates, parser accuracy, and user experience.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
                                    <FileText size={18} className="text-amber-400" /> 4. Data Retention & Deletion
                                </h2>
                                <p>
                                    You have full control over your data. You can edit or delete any saved resume directly from your dashboard. If you wish to delete your account permanently, you can do so in your **Profile Page**. This will instantly and irreversibly erase all your personal data, credentials, and saved resumes from our servers.
                                </p>
                            </section>

                            <section className="border-t border-outline-variant/30 pt-6">
                                <h2 className="text-lg font-bold text-on-surface mb-2">5. Contact Support</h2>
                                <p>
                                    If you have any questions or concerns regarding this Privacy Policy, feel free to visit our <Link href="/contact" className="text-primary hover:underline">Contact Support</Link> page.
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
