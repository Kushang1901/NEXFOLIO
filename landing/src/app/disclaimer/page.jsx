"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AlertCircle, CheckCircle2, Bot, Briefcase, ExternalLink, ArrowLeft } from "lucide-react";

export default function Disclaimer() {
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
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                                <AlertCircle size={24} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Disclaimer</h1>
                            <p className="text-slate-400 text-sm">Last updated: August 20, 2026</p>
                        </header>

                        <div className="space-y-8 text-slate-300 leading-relaxed text-sm md:text-base">
                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <Briefcase size={18} className="text-indigo-400" /> 1. Career & Educational Information
                                </h2>
                                <p>
                                    All information, templates, articles, guides, and tools provided on CVGrid (https://cvgrid.in) are published in good faith and for general informational, educational, and career preparation purposes only. While we strive to provide modern industry best practices and ATS-friendly formatting, CVGrid does not guarantee employment, job interviews, or hiring offers as a result of using our services or resources.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <Bot size={18} className="text-emerald-400" /> 2. AI-Generated Content Notice
                                </h2>
                                <p className="mb-3">
                                    CVGrid integrates artificial intelligence assistance to help users brainstorm summaries, rephrase experience bullet points, and suggest industry skills. Users acknowledge that:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>AI-generated text is advisory and must be reviewed, verified, and approved by the user prior to submitting any application.</li>
                                    <li>You are solely responsible for ensuring the accuracy, honesty, and truthfulness of all claims, metrics, credentials, and achievements stated in your resume.</li>
                                    <li>CVGrid does not verify user-submitted credentials or assume liability for inaccuracies in resumes generated using our platform.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <CheckCircle2 size={18} className="text-purple-400" /> 3. ATS Scores and Algorithm Simulators
                                </h2>
                                <p>
                                    Our ATS scoring algorithms and keyword match tools provide simulated estimates based on general parsing heuristics. Every hiring company and recruiting agency configures their proprietary Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo, iCIMS) with unique parameters and weighting. A high score on CVGrid does not guarantee a resume will pass every third-party employer filter.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    <ExternalLink size={18} className="text-pink-400" /> 4. External Links & Third-Party Advertisers
                                </h2>
                                <p>
                                    Our website may contain links to external sites or display advertisements served by third-party ad networks, including Google AdSense. While we strive to provide quality links, we have no control over the content, privacy policies, or practices of external websites. The inclusion of any advertisement or external link does not imply endorsement by CVGrid.
                                </p>
                            </section>

                            <section className="border-t border-white/10 pt-6">
                                <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>5. Contact Us</h2>
                                <p>
                                    If you require any more information or have questions about our site's disclaimer, please feel free to reach out to us via our <Link href="/contact" className="text-indigo-400 hover:underline">Contact page</Link> or email us at <a href="mailto:kushangacharya8830@gmail.com" className="text-indigo-400 hover:underline">kushangacharya8830@gmail.com</a>.
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
