"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Shield, Eye, Lock, FileText, ArrowLeft, Cpu } from "lucide-react";

export default function PrivacyPolicy() {
    const [tailwindLoaded, setTailwindLoaded] = useState(true);

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
                    <div className="glow-circle top-10 left-10"></div>
                    
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Main Card */}
                    <div className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <header className="border-b border-white/10 pb-8 mb-8 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-xl bg-indigo-550/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                                <Shield size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Privacy Policy</h1>
                            <p className="text-slate-400 text-sm">Last updated: August 7, 2026</p>
                        </header>

                        <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <Eye size={18} className="text-indigo-400" /> 1. Information We Collect
                                </h2>
                                <p className="mb-3">
                                    We collect information to provide a better, more customized resume building experience. This includes:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Account Information:</strong> When you sign up on our app, we collect your email address, name, and profile picture (if using Google Authentication).</li>
                                    <li><strong>Resume Data:</strong> Any information you enter while building your resume (such as contact info, job history, education, skills, and projects).</li>
                                    <li><strong>Uploaded PDFs:</strong> If you upload a PDF resume for parsing, we temporarily process it to extract text content.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <Lock size={18} className="text-emerald-400" /> 2. How We Protect Your Data
                                </h2>
                                <p className="mb-3">
                                    Your data security is our top priority. We implement modern, high-grade security practices to keep your account safe:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>We use secure, SSL-encrypted connections (HTTPS) for all data transfers.</li>
                                    <li>Credentials and user information are stored in secure databases protected by access control policies.</li>
                                    <li>We use modern Authentication systems to securely manage logins without directly storing your plaintext password.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
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
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <FileText size={18} className="text-amber-400" /> 4. Data Retention & Deletion
                                </h2>
                                <p>
                                    You have full control over your data. You can edit or delete any saved resume directly from your dashboard. If you wish to delete your account permanently, you can do so in your Profile Page. This will instantly and irreversibly erase all your personal data, credentials, and saved resumes from our servers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <Shield size={18} className="text-blue-400" /> 5. Google AdSense & Third-Party Advertising
                                </h2>
                                <p className="mb-3">
                                    We use third-party advertising companies, including Google AdSense, to serve advertisements when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mb-3">
                                    <li>
                                        <strong>Google DoubleClick DART Cookies:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.
                                    </li>
                                    <li>
                                        <strong>Opt-Out Options:</strong> Users may opt out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of third-party vendors' use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">aboutads.info</a>.
                                    </li>
                                    <li>
                                        <strong>Third-Party Ad Networks:</strong> Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on CVGrid. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize advertising content.
                                    </li>
                                </ul>
                                <p className="text-xs text-slate-400">
                                    Note that CVGrid has no access to or control over cookies that are used by third-party advertisers.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <Lock size={18} className="text-purple-400" /> 6. Cookies and Tracking Technologies
                                </h2>
                                <p className="mb-3">
                                    Like any other website, CVGrid uses cookies to record session information, user-specific preferences, and track visitor behavior to enhance your user experience. You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
                                </p>
                            </section>

                            <section className="border-t border-white/10 pt-6">
                                <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>7. Contact Support</h2>
                                <p>
                                    If you have any questions or concerns regarding this Privacy Policy or our advertising practices, feel free to visit our <Link href="/contact" className="text-indigo-400 hover:underline">Contact Us</Link> page.
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
