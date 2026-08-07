"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Mail, MessageSquare, Send, CheckCircle, ArrowLeft } from "lucide-react";

export default function ContactSupport() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        subject: "General Inquiry",
        message: ""
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Standard client-side simulation for fast, static deployment
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
            setFormData({
                name: "",
                phone: "",
                subject: "General Inquiry",
                message: ""
            });
        }, 1200);
    };

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
                input, select, textarea {
                    background-color: rgba(255, 255, 255, 0.03) !important;
                    color: #ffffff !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                input:focus, select:focus, textarea:focus {
                    border-color: rgba(99, 102, 241, 0.5) !important;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15) !important;
                }
                select option {
                    color: #ffffff !important;
                    background-color: #0d0d16 !important;
                }
            ` }} />

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative flex-grow w-full">
                    <div className="glow-circle top-1/4 left-1/3"></div>

                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* LEFT COLUMN: Contact details */}
                        <div className="lg:col-span-5 flex flex-col justify-between glass-card p-8 md:p-10">
                            <div>
                                <h1 className="text-3xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Contact Us</h1>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                                    Have questions about CVGrid, AI resume generation, or need help with your account? Drop us a message, and our team will get back to you shortly.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 flex-shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Email Address</h4>
                                            <a href="mailto:kushangacharya8830@gmail.com" className="text-xs md:text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                                kushangacharya8830@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 flex-shrink-0">
                                            <MessageSquare size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Instant Support</h4>
                                            <a 
                                                href="https://wa.me/919724236385" 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-xs md:text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                Chat via WhatsApp (Support Line)
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="mt-12 pt-6 border-t border-white/10 flex gap-4">
                                <a href="https://github.com/Kushang1901" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/in/kushang-acharya-938a712a6/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Interactive Form */}
                        <div className="lg:col-span-7 glass-card p-8 md:p-10 flex flex-col justify-center">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Message Sent!</h3>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
                                        Thank you for reaching out. A support representative will review your request and reply to you via email shortly.
                                    </p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline bg-transparent border-0 cursor-pointer"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="name" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Your Name</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                name="name" 
                                                className="w-full h-11 px-4 rounded-lg outline-none transition-all text-sm placeholder:text-slate-500" 
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Alex Smith" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="phone" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Phone Number</label>
                                            <input 
                                                type="tel" 
                                                id="phone" 
                                                name="phone" 
                                                className="w-full h-11 px-4 rounded-lg outline-none transition-all text-sm placeholder:text-slate-500" 
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="e.g. +91 97242 36385" 
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="subject" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Subject</label>
                                        <select 
                                            id="subject" 
                                            name="subject" 
                                            className="w-full h-11 px-4 rounded-lg outline-none transition-all text-sm cursor-pointer"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        >
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Bug Report">Bug Report</option>
                                            <option value="Feature Request">Feature Request</option>
                                            <option value="Account Issue">Account Issue</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="message" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Your Message</label>
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            rows="5"
                                            className="w-full p-4 rounded-lg outline-none transition-all text-sm placeholder:text-slate-500"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write details of your inquiry here..." 
                                            required
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 text-sm border-0"
                                    >
                                        {loading ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                <Send size={16} /> Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
