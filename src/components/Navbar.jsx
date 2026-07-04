"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { subscribeToAuthChanges } from "../authState";
import { showToast } from "../utils/toast";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Templates", href: "/templates" },
    { label: "AI Cover Letter", href: "/cover-letter" },
    { label: "ATS Checker", href: "/ats-checker" },
    { label: "Blog", href: "/blog" },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        let activeEmail = null;
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            setUser(loggedUser);
            if (loggedUser) {
                activeEmail = loggedUser.email;
                setDisplayName(loggedUser.displayName || loggedUser.email);
                setPhotoUrl(loggedUser.photoURL || "");
                try {
                    const response = await fetch(`/api/user?email=${encodeURIComponent(loggedUser.email)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (activeEmail === loggedUser.email) {
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

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.body.style.overflow = menuOpen ? "hidden" : "";
        }
        return () => { if (typeof document !== "undefined") document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Close drawer on route change
    useEffect(() => { setMenuOpen(false); }, [pathname]);

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
                background: "rgba(0,0,0,0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}>
                <div style={{
                    maxWidth: "1280px", margin: "0 auto",
                    padding: "0 24px",
                    display: "flex", alignItems: "center",
                    height: "64px", gap: "32px",
                }}>
                    {/* LOGO */}
                    <Link href="/" onClick={closeMenu} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <img src="/logo.png" alt="Nexfolio Logo" style={{ height: "32px", width: "32px" }} />
                        <span style={{
                            fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700",
                            letterSpacing: "0.08em",
                            background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            fontSize: "1.3rem",
                        }}>NEXFOLIO</span>
                    </Link>

                    {/* Divider */}
                    <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} className="d-none d-lg-block" />

                    {/* ── Desktop: Left Nav Links ── */}
                    <div className="d-none d-lg-flex align-items-center" style={{ gap: "4px", flex: 1 }}>
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} style={{
                                ...desktopLinkStyle,
                                color: isActive(link.href) ? "#fff" : "rgba(255,255,255,0.65)",
                                background: isActive(link.href) ? "rgba(255,255,255,0.08)" : "transparent",
                                borderBottom: isActive(link.href) ? "2px solid #6f9dff" : "2px solid transparent",
                            }}
                                onMouseEnter={e => { if (!isActive(link.href)) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                                onMouseLeave={e => { if (!isActive(link.href)) { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "transparent"; } }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <Link href="/my-resumes" style={{
                                ...desktopLinkStyle,
                                color: isActive("/my-resumes") ? "#fff" : "rgba(255,255,255,0.65)",
                                background: isActive("/my-resumes") ? "rgba(255,255,255,0.08)" : "transparent",
                                borderBottom: isActive("/my-resumes") ? "2px solid #6f9dff" : "2px solid transparent",
                            }}
                                onMouseEnter={e => { if (!isActive("/my-resumes")) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                                onMouseLeave={e => { if (!isActive("/my-resumes")) { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "transparent"; } }}
                            >
                                My Resumes
                            </Link>
                        )}
                    </div>

                    {/* ── Desktop: Right Auth Actions ── */}
                    <div className="d-none d-lg-flex align-items-center" style={{ gap: "12px", marginLeft: "auto" }}>
                        {user ? (
                            <>
                                <Link href="/profile" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#38bdf8", fontWeight: "600", fontSize: "0.9rem" }}>
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Profile" style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "2px solid #38bdf8" }} />
                                    ) : (
                                        <div style={avatarStyle}>{(displayName || user.email).charAt(0).toUpperCase()}</div>
                                    )}
                                    <span style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName || user.email}</span>
                                </Link>
                                <button onClick={handleLogout} style={logoutBtnStyle}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >Logout</button>
                            </>
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
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: "700", letterSpacing: "0.08em", background: "linear-gradient(90deg, #fff 0%, #b6c4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "1.1rem" }}>NEXFOLIO</span>
                    <button onClick={closeMenu} aria-label="Close menu" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px" }}>✕</button>
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
                            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: "2px" }}>View Profile →</div>
                        </div>
                    </Link>
                )}

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: "8px 0" }}>
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} onClick={closeMenu} style={{
                            ...drawerLinkStyle,
                            color: isActive(link.href) ? "#fff" : "rgba(255,255,255,0.75)",
                            background: isActive(link.href) ? "rgba(111,157,255,0.1)" : "transparent",
                            borderLeft: isActive(link.href) ? "3px solid #6f9dff" : "3px solid transparent",
                        }}>
                            <span style={{ fontSize: "1rem" }}>{drawerIcons[link.href] || "→"}</span>
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Link href="/my-resumes" onClick={closeMenu} style={{
                            ...drawerLinkStyle,
                            color: isActive("/my-resumes") ? "#fff" : "rgba(255,255,255,0.75)",
                            background: isActive("/my-resumes") ? "rgba(111,157,255,0.1)" : "transparent",
                            borderLeft: isActive("/my-resumes") ? "3px solid #6f9dff" : "3px solid transparent",
                        }}>
                            <span>📄</span> My Resumes
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
        </>
    );
}

/* ── Shared Styles ── */
const desktopLinkStyle = {
    textDecoration: "none", fontSize: "0.88rem", fontWeight: "500",
    padding: "6px 12px", borderRadius: "6px 6px 0 0",
    transition: "all 0.15s ease", whiteSpace: "nowrap",
};
const hamburgerStyle = {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "10px 12px",
    display: "flex", flexDirection: "column", gap: "5px", cursor: "pointer",
};
const burgerLine = { display: "block", width: "22px", height: "2px", background: "#fff", borderRadius: "2px" };
const avatarStyle = {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "rgba(56,189,248,0.1)", border: "2px solid #38bdf8",
    color: "#38bdf8", display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: "700", fontSize: "13px",
};
const logoutBtnStyle = {
    background: "transparent", border: "1.5px solid rgba(239,68,68,0.5)",
    borderRadius: "8px", color: "#ef4444", padding: "7px 16px",
    fontWeight: "600", fontSize: "0.88rem", cursor: "pointer", transition: "background 0.2s",
};
const drawerLinkStyle = {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px 24px", textDecoration: "none",
    fontSize: "0.97rem", fontWeight: "500",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "all 0.15s ease",
};
const drawerIcons = {
    "/": "🏠",
    "/templates": "🎨",
    "/cover-letter": "✉️",
    "/ats-checker": "🎯",
    "/blog": "📝",
};
