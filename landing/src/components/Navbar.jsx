"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight, Sparkles, Target, Palette } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled ? "bg-[#08080c]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
        }`}>
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                        C
                    </div>
                    <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-white to-[#b6c4ff] bg-clip-text text-transparent" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                        CVGRID
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#c7c4d7]">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    <a href="https://app.cvgrid.in/templates" className="hover:text-white transition-colors">Templates</a>
                    <a href="https://app.cvgrid.in/ats-checker" className="hover:text-white transition-colors">ATS Checker</a>
                </nav>

                {/* Action Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <a 
                        href="https://app.cvgrid.in/login" 
                        className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors px-4 py-2"
                    >
                        Sign In
                    </a>
                    <a 
                        href="https://app.cvgrid.in/signup" 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="md:hidden p-2 text-[#c7c4d7] hover:text-white transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#08080c] border-b border-white/5 px-6 py-8 flex flex-col gap-6 text-base font-semibold shadow-2xl">
                    <a href="#features" onClick={() => setIsOpen(false)} className="text-[#c7c4d7] hover:text-white">Features</a>
                    <a href="#faq" onClick={() => setIsOpen(false)} className="text-[#c7c4d7] hover:text-white">FAQ</a>
                    <a href="https://app.cvgrid.in/templates" className="text-[#c7c4d7] hover:text-white">Templates</a>
                    <a href="https://app.cvgrid.in/ats-checker" className="text-[#c7c4d7] hover:text-white">ATS Checker</a>
                    <hr className="border-white/5 my-2" />
                    <div className="flex flex-col gap-4">
                        <a 
                            href="https://app.cvgrid.in/login" 
                            className="text-center text-[#c7c4d7] hover:text-white py-3 rounded-xl border border-white/10"
                        >
                            Sign In
                        </a>
                        <a 
                            href="https://app.cvgrid.in/signup" 
                            className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl shadow-lg"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
