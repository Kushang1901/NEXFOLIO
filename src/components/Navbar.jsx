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
                // Set fallback name and photo first
                setDisplayName(loggedUser.displayName || loggedUser.email);
                setPhotoUrl(loggedUser.photoURL || "");
                
                // Fetch real name and photo from Neon PostgreSQL database
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

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm">
            <div className="container">

                {/* LOGO */}
                <Link
                    className="navbar-brand fw-bold d-flex align-items-center gap-2"
                    href="/"
                    onClick={closeMenu}
                    style={{ textDecoration: "none" }}
                >
                    <img
                        src="/logo.png"
                        alt="Nexfolio Logo"
                        style={{ height: "32px", width: "32px" }}
                    />
                    <span style={{ 
                        fontFamily: "'Space Grotesk', sans-serif", 
                        fontWeight: "700", 
                        letterSpacing: "0.08em",
                        background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "1.3rem"
                    }}>
                        NEXFOLIO
                    </span>
                </Link>

                {/* HAMBURGER */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    suppressHydrationWarning
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* NAV LINKS */}
                <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} style={{ visibility: "visible" }}>
                    
                    {/* Left navigation links */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 align-items-lg-center">
                        <li className="nav-item">
                            <Link className="nav-link" href="/" onClick={closeMenu}>
                                Home
                            </Link>
                        </li>

                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link" href="/cover-letter" onClick={closeMenu}>
                                    AI Cover Letter
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Right profile/action items */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link href="/profile" className="nav-link text-info fw-bold d-flex align-items-center gap-2 py-1" onClick={closeMenu}>
                                        {photoUrl ? (
                                            <img 
                                                src={photoUrl} 
                                                alt="User Profile" 
                                                className="rounded-circle border" 
                                                style={{ width: "30px", height: "30px", objectFit: "cover", borderColor: "#38bdf8" }} 
                                            />
                                        ) : (
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center border fw-bold text-info"
                                                style={{ width: "30px", height: "30px", fontSize: "12px", backgroundColor: "rgba(56, 189, 248, 0.1)", borderColor: "#38bdf8" }}
                                            >
                                                {(displayName || user.email).charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="d-inline-block text-truncate" style={{ maxWidth: "160px" }}>
                                            {displayName || user.email}
                                        </span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-danger btn-sm px-3 py-1.5"
                                        onClick={handleLogout}
                                        suppressHydrationWarning
                                        style={{ borderRadius: "8px" }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}

                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/signup" onClick={closeMenu}>
                                        Sign Up
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link btn btn-outline-primary btn-sm px-3 py-1.5 text-white" href="/login" onClick={closeMenu} style={{ borderRadius: "8px" }}>
                                        Login
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

            </div>
        </nav>
    );
}
