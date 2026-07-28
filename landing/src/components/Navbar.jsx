"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Palette, FileSignature, Target, Sparkles, FileText, X, ArrowRight, ChevronDown, User, Briefcase, KeyRound, HelpCircle, Crown, Share2 } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "https://cvgrid.in" },
    { label: "Templates", href: "https://app.cvgrid.in/templates" },
    { label: "AI Cover Letter", href: "https://app.cvgrid.in/cover-letter" },
    { label: "ATS Checker", href: "https://app.cvgrid.in/ats-checker" },
    { label: "AI Tools", href: "https://app.cvgrid.in/ai-tools" },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileTemplatesOpen, setMobileTemplatesOpen] = useState(false);
    const [mobileAiOpen, setMobileAiOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    const handleCategoryClick = (category) => {
        if (typeof window !== "undefined") {
            const event = new CustomEvent("categoryChange", { detail: category });
            window.dispatchEvent(event);
        }
    };

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.body.style.overflow = menuOpen ? "hidden" : "";
        }
        return () => { if (typeof document !== "undefined") document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Close drawer on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            if (menuOpen) {
                setHidden(false);
                return;
            }
            
            // Do not hide if cursor is hovering over the navbar
            const isNavbarHovered = document.querySelector('nav:hover') !== null;
            if (isNavbarHovered) {
                setHidden(false);
                return;
            }
            
            const currentScrollY = window.scrollY;
            const diff = currentScrollY - lastScrollY;
            
            if (currentScrollY <= 10) {
                setHidden(false);
            } else if (Math.abs(diff) > 5) {
                if (diff > 0) {
                    setHidden(true);
                } else {
                    setHidden(false);
                }
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);
    const isActive = (href) => {
        if (href === "https://cvgrid.in" && pathname === "/") return true;
        return false;
    };

    return (
        <>
            {/* ── Top Navbar ── */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 1000,
                background: "rgba(8, 8, 12, 0.85)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.4)",
                transform: hidden ? "translateY(-100%)" : "translateY(0)",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease",
            }}>
                <div style={{
                    maxWidth: "1280px", margin: "0 auto",
                    padding: "0 24px",
                    display: "flex", alignItems: "center",
                    height: "64px", gap: "32px",
                }}>
                    {/* LOGO */}
                    <a href="https://cvgrid.in" onClick={closeMenu} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <img src="/logo.png" alt="CVGrid Logo" style={{ height: "32px", width: "32px" }} />
                        <span style={{
                            fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: "700",
                            letterSpacing: "0.08em",
                            background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            fontSize: "1.3rem",
                        }}>CVGRID</span>
                    </a>

                    {/* Divider */}
                    <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} className="hidden lg:block" />

                    {/* ── Desktop: Left Nav Links ── */}
                    <div className="hidden lg:flex" style={{ gap: "4px", flex: 1, height: "100%", alignItems: "stretch", alignSelf: "stretch" }}>
                        {NAV_LINKS.map((link) => {
                            if (link.label === "Templates") {
                                return (
                                    <div
                                        key={link.href}
                                        className="nav-item-wrapper"
                                    >
                                        <a href={link.href} className={`nav-link-item ${isActive(link.href) ? 'active' : ''}`}>
                                            {link.label}
                                            <ChevronDown size={14} className="chevron-icon" />
                                        </a>

                                        {/* MEGA DROPDOWN */}
                                        <div className="mega-dropdown-menu">
                                                <div style={megaDropdownContainerStyle}>
                                                    {/* Left Column: Grid */}
                                                    <div>
                                                        <h4 style={megaDropdownTitleStyle}>Resume Templates</h4>
                                                        <div style={megaDropdownGridStyle}>
                                                            
                                                            {/* ATS Friendly */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates?category=professional" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#3b82f6")}>
                                                                    <Target size={18} color="#60a5fa" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        ATS Friendly 
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Optimized layouts built to pass screening software.</div>
                                                                </div>
                                                            </a>

                                                            {/* Graduate */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates?category=minimalist" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#10b981")}>
                                                                    <FileSignature size={18} color="#34d399" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Graduate / Starter
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Showcase academic milestones and internships.</div>
                                                                </div>
                                                            </a>

                                                            {/* Modern */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates?category=creative" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#ec4899")}>
                                                                    <Palette size={18} color="#f472b6" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Modern & Creative
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Asymmetrical and design-forward layouts.</div>
                                                                </div>
                                                            </a>

                                                            {/* Professional */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates?category=professional" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#6366f1")}>
                                                                    <FileText size={18} color="#818cf8" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Professional
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Recruiter-approved templates for business roles.</div>
                                                                </div>
                                                            </a>

                                                            {/* Simple */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates?category=minimalist" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#6b7280")}>
                                                                    <Home size={18} color="#9ca3af" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Simple & Clean
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Clean typography with traditional framing.</div>
                                                                </div>
                                                            </a>

                                                            {/* Tech / Monospace */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates?category=tech" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#f59e0b")}>
                                                                    <Sparkles size={18} color="#fbbf24" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Developer / Tech
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Monospace and terminal formats for coders.</div>
                                                                </div>
                                                            </a>

                                                        </div>
                                                    </div>

                                                    {/* Right Column: Actions */}
                                                    <div style={sidebarContainerStyle}>
                                                        <h4 style={sidebarHeaderStyle}>Quick Builder Access</h4>
                                                        
                                                        <a href="https://app.cvgrid.in/builder" onClick={closeMenu} style={sidebarLinkCardStyle}
                                                            onMouseEnter={e => {
                                                                e.currentTarget.style.background = "rgba(111, 157, 255, 0.06)";
                                                                e.currentTarget.style.borderColor = "rgba(111, 157, 255, 0.2)";
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#6f9dff", display: "flex", alignItems: "center", gap: "6px" }}>
                                                                Resume Builder <ArrowRight size={14} />
                                                            </div>
                                                            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "4px", lineHeight: "1.4" }}>
                                                                Build powerful resumes in 5 minutes with real-time editing.
                                                            </div>
                                                        </a>

                                                        <a href="https://app.cvgrid.in/cover-letter" onClick={closeMenu} style={{ ...sidebarLinkCardStyle, marginTop: "12px" }}
                                                            onMouseEnter={e => {
                                                                e.currentTarget.style.background = "rgba(167, 139, 250, 0.06)";
                                                                e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.2)";
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#a78bfa", display: "flex", alignItems: "center", gap: "6px" }}>
                                                                AI Cover Letter <ArrowRight size={14} />
                                                            </div>
                                                            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "4px", lineHeight: "1.4" }}>
                                                                Write personalized and targeted cover letters in seconds.
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                );
                            }
                            if (link.label === "AI Tools") {
                                return (
                                    <div
                                        key={link.href}
                                        className="nav-item-wrapper"
                                    >
                                        <a href={link.href} className={`nav-link-item ${isActive(link.href) ? 'active' : ''}`}>
                                            {link.label}
                                            <ChevronDown size={14} className="chevron-icon" />
                                        </a>

                                        {/* AI TOOLS MEGA DROPDOWN */}
                                        <div className="mega-dropdown-menu">
                                                <div style={megaDropdownContainerStyle}>
                                                    {/* Left Column: Grid */}
                                                    <div>
                                                        <h4 style={aiMegaDropdownTitleStyle}>AI Career Suite</h4>
                                                        <div style={megaDropdownGridStyle}>
                                                            
                                                            {/* AI Resume Builder */}
                                                            <a 
                                                                href="https://app.cvgrid.in/templates" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#6366f1")}>
                                                                    <Sparkles size={18} color="#818cf8" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        AI Resume Builder
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Generate profiles, summaries, and achievements with AI.</div>
                                                                </div>
                                                            </a>

                                                            {/* Match Score Checker */}
                                                            <a 
                                                                href="https://app.cvgrid.in/ai-tools/match-score" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#3b82f6")}>
                                                                    <Target size={18} color="#60a5fa" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Match Score Checker
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Calculate overall ATS job description alignment and gaps.</div>
                                                                </div>
                                                            </a>

                                                            {/* Keyword Optimizer */}
                                                            <a 
                                                                href="https://app.cvgrid.in/ai-tools/keyword-optimizer" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#ec4899")}>
                                                                    <KeyRound size={18} color="#f472b6" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Keyword Optimizer
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Find missing ATS terms and auto-inject them into resumes.</div>
                                                                </div>
                                                            </a>

                                                            {/* Job Description Analyzer */}
                                                            <a 
                                                                href="https://app.cvgrid.in/ai-tools/job-analyzer" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#10b981")}>
                                                                    <Briefcase size={18} color="#34d399" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Job Post Parser
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Extract required experience, tech stack, and responsibilities.</div>
                                                                </div>
                                                            </a>

                                                            {/* AI Interview Prep */}
                                                            <a 
                                                                href="https://app.cvgrid.in/ai-tools/interview-generator" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#f59e0b")}>
                                                                    <HelpCircle size={18} color="#fbbf24" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Interview Q&A Prep
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Generate tailored mock interview questions with answers.</div>
                                                                </div>
                                                            </a>

                                                            {/* Portfolio Builder */}
                                                            <a 
                                                                href="https://app.cvgrid.in/ai-tools/portfolio-builder" 
                                                                onClick={closeMenu}
                                                                style={dropdownCardStyle}
                                                                onMouseEnter={e => {
                                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(4px)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "1";
                                                                }}
                                                                onMouseLeave={e => {
                                                                    e.currentTarget.style.background = "transparent";
                                                                    e.currentTarget.style.borderColor = "transparent";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.transform = "translateX(0)";
                                                                    e.currentTarget.querySelector(".arrow-icon").style.opacity = "0.5";
                                                                }}
                                                            >
                                                                <div style={iconContainerStyle("#fb7185")}>
                                                                    <Crown size={18} color="#fda4af" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Portfolio Builder
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Deploy responsive, beautiful, custom domain developer websites.</div>
                                                                </div>
                                                            </a>

                                                        </div>
                                                    </div>

                                                    {/* Right Column: Actions */}
                                                    <div style={sidebarContainerStyle}>
                                                        <h4 style={sidebarHeaderStyle}>Interactive Career Hub</h4>
                                                        
                                                        <a href="https://app.cvgrid.in/ai-tools/resume-sharing" onClick={closeMenu} style={sidebarLinkCardStyle}
                                                            onMouseEnter={e => {
                                                                e.currentTarget.style.background = "rgba(139, 92, 246, 0.06)";
                                                                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.2)";
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#a78bfa", display: "flex", alignItems: "center", gap: "6px" }}>
                                                                Public Resume URL <ArrowRight size={14} />
                                                            </div>
                                                            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: "4px", lineHeight: "1.4" }}>
                                                                Generate shareable web links to showcase resume securely.
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                );
                            }

                            return (
                                <a key={link.href} href={link.href} className={`nav-link-item ${isActive(link.href) ? 'active' : ''}`}>
                                    {link.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* ── Desktop: Right Auth Buttons (Logged Out) ── */}
                    <div className="hidden lg:flex" style={{ alignItems: "center", gap: "12px", marginLeft: "auto" }}>
                        <a href="https://app.cvgrid.in/signup" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", padding: "7px 14px" }}>Sign Up</a>
                        <a href="https://app.cvgrid.in/login" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", padding: "8px 20px", borderRadius: "8px", transition: "opacity 0.2s" }}>Login</a>
                    </div>

                    {/* ── Mobile: Hamburger ── */}
                    <button className="flex lg:hidden flex-col gap-[5px]" onClick={() => setMenuOpen(true)} aria-label="Open menu"
                        style={{ ...hamburgerStyle, marginLeft: "auto" }}>
                        <span style={burgerLine} />
                        <span style={burgerLine} />
                        <span style={burgerLine} />
                    </button>
                </div>
            </nav>

            {/* ── Overlay ── */}
            <div onClick={closeMenu} style={{
                position: "fixed", inset: 0, zIndex: 1100,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                opacity: menuOpen ? 1 : 0,
                pointerEvents: menuOpen ? "all" : "none",
                transition: "opacity 0.3s ease",
            }} />

            {/* ── Right Drawer ── */}
            <aside style={{
                position: "fixed", top: 0, right: 0,
                width: "80vw", maxWidth: "320px",
                height: "100dvh", zIndex: 1200,
                background: "linear-gradient(160deg, #0d0d0d 0%, #0a0a1a 100%)",
                borderLeft: "1px solid rgba(182,196,255,0.12)",
                boxShadow: "-8px 0 48px rgba(0,0,0,0.75)",
                display: "flex", flexDirection: "column",
                transform: menuOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                overflowY: "auto",
            }}>
                {/* Drawer Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: "700", letterSpacing: "0.08em", background: "linear-gradient(90deg, #fff 0%, #b6c4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "1.1rem" }}>CVGRID</span>
                    <button onClick={closeMenu} aria-label="Close menu" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: "8px 0" }}>
                    {NAV_LINKS.map((link) => {
                        const Icon = drawerIcons[link.href] || drawerIcons["/"];
                        if (link.label === "Templates") {
                            return (
                                <div key={link.href}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background: isActive(link.href) ? "rgba(111,157,255,0.1)" : "transparent",
                                        borderLeft: isActive(link.href) ? "3px solid #6f9dff" : "3px solid transparent",
                                        paddingRight: "16px"
                                    }}>
                                        <a href={link.href} onClick={closeMenu} style={{
                                            ...drawerLinkStyle,
                                            borderBottom: "none",
                                            flexGrow: 1,
                                            paddingRight: 0,
                                            borderLeft: "none",
                                            background: "transparent"
                                        }}>
                                            <Palette size={16} />
                                            {link.label}
                                        </a>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMobileTemplatesOpen(!mobileTemplatesOpen);
                                            }}
                                            aria-label="Toggle templates sub-menu"
                                            aria-expanded={mobileTemplatesOpen}
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "6px",
                                                color: "#fff",
                                                padding: "4px 8px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <ChevronDown size={14} style={{
                                                transform: mobileTemplatesOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s"
                                            }} />
                                        </button>
                                    </div>

                                    {/* Collapsible Sub-menu links */}
                                    {mobileTemplatesOpen && (
                                        <div style={{
                                            background: "rgba(0, 0, 0, 0.25)",
                                            borderLeft: "2px solid rgba(111,157,255,0.3)",
                                            marginLeft: "28px",
                                            marginTop: "4px",
                                            marginBottom: "8px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "2px"
                                        }}>
                                            <a 
                                                href="https://app.cvgrid.in/templates" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                All Layouts
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/templates?category=professional" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                ATS Friendly
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/templates?category=minimalist" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Graduate / Starter
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/templates?category=creative" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Modern & Creative
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/templates?category=tech" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Developer / Tech
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        
                        if (link.label === "AI Tools") {
                            return (
                                <div key={link.href}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background: isActive(link.href) ? "rgba(111,157,255,0.1)" : "transparent",
                                        borderLeft: isActive(link.href) ? "3px solid #6f9dff" : "3px solid transparent",
                                        paddingRight: "16px"
                                    }}>
                                        <a href={link.href} onClick={closeMenu} style={{
                                            ...drawerLinkStyle,
                                            borderBottom: "none",
                                            flexGrow: 1,
                                            paddingRight: 0,
                                            borderLeft: "none",
                                            background: "transparent"
                                        }}>
                                            <Sparkles size={16} />
                                            {link.label}
                                        </a>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMobileAiOpen(!mobileAiOpen);
                                            }}
                                            aria-label="Toggle AI tools sub-menu"
                                            aria-expanded={mobileAiOpen}
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "6px",
                                                color: "#fff",
                                                padding: "4px 8px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <ChevronDown size={14} style={{
                                                transform: mobileAiOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s"
                                            }} />
                                        </button>
                                    </div>

                                    {/* Collapsible AI Sub-menu links */}
                                    {mobileAiOpen && (
                                        <div style={{
                                            background: "rgba(0, 0, 0, 0.25)",
                                            borderLeft: "2px solid rgba(167, 139, 250, 0.3)",
                                            marginLeft: "28px",
                                            marginTop: "4px",
                                            marginBottom: "8px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "2px"
                                        }}>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                AI Hub Overview
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools/match-score" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Match Score Checker
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools/keyword-optimizer" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Keyword Optimizer
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools/job-analyzer" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Job Post Parser
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools/interview-generator" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Interview Q&A Prep
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools/portfolio-builder" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Premium Portfolio Builder
                                            </a>
                                            <a 
                                                href="https://app.cvgrid.in/ai-tools/resume-sharing" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Public URL Sharing
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        
                        return (
                            <a key={link.href} href={link.href} onClick={closeMenu} style={{
                                ...drawerLinkStyle,
                                color: isActive(link.href) ? "#fff" : "rgba(255,255,255,0.75)",
                                background: isActive(link.href) ? "rgba(111,157,255,0.1)" : "transparent",
                                borderLeft: isActive(link.href) ? "3px solid #6f9dff" : "3px solid transparent",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}>
                                {Icon ? <Icon size={16} /> : null}
                                {link.label}
                            </a>
                        );
                    })}

                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "8px" }}>
                        <a href="https://app.cvgrid.in/signup" onClick={closeMenu} style={{ textAlign: "center", padding: "11px", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontWeight: "500" }}>Sign Up</a>
                        <a href="https://app.cvgrid.in/login" onClick={closeMenu} style={{ textAlign: "center", padding: "11px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontWeight: "600" }}>Login</a>
                    </div>
                </nav>
            </aside>
            <style>{`
                @keyframes navSlideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .nav-item-wrapper {
                    position: static;
                    display: flex;
                    align-items: center;
                    height: 100%;
                }
                .nav-link-item {
                    text-decoration: none !important;
                    font-size: 0.85rem;
                    font-weight: 500;
                    padding: 6px 14px;
                    border-radius: 20px;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    border: 1px solid transparent;
                    color: rgba(255, 255, 255, 0.65) !important;
                    background: transparent;
                }
                .nav-link-item:hover,
                .nav-item-wrapper:hover .nav-link-item {
                    color: #fff !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                }
                .nav-link-item.active {
                    color: #fff !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                }
                .chevron-icon {
                    opacity: 0.7;
                    transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .nav-item-wrapper:hover .chevron-icon {
                    transform: rotate(180deg);
                }
                .mega-dropdown-menu {
                    position: absolute;
                    top: 64px;
                    left: 0;
                    right: 0;
                    width: 100vw;
                    background: rgba(8, 8, 12, 0.96);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 20px 48px rgba(0,0,0,0.85);
                    z-index: 999;
                    padding: 36px 0;
                    opacity: 0;
                    transform: translateY(-10px);
                    pointer-events: none;
                    visibility: hidden;
                    transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
                }
                .nav-item-wrapper:hover .mega-dropdown-menu {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                    visibility: visible;
                }
            `}</style>
        </>
    );
}

/* ── Shared Styles ── */
const hamburgerStyle = {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "10px 12px",
    cursor: "pointer",
};
const burgerLine = { display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px" };
const drawerLinkStyle = {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px 24px", textDecoration: "none",
    fontSize: "0.97rem", fontWeight: "500",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "all 0.15s ease",
};
const drawerIcons = {
    "/": Home,
    "https://app.cvgrid.in/templates": Palette,
    "https://app.cvgrid.in/cover-letter": FileSignature,
    "https://app.cvgrid.in/ats-checker": Target,
    "https://app.cvgrid.in/ai-tools": Sparkles,
};

const megaDropdownContainerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "2.4fr 1fr",
    gap: "48px",
};

const megaDropdownTitleStyle = {
    fontSize: "1.05rem",
    fontWeight: "700",
    letterSpacing: "0.06em",
    color: "#a5b4fc",
    textTransform: "uppercase",
    marginBottom: "24px",
};

const megaDropdownGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
};

const dropdownCardStyle = {
    display: "flex",
    gap: "14px",
    padding: "12px",
    borderRadius: "12px",
    textDecoration: "none",
    border: "1px solid transparent",
    transition: "all 0.2s ease",
    cursor: "pointer",
};

const iconContainerStyle = (color) => ({
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: `rgba(${color === "#3b82f6" ? "59,130,246" : color === "#ec4899" ? "236,72,153" : color === "#10b981" ? "16,185,129" : color === "#f59e0b" ? "245,158,11" : color === "#fb7185" ? "251,113,133" : color === "#6366f1" ? "99,102,241" : "139,92,246"}, 0.1)`,
    border: `1px solid rgba(${color === "#3b82f6" ? "59,130,246" : color === "#ec4899" ? "236,72,153" : color === "#10b981" ? "16,185,129" : color === "#f59e0b" ? "245,158,11" : color === "#fb7185" ? "251,113,133" : color === "#6366f1" ? "99,102,241" : "139,92,246"}, 0.2)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
});

const cardTitleStyle = {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "4px",
};

const arrowIconStyle = {
    fontSize: "0.95rem",
    color: "#a5b4fc",
    opacity: "0.5",
    transition: "all 0.2s ease",
    display: "inline-block",
};

const cardDescStyle = {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.45)",
    lineHeight: "1.4",
};

const sidebarContainerStyle = {
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    paddingLeft: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const sidebarHeaderStyle = {
    fontSize: "0.82rem",
    fontWeight: "700",
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    marginBottom: "8px",
};

const sidebarLinkCardStyle = {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "16px",
    textDecoration: "none",
    transition: "all 0.2s ease",
    cursor: "pointer",
    display: "block",
};

const drawerSubLinkStyle = {
    padding: "8px 16px",
    textDecoration: "none",
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.65)",
    transition: "color 0.15s ease",
};

const aiMegaDropdownTitleStyle = {
    fontSize: "1.05rem",
    fontWeight: "700",
    letterSpacing: "0.06em",
    color: "#a78bfa",
    textTransform: "uppercase",
    marginBottom: "24px",
};
