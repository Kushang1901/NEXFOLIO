"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { getRecaptchaToken } from "../../utils/recaptcha";
import { subscribeToAuthChanges } from "../../authState";
import Script from "next/script";
import { showToast } from "../../utils/toast";

export default function Login() {
    const router = useRouter();
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [tailwindLoaded, setTailwindLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && window.tailwind) {
            setTailwindLoaded(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // MOCK LOGIN BYPASS
    const loginWithMockUser = (email = "demo@cvgrid.in", displayName = "Demo User") => {
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
        showToast("Login successful!");
        router.push("/");
    };

    // EMAIL LOGIN
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Verify that the user exists in PostgreSQL Neon Database before authentication
            const checkRes = await fetch(`/api/user?email=${encodeURIComponent(formData.email)}`);
            if (!checkRes.ok) {
                showToast("Account does not exist. Please sign up first!");
                router.push("/signup");
                setLoading(false);
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
            } catch (firebaseError) {
                console.warn("Firebase authentication failed. Trying database credentials fallback...", firebaseError);
                
                // Fallback: Validate credentials against PostgreSQL
                const fallbackRes = await fetch("/api/login/fallback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });

                if (fallbackRes.ok) {
                    const fallbackData = await fallbackRes.json();
                    loginWithMockUser(formData.email, `${fallbackData.firstName || ""} ${fallbackData.lastName || ""}`.trim());
                    return;
                } else {
                    const fallbackData = await fallbackRes.json().catch(() => ({}));
                    const errorMessage = fallbackData.error || firebaseError.message || firebaseError;
                    showToast("Login failed: " + errorMessage);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("General Login Error:", error);
            showToast("Login failed: " + (error.message || error));
            setLoading(false);
        }
    };

    // HANDLE REDIRECT RESULT & AUTH STATE CHANGES
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user) {
                if (user.uid === "mock_user_12345") {
                    router.push("/");
                    return;
                }

                setLoading(true);
                try {
                    // Double check database existence to handle Google sign-ins cleanly
                    const checkRes = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
                    if (!checkRes.ok) {
                        const { signOut } = await import("firebase/auth");
                        await signOut(auth);
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("mock_user");
                        }
                        showToast("Account does not exist. Please sign up first!");
                        router.push("/signup");
                        setLoading(false);
                        return;
                    }

                    const recaptchaToken = await getRecaptchaToken("LOGIN").catch(() => "MOCK_TOKEN");
                    await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            firstName: user.displayName?.split(" ")[0] || "",
                            lastName: user.displayName?.split(" ")[1] || "",
                            email: user.email,
                            provider: "google",
                            photoUrl: user.photoURL || "",
                            recaptchaToken
                        })
                    });
                    
                    showToast("Login successful!");
                    router.push("/");
                } catch (error) {
                    console.error("Login verification error:", error);
                    showToast("Login verification failed: " + (error.message || error));
                } finally {
                    setLoading(false);
                }
            }
        });
        return () => unsubscribe();
    }, [router, auth]);

    // GOOGLE LOGIN
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Firebase Google Login Error:", error);
            showToast("Google login failed: " + (error.message || error));
            setLoading(false);
        }
    };



    return (
        <>
            {/* Tailwind script injection */}
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
                    
                    {/* Login Card */}
                    <div className="glass-card w-full max-w-md p-8 rounded-xl shadow-2xl relative z-10">
                        <div className="flex flex-col gap-6">
                            {/* Heading */}
                            <div className="text-center">
                                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Login</h1>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">Welcome back to professional excellence.</p>
                            </div>
                            {/* Google Login */}
                            <button 
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-highest hover:bg-surface-container-high transition-colors border border-outline-variant rounded-lg font-button text-button text-on-surface cursor-pointer h-[48px]"
                                type="button"
                                suppressHydrationWarning
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                Login with Google
                            </button>
                            
                            {/* Separator */}
                            <div className="flex items-center gap-4">
                                <div className="flex-grow h-[1px] bg-outline-variant"></div>
                                <span className="font-body-sm text-body-sm text-outline uppercase tracking-widest text-[10px]">or</span>
                                <div className="flex-grow h-[1px] bg-outline-variant"></div>
                            </div>
                            {/* Form Fields */}
                            <form onSubmit={handleEmailLogin} className="flex flex-col gap-element-gap">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">Email Address</label>
                                    <input 
                                        className="w-full bg-white text-black font-body-lg text-body-lg p-input-padding rounded border-none focus:ring-2 focus:ring-primary h-[48px]" 
                                        id="email" 
                                        name="email"
                                        placeholder="name@company.com" 
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                     <div className="flex justify-between items-center">
                                         <label className="font-label-bold text-label-bold text-on-surface" htmlFor="password">Password</label>
                                         <Link className="text-[12px] text-primary hover:underline" href="/forgot-password">Forgot password?</Link>
                                     </div>
                                    <input 
                                        className="w-full bg-white text-black font-body-lg text-body-lg p-input-padding rounded border-none focus:ring-2 focus:ring-primary h-[48px]" 
                                        id="password" 
                                        name="password"
                                        placeholder="••••••••" 
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                
                                {/* Action Button */}
                                <button 
                                    className="w-full bg-[#4A72F3] hover:brightness-110 active:scale-[0.98] text-white font-button text-button py-3 px-4 rounded transition-all duration-200 mt-2 h-[48px]" 
                                    type="submit"
                                    suppressHydrationWarning
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <i className="fas fa-sync fa-spin"></i>
                                            Authenticating...
                                        </span>
                                    ) : "Login"}
                                </button>
                            </form>
                            
                            {/* Footer Link */}
                            <div className="text-center mt-2">
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="text-primary font-bold hover:underline">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Image Context (Background Context) */}
                    <div className="hidden lg:block absolute right-10 bottom-10 opacity-20 pointer-events-none w-64 h-64">
                        <img 
                            className="w-full h-full object-contain" 
                            alt="A clean, minimalist 3D isometric representation of a professional resume with glowing digital highlights. The aesthetic uses a dark slate background with neon blue accents to match a modern career-focused AI tool. Soft depth-of-field lighting creates a sophisticated, high-end tech environment." 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNsfE6PKLdtsQzMTpppyyFohX0H6GKX_AI54QlcdC-unJKXA8Oa5fsBUClpln38i1UBMRkTzfKzRp8HFoi5BzFJWnsPrzLmQDHXIvYvjRXklaMa6tuEYJhyyxY1xXahx1UYUPmzvWbxCH_DZm-yGIWAneuGq-iY0J2zb9z3jNWKGf5qPmkx4KriZ8mma3h3ZOTrHv32gF8LexMCKVsCMMkqdpNYngUzlW6Fhj9BQvqAG0nh7uR8-Nm4VsKevDRMdBiDQ1OYL3g9g"
                        />
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center max-w-container-max-width mx-auto gap-4 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant">
                    <div className="font-label-bold text-label-bold text-on-surface">CVGrid</div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <span className="font-body-sm text-body-sm text-tertiary-fixed-dim">© 2026 CVGrid. All rights reserved.</span>
                        <div className="flex gap-6">
                            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer" href="/privacy">Privacy Policy</Link>
                            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer" href="/terms">Terms of Service</Link>
                            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer" href="/contact">Contact Support</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
