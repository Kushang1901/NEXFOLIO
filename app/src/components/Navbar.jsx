"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { subscribeToAuthChanges } from "../authState";
import { showToast } from "../utils/toast";
import { Home, Palette, FileSignature, Target, Sparkles, FileText, X, ArrowRight, LogOut, ChevronDown, User, Briefcase, KeyRound, HelpCircle, Crown, Share2 } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Templates", href: "/templates" },
    { label: "Blog", href: "https://cvgrid.in/blog" },
    { label: "AI Cover Letter", href: "/cover-letter" },
    { label: "ATS Checker", href: "/ats-checker" },
    { label: "AI Tools", href: "/ai-tools" },
    { label: "PDF Tools", href: "https://convert.cvgrid.in" },
    { label: "Docs", href: "https://docs.cvgrid.in" },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
    const [mobileTemplatesOpen, setMobileTemplatesOpen] = useState(false);
    const [showAiDropdown, setShowAiDropdown] = useState(false);
    const [mobileAiOpen, setMobileAiOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const handleCategoryClick = (category) => {
        if (typeof window !== "undefined") {
            const event = new CustomEvent("categoryChange", { detail: category });
            window.dispatchEvent(event);
        }
    };

    useEffect(() => {
        let activeEmail = null;
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            setUser(loggedUser);
            if (loggedUser) {
                const userEmail = loggedUser.email || `github-${loggedUser.uid}@cvgrid.in`;
                activeEmail = userEmail;
                setDisplayName(loggedUser.displayName || userEmail);
                setPhotoUrl(loggedUser.photoURL || "");
                try {
                    const response = await fetch(`/api/user?email=${encodeURIComponent(userEmail)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (activeEmail === userEmail) {
                            if (data.firstName || data.lastName) setDisplayName(`${data.firstName} ${data.lastName}`.trim());
                            if (data.photoUrl) setPhotoUrl(data.photoUrl);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user details:", err);
                }
            } else {
                activeEmail = null;
                setDisplayName("");
                setPhotoUrl("");
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, []);

    // Click outside handler for profile dropdown
    useEffect(() => {
        if (!profileDropdownOpen) return;
        const handleOutsideClick = (e) => {
            if (!e.target.closest(".profile-dropdown-container")) {
                setProfileDropdownOpen(false);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, [profileDropdownOpen]);

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

    const handleLogout = async () => {
        if (typeof window !== "undefined") localStorage.removeItem("mock_user");
        try { await signOut(auth); } catch (err) { console.error("Firebase SignOut error:", err); }
        setMenuOpen(false);
        showToast("Logged out successfully");
        router.push("/");
    };

    const closeMenu = () => setMenuOpen(false);
    const isActive = (href) => pathname === href;

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
                    <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} className="d-none d-lg-block" />

                    {/* ── Desktop: Left Nav Links ── */}
                    <div className="d-none d-lg-flex" style={{ gap: "4px", flex: 1, height: "100%", alignItems: "stretch", alignSelf: "stretch" }}>
                        {NAV_LINKS.map((link) => {
                            if (link.label === "Templates") {
                                return (
                                    <div
                                        key={link.href}
                                        className="nav-item-wrapper"
                                    >
                                        <Link href={link.href} className={`nav-link-item ${isActive(link.href) ? 'active' : ''}`}>
                                            {link.label}
                                            <ChevronDown size={14} className="chevron-icon" />
                                        </Link>

                                        {/* MEGA DROPDOWN */}
                                        <div className="mega-dropdown-menu">
                                                <div style={megaDropdownContainerStyle}>
                                                    {/* Left Column: Grid */}
                                                    <div>
                                                        <h4 style={megaDropdownTitleStyle}>Resume Templates</h4>
                                                        <div style={megaDropdownGridStyle}>
                                                            
                                                            {/* ATS Friendly */}
                                                            <Link 
                                                                href="/templates?category=professional" 
                                                                onClick={() => {
                                                                    setShowTemplatesDropdown(false);
                                                                    handleCategoryClick("professional");
                                                                }}
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
                                                            </Link>

                                                            {/* Graduate */}
                                                            <Link 
                                                                href="/templates?category=minimalist" 
                                                                onClick={() => {
                                                                    setShowTemplatesDropdown(false);
                                                                    handleCategoryClick("minimalist");
                                                                }}
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
                                                            </Link>

                                                            {/* Modern */}
                                                            <Link 
                                                                href="/templates?category=creative" 
                                                                onClick={() => {
                                                                    setShowTemplatesDropdown(false);
                                                                    handleCategoryClick("creative");
                                                                }}
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
                                                            </Link>

                                                            {/* Professional */}
                                                            <Link 
                                                                href="/templates?category=professional" 
                                                                onClick={() => {
                                                                    setShowTemplatesDropdown(false);
                                                                    handleCategoryClick("professional");
                                                                }}
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
                                                            </Link>

                                                            {/* Simple */}
                                                            <Link 
                                                                href="/templates?category=minimalist" 
                                                                onClick={() => {
                                                                    setShowTemplatesDropdown(false);
                                                                    handleCategoryClick("minimalist");
                                                                }}
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
                                                            </Link>

                                                            {/* Tech / Monospace */}
                                                            <Link 
                                                                href="/templates?category=tech" 
                                                                onClick={() => {
                                                                    setShowTemplatesDropdown(false);
                                                                    handleCategoryClick("tech");
                                                                }}
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
                                                            </Link>

                                                        </div>
                                                    </div>

                                                    {/* Right Column: Actions */}
                                                    <div style={sidebarContainerStyle}>
                                                        <h4 style={sidebarHeaderStyle}>Quick Builder Access</h4>
                                                        
                                                        <Link href="/builder" onClick={() => setShowTemplatesDropdown(false)} style={sidebarLinkCardStyle}
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
                                                        </Link>

                                                        <Link href="/cover-letter" onClick={() => setShowTemplatesDropdown(false)} style={{ ...sidebarLinkCardStyle, marginTop: "12px" }}
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
                                                        </Link>
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
                                        <Link href={link.href} className={`nav-link-item ${isActive(link.href) ? 'active' : ''}`}>
                                            {link.label}
                                            <ChevronDown size={14} className="chevron-icon" />
                                        </Link>

                                        {/* AI TOOLS MEGA DROPDOWN */}
                                        <div className="mega-dropdown-menu">
                                                <div style={megaDropdownContainerStyle}>
                                                    {/* Left Column: Grid */}
                                                    <div>
                                                        <h4 style={aiMegaDropdownTitleStyle}>AI Career Suite</h4>
                                                        <div style={megaDropdownGridStyle}>
                                                            
                                                            {/* AI Resume Builder */}
                                                            <Link 
                                                                href="/templates" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                            </Link>

                                                            {/* Match Score Checker */}
                                                            <Link 
                                                                href="/ai-tools/match-score" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                            </Link>

                                                            {/* Keyword Optimizer */}
                                                            <Link 
                                                                href="/ai-tools/keyword-optimizer" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                            </Link>

                                                            {/* Job Description Analyzer */}
                                                            <Link 
                                                                href="/ai-tools/job-analyzer" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                            </Link>

                                                            {/* AI Interview Prep */}
                                                            <Link 
                                                                href="/ai-tools/interview-generator" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                                    <div style={cardDescStyle}>Get role-specific questions and recommended expert answers.</div>
                                                                </div>
                                                            </Link>

                                                            {/* Premium AI Portfolio */}
                                                            <Link 
                                                                href="/ai-tools/portfolio-builder" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                                    <Crown size={18} color="#fb7185" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Premium Portfolio
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Deploy a ready website with custom templates (₹499).</div>
                                                                </div>
                                                            </Link>

                                                            {/* Public Resume Share */}
                                                            <Link 
                                                                href="/ai-tools/resume-sharing" 
                                                                onClick={() => setShowAiDropdown(false)}
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
                                                                    <Share2 size={18} color="#818cf8" />
                                                                </div>
                                                                <div>
                                                                    <div style={cardTitleStyle}>
                                                                        Public URL Share
                                                                        <span className="arrow-icon" style={arrowIconStyle}>→</span>
                                                                    </div>
                                                                    <div style={cardDescStyle}>Set custom handles, passcodes, and track access stats.</div>
                                                                </div>
                                                            </Link>

                                                        </div>
                                                    </div>

                                                    {/* Right Column: Actions */}
                                                    <div style={sidebarContainerStyle}>
                                                        <h4 style={sidebarHeaderStyle}>Suite Performance</h4>
                                                        <div style={{
                                                            background: "rgba(255,255,255,0.02)",
                                                            border: "1px solid rgba(255,255,255,0.05)",
                                                            borderRadius: "12px",
                                                            padding: "16px",
                                                            fontSize: "0.8rem",
                                                            color: "rgba(255,255,255,0.6)",
                                                            lineHeight: "1.5"
                                                        }}>
                                                            <strong style={{ color: "#a78bfa", display: "block", marginBottom: "6px" }}>Recruiter-Grade AI</strong>
                                                            Powered by CVGrid AI models to write professional experience entries without clichés. Completely free.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                );
                            }
                            if (link.label === "PDF Tools") {
                                return (
                                    <div key={link.href} className="nav-item-wrapper" style={{ padding: "0 4px" }}>
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" style={{
                                            textDecoration: "none",
                                            fontSize: "0.82rem",
                                            fontWeight: "700",
                                            height: "34px",
                                            padding: "0 16px",
                                            borderRadius: "9999px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "6px",
                                            background: "linear-gradient(135deg, #a855f7, #6366f1)",
                                            color: "#ffffff",
                                            boxShadow: "0 2px 10px rgba(168,85,247,0.3)",
                                            transition: "all 0.2s ease",
                                            border: "none",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(168,85,247,0.5)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 2px 10px rgba(168,85,247,0.3)";
                                        }}
                                        >
                                            <FileText size={13} />
                                            {link.label}
                                        </a>
                                    </div>
                                );
                            }

                            return (
                                <div key={link.href} className="nav-item-wrapper">
                                    <Link href={link.href} className={`nav-link-item ${isActive(link.href) ? 'active' : ''}`}>
                                        {link.label}
                                    </Link>
                                </div>
                            );
                        })}

                    </div>

                    {/* ── Desktop: Right Auth Actions ── */}
                    <div className="d-none d-lg-flex align-items-center profile-dropdown-container" style={{ gap: "12px", marginLeft: "auto", position: "relative" }}>
                        {user ? (
                            <div style={{ position: "relative" }}>
                                <button 
                                    onClick={() => setProfileDropdownOpen(prev => !prev)}
                                    style={{
                                        background: profileDropdownOpen ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.05)",
                                        borderColor: profileDropdownOpen ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.08)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        borderRadius: "50%",
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 0,
                                        transition: "all 0.2s ease",
                                        cursor: "pointer",
                                        color: "inherit"
                                    }}
                                >
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Profile" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={avatarStyle}>{(displayName || user.email).charAt(0).toUpperCase()}</div>
                                    )}
                                </button>

                                {profileDropdownOpen && (
                                    <div style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: 0,
                                        width: "160px",
                                        background: "rgba(13, 14, 21, 0.96)",
                                        backdropFilter: "blur(16px)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                                        padding: "6px",
                                        zIndex: 1010,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px"
                                    }}>
                                        <Link 
                                            href="/profile" 
                                            onClick={() => { setProfileDropdownOpen(false); closeMenu(); }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "8px 12px",
                                                color: "rgba(255, 255, 255, 0.8)",
                                                fontSize: "0.85rem",
                                                fontWeight: "500",
                                                textDecoration: "none",
                                                borderRadius: "8px",
                                                transition: "all 0.15s ease",
                                                cursor: "pointer"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                                e.currentTarget.style.color = "#fff";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                                            }}
                                        >
                                            <User size={14} />
                                            My Profile
                                        </Link>

                                        <button 
                                            onClick={() => { setProfileDropdownOpen(false); handleLogout(); }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                padding: "8px 12px",
                                                color: "#f87171",
                                                fontSize: "0.85rem",
                                                fontWeight: "500",
                                                background: "transparent",
                                                border: "none",
                                                borderRadius: "8px",
                                                width: "100%",
                                                textAlign: "left",
                                                transition: "all 0.15s ease",
                                                cursor: "pointer"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = "rgba(248, 113, 113, 0.08)";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = "transparent";
                                            }}
                                        >
                                            <LogOut size={14} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/signup" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "500", padding: "7px 14px" }}>Sign Up</Link>
                                <Link href="/login" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", padding: "8px 20px", borderRadius: "8px", transition: "opacity 0.2s" }}>Login</Link>
                            </>
                        )}
                    </div>

                    {/* ── Mobile: Hamburger ── */}
                    <button className="d-lg-none" onClick={() => setMenuOpen(true)} aria-label="Open menu"
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

                {/* User Card (logged in) */}
                {user && (
                    <Link href="/profile" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 24px", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(56,189,248,0.05)" }}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Profile" style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #38bdf8", flexShrink: 0 }} />
                        ) : (
                            <div style={{ ...avatarStyle, width: "46px", height: "46px", fontSize: "16px", flexShrink: 0 }}>
                                {(displayName || user.email).charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ color: "#38bdf8", fontWeight: "600", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName || user.email}</div>
                            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                                View Profile <ArrowRight size={12} />
                            </div>
                        </div>
                    </Link>
                )}

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: "8px 0" }}>
                    {NAV_LINKS.map((link) => {
                        const Icon = drawerIcons[link.href];
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
                                        <Link href={link.href} onClick={closeMenu} style={{
                                            ...drawerLinkStyle,
                                            borderBottom: "none",
                                            flexGrow: 1,
                                            paddingRight: 0,
                                            borderLeft: "none",
                                            background: "transparent"
                                        }}>
                                            {Icon ? <Icon size={16} /> : null}
                                            {link.label}
                                        </Link>
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
                                            <Link 
                                                href="/templates" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                All Layouts
                                            </Link>
                                            <Link 
                                                href="/templates?category=professional" 
                                                onClick={() => {
                                                    closeMenu();
                                                    handleCategoryClick("professional");
                                                }} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                ATS Friendly
                                            </Link>
                                            <Link 
                                                href="/templates?category=minimalist" 
                                                onClick={() => {
                                                    closeMenu();
                                                    handleCategoryClick("minimalist");
                                                }} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Graduate / Starter
                                            </Link>
                                            <Link 
                                                href="/templates?category=creative" 
                                                onClick={() => {
                                                    closeMenu();
                                                    handleCategoryClick("creative");
                                                }} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Modern & Creative
                                            </Link>
                                            <Link 
                                                href="/templates?category=tech" 
                                                onClick={() => {
                                                    closeMenu();
                                                    handleCategoryClick("tech");
                                                }} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Developer / Tech
                                            </Link>
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
                                        <Link href={link.href} onClick={closeMenu} style={{
                                            ...drawerLinkStyle,
                                            borderBottom: "none",
                                            flexGrow: 1,
                                            paddingRight: 0,
                                            borderLeft: "none",
                                            background: "transparent"
                                        }}>
                                            {Icon ? <Icon size={16} /> : null}
                                            {link.label}
                                        </Link>
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
                                            <Link 
                                                href="/ai-tools" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                AI Hub Overview
                                            </Link>
                                            <Link 
                                                href="/ai-tools/match-score" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Match Score Checker
                                            </Link>
                                            <Link 
                                                href="/ai-tools/keyword-optimizer" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Keyword Optimizer
                                            </Link>
                                            <Link 
                                                href="/ai-tools/job-analyzer" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Job Post Parser
                                            </Link>
                                            <Link 
                                                href="/ai-tools/interview-generator" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Interview Q&A Prep
                                            </Link>
                                            <Link 
                                                href="/ai-tools/portfolio-builder" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Premium Portfolio Builder
                                            </Link>
                                            <Link 
                                                href="/ai-tools/resume-sharing" 
                                                onClick={closeMenu} 
                                                style={drawerSubLinkStyle}
                                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                                onMouseLeave={e => e.currentTarget.style.color = "rgba(255, 255, 255, 0.65)"}
                                            >
                                                Public URL Sharing
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        
                        if (link.label === "PDF Tools") {
                            return (
                                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu} style={{
                                    ...drawerLinkStyle,
                                    color: "#fff",
                                    background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.15))",
                                    borderLeft: "3px solid #a855f7",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    fontWeight: "600",
                                }}>
                                    <FileText size={16} color="#c084fc" />
                                    {link.label}
                                </a>
                            );
                        }

                        return (
                            <Link key={link.href} href={link.href} onClick={closeMenu} style={{
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
                            </Link>
                        );
                    })}

                    {user && (
                        <Link href="/profile" onClick={closeMenu} style={{
                            ...drawerLinkStyle,
                            color: isActive("/profile") ? "#fff" : "rgba(255,255,255,0.75)",
                            background: isActive("/profile") ? "rgba(111,157,255,0.1)" : "transparent",
                            borderLeft: isActive("/profile") ? "3px solid #6f9dff" : "3px solid transparent",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}>
                            <User size={16} /> My Profile
                        </Link>
                    )}

                    {!user && (
                        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "8px" }}>
                            <Link href="/signup" onClick={closeMenu} style={{ textAlign: "center", padding: "11px", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontWeight: "500" }}>Sign Up</Link>
                            <Link href="/login" onClick={closeMenu} style={{ textAlign: "center", padding: "11px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "10px", color: "#fff", textDecoration: "none", fontWeight: "600" }}>Login</Link>
                        </div>
                    )}
                </nav>

                {/* Logout */}
                {user && (
                    <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <button onClick={handleLogout} style={{ width: "100%", padding: "12px", background: "rgba(239,68,68,0.1)", border: "1.5px solid rgba(239,68,68,0.45)", borderRadius: "10px", color: "#ef4444", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer", transition: "background 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                        >Logout</button>
                    </div>
                )}
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
                    height: 34px;
                    padding: 0 16px;
                    border-radius: 9999px;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
const desktopLinkStyle = {
    textDecoration: "none", fontSize: "0.85rem", fontWeight: "500",
    padding: "6px 14px", borderRadius: "20px",
    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)", whiteSpace: "nowrap",
    display: "flex", alignItems: "center", gap: "6px",
    border: "1px solid transparent",
};
const hamburgerStyle = {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "10px 12px",
    display: "flex", flexDirection: "column", gap: "5px", cursor: "pointer",
};
const burgerLine = { display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px" };
const avatarStyle = {
    width: "28px", height: "28px", borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", 
    color: "#ffffff", display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: "600", fontSize: "12px",
    flexShrink: 0
};
const logoutBtnStyle = {
    background: "rgba(255, 255, 255, 0.04)", 
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px", 
    color: "rgba(255, 255, 255, 0.75)", 
    padding: "6px 14px",
    fontWeight: "500", 
    fontSize: "0.85rem", 
    cursor: "pointer", 
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px"
};
const profileCapsuleStyle = {
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    textDecoration: "none", 
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "30px",
    padding: "4px 12px 4px 4px",
    transition: "all 0.2s ease",
    cursor: "pointer"
};
const drawerLinkStyle = {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px 24px", textDecoration: "none",
    fontSize: "0.97rem", fontWeight: "500",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "all 0.15s ease",
};
const drawerIcons = {
    "/": Home,
    "/templates": Palette,
    "https://cvgrid.in/blog": FileText,
    "/cover-letter": FileSignature,
    "/ats-checker": Target,
    "/ai-tools": Sparkles,
    "https://docs.cvgrid.in": HelpCircle,
};

/* Mega Dropdown CSS Styling Constants */
const megaDropdownStyle = {
    position: "absolute",
    top: "64px",
    left: 0,
    right: 0,
    width: "100vw",
    background: "rgba(8, 8, 12, 0.96)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 48px rgba(0,0,0,0.85)",
    zIndex: 999,
    padding: "36px 0",
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

const aiMegaDropdownStyle = {
    position: "absolute",
    top: "64px",
    left: 0,
    right: 0,
    width: "100vw",
    background: "rgba(8, 8, 12, 0.96)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 48px rgba(0,0,0,0.85)",
    zIndex: 999,
    padding: "36px 0",
};

const aiMegaDropdownTitleStyle = {
    fontSize: "1.05rem",
    fontWeight: "700",
    letterSpacing: "0.06em",
    color: "#a78bfa",
    textTransform: "uppercase",
    marginBottom: "24px",
};
