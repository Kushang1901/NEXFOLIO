"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToAuthChanges } from "../authState";
import { Cookie } from "lucide-react";

function getCookie(name) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days = 365) {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; Secure`;
}

function generateUUID() {
    if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    // Fallback UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [isHoveredAccept, setIsHoveredAccept] = useState(false);
    const [isHoveredDeny, setIsHoveredDeny] = useState(false);

    useEffect(() => {
        // Subscribe to auth state changes to capture user email if logged in
        const unsubscribe = subscribeToAuthChanges((loggedUser) => {
            if (loggedUser && loggedUser.email) {
                setUserEmail(loggedUser.email);
            } else {
                setUserEmail(null);
            }
        });

        // Delay banner visibility check slightly for smoother initial load
        const timer = setTimeout(() => {
            const consentStatus = localStorage.getItem("cookie-consent-status") || getCookie("cookie-consent-status");
            if (!consentStatus) {
                setIsVisible(true);
            } else {
                // If consent already exists, ensure GA state matches
                updateGoogleAnalytics(consentStatus);
            }
        }, 1200);

        return () => {
            clearTimeout(timer);
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    // Sync guest consent when a user logs in
    useEffect(() => {
        if (userEmail) {
            const consentId = localStorage.getItem("cookie-consent-id");
            const consentStatus = localStorage.getItem("cookie-consent-status");
            const syncedEmail = localStorage.getItem("cookie-consent-synced-email");

            if (consentId && consentStatus && syncedEmail !== userEmail) {
                fetch("/api/cookie-consent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ consentId, consentStatus, userEmail }),
                })
                .then(res => {
                    if (res.ok) {
                        localStorage.setItem("cookie-consent-synced-email", userEmail);
                    }
                })
                .catch(err => console.error("Error syncing cookie consent with user account:", err));
            }
        }
    }, [userEmail]);

    const updateGoogleAnalytics = (status) => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("consent", "update", {
                analytics_storage: status === "accepted" ? "granted" : "denied",
            });
        }
    };

    const handleConsent = async (status) => {
        // Generate or retrieve unique consent id
        let consentId = localStorage.getItem("cookie-consent-id");
        if (!consentId) {
            consentId = generateUUID();
            localStorage.setItem("cookie-consent-id", consentId);
        }

        // Store preference in localStorage and cookies
        localStorage.setItem("cookie-consent-status", status);
        setCookie("cookie-consent-status", status, 365);

        // Update Google Analytics consent mode
        updateGoogleAnalytics(status);

        // Animate exit
        setIsVisible(false);

        // Send to backend database
        try {
            const response = await fetch("/api/cookie-consent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    consentId,
                    consentStatus: status,
                    userEmail: userEmail || null
                })
            });

            if (response.ok && userEmail) {
                localStorage.setItem("cookie-consent-synced-email", userEmail);
            }
        } catch (error) {
            console.error("Failed to save cookie consent to database:", error);
        }
    };

    if (!isVisible) return null;

    return (
        <>
            <div className="no-print" style={containerStyle}>
                <div style={headerStyle}>
                    <div style={iconWrapperStyle}>
                        <Cookie size={18} color="#6366f1" />
                    </div>
                    <div style={titleStyle}>Cookie Preference</div>
                </div>
                <p style={descStyle}>
                    We use cookies to optimize CVGrid, customize your experience, and analyze our traffic. 
                    By clicking "Accept All", you agree to our use of cookies. Read our{" "}
                    <Link href="/privacy" style={linkStyle}>
                        Privacy Policy
                    </Link>{" "}
                    to learn more.
                </p>
                <div style={btnGroupStyle}>
                    <button
                        onClick={() => handleConsent("denied")}
                        onMouseEnter={() => setIsHoveredDeny(true)}
                        onMouseLeave={() => setIsHoveredDeny(false)}
                        style={{
                            ...btnStyle,
                            ...denyBtnStyle,
                            ...(isHoveredDeny ? denyBtnHoverStyle : {})
                        }}
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleConsent("accepted")}
                        onMouseEnter={() => setIsHoveredAccept(true)}
                        onMouseLeave={() => setIsHoveredAccept(false)}
                        style={{
                            ...btnStyle,
                            ...acceptBtnStyle,
                            ...(isHoveredAccept ? acceptBtnHoverStyle : {})
                        }}
                    >
                        Accept All
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
}

// ── Styles ──
const containerStyle = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "380px",
    maxWidth: "calc(100vw - 48px)",
    background: "rgba(10, 10, 12, 0.88)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "20px 24px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.15) inset",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    animation: "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
    fontFamily: "var(--font-inter), sans-serif",
};

const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

const iconWrapperStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(99, 102, 241, 0.12)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
};

const titleStyle = {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "var(--font-space-grotesk), sans-serif",
    letterSpacing: "0.02em",
};

const descStyle = {
    margin: 0,
    fontSize: "0.85rem",
    lineHeight: "1.45",
    color: "rgba(255, 255, 255, 0.7)",
};

const linkStyle = {
    color: "#6f9dff",
    textDecoration: "underline",
    fontWeight: "500",
    transition: "color 0.2s",
};

const btnGroupStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "4px",
};

const btnStyle = {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    outline: "none",
    textAlign: "center",
};

const denyBtnStyle = {
    background: "transparent",
    border: "1.5px solid rgba(255, 255, 255, 0.15)",
    color: "rgba(255, 255, 255, 0.8)",
};

const denyBtnHoverStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    color: "#ffffff",
};

const acceptBtnStyle = {
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "#ffffff",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.25)",
};

const acceptBtnHoverStyle = {
    opacity: 0.95,
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)",
};
