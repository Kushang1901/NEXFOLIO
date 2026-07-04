"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { subscribeToAuthChanges } from "../authState";
import { showToast } from "../utils/toast";

export default function Navbar() {
    const router = useRouter();
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
                            if (data.firstName || data.lastName) {
                                setDisplayName(`${data.firstName} ${data.lastName}`.trim());
                            }
                            if (data.photoUrl) {
                                setPhotoUrl(data.photoUrl);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user details from database:", err);
                }
            } else {
                activeEmail = null;
                setDisplayName("");
                setPhotoUrl("");
            }
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.body.style.overflow = menuOpen ? "hidden" : "";
        }
        return () => {
            if (typeof document !== "undefined") {
                document.body.style.overflow = "";
            }
        };
    }, [menuOpen]);

    const handleLogout = async () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("mock_user");
        }
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Firebase SignOut error:", err);
        }
        setMenuOpen(false);
        showToast("Logged out successfully");
        router.push("/");
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            {/* ── Navbar bar ── */}
            <nav
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                    background: "#000",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 2px 24px rgba(0,0,0,0.5)",
                }}
            >
                <div
                    className="container"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: "64px",
                    }}
                >
                    {/* LOGO */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        style={{
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <img
                            src="/logo.png"
                            alt="Nexfolio Logo"
                            style={{ height: "32px", width: "32px" }}
                        />
                        <span
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: "700",
                                letterSpacing: "0.08em",
                                background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: "1.3rem",
                            }}
                        >
                            NEXFOLIO
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="d-none d-lg-flex align-items-center gap-4">
                        <Link href="/" style={desktopLinkStyle}>Home</Link>
                        {user && (
                            <Link href="/cover-letter" style={desktopLinkStyle}>
                                AI Cover Letter
                            </Link>
                        )}

                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={closeMenu}
                                    style={{ ...desktopLinkStyle, color: "#38bdf8", display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt="Profile"
                                            style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #38bdf8" }}
                                        />
                                    ) : (
                                        <div style={avatarStyle}>
                                            {(displayName || user.email).charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {displayName || user.email}
                                    </span>
                                </Link>
                                <button className="btn btn-outline-danger btn-sm px-3" onClick={handleLogout} style={{ borderRadius: "8px" }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/signup" style={desktopLinkStyle}>Sign Up</Link>
                                <Link href="/login" style={{ ...desktopLinkStyle, border: "1.5px solid #4f8ef7", borderRadius: "8px", padding: "6px 18px", color: "#fff" }}>
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="d-lg-none"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open menu"
                        style={hamburgerStyle}
                    >
                        <span style={burgerLine} />
                        <span style={burgerLine} />
                        <span style={burgerLine} />
                    </button>
                </div>
            </nav>

            {/* ── Mobile drawer overlay ── */}
            <div
                onClick={closeMenu}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 1100,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(3px)",
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? "all" : "none",
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* ── Right-side drawer ── */}
            <aside
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "80vw",
                    maxWidth: "320px",
                    height: "100dvh",
                    zIndex: 1200,
                    background: "linear-gradient(160deg, #0d0d0d 0%, #0a0a1a 100%)",
                    borderLeft: "1px solid rgba(182,196,255,0.12)",
                    boxShadow: "-8px 0 40px rgba(0,0,0,0.7)",
                    display: "flex",
                    flexDirection: "column",
                    transform: menuOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflowY: "auto",
                }}
            >
                {/* Drawer header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: "700",
                            letterSpacing: "0.08em",
                            background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontSize: "1.15rem",
                        }}
                    >
                        NEXFOLIO
                    </span>
                    <button
                        onClick={closeMenu}
                        aria-label="Close menu"
                        style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "8px",
                            color: "#fff",
                            width: "36px",
                            height: "36px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: "18px",
                            lineHeight: 1,
                            transition: "background 0.2s",
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* User profile section (if logged in) */}
                {user && (
                    <Link
                        href="/profile"
                        onClick={closeMenu}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "20px 24px",
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(56,189,248,0.04)",
                        }}
                    >
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt="Profile"
                                style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #38bdf8", flexShrink: 0 }}
                            />
                        ) : (
                            <div
                                style={{
                                    ...avatarStyle,
                                    width: "46px",
                                    height: "46px",
                                    fontSize: "16px",
                                    flexShrink: 0,
                                }}
                            >
                                {(displayName || user.email).charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ color: "#38bdf8", fontWeight: "600", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {displayName || user.email}
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", marginTop: "2px" }}>View Profile →</div>
                        </div>
                    </Link>
                )}

                {/* Nav links */}
                <nav style={{ flex: 1, padding: "12px 0" }}>
                    {[
                        { label: "Home", href: "/" },
                        ...(user ? [{ label: "AI Cover Letter", href: "/cover-letter" }] : []),
                        ...(!user ? [{ label: "Sign Up", href: "/signup" }, { label: "Login", href: "/login" }] : []),
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            style={drawerLinkStyle}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout at bottom */}
                {user && (
                    <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "rgba(239,68,68,0.1)",
                                border: "1.5px solid rgba(239,68,68,0.5)",
                                borderRadius: "10px",
                                color: "#ef4444",
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                cursor: "pointer",
                                transition: "background 0.2s, border-color 0.2s",
                                letterSpacing: "0.02em",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                                e.currentTarget.style.borderColor = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
                                e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}

/* ─── Shared style objects ─── */

const desktopLinkStyle = {
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "color 0.2s",
};

const hamburgerStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    cursor: "pointer",
};

const burgerLine = {
    display: "block",
    width: "22px",
    height: "2px",
    background: "#fff",
    borderRadius: "2px",
};

const avatarStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "rgba(56,189,248,0.1)",
    border: "1.5px solid #38bdf8",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "12px",
};

const drawerLinkStyle = {
    display: "flex",
    alignItems: "center",
    padding: "15px 28px",
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "background 0.15s, color 0.15s",
    gap: "10px",
};
