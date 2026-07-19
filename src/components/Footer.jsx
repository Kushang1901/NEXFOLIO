"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <footer className="relative bg-[#09090f] w-full pt-20 pb-12 border-t border-[rgba(255,255,255,0.06)] text-[#e4e0f1] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
                {/* Branding Block */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <Link href="/" className="flex items-center gap-3 text-decoration-none group">
                        <img 
                            src="/logo.png" 
                            alt="CVGrid Logo" 
                            className="h-9 w-9 group-hover:rotate-12 transition-transform duration-300 object-contain" 
                        />
                        <span 
                            className="font-bold tracking-wider text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#b6c4ff]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            CVGrid
                        </span>
                    </Link>
                    <p className="text-[#c7c4d7] text-sm md:text-base leading-relaxed max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        The intelligent career platform for the modern era. Build, optimize, and export ATS-compliant resumes powered by advanced neural insights.
                    </p>
                    
                    {/* Developer Credits */}
                    <div className="flex items-center mt-2">
                        <a 
                            href="https://kushangacharya.vercel.app" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#c0c1ff]/40 text-[#c7c4d7] hover:text-white transition-all duration-300 text-decoration-none group"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0c1ff] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c0c1ff]"></span>
                            </span>
                            <span className="text-xs font-medium tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                                Designed &amp; Developed by <span className="font-semibold text-[#c0c1ff] group-hover:underline transition-colors">Kushang Acharya</span>
                            </span>
                        </a>
                    </div>
                </div>

                {/* Navigation Columns */}
                <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full">
                    {/* Col 1 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Product</h4>
                        <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/templates" style={{ fontFamily: "Inter, sans-serif" }}>
                            Resume Templates
                        </Link>
                        <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/ats-checker" style={{ fontFamily: "Inter, sans-serif" }}>
                            ATS Scanner
                        </Link>
                        <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/templates" style={{ fontFamily: "Inter, sans-serif" }}>
                            Pricing Plans
                        </Link>
                    </div>

                    {/* Col 2 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Support</h4>
                        <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/contact" style={{ fontFamily: "Inter, sans-serif" }}>
                            Help Center
                        </Link>
                        <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/contact" style={{ fontFamily: "Inter, sans-serif" }}>
                            Contact Support
                        </Link>
                        <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none text-sm py-1" href="/terms" style={{ fontFamily: "Inter, sans-serif" }}>
                            Terms of Service
                        </Link>
                    </div>

                    {/* Col 3: Social & Media */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Connect</h4>
                        <div className="flex gap-3">
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c7c4d7] hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c7c4d7] hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#c7c4d7] hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer Section */}
            <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row justify-between items-center gap-6 text-[#c7c4d7] text-xs relative z-10">
                {/* Back to Top */}
                <div className="flex items-center gap-3 order-2 md:order-1">
                    <button 
                        onClick={scrollToTop} 
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#c0c1ff]/30 flex items-center justify-center text-[#c0c1ff] hover:bg-[#c0c1ff]/15 transition-all duration-300 group shadow-md"
                        title="Back to Top"
                    >
                        <ArrowUp size={20} className="transition-transform duration-300 group-hover:-translate-y-1" />
                    </button>
                    <span className="font-medium tracking-wide">© 2026 CVGrid Career Architect.</span>
                </div>
                
                {/* Right side Policy Links */}
                <div className="flex gap-6 font-medium order-1 md:order-2">
                    <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none" href="/privacy">
                        Privacy Policy
                    </Link>
                    <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none" href="/terms">
                        Terms of Service
                    </Link>
                    <Link className="text-[#c7c4d7] hover:text-white transition-colors duration-200 text-decoration-none" href="/contact">
                        Contact Support
                    </Link>
                </div>
            </div>
        </footer>
    );
}
