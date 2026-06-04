"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { subscribeToAuthChanges } from "../authState";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            setUser(loggedUser);
            if (loggedUser) {
                // Set fallback name and photo first
                setDisplayName(loggedUser.displayName || loggedUser.email);
                setPhotoUrl(loggedUser.photoURL || "");
                
                // Fetch real name and photo from Neon PostgreSQL database
                try {
                    const response = await fetch(`/api/user?email=${encodeURIComponent(loggedUser.email)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.firstName || data.lastName) {
                            setDisplayName(`${data.firstName} ${data.lastName}`.trim());
                        }
                        if (data.photoUrl) {
                            setPhotoUrl(data.photoUrl);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user details from database:", err);
                }
            } else {
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
        alert("Logged out successfully");
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
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
                >
                    <img
                        src="/logo.png"
                        alt="ResumeCraft AI Logo"
                        style={{ height: "32px", width: "32px" }}
                    />
                    ResumeCraft AI
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
                <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link className="nav-link" href="/" onClick={closeMenu}>
                                Home
                            </Link>
                        </li>

                        {user && (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link text-info fw-bold d-flex align-items-center gap-2">
                                        {photoUrl && (
                                            <img 
                                                src={photoUrl} 
                                                alt="User Profile" 
                                                className="rounded-circle border" 
                                                style={{ width: "24px", height: "24px", objectFit: "cover", borderColor: "#38bdf8" }} 
                                            />
                                        )}
                                        {displayName || user.email}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-danger ms-lg-3 mt-2 mt-lg-0"
                                        onClick={handleLogout}
                                        suppressHydrationWarning
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
                                    <Link className="nav-link" href="/login" onClick={closeMenu}>
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
