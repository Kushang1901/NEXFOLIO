"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Sparkles, Trophy, Users, Award, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function AboutUs() {
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
                .grid-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #818cf8;
                }
            ` }} />

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative flex-grow w-full">
                    <div className="glow-circle top-10 left-10"></div>
                    <div className="glow-circle bottom-10 right-10"></div>
                    
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Main Title Hero */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-450/10 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">Our Story & Mission</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                            Democratizing the Career Search with AI
                        </h1>
                        <p className="text-slate-400 mt-4 leading-relaxed text-base md:text-lg">
                            CVGrid is a modern, intelligent career platform designed to help students, freshers, and professionals build ATS-friendly resumes and cover letters in minutes.
                        </p>
                    </div>

                    {/* The Problem & Our Solution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="glass-card p-8 flex flex-col gap-4">
                            <div className="grid-icon-box">
                                <Trophy size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Why We Started</h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                Traditional online resume makers are often complex and expensive. Many hook users with 'free' trials, only to charge high monthly fees ($20+/month) or add watermarks when downloading. We believed there had to be a better, fairer way. We built CVGrid to provide clean, watermark-free PDF resumes for free, with premium styling upgrades available for a single, small one-time payment.
                            </p>
                        </div>

                        <div className="glass-card p-8 flex flex-col gap-4">
                            <div className="grid-icon-box" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                                <Sparkles size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Our AI Philosophy</h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                                AI shouldn't write your entire profile; it should help you polish and highlight your actual accomplishments. Our integrated tools act as a collaborative writer. We guide you to write action-oriented experience points, identify keyword gaps using our ATS scanner, and prepare tailored mock questions for your job interview.
                            </p>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="glass-card p-8 md:p-12 mb-16">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Our Core Values</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col gap-3">
                                <div className="text-indigo-400 font-extrabold text-lg flex items-center gap-2">
                                    <Award size={18} /> Accessibility First
                                </div>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                    We believe clean, professional career tools should be accessible to everyone, regardless of their budget. We maintain a robust free-forever tier.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="text-indigo-400 font-extrabold text-lg flex items-center gap-2">
                                    <ShieldCheck size={18} /> Data Privacy
                                </div>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                    Your personal and work histories belong to you. We secure your details with modern databases, encryption, and provide immediate, complete deletion controls.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="text-indigo-400 font-extrabold text-lg flex items-center gap-2">
                                    <Users size={18} /> Continuous Growth
                                </div>
                                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                    We consistently update our templates, resume parser engines, and AI algorithms to align with modern hiring standards and recruiter expectations.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-r from-indigo-950/20 via-transparent to-indigo-950/20">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Ready to Build Your Professional CV?</h2>
                        <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm md:text-base">
                            Create your ATS-friendly resume for free in minutes. Choose from our 18+ designer layouts and export a clean PDF.
                        </p>
                        <a 
                            href="https://app.cvgrid.in/signup" 
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer text-sm"
                        >
                            Get Started for Free <ArrowRight size={16} />
                        </a>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
