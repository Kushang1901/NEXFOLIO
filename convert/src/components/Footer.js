"use client";

import React from "react";
import { ArrowUp, Github } from "lucide-react";

export default function Footer() {
    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <footer className="relative bg-[#08080c] w-full pt-20 pb-12 border-t border-white/5 text-[#e4e0f1] overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
                {/* Branding Block */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <a href="https://cvgrid.in" className="flex items-center gap-3 text-decoration-none group">
                        <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                            <span className="font-bold text-white text-base">CV</span>
                        </span>
                        <span className="font-bold tracking-wider text-2xl text-white font-space-grotesk">
                            CVGrid
                        </span>
                    </a>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm">
                        The intelligent career platform for the modern era. Convert, compress, and merge documents completely in-browser with 100% privacy.
                    </p>

                    {/* Developer Credits */}
                    <div className="flex items-center mt-2">
                        <a
                            href="https://kushangacharya.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/40 text-gray-300 hover:text-white transition-all duration-300 text-decoration-none group"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
                            </span>
                            <span className="text-xs font-medium tracking-wide">
                                Designed &amp; Developed by <span className="font-semibold text-indigo-300 group-hover:underline">Kushang Acharya</span>
                            </span>
                        </a>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-2.5 mt-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all duration-300 select-none">
                            <span className="text-[11px] font-medium tracking-wide">
                                🔒 100% Private (Local Conversion)
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all duration-300 select-none">
                            <span className="text-[11px] font-medium tracking-wide">
                                ⚡ Zero Upload Waiting
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all duration-300 select-none">
                            <span className="text-[11px] font-medium tracking-wide">
                                📄 Recruiter &amp; ATS Friendly
                            </span>
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-2 font-space-grotesk">Utility Tools</h3>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/pdf-to-image">PDF to PNG</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/image-to-pdf">PNG to PDF</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/merge">Merge PDF</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/split">Split PDF</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/compress">Compress PDF</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-2 font-space-grotesk">Product Suite</h3>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://cvgrid.in">Home</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://app.cvgrid.in/templates">Resume Templates</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://app.cvgrid.in/cover-letter">AI Cover Letter</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://app.cvgrid.in/ats-checker">ATS Checker</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://app.cvgrid.in/ai-tools">AI Career Hub</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-2 font-space-grotesk">Support</h3>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://docs.cvgrid.in">Docs</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://cvgrid.in/contact">Contact Us</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://cvgrid.in/privacy">Privacy Policy</a>
                        <a className="text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="https://cvgrid.in/terms">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} CVGrid. All rights reserved.</p>
                <button
                    onClick={scrollToTop}
                    className="flex items-center gap-1 bg-white/5 border border-white/10 hover:border-indigo-400/40 text-gray-400 hover:text-white px-3 py-2 rounded-xl transition-all duration-300"
                >
                    Back to top <ArrowUp className="w-3.5 h-3.5" />
                </button>
            </div>
        </footer>
    );
}
