"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { showToast } from "../../utils/toast";

export default function ForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [tailwindLoaded, setTailwindLoaded] = useState(false);
    const [devOtpHint, setDevOtpHint] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && window.tailwind) {
            setTailwindLoaded(true);
        }
    }, []);

    // Handle email submission to send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await fetch("/api/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send OTP");
            }

            showToast(data.message || "OTP sent successfully!", "success");

            // Capture devOtp if present for easy testing/dev environment verification
            if (data.devOtp) {
                setDevOtpHint(data.devOtp);
            } else {
                setDevOtpHint("");
            }

            setStep(2);
        } catch (error) {
            console.error("Send OTP Error:", error);
            showToast(error.message || "Failed to send OTP. Please check your email and try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) return;

        setLoading(true);
        try {
            const response = await fetch("/api/forgot-password/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), otp: otp.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Invalid OTP");
            }

            showToast("OTP verified successfully! Please enter your new password.", "success");
            setStep(3);
        } catch (error) {
            console.error("Verify OTP Error:", error);
            showToast(error.message || "OTP verification failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Handle password reset
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = passwordData;

        if (!newPassword || !confirmPassword) return;

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match!", "error");
            return;
        }

        if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters long.", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/forgot-password/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    password: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            showToast("Password reset successfully! Redirecting to login...", "success");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            console.error("Reset Password Error:", error);
            showToast(error.message || "Failed to reset password. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Floating particles effect for UI aesthetics matching login/signup
    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            const p = document.createElement("div");
            p.style.position = "fixed";
            p.style.width = Math.random() * 4 + "px";
            p.style.height = p.style.width;
            p.style.background = "rgba(182, 196, 255, 0.2)";
            p.style.borderRadius = "50%";
            p.style.left = Math.random() * 100 + "vw";
            p.style.top = Math.random() * 100 + "vh";
            p.style.pointerEvents = "none";
            p.style.zIndex = "0";
            document.body.appendChild(p);

            const duration = Math.random() * 3000 + 3000;
            p.animate([
                { opacity: 0, transform: "translateY(0)" },
                { opacity: 0.5, transform: "translateY(-100px)" },
                { opacity: 0, transform: "translateY(-200px)" }
            ], {
                duration: duration,
                easing: "linear"
            });

            setTimeout(() => p.remove(), duration);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Script 
                src="https://cdn.tailwindcss.com?plugins=forms,container-queries" 
                strategy="afterInteractive" 
                onLoad={() => setTailwindLoaded(true)}
            />
            <Script id="tailwind-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
                window.tailwind = window.tailwind || {};
                window.tailwind.config = {
                    darkMode: "class",
                    theme: {
                        extend: {
                            "colors": {
                                "surface-container-lowest": "#0a0e15",
                                "tertiary-fixed-dim": "#c3c6cd",
                                "on-primary-fixed-variant": "#003ab2",
                                "surface-container-highest": "#31353d",
                                "primary": "#b6c4ff",
                                "inverse-primary": "#2453d4",
                                "on-surface": "#dfe2ed",
                                "background": "#0f131b",
                                "primary-container": "#6789ff",
                                "on-secondary-fixed": "#410006",
                                "surface-container-low": "#181c23",
                                "surface-variant": "#31353d",
                                "secondary": "#ffb3b0",
                                "tertiary": "#c3c6cd",
                                "inverse-surface": "#dfe2ed",
                                "surface-container-high": "#262a2f",
                                "outline": "#8e90a0",
                                "on-secondary-container": "#ff9e9a",
                                "primary-fixed": "#dce1ff",
                                "on-primary-container": "#002170",
                                "on-surface-variant": "#c4c5d7",
                                "secondary-fixed-dim": "#ffb3b0",
                                "on-tertiary-fixed-variant": "#43474d",
                                "on-tertiary-fixed": "#181c21",
                                "on-primary": "#00277f",
                                "surface-dim": "#0f131b",
                                "surface-container": "#1c2027",
                                "surface": "#0f131b",
                                "on-tertiary": "#2d3136",
                                "outline-variant": "#434654",
                                "secondary-container": "#8a2226",
                                "on-primary-fixed": "#001550",
                                "on-tertiary-container": "#262a2f",
                                "on-secondary-fixed-variant": "#862024",
                                "tertiary-container": "#8d9197",
                                "error": "#ffb4ab",
                                "surface-tint": "#b6c4ff",
                                "on-error": "#690005",
                                "on-error-container": "#ffdad6",
                                "on-background": "#dfe2ed",
                                "on-secondary": "#660511",
                                "error-container": "#93000a",
                                "primary-fixed-dim": "#b6c4ff",
                                "secondary-fixed": "#ffdad8",
                                "inverse-on-surface": "#2c3039",
                                "tertiary-fixed": "#e0e2e9",
                                "surface-bright": "#353942"
                            },
                            "borderRadius": {
                                "DEFAULT": "0.125rem",
                                "lg": "0.25rem",
                                "xl": "0.5rem",
                                "full": "0.75rem"
                            },
                            "spacing": {
                                "input-padding": "1rem",
                                "container-max-width": "1200px",
                                "margin-mobile": "16px",
                                "gutter": "24px",
                                "section-gap": "4rem",
                                "element-gap": "1.5rem"
                            },
                            "fontFamily": {
                                "headline-md": ["Inter"],
                                "button": ["Inter"],
                                "body-sm": ["Inter"],
                                "label-bold": ["Inter"],
                                "headline-lg": ["Inter"],
                                "body-lg": ["Inter"]
                            },
                            "fontSize": {
                                "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
                                "button": ["16px", { "lineHeight": "1", "letterSpacing": "0.01em", "fontWeight": "500" }],
                                "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
                                "label-bold": ["14px", { "lineHeight": "1.2", "fontWeight": "600" }],
                                "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                                "body-lg": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }]
                            }
                        },
                    },
                }
            ` }} />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    font-family: 'Inter', sans-serif !important;
                    background-color: #0f131b !important;
                    color: #dfe2ed !important;
                }
                input {
                    color: #000000 !important;
                }
                .glass-card {
                    background: rgba(28, 32, 39, 0.7) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(142, 144, 160, 0.2) !important;
                }
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important;
                }
                .initial-loader-container {
                    position: fixed;
                    inset: 0;
                    background-color: #0f131b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 99999;
                }
                .initial-loader-spinner {
                    width: 48px;
                    height: 48px;
                    border: 3px solid rgba(74, 114, 243, 0.15);
                    border-top-color: #4a72f3;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            ` }} />

            {!tailwindLoaded && (
                <div className="initial-loader-container">
                    <div className="initial-loader-spinner"></div>
                </div>
            )}

            <div className="bg-background text-on-surface min-h-screen flex flex-col" style={{ opacity: tailwindLoaded ? 1 : 0, transition: "opacity 0.15s ease-in" }}>
                <Navbar />

                <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
                    {/* Atmospheric Background Elements */}
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none"></div>
                    
                    {/* Card */}
                    <div className="glass-card w-full max-w-md p-8 rounded-xl shadow-2xl relative z-10">
                        <div className="flex flex-col gap-6">
                            
                            {/* Heading */}
                            <div className="text-center">
                                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                                    {step === 1 && "Forgot Password"}
                                    {step === 2 && "Verify OTP"}
                                    {step === 3 && "Reset Password"}
                                </h1>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {step === 1 && "Enter your email address to receive a one-time verification code."}
                                    {step === 2 && `We sent a 6-digit verification code to ${email}.`}
                                    {step === 3 && "Create a strong new password for your account."}
                                </p>
                            </div>

                            {/* STEP 1: ENTER EMAIL */}
                            {step === 1 && (
                                <form onSubmit={handleSendOtp} className="flex flex-col gap-element-gap">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">Email Address</label>
                                        <input 
                                            className="w-full bg-white text-black font-body-lg text-body-lg p-input-padding rounded border-none focus:ring-2 focus:ring-primary h-[48px]" 
                                            id="email" 
                                            name="email"
                                            placeholder="name@company.com" 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button 
                                        className="w-full bg-[#4A72F3] hover:brightness-110 active:scale-[0.98] text-white font-button text-button py-3 px-4 rounded transition-all duration-200 mt-2 h-[48px]" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                    </button>
                                </form>
                            )}

                            {/* STEP 2: VERIFY OTP */}
                            {step === 2 && (
                                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-element-gap">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="otp">One-Time Password (OTP)</label>
                                        <input 
                                            className="w-full bg-white text-black font-body-lg text-body-lg p-input-padding rounded border-none focus:ring-2 focus:ring-primary tracking-[0.3em] text-center font-bold h-[48px]" 
                                            id="otp" 
                                            name="otp"
                                            placeholder="••••••" 
                                            maxLength={6}
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {devOtpHint && (
                                        <div className="p-3 bg-surface-container-high rounded border border-outline-variant text-center">
                                            <span className="font-body-sm text-body-sm text-primary font-bold">
                                                Dev OTP Hint: {devOtpHint}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <button 
                                            className="w-full bg-[#4A72F3] hover:brightness-110 active:scale-[0.98] text-white font-button text-button py-3 px-4 rounded transition-all duration-200 mt-2 h-[48px]" 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? "Verifying..." : "Verify OTP"}
                                        </button>

                                        <button 
                                            className="w-full bg-transparent hover:bg-surface-container-highest text-on-surface font-button text-button py-2 px-4 rounded border border-outline-variant transition-all duration-200 mt-1 h-[48px]" 
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 3: RESET PASSWORD */}
                            {step === 3 && (
                                <form onSubmit={handleResetPassword} className="flex flex-col gap-element-gap">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="newPassword">New Password</label>
                                        <input 
                                            className="w-full bg-white text-black font-body-lg text-body-lg p-input-padding rounded border-none focus:ring-2 focus:ring-primary h-[48px]" 
                                            id="newPassword" 
                                            name="newPassword"
                                            placeholder="••••••••" 
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="confirmPassword">Retype New Password</label>
                                        <input 
                                            className="w-full bg-white text-black font-body-lg text-body-lg p-input-padding rounded border-none focus:ring-2 focus:ring-primary h-[48px]" 
                                            id="confirmPassword" 
                                            name="confirmPassword"
                                            placeholder="••••••••" 
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <button 
                                        className="w-full bg-[#4A72F3] hover:brightness-110 active:scale-[0.98] text-white font-button text-button py-3 px-4 rounded transition-all duration-200 mt-2 h-[48px]" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating Password..." : "Reset Password"}
                                    </button>
                                </form>
                            )}
                            
                            {/* Footer Link */}
                            <div className="text-center mt-2">
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    Back to{" "}
                                    <Link href="/login" className="text-primary font-bold hover:underline">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
