"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, ChevronDown, ArrowRight, Activity, Cpu } from "lucide-react";

const NAV_LINKS = [
    { label: "PDF to PNG", href: "/pdf-to-image" },
    { label: "PNG to PDF", href: "/image-to-pdf" },
    { label: "Merge PDF", href: "/merge" },
    { label: "Split PDF", href: "/split" },
    { label: "Compress PDF", href: "/compress" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);
    const isActive = (href) => pathname === href;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || menuOpen
                    ? "bg-[#08080c]/90 backdrop-blur-md border-b border-white/10 shadow-lg"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group text-decoration-none">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        <FileText className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="font-bold tracking-wider text-lg text-white font-space-grotesk">
                        CVGrid <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-semibold text-xs ml-1 uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">Convert</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-1.5">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-decoration-none ${
                                isActive(link.href)
                                    ? "text-white bg-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden lg:flex items-center gap-4">
                    <a
                        href="https://app.cvgrid.in"
                        className="text-xs font-semibold text-gray-400 hover:text-white transition-colors duration-200 text-decoration-none"
                    >
                        Back to App
                    </a>
                    <a
                        href="https://app.cvgrid.in/templates"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 hover:scale-102 hover:shadow-indigo-500/30 transition-all duration-200 text-decoration-none"
                    >
                        Build AI Resume <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {menuOpen && (
                <div className="lg:hidden bg-[#08080c] border-b border-white/10 px-6 py-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2">
                            Conversion Tools
                        </span>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-decoration-none ${
                                    isActive(link.href)
                                        ? "text-white bg-white/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="h-[1px] bg-white/5" />
                    <div className="flex flex-col gap-4">
                        <a
                            href="https://app.cvgrid.in"
                            className="px-3 py-2 text-center text-sm font-semibold text-gray-400 hover:text-white transition-colors text-decoration-none"
                        >
                            Back to CVGrid App
                        </a>
                        <a
                            href="https://app.cvgrid.in/templates"
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 text-decoration-none"
                        >
                            Build AI Resume <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
