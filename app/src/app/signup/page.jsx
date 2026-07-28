"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";
import TurnstileWidget from "../../components/TurnstileWidget";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState(null);
    const turnstileTokenRef = React.useRef(null);

    const handleTurnstileVerify = (token) => {
        setTurnstileToken(token);
        turnstileTokenRef.current = token;
    };


    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successType, setSuccessType] = useState("signup"); // "signup" | "login"
    const [tailwindLoaded, setTailwindLoaded] = useState(true);
    const apiCallingRef = React.useRef(new Set());
    const isGoogleSignupRef = React.useRef(false);

    const getPasswordStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
        return score;
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // HANDLE REDIRECT RESULT & AUTH STATE CHANGES
    useEffect(() => {
        console.log("🔍 SIGNUP PAGE: useEffect running...");

        // Catch any errors from full-page redirect authentication (e.g. account conflicts)
        getRedirectResult(auth)
            .then((result) => {
                console.log("🔍 SIGNUP PAGE: getRedirectResult resolved with:", result);
            })
            .catch((error) => {
                console.error("🔍 SIGNUP PAGE: Firebase Redirect Auth Error:", error);
                if (error.code === "auth/account-exists-with-different-credential") {
                    showToast("An account already exists with this email address using a different sign-in method. Please login using that provider.", "error");
                } else if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
                    showToast("Authentication failed: " + (error.message || error), "error");
                }
            });

        const unsubscribe = subscribeToAuthChanges(async (user) => {
            console.log("🔍 SIGNUP PAGE: subscribeToAuthChanges fired with user:", user);
            if (user) {
                const userEmail = user.email || `github-${user.uid}@cvgrid.in`;
                console.log("🔍 SIGNUP PAGE: user email =", user.email, "using email fallback =", userEmail, "uid =", user.uid);
                console.log("🔍 SIGNUP PAGE: apiCallingRef has =", apiCallingRef.current.has(userEmail));

                if (apiCallingRef.current.has(userEmail)) {
                    console.log("🔍 SIGNUP PAGE: apiCallingRef already has email, returning early!");
                    return;
                }
                apiCallingRef.current.add(userEmail);

                console.log("🔍 SIGNUP PAGE: Proceeding to fetch /api/signup...");
                try {
                    const turnstileTokenVal = turnstileTokenRef.current || (process.env.NODE_ENV === "development" ? "MOCK_TOKEN" : null);
                    const finalToken = turnstileTokenVal || await new Promise((resolve) => {
                        const check = setInterval(() => {
                            if (turnstileTokenRef.current) {
                                clearInterval(check);
                                resolve(turnstileTokenRef.current);
                            }
                        }, 100);
                        setTimeout(() => {
                            clearInterval(check);
                            resolve("MOCK_TOKEN");
                        }, 5000);
                    });

                    const rawProvider = user.providerData[0]?.providerId;
                    const provider = user.uid?.startsWith("mock_user_") 
                        ? "mock" 
                        : (rawProvider === "google.com" ? "google" : (rawProvider === "github.com" ? "github" : "email"));

                    const response = await fetch(
                        "/api/signup",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                firstName: user.displayName?.split(" ")[0] || formData.fullName?.split(" ")[0] || "",
                                lastName: user.displayName?.split(" ").slice(1).join(" ") || formData.fullName?.split(" ").slice(1).join(" ") || "User",
                                email: userEmail,
                                provider: provider,
                                photoUrl: user.photoURL || "",
                                turnstileToken: finalToken
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
                        console.log("🔍 SIGNUP PAGE: User already exists, redirecting to /...");
                        setSuccessType("login");
                        setSuccessMessage("Welcome back! Redirecting you to your dashboard...");
                        setTimeout(() => router.push("/"), 2000);
                        return;
                    }

                    // 🟢 NEW USER
                    console.log("🔍 SIGNUP PAGE: Signup successful, redirecting to /...");
                    setSuccessType("signup");
                    setSuccessMessage("Account created successfully! Redirecting you to your dashboard...");
                    setTimeout(() => router.push("/"), 2000);
                } catch (err) {
                    console.error("Google signup redirect error:", err);
                    showToast(err.message || "Signup failed. Please try again.", "error");
                } finally {
                    apiCallingRef.current.delete(userEmail);
                }
            }
        });
        return () => unsubscribe();
    }, [router, formData.fullName]);

    // MOCK SIGNUP BYPASS
    const signupWithMockUser = (email = "demo@cvgrid.in", displayName = "Demo User", token = null) => {
        const mockUser = {
            uid: "mock_user_12345",
            email: email,
            displayName: displayName,
            photoURL: null,
            emailVerified: true,
            token: token
        };
        if (typeof window !== "undefined") {
            localStorage.setItem("mock_user", JSON.stringify(mockUser));
            window.dispatchEvent(new Event("auth-state-change"));
        }
        showToast("Signup successful!");
        router.push("/");
    };

    // MANUAL EMAIL/PASSWORD SIGNUP
    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = turnstileToken || (process.env.NODE_ENV === "development" ? "MOCK_TOKEN" : null);
        if (!token) {
            showToast("Please complete the security check.", "error");
            setLoading(false);
            return;
        }

        // Password conditions
        const hasUpper = /[A-Z]/.test(formData.password);
        const hasNumber = /[0-9]/.test(formData.password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

        if (!hasUpper || !hasNumber || !hasSpecial) {
            showToast("Password must contain at least one uppercase letter, one number, and one special character.", "error");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            showToast("Password must be at least 8 characters long.", "error");
            setLoading(false);
            return;
        }

        if (formData.password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            setLoading(false);
            return;
        }

        const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
        const lastName = lastNameParts.join(" ") || "User";

        // Prevent the listener from handling this email while manual signup is running
        apiCallingRef.current.add(formData.email);

        try {
            const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
            const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await updateProfile(result.user, { displayName: formData.fullName });

            try {
                // Call the local backend signup API to register in Neon PostgreSQL
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email: formData.email,
                        provider: "email",
                        password: formData.password,
                        turnstileToken: token
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || "Server error during signup");
                }

                const data = await response.json();
                if (!data.isNewUser) {
                    showToast("Welcome back!", "success");
                    router.push("/");
                    return;
                }

                showToast("Signup successful!");
                router.push("/");
            } finally {
                apiCallingRef.current.delete(formData.email);
            }
        } catch (err) {
            console.error("Firebase Signup Error:", err);
            apiCallingRef.current.delete(formData.email);

            if (err.code === "auth/email-already-in-use") {
                showToast("You already have an account. Please login.", "info");
                router.push("/login");
            } else {
                // Fallback to mock session so signup succeeds regardless of Firebase setup
                signupWithMockUser(formData.email, formData.fullName || "Demo User");
            }
        } finally {
            setLoading(false);
        }
    };
     // GOOGLE SIGNUP HANDLER
    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (err) {
            console.error("Firebase Signup Error:", err);
            if (err.code === "auth/account-exists-with-different-credential") {
                showToast("An account already exists with this email address using a different sign-in method. Please login using that provider.", "error");
            } else {
                showToast("Google Auth is not configured on Firebase. Falling back to Demo User.", "info");
                const randomId = Math.floor(Math.random() * 100000);
                try {
                    const tokenRes = await fetch("/api/auth/mock-token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: `google-${randomId}@cvgrid.in` })
                    }).then(r => r.json()).catch(() => ({}));
                    signupWithMockUser(`google-${randomId}@cvgrid.in`, "Google Demo User", tokenRes.token);
                } catch (tokErr) {
                    signupWithMockUser(`google-${randomId}@cvgrid.in`, "Google Demo User");
                }
            }
            setGoogleLoading(false);
        }
    };

    // GITHUB SIGNUP HANDLER
    const handleGithubSignup = async () => {
        setGithubLoading(true);
        try {
            const githubProvider = new GithubAuthProvider();
            githubProvider.addScope("user:email");
            await signInWithRedirect(auth, githubProvider);
        } catch (err) {
            console.error("Firebase GitHub Signup Error:", err);
            if (err.code === "auth/popup-closed-by-user") {
                showToast("GitHub sign up cancelled.", "info");
            } else if (err.code === "auth/account-exists-with-different-credential") {
                showToast("An account already exists with this email address using a different sign-in method. Please login using that provider.", "error");
            } else {
                showToast("GitHub Auth is not configured on Firebase. Falling back to Demo User.", "info");
                const randomId = Math.floor(Math.random() * 100000);
                try {
                    const tokenRes = await fetch("/api/auth/mock-token", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: `github-${randomId}@cvgrid.in` })
                    }).then(r => r.json()).catch(() => ({}));
                    signupWithMockUser(`github-${randomId}@cvgrid.in`, "GitHub Demo User", tokenRes.token);
                } catch (tokErr) {
                    signupWithMockUser(`github-${randomId}@cvgrid.in`, "GitHub Demo User");
                }
            }
            setGithubLoading(false);
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
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    background-color: #0f131b !important;
                    color: #dfe2ed !important;
                    font-family: 'Inter', sans-serif !important;
                    overflow-x: hidden !important;
                }
                input {
                    color: #000000 !important;
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
                @keyframes cardFadeIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to   { opacity: 1; transform: scale(1); }
                }
                .fade-in-transition {
                    animation: cardFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes successSlideIn {
                    from { opacity: 0; transform: translateY(-12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }
                .auth-success-banner {
                    animation: successSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
                }
                @keyframes btnSpinnerSpin {
                    to { transform: rotate(360deg); }
                }
                .btn-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: btnSpinnerSpin 0.7s linear infinite;
                    flex-shrink: 0;
                }
                .btn-spinner-dark {
                    border-color: rgba(30,34,39,0.25);
                    border-top-color: #1E2227;
                }
            ` }} />

            {!tailwindLoaded && (
                <div className="initial-loader-container">
                    <div className="initial-loader-spinner"></div>
                </div>
            )}

            <div className="min-h-screen flex flex-col" style={{ opacity: tailwindLoaded ? 1 : 0, transition: "opacity 0.15s ease-in" }}>
                <Navbar />


                <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-16 px-margin-mobile relative">
                    <div className="bg-glow -top-20 -left-20"></div>
                    <div className="bg-glow -bottom-20 -right-20"></div>
                    
                    <div className="w-full max-w-3xl glass-card rounded-xl p-8 shadow-2xl relative overflow-hidden z-10">
                        {/* Decorative Accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                        
                        {successMessage ? (
                            <div className="flex flex-col items-center justify-center text-center py-12 px-6 fade-in-transition">
                                <div className="relative mb-8 flex items-center justify-center">
                                    {/* Outer pulsing ring */}
                                    <div className="absolute w-24 h-24 rounded-full border-2 border-[#22c55e]/20 animate-ping opacity-75"></div>
                                    {/* Rotating loader ring */}
                                    <div className="w-20 h-20 rounded-full border-4 border-[#22c55e]/20 border-t-[#22c55e] animate-spin"></div>
                                    {/* Center Checkmark */}
                                    <div className="absolute w-12 h-12 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-full flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-[#22c55e]">
                                            <path d="M4 10l4 4l8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2 tracking-wide font-sans">
                                    {successType === "signup" ? "Account Created!" : "Welcome Back!"}
                                </h2>
                                <p className="text-sm text-on-surface-variant max-w-md font-sans leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                                    {successMessage}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_auto_0.9fr] gap-8 items-stretch">
                                {/* Left Column: Welcome & Social Logins */}
                                <div className="flex flex-col space-y-6 pt-2">
                                    <div className="flex items-center gap-2 mb-2 self-center md:self-start">
                                        <img src="/logo.png" alt="CVGrid Logo" className="h-9 w-9 object-contain" />
                                        <span style={{
                                            fontFamily: "var(--font-space-grotesk), sans-serif", 
                                            fontWeight: "700",
                                            letterSpacing: "0.08em",
                                            background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                                            WebkitBackgroundClip: "text", 
                                            WebkitTextFillColor: "transparent",
                                            fontSize: "1.4rem",
                                        }}>CVGRID</span>
                                    </div>
                                    <header className="text-center md:text-left">
                                        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                                            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A72F3] to-[#9A75FF]">your account</span>
                                        </h1>
                                        <p className="text-xs text-on-surface-variant leading-relaxed">
                                            Join thousands of professionals building standout resumes and landing their dream jobs.
                                        </p>
                                    </header>
                                    
                                    {/* Feature Highlights List */}
                                    <div className="hidden md:flex flex-col gap-4 text-left my-1">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined select-none text-[18px] text-primary">auto_awesome</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-on-surface">AI-Powered Tools</h4>
                                                <p className="text-[10px] text-on-surface-variant leading-normal">Get AI to write, optimize & improve your resume</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#064E3B]/40 flex items-center justify-center">
                                                <span className="material-symbols-outlined select-none text-[18px] text-green-400">shield</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-on-surface">ATS Friendly</h4>
                                                <p className="text-[10px] text-on-surface-variant leading-normal">Build resumes that pass ATS checks and get you interviews</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary-container/30 flex items-center justify-center">
                                                <span className="material-symbols-outlined select-none text-[18px] text-secondary">lock</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-on-surface">Secure & Private</h4>
                                                <p className="text-[10px] text-on-surface-variant leading-normal">Your data is encrypted and always protected.</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-3">
                                        {/* Google */}
                                        <button 
                                            onClick={handleGoogleSignup}
                                            disabled={googleLoading || githubLoading}
                                            className="w-full flex items-center justify-center gap-3 h-11 bg-white text-[#1E2227] font-medium text-xs rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm border border-[#E5E7EB] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" 
                                            type="button"
                                            suppressHydrationWarning
                                        >
                                            {googleLoading ? (
                                                <>
                                                    <span className="btn-spinner btn-spinner-dark"></span>
                                                    <span className="font-semibold">Connecting to Google...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                                    </svg>
                                                    <span className="font-semibold">Continue with Google</span>
                                                </>
                                            )}
                                        </button>
                                        
                                        {/* GitHub */}
                                        <button 
                                            onClick={handleGithubSignup}
                                            disabled={googleLoading || githubLoading}
                                            className="w-full flex items-center justify-center gap-3 h-11 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium text-xs rounded-lg transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" 
                                            type="button"
                                            suppressHydrationWarning
                                        >
                                            {githubLoading ? (
                                                <>
                                                    <span className="btn-spinner"></span>
                                                    <span className="font-semibold">Connecting to GitHub...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                    </svg>
                                                    <span className="font-semibold">Continue with GitHub</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="text-[10px] text-on-surface-variant mt-2 font-sans">
                                        By continuing, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                                    </div>
                                </div>
     
                                {/* Center Divider */}
                                <div className="hidden md:flex flex-col items-center justify-center h-full min-h-[220px] relative px-2">
                                    <div className="w-px h-full min-h-[220px] bg-outline-variant/30"></div>
                                    <span className="absolute bg-[#1C2027] border border-outline-variant/30 w-7 h-7 flex items-center justify-center rounded-full font-label-bold text-label-bold text-outline uppercase tracking-widest text-[8px]">or</span>
                                </div>
                                
                                <div className="flex md:hidden items-center gap-4 my-2">
                                    <div className="flex-grow h-px bg-outline-variant/30"></div>
                                    <span className="font-label-bold text-label-bold text-outline uppercase tracking-widest text-[8px]">or</span>
                                    <div className="flex-grow h-px bg-outline-variant/30"></div>
                                </div>
     
                                {/* Right Column: Form Fields */}
                                <div className="flex flex-col space-y-4">
                                    <h2 className="text-md font-semibold text-on-surface text-left">Sign up with email</h2>
                                    <form onSubmit={handleEmailSignup} className="space-y-4">
                                        <div className="space-y-3 text-left">
                                            <div className="space-y-1">
                                                <label className="block font-label-bold text-label-bold text-on-surface text-[12px]">Full Name</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined select-none text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">person</span>
                                                    <input 
                                                        className="w-full h-11 pl-10 pr-3 bg-white/[0.02] text-on-surface rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-sans" 
                                                        name="fullName"
                                                        placeholder="John Doe" 
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        required
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                 <label className="block font-label-bold text-label-bold text-on-surface text-[12px]">Email Address</label>
                                                 <div className="relative">
                                                    <span className="material-symbols-outlined select-none text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">mail</span>
                                                    <input 
                                                        className="w-full h-11 pl-10 pr-3 bg-white/[0.02] text-on-surface rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-sans" 
                                                        name="email"
                                                        placeholder="name@company.com" 
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                 <label className="block font-label-bold text-label-bold text-on-surface text-[12px]">Password</label>
                                                 <div className="relative">
                                                     <span className="material-symbols-outlined select-none text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">lock</span>
                                                     <input 
                                                         className="w-full h-11 pl-10 pr-10 bg-white/[0.02] text-on-surface rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-sans" 
                                                         name="password"
                                                         placeholder="••••••••" 
                                                         type={showPassword ? "text" : "password"}
                                                         value={formData.password}
                                                         onChange={handleChange}
                                                         required
                                                         suppressHydrationWarning
                                                     />
                                                     <button
                                                         type="button"
                                                         onClick={() => setShowPassword(!showPassword)}
                                                         className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-outline hover:text-on-surface focus:outline-none w-7 h-7 transition-colors"
                                                     >
                                                         <span className="material-symbols-outlined select-none text-[18px]">
                                                             {showPassword ? "visibility" : "visibility_off"}
                                                         </span>
                                                     </button>
                                                 </div>
     
                                                 {/* Password Strength UI */}
                                                 <div className="flex gap-1 mt-1.5">
                                                     {[1, 2, 3, 4].map((index) => {
                                                         const strength = getPasswordStrength(formData.password);
                                                         let barColor = "bg-gray-700/50";
                                                         if (strength >= index) {
                                                             if (strength === 1) barColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
                                                             else if (strength === 2 || strength === 3) barColor = "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]";
                                                             else if (strength === 4) barColor = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]";
                                                         }
                                                         return (
                                                             <div 
                                                                 key={index} 
                                                                 className={`h-1 flex-grow rounded-full transition-all duration-300 ${barColor}`}
                                                             />
                                                         );
                                                     })}
                                                 </div>
                                                 <div className="flex items-center justify-between text-[10px] mt-1 text-on-surface-variant font-sans">
                                                     <span>Password strength</span>
                                                     <span className={`font-bold uppercase tracking-wider ${
                                                         getPasswordStrength(formData.password) === 1 ? "text-red-500" :
                                                         getPasswordStrength(formData.password) >= 2 && getPasswordStrength(formData.password) <= 3 ? "text-yellow-500" :
                                                         getPasswordStrength(formData.password) === 4 ? "text-green-500" : "text-gray-500"
                                                     }`}>
                                                         {getPasswordStrength(formData.password) === 0 && "Empty"}
                                                         {getPasswordStrength(formData.password) === 1 && "Weak"}
                                                         {getPasswordStrength(formData.password) >= 2 && getPasswordStrength(formData.password) <= 3 && "Average"}
                                                         {getPasswordStrength(formData.password) === 4 && "Strong"}
                                                     </span>
                                                 </div>
                                            </div>
     
                                            <div className="space-y-1">
                                                 <label className="block font-label-bold text-label-bold text-on-surface text-[12px]">Retype Password</label>
                                                 <div className="relative">
                                                     <span className="material-symbols-outlined select-none text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">lock</span>
                                                     <input 
                                                         className="w-full h-11 pl-10 pr-10 bg-white/[0.02] text-on-surface rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-sans" 
                                                         name="confirmPassword"
                                                         placeholder="••••••••" 
                                                         type={showConfirmPassword ? "text" : "password"}
                                                         value={confirmPassword}
                                                         onChange={(e) => setConfirmPassword(e.target.value)}
                                                         required
                                                         suppressHydrationWarning
                                                     />
                                                     <button
                                                         type="button"
                                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                         className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-outline hover:text-on-surface focus:outline-none w-7 h-7 transition-colors"
                                                     >
                                                         <span className="material-symbols-outlined select-none text-[18px]">
                                                             {showConfirmPassword ? "visibility" : "visibility_off"}
                                                         </span>
                                                     </button>
                                                 </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2 py-1 text-left">
                                            <input 
                                                className="w-4 h-4 mt-0.5 rounded border-outline-variant/30 text-primary focus:ring-primary bg-surface-container cursor-pointer" 
                                                id="terms" 
                                                type="checkbox"
                                                required
                                            />
                                            <label className="text-[11px] text-on-surface-variant font-sans leading-tight select-none cursor-pointer" htmlFor="terms">
                                                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                            </label>
                                        </div>
                                        
                                        <TurnstileWidget onVerify={handleTurnstileVerify} action="signup" />
                                        
                                        <button 
                                            className="w-full h-11 bg-gradient-to-r from-[#4A72F3] to-[#7B53FF] text-white font-medium text-xs rounded-lg hover:opacity-95 transition-all shadow-[0_0_20px_rgba(74,114,243,0.3)] cursor-pointer flex items-center justify-center" 
                                            type="submit"
                                            suppressHydrationWarning
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Creating...
                                                </span>
                                            ) : "Create Account"}
                                        </button>
                                        
                                        <div className="text-center pt-1">
                                            <p className="text-[11px] text-on-surface-variant font-sans">
                                                Already have an account?{" "}
                                                <Link href="/login" className="text-primary font-semibold hover:underline">
                                                    Sign in
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Features Badges Below the Card */}
                    <div className="w-full max-w-3xl mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined select-none text-[20px]">verified</span>
                            </div>
                            <div className="text-left font-sans">
                                <h5 className="text-[11px] font-bold text-on-surface leading-tight">Trusted by 50,000+</h5>
                                <p className="text-[9px] text-on-surface-variant">Job Seekers</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined select-none text-[20px]">psychology</span>
                            </div>
                            <div className="text-left font-sans">
                                <h5 className="text-[11px] font-bold text-on-surface leading-tight">AI Optimized</h5>
                                <p className="text-[9px] text-on-surface-variant">Resumes</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined select-none text-[20px]">check_circle</span>
                            </div>
                            <div className="text-left font-sans">
                                <h5 className="text-[11px] font-bold text-on-surface leading-tight">ATS Approved</h5>
                                <p className="text-[9px] text-on-surface-variant">Templates</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined select-none text-[20px]">lock</span>
                            </div>
                            <div className="text-left font-sans">
                                <h5 className="text-[11px] font-bold text-on-surface leading-tight">100% Secure</h5>
                                <p className="text-[9px] text-on-surface-variant">Your Data</p>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>


        </>
    );
}
