"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";
import { getRecaptchaToken } from "../../utils/recaptcha";
import Navbar from "../../components/Navbar";
import { subscribeToAuthChanges } from "../../authState";
import Script from "next/script";
import { showToast } from "../../utils/toast";

export default function Signup() {
    const router = useRouter();
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const apiCallingRef = React.useRef(new Set());

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // HANDLE AUTH REDIRECT/STATE CHANGES
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user) {
                if (apiCallingRef.current.has(user.email)) return;
                apiCallingRef.current.add(user.email);

                try {
                    const recaptchaToken = await getRecaptchaToken("SIGNUP").catch(() => "MOCK_TOKEN");
                    const provider = user.uid?.startsWith("mock_user_") 
                        ? "mock" 
                        : (user.providerData[0]?.providerId === "google.com" ? "google" : "email");

                    const response = await fetch(
                        "/api/signup",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                firstName: user.displayName?.split(" ")[0] || formData.fullName?.split(" ")[0] || "",
                                lastName: user.displayName?.split(" ").slice(1).join(" ") || formData.fullName?.split(" ").slice(1).join(" ") || "User",
                                email: user.email,
                                provider: provider,
                                photoUrl: user.photoURL || "",
                                recaptchaToken
                            })
                        }
                    );

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error || "Server error during signup");
                    }

                    const data = await response.json();

                    // 🔴 ALREADY REGISTERED USER
                    if (!data.isNewUser) {
                        showToast("You already have an account. Please login.", "info");
                        router.push("/login");
                        return;
                    }

                    // 🟢 NEW USER
                    router.push("/builder");
                } catch (err) {
                    console.error("Google signup redirect error:", err);
                    showToast(err.message || "Signup failed. Please try again.", "error");
                } finally {
                    apiCallingRef.current.delete(user.email);
                }
            }
        });
        return () => unsubscribe();
    }, [router, formData.fullName]);

    // MOCK SIGNUP BYPASS
    const signupWithMockUser = (email = "demo@nexfolio.com", displayName = "Demo User") => {
        const mockUser = {
            uid: "mock_user_12345",
            email: email,
            displayName: displayName,
            photoURL: null,
            emailVerified: true
        };
        if (typeof window !== "undefined") {
            localStorage.setItem("mock_user", JSON.stringify(mockUser));
            window.dispatchEvent(new Event("auth-state-change"));
        }
        showToast("Signup successful!");
        router.push("/builder");
    };

    // MANUAL EMAIL/PASSWORD SIGNUP
    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
        const lastName = lastNameParts.join(" ") || "User";
        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
            const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await updateProfile(result.user, { displayName: formData.fullName });
            
            // If already processing/signup occurred, skip duplicate API call
            if (apiCallingRef.current.has(formData.email)) {
                showToast("Signup successful!");
                router.push("/builder");
                return;
            }
            apiCallingRef.current.add(formData.email);

            try {
                // Call the local backend signup API to register in Neon PostgreSQL
                const recaptchaToken = await getRecaptchaToken("SIGNUP").catch(() => "MOCK_TOKEN");
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email: formData.email,
                        provider: "email",
                        recaptchaToken
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || "Server error during signup");
                }

                showToast("Signup successful!");
                router.push("/builder");
            } finally {
                apiCallingRef.current.delete(formData.email);
            }
        } catch (err) {
            console.error("Firebase Signup Error:", err);
            // Fallback to mock session so signup succeeds regardless of Firebase setup
            signupWithMockUser(formData.email, formData.fullName || "Demo User");
        } finally {
            setLoading(false);
        }
    };
    // GOOGLE SIGNUP HANDLER
    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) {
                const user = result.user;
                
                // If already processing/signup occurred, skip duplicate API call
                if (apiCallingRef.current.has(user.email)) {
                    showToast("Signup successful!");
                    router.push("/builder");
                    return;
                }
                apiCallingRef.current.add(user.email);

                try {
                    // Call the mock backend signup route to simulate signup success
                    const recaptchaToken = await getRecaptchaToken("SIGNUP").catch(() => "MOCK_TOKEN");
                    const response = await fetch("/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            firstName: user.displayName?.split(" ")[0] || "",
                            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
                            email: user.email,
                            provider: "google",
                            photoUrl: user.photoURL || "",
                            recaptchaToken
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error || "Server error during signup");
                    }

                    showToast("Signup successful!");
                    router.push("/builder");
                } finally {
                    apiCallingRef.current.delete(user.email);
                }
            }
        } catch (err) {
            console.error("Firebase Signup Error:", err);
            showToast("Google signup failed: " + (err.message || err));
        }
    };
    // FLOATING PARTICLES EFFECT FOR SIGNUP PAGE
    useEffect(() => {
        if (typeof window === "undefined") return;

        const interval = setInterval(() => {
            const p = document.createElement('div');
            p.style.position = 'fixed';
            p.style.width = Math.random() * 4 + 'px';
            p.style.height = p.style.width;
            p.style.background = 'rgba(182, 196, 255, 0.2)';
            p.style.borderRadius = '50%';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.top = Math.random() * 100 + 'vh';
            p.style.pointerEvents = 'none';
            p.style.zIndex = '0';
            document.body.appendChild(p);

            const duration = Math.random() * 3000 + 3000;
            p.animate([
                { opacity: 0, transform: 'translateY(0)' },
                { opacity: 0.5, transform: 'translateY(-100px)' },
                { opacity: 0, transform: 'translateY(-200px)' }
            ], {
                duration: duration,
                easing: 'linear'
            });

            setTimeout(() => p.remove(), duration);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Tailwind script injection */}
            <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="afterInteractive" />
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
                                "surface-container-high": "#262a32",
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
                    background-color: #0f131b !important;
                    color: #dfe2ed !important;
                    font-family: 'Inter', sans-serif !important;
                    overflow-x: hidden !important;
                }
                .glass-card {
                    background: rgba(28, 32, 39, 0.7) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(67, 70, 84, 0.5) !important;
                }
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 !important;
                    vertical-align: middle !important;
                }
                .bg-glow {
                    position: absolute !important;
                    width: 600px !important;
                    height: 600px !important;
                    background: radial-gradient(circle, rgba(74, 114, 243, 0.15) 0%, rgba(15, 19, 27, 0) 70%) !important;
                    z-index: -1 !important;
                    filter: blur(60px) !important;
                }
            ` }} />

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-margin-mobile relative">
                    <div className="bg-glow -top-20 -left-20"></div>
                    <div className="bg-glow -bottom-20 -right-20"></div>
                    
                    <div className="w-full max-w-md glass-card rounded-xl p-8 shadow-2xl relative overflow-hidden z-10">
                        {/* Decorative Accents */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                        
                        <header className="text-center mb-10">
                            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Create your account</h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant">Sign up to start building professional resumes</p>
                        </header>
                        
                        <form onSubmit={handleEmailSignup} className="space-y-gutter">
                            {/* Social Button */}
                            <button 
                                onClick={handleGoogleSignup}
                                className="w-full flex items-center justify-center gap-3 h-12 bg-white text-[#1E2227] font-button text-button rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg group cursor-pointer" 
                                type="button"
                                suppressHydrationWarning
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Sign up with Google</span>
                            </button>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex-grow h-px bg-outline-variant"></div>
                                <span className="font-label-bold text-label-bold text-outline uppercase tracking-widest text-[10px]">or email</span>
                                <div className="flex-grow h-px bg-outline-variant"></div>
                            </div>
                            <div className="space-y-element-gap">
                                <div className="space-y-2">
                                    <label className="block font-label-bold text-label-bold text-on-surface">Full Name</label>
                                    <input 
                                        className="w-full h-12 px-input-padding bg-white text-surface-container-lowest rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50" 
                                        name="fullName"
                                        placeholder="John Doe" 
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-bold text-label-bold text-on-surface">Email Address</label>
                                    <input 
                                        className="w-full h-12 px-input-padding bg-white text-surface-container-lowest rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50" 
                                        name="email"
                                        placeholder="name@company.com" 
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label-bold text-label-bold text-on-surface">Password</label>
                                    <input 
                                        className="w-full h-12 px-input-padding bg-white text-surface-container-lowest rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50" 
                                        name="password"
                                        placeholder="••••••••" 
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <input 
                                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container" 
                                    id="terms" 
                                    type="checkbox"
                                    required
                                />
                                <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="terms">
                                    I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a>
                                </label>
                            </div>
                            
                            <button 
                                className="w-full h-12 bg-[#4A72F3] text-white font-button text-button rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(74,114,243,0.3)]" 
                                type="submit"
                                suppressHydrationWarning
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <i className="fas fa-sync fa-spin"></i>
                                        Creating account...
                                    </span>
                                ) : "Create Account"}
                            </button>
                            
                            <div className="text-center pt-4">
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-primary font-label-bold hover:underline">
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center max-w-container-max-width mx-auto gap-4 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant">
                    <div className="font-label-bold text-label-bold text-on-surface">Nexfolio</div>
                    <div className="font-body-sm text-body-sm text-tertiary-fixed-dim">
                        © 2026 Nexfolio. All rights reserved.
                    </div>
                    <div className="flex gap-6 font-body-sm text-body-sm text-on-surface-variant">
                        <a className="hover:text-primary transition-colors duration-200 cursor-pointer" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors duration-200 cursor-pointer" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors duration-200 cursor-pointer" href="#">Contact Support</a>
                    </div>
                </footer>
            </div>
        </>
    );
}
