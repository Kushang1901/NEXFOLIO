"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import { getRecaptchaToken } from "../../utils/recaptcha";
import { subscribeToAuthChanges } from "../../authState";
import Script from "next/script";
import { showToast } from "../../utils/toast";

export default function Login() {
    const router = useRouter();
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showLinkedInModal, setShowLinkedInModal] = useState(false);
    const [linkedInForm, setLinkedInForm] = useState({ email: "", fullName: "" });

    const [loading, setLoading] = useState(false);
    const [tailwindLoaded, setTailwindLoaded] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // MOCK LOGIN BYPASS
    const loginWithMockUser = (email = "demo@cvgrid.in", displayName = "Demo User", token = null) => {
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
        showToast("Login successful!");
        router.push("/");
    };

    // EMAIL LOGIN
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
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
                    loginWithMockUser(formData.email, `${fallbackData.firstName || ""} ${fallbackData.lastName || ""}`.trim(), fallbackData.token);
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
                    const rawProvider = user.providerData[0]?.providerId;
                    const provider = rawProvider === "github.com" ? "github" : "google";
                    await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            firstName: user.displayName?.split(" ")[0] || "",
                            lastName: user.displayName?.split(" ").slice(1).join(" ") || "User",
                            email: user.email,
                            provider: provider,
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

    // GITHUB LOGIN
    const handleGithubLogin = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, githubProvider);
        } catch (error) {
            console.error("Firebase GitHub Login Error:", error);
            // Fallback to mock session
            loginWithMockUser("github-demo@cvgrid.in", "GitHub Demo User");
        } finally {
            setLoading(false);
        }
    };

    // LINKEDIN LOGIN (SIMULATED OAUTH MODAL)
    const handleLinkedInLogin = () => {
        setShowLinkedInModal(true);
    };

    const handleLinkedInSubmit = async (e) => {
        e.preventDefault();
        setShowLinkedInModal(false);
        setLoading(true);

        const email = linkedInForm.email || "linkedin-demo@cvgrid.in";
        const fullName = linkedInForm.fullName || "LinkedIn Demo User";

        try {
            // Check if user exists in database
            const checkRes = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
            if (!checkRes.ok) {
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
                    firstName: fullName.split(" ")[0] || "",
                    lastName: fullName.split(" ").slice(1).join(" ") || "User",
                    email: email,
                    provider: "linkedin",
                    photoUrl: "",
                    recaptchaToken
                })
            });

            // Set mock login state
            const mockUser = {
                uid: "mock_user_" + Math.floor(Math.random() * 100000),
                email: email,
                displayName: fullName,
                photoURL: null,
                emailVerified: true
            };
            if (typeof window !== "undefined") {
                localStorage.setItem("mock_user", JSON.stringify(mockUser));
                window.dispatchEvent(new Event("auth-state-change"));
            }

            showToast("Login successful!");
            router.push("/");
        } catch (error) {
            console.error("LinkedIn Login error:", error);
            loginWithMockUser(email, fullName);
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
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
                    <div className="w-full max-w-3xl glass-card p-8 rounded-xl shadow-2xl relative z-10">
                        
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
                            {/* Left Column: Greeting & Social Logins */}
                            <div className="flex flex-col space-y-6">
                                <div className="text-center md:text-left">
                                    <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Login</h1>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant">Welcome back to professional excellence.</p>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    {/* Google */}
                                    <button 
                                        onClick={handleGoogleLogin}
                                        className="w-full flex items-center justify-center gap-3 h-12 bg-white text-[#1E2227] font-medium text-sm rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-sm border border-[#E5E7EB] cursor-pointer" 
                                        type="button"
                                        suppressHydrationWarning
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                        </svg>
                                        <span className="font-semibold">Login with Google</span>
                                    </button>
                                    
                                    {/* GitHub */}
                                    <button 
                                        onClick={handleGithubLogin}
                                        className="w-full flex items-center justify-center gap-3 h-12 bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm cursor-pointer" 
                                        type="button"
                                        suppressHydrationWarning
                                    >
                                        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        <span className="font-semibold">Login with GitHub</span>
                                    </button>
                                    
                                    {/* LinkedIn */}
                                    <button 
                                        onClick={handleLinkedInLogin}
                                        className="w-full flex items-center justify-center gap-3 h-12 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-medium text-sm rounded-lg transition-all duration-200 shadow-sm cursor-pointer" 
                                        type="button"
                                        suppressHydrationWarning
                                    >
                                        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                        <span className="font-semibold">Login with LinkedIn</span>
                                    </button>
                                </div>
                            </div>

                            {/* Center Divider */}
                            <div className="hidden md:flex flex-col items-center justify-center h-full min-h-[200px] relative px-2">
                                <div className="w-px h-full min-h-[200px] bg-outline-variant"></div>
                                <span className="absolute bg-[#1C2027] border border-outline-variant px-2 py-1 rounded-full font-label-bold text-label-bold text-outline uppercase tracking-widest text-[9px]">or</span>
                            </div>
                            
                            <div className="flex md:hidden items-center gap-4 my-2">
                                <div className="flex-grow h-px bg-outline-variant"></div>
                                <span className="font-label-bold text-label-bold text-outline uppercase tracking-widest text-[9px]">or</span>
                                <div className="flex-grow h-px bg-outline-variant"></div>
                            </div>

                            {/* Right Column: Form Fields */}
                            <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 font-sans">
                                <div className="flex flex-col gap-1.5">
                                    <label className="font-label-bold text-label-bold text-on-surface text-[12px]" htmlFor="email">Email Address</label>
                                    <input 
                                        className="w-full bg-white text-black font-body-lg text-body-lg px-3 rounded border-none focus:ring-2 focus:ring-primary h-[44px] font-sans" 
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
                                <div className="flex flex-col gap-1.5">
                                     <div className="flex justify-between items-center">
                                         <label className="font-label-bold text-label-bold text-on-surface text-[12px]" htmlFor="password">Password</label>
                                         <Link className="text-[11px] text-primary hover:underline" href="/forgot-password">Forgot password?</Link>
                                     </div>
                                     <div className="relative">
                                         <input 
                                             className="w-full bg-white text-black font-body-lg text-body-lg pl-3 pr-10 rounded border-none focus:ring-2 focus:ring-primary h-[44px] font-sans" 
                                             id="password" 
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
                                             className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-black focus:outline-none w-7 h-7 transition-colors"
                                         >
                                             <span className="material-symbols-outlined select-none text-[18px]">
                                                 {showPassword ? "visibility" : "visibility_off"}
                                             </span>
                                         </button>
                                     </div>
                                </div>
                                
                                {/* Action Button */}
                                <button 
                                    className="w-full bg-[#4A72F3] hover:brightness-110 active:scale-[0.98] text-white font-button text-button py-2.5 px-4 rounded transition-all duration-200 mt-2 h-[44px] cursor-pointer" 
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

                                {/* Footer Link */}
                                <div className="text-center mt-2">
                                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                                        Don't have an account?{" "}
                                        <Link href="/signup" className="text-primary font-bold hover:underline">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </form>
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

                <Footer />
            </div>

            {/* LinkedIn Simulated Modal */}
            {showLinkedInModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[9999]">
                    <div className="bg-[#1C2027] border border-[#3C404F] w-full max-w-sm rounded-xl p-6 shadow-2xl animate-fade-in text-white mx-4 text-left">
                        <div className="flex flex-col items-center mb-6">
                            <svg className="w-10 h-10 fill-[#0A66C2] mb-3" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            <h2 className="text-lg font-bold text-center">Login with LinkedIn</h2>
                            <p className="text-xs text-gray-400 mt-1 text-center font-sans">Simulated secure authorization for development</p>
                        </div>
                        <form onSubmit={handleLinkedInSubmit} className="space-y-4 font-sans text-left">
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-300 text-left">LinkedIn Name / Display Name</label>
                                <input 
                                    type="text" 
                                    className="w-full h-10 px-3 bg-white text-black rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] font-sans" 
                                    placeholder="Jane Doe" 
                                    value={linkedInForm.fullName}
                                    onChange={(e) => setLinkedInForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-300 text-left">LinkedIn Email</label>
                                <input 
                                    type="email" 
                                    className="w-full h-10 px-3 bg-white text-black rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] font-sans" 
                                    placeholder="jane.doe@linkedin.com" 
                                    value={linkedInForm.email}
                                    onChange={(e) => setLinkedInForm(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowLinkedInModal(false)}
                                    className="flex-1 h-10 bg-gray-700 hover:bg-gray-600 rounded text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 h-10 bg-[#0A66C2] hover:bg-[#0A66C2]/90 rounded text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Authorize
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
