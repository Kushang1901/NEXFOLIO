"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import Script from "next/script";
import { Sparkles, LayoutTemplate, ShieldCheck, ArrowLeft, RefreshCw, Crown, Code, Eye, Download, Play, Save, Lock, Edit3 } from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import { subscribeToAuthChanges } from "../../../authState";
import JSZip from "jszip";

export default function PortfolioBuilderPage() {
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [isPortfolioPaid, setIsPortfolioPaid] = useState(false);
    const [loadingResumes, setLoadingResumes] = useState(true);
    
    // Purchase modal state
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Generator states
    const [templateType, setTemplateType] = useState("dark_glass");
    const [generating, setGenerating] = useState(false);
    
    // Generated Code States
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [activeEditorTab, setActiveEditorTab] = useState("html"); // html, css, js
    
    const iframeRef = useRef(null);

    // 1. Auth Subscription & Fetch Resumes
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            setUser(loggedUser);
            if (loggedUser) {
                try {
                    setLoadingResumes(true);
                    const res = await fetch("/api/resumes");
                    if (res.ok) {
                        const data = await res.json();
                        setResumes(data);
                        if (data.length > 0) {
                            setSelectedResumeId(data[0].id);
                            // Check if portfolio is paid for the first resume
                            setIsPortfolioPaid(data[0].isPortfolioPaid || false);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching resumes:", err);
                } finally {
                    setLoadingResumes(false);
                }
            } else {
                setLoadingResumes(false);
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, []);

    // Sync payment state when selected resume changes
    useEffect(() => {
        if (!selectedResumeId || resumes.length === 0) return;
        const selected = resumes.find(r => r.id === parseInt(selectedResumeId));
        if (selected) {
            setIsPortfolioPaid(selected.isPortfolioPaid || false);
        }
    }, [selectedResumeId, resumes]);

    // 2. Open Razorpay Checkout for ₹499 Portfolio Builder Upgrade
    const handlePurchase = async () => {
        if (!user) {
            showToast("Please log in to purchase premium features.", "error");
            return;
        }
        if (!selectedResumeId) {
            showToast("Please select or create a resume before upgrading.", "error");
            return;
        }

        setPaymentProcessing(true);
        try {
            // 1. Create order on the backend for type "portfolio"
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_order",
                    resumeId: selectedResumeId,
                    type: "portfolio"
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create order");
            }

            const { orderId, amount, currency } = await response.json();

            // 2. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TDTM6sBKdckc4Y",
                amount: amount,
                currency: currency,
                name: "CVGrid Premium Portfolio",
                description: "Unlock AI Portfolio Website Generator & Code Downloader",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        setPaymentProcessing(true);
                        // 3. Verify payment on backend
                        const verifyRes = await fetch("/api/payments", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "verify_payment",
                                resumeId: selectedResumeId,
                                type: "portfolio",
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setIsPortfolioPaid(true);
                            setShowUpgradeModal(false);
                            // Update local resumes list status
                            setResumes(prev => prev.map(r => r.id === parseInt(selectedResumeId) ? { ...r, isPortfolioPaid: true } : r));
                            showToast("Payment Successful! Premium Portfolio unlocked.", "success");
                        } else {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        showToast(err.message || "Payment verification failed. Please contact support.", "error");
                    } finally {
                        setPaymentProcessing(false);
                    }
                },
                prefill: {
                    email: user.email
                },
                theme: {
                    color: "#f59e0b"
                },
                modal: {
                    ondismiss: function () {
                        showToast("Payment cancelled.", "warning");
                        setPaymentProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Razorpay error:", err);
            showToast(err.message || "Could not launch payment gateway.", "error");
            setPaymentProcessing(false);
        }
    };

    // 3. Call AI portfolio builder endpoint
    const handleGeneratePortfolio = async () => {
        if (!selectedResumeId) {
            showToast("Please select a resume.", "error");
            return;
        }
        if (!isPortfolioPaid) {
            setShowUpgradeModal(true);
            return;
        }

        setGenerating(true);
        try {
            const targetResume = resumes.find(r => r.id === parseInt(selectedResumeId));
            if (!targetResume) throw new Error("Resume details not found.");

            const res = await fetch("/api/ai/portfolio-builder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData: targetResume.resumeData,
                    templateType
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to generate portfolio");
            }

            const data = await res.json();
            setHtmlCode(data.html || "");
            setCssCode(data.css || "");
            setJsCode(data.js || "");
            showToast("Portfolio website generated successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to build portfolio.", "error");
        } finally {
            setGenerating(false);
        }
    };

    // 4. Update preview iframe content
    useEffect(() => {
        if (!htmlCode || !iframeRef.current) return;
        
        let compiledSource = htmlCode;
        // Inject Tailwind CDN if using dark_glass/modern layout
        if (templateType === "dark_glass") {
            compiledSource = compiledSource.replace("</head>", `<script src="https://cdn.tailwindcss.com"></script></head>`);
        }
        // Inject CSS and JS files
        compiledSource = compiledSource.replace("</head>", `<style>${cssCode}</style></head>`);
        compiledSource = compiledSource.replace("</body>", `<script>${jsCode}</script></body>`);
        
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        doc.open();
        doc.write(compiledSource);
        doc.close();
    }, [htmlCode, cssCode, jsCode, templateType]);

    // 5. ZIP download of source code
    const handleDownloadZip = async () => {
        if (!htmlCode) return;
        
        try {
            const zip = new JSZip();
            zip.file("index.html", htmlCode);
            zip.file("style.css", cssCode);
            zip.file("script.js", jsCode);

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Portfolio_${templateType}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast("Portfolio source code downloaded as ZIP!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to compile ZIP archive.", "error");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            {/* Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            {/* Breadcrumb */}
            <div className="container pt-5">
                <Link href="/ai-tools" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }} className="hover-white">
                    <ArrowLeft size={16} /> Back to AI Tools Suite
                </Link>
            </div>

            {/* Hero */}
            <section style={{ textAlign: "center", padding: "40px 24px 20px" }}>
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#fbbf24", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Crown size={13} className="text-amber-400 fill-amber-400 animate-pulse" /> Premium AI Portfolio Builder
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "16px" }}>
                        AI Recruiter Portfolio Website
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Instantly deploy a beautiful, custom developer portfolio site. Choose a style template, preview, customize content, and download the full ZIP source code.
                    </p>
                </div>
            </section>

            {/* Main Panel */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    
                    {/* Choose Resume & Upgrade Banner */}
                    <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3 p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "16px" }}>
                        <div style={{ flex: 1, minWidth: "280px" }}>
                            <label className="form-label text-white fw-bold mb-2 small d-block">1. Select Target Resume</label>
                            {loadingResumes ? (
                                <div className="text-white-50 small">Loading resumes...</div>
                            ) : resumes.length === 0 ? (
                                <div className="text-danger small">No saved resumes found. Go to templates and save a resume first!</div>
                            ) : (
                                <select 
                                    value={selectedResumeId}
                                    onChange={(e) => setSelectedResumeId(e.target.value)}
                                    className="form-select glass-input-custom w-100"
                                >
                                    {resumes.map(r => (
                                        <option key={r.id} value={r.id}>{r.resumeName}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="d-flex flex-column align-items-md-end justify-content-center gap-1">
                            <span className="text-white-50 small">Portfolio License Status:</span>
                            {isPortfolioPaid ? (
                                <span className="badge bg-success/15 text-success border border-success/30 px-3 py-2 d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
                                    <ShieldCheck size={14} /> Unlocked (Premium)
                                </span>
                            ) : (
                                <button 
                                    onClick={() => setShowUpgradeModal(true)}
                                    disabled={!selectedResumeId}
                                    className="btn btn-sm btn-gradient-premium d-flex align-items-center gap-2 px-3.5 py-2.5"
                                    style={{ borderRadius: "8px", fontSize: "0.85rem", background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}
                                >
                                    <Lock size={14} /> Unlock Premium for ₹499
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Generator Controls */}
                    {isPortfolioPaid ? (
                        <div className="row g-4 mb-4">
                            {/* Layout Selection */}
                            <div className="col-md-7">
                                <label className="form-label text-white fw-bold mb-2 small d-block">2. Choose Portfolio Template Layout</label>
                                <div className="row g-3">
                                    {[
                                        { id: "classic", title: "Elegant Classic", desc: "Traditional typography, clean lines, professional business style." },
                                        { id: "dark_glass", title: "Glassmorphic Dark", desc: "Vibrant gradient spotlights, translucent blur card layouts, animations." },
                                        { id: "dev_terminal", title: "Terminal monospaced", desc: "Command-line shell prompt theme with typewriter effects." }
                                    ].map(t => (
                                        <div className="col-sm-4" key={t.id}>
                                            <div 
                                                onClick={() => setTemplateType(t.id)}
                                                className={`p-3 text-center h-100 cursor-pointer border rounded-12 transition-all`}
                                                style={{
                                                    cursor: "pointer",
                                                    background: templateType === t.id ? "rgba(245, 158, 11, 0.05)" : "rgba(255,255,255,0.01)",
                                                    borderColor: templateType === t.id ? "rgba(245, 158, 11, 0.45)" : "rgba(255,255,255,0.06)",
                                                    borderRadius: "12px"
                                                }}
                                            >
                                                <LayoutTemplate size={20} className="mb-2" style={{ color: templateType === t.id ? "#f59e0b" : "rgba(255,255,255,0.4)" }} />
                                                <h4 className="fw-bold mb-1" style={{ fontSize: "0.85rem", color: templateType === t.id ? "#fff" : "rgba(255,255,255,0.7)" }}>{t.title}</h4>
                                                <p className="text-white-50 small mb-0" style={{ fontSize: "0.7rem", lineHeight: "1.3" }}>{t.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trigger Generation */}
                            <div className="col-md-5 d-flex align-items-end justify-content-end">
                                <button
                                    onClick={handleGeneratePortfolio}
                                    disabled={generating}
                                    className="btn btn-lg btn-gradient-premium py-3 px-5 w-100"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        fontSize: "1rem",
                                        background: "linear-gradient(135deg, #f59e0b, #d97706)"
                                    }}
                                >
                                    {generating ? (
                                        <>
                                            <RefreshCw size={18} className="animate-spin" />
                                            Developing Portfolio Site...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} /> Generate Portfolio Website
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 border border-dashed rounded-16" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.01)" }}>
                            <h3 className="fw-bold mb-2">Premium Portfolio Builder Locked</h3>
                            <Lock size={48} className="text-amber-500 my-3 mx-auto" style={{ display: "block" }} />
                            <p className="text-white-50 max-w-md mx-auto mb-4" style={{ fontSize: "0.95rem" }}>
                                Generate, preview, edit, and download the full ZIP source code of a premium portfolio website from your resume.
                            </p>
                            <button 
                                onClick={() => setShowUpgradeModal(true)}
                                className="btn btn-gradient-premium py-2.5 px-4"
                                style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}
                            >
                                View Premium Unlock Modal
                            </button>
                        </div>
                    )}

                    {/* Code Editor and Preview Workspace */}
                    {isPortfolioPaid && htmlCode && (
                        <div className="row g-4 mt-4" style={{ animation: "fadeUp 0.3s ease" }}>
                            
                            {/* Editor Columns */}
                            <div className="col-lg-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex gap-1">
                                        {["html", "css", "js"].map(tab => (
                                            <button 
                                                key={tab}
                                                onClick={() => setActiveEditorTab(tab)}
                                                className={`btn btn-sm px-3 py-1.5 text-uppercase`}
                                                style={{
                                                    borderRadius: "6px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "700",
                                                    background: activeEditorTab === tab ? "rgba(245, 158, 11, 0.12)" : "rgba(255,255,255,0.02)",
                                                    border: `1px solid ${activeEditorTab === tab ? "rgba(245, 158, 11, 0.3)" : "rgba(255,255,255,0.05)"}`,
                                                    color: activeEditorTab === tab ? "#f59e0b" : "rgba(255,255,255,0.6)"
                                                }}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-white-50 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                                        <Code size={12} /> Custom Source Editor
                                    </span>
                                </div>

                                <textarea 
                                    value={activeEditorTab === "html" ? htmlCode : activeEditorTab === "css" ? cssCode : jsCode}
                                    onChange={(e) => {
                                        if (activeEditorTab === "html") setHtmlCode(e.target.value);
                                        else if (activeEditorTab === "css") setCssCode(e.target.value);
                                        else setJsCode(e.target.value);
                                    }}
                                    className="form-control font-monospace text-white p-3"
                                    style={{
                                        height: "460px",
                                        background: "#080b11",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "12px",
                                        fontSize: "0.82rem",
                                        fontFamily: "'Courier New', Courier, monospace",
                                        lineHeight: "1.4"
                                    }}
                                />
                            </div>

                            {/* Preview Workspace */}
                            <div className="col-lg-7">
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                    <span className="text-white-50 d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.8rem" }}>
                                        <Eye size={14} className="text-indigo-400" /> Interactive Live Preview
                                    </span>
                                    <button 
                                        onClick={handleDownloadZip}
                                        className="btn btn-sm btn-gradient-premium d-flex align-items-center gap-2 px-4 py-2"
                                        style={{ borderRadius: "8px", fontSize: "0.85rem", background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}
                                    >
                                        <Download size={14} /> Download ZIP Code
                                    </button>
                                </div>

                                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", height: "460px", background: "#fff" }}>
                                    <iframe 
                                        ref={iframeRef} 
                                        style={{ width: "100%", height: "100%", border: "none" }}
                                        title="Portfolio Live Preview"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Attractive Premium Purchase Modal */}
            {showUpgradeModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(6, 6, 16, 0.85)", backdropFilter: "blur(12px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <div 
                        className="card p-5 text-center text-white" 
                        style={{
                            maxWidth: "460px",
                            width: "100%",
                            background: "linear-gradient(145deg, #1d212c 0%, #0e1117 100%)",
                            borderRadius: "24px",
                            border: "1px solid rgba(245, 158, 11, 0.25)",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
                            animation: "fadeUp 0.3s ease"
                        }}
                    >
                        <div className="d-flex justify-content-center mb-4">
                            <div style={{ width: "70px", height: "70px", borderRadius: "18px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Crown size={36} color="#fbbf24" className="fill-amber-400" />
                            </div>
                        </div>

                        <h3 className="fw-bold mb-3" style={{ fontSize: "1.45rem", letterSpacing: "-0.01em" }}>Unlock Premium AI Portfolio Builder</h3>
                        <p className="text-white-50 mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                            Generate a professional, fully responsive recruiter-friendly portfolio website from your resume using next-gen AI. Choose from stunning layouts, preview interactively, edit contents, and download the complete ready-to-deploy HTML/CSS/JS source code.
                        </p>

                        <div className="p-3 mb-4" style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.12)", borderRadius: "12px" }}>
                            <span className="text-white-50 d-block small" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>One-Time Lifetime Price</span>
                            <span className="fw-bold" style={{ fontSize: "1.6rem", color: "#fbbf24" }}>₹499</span>
                        </div>

                        <div className="d-flex gap-3">
                            <button 
                                onClick={() => setShowUpgradeModal(false)}
                                className="btn btn-outline-light w-50 py-2.5"
                                style={{ borderRadius: "10px", fontSize: "0.9rem" }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePurchase}
                                disabled={paymentProcessing}
                                className="btn btn-gradient-premium w-50 py-2.5 d-flex align-items-center justify-content-center gap-2"
                                style={{ borderRadius: "10px", fontSize: "0.9rem", background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}
                            >
                                {paymentProcessing ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" /> Verifying...
                                    </>
                                ) : (
                                    <>
                                        Unlock for ₹499
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -10%;
                    left: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, rgba(245, 158, 11, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .bg-glow-spot-2 {
                    position: absolute;
                    bottom: -10%;
                    right: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, rgba(99, 102, 241, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .glass-panel-custom {
                    background: rgba(15, 18, 32, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
                }
                .glass-input-custom {
                    background-color: rgba(11, 13, 23, 0.85) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    color: #fff !important;
                    border-radius: 12px !important;
                    padding: 12px 16px !important;
                    transition: all 0.2s ease !important;
                }
                .glass-input-custom:focus {
                    border-color: rgba(245, 158, 11, 0.45) !important;
                    box-shadow: 0 0 12px rgba(245, 158, 11, 0.15) !important;
                    background-color: rgba(11, 13, 23, 0.95) !important;
                }
                .btn-gradient-premium {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
                    border: none !important;
                    color: #fff !important;
                    border-radius: 12px !important;
                    font-weight: 700 !important;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25) !important;
                    transition: all 0.25s ease !important;
                }
                .btn-gradient-premium:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important;
                    box-shadow: 0 6px 22px rgba(99, 102, 241, 0.35) !important;
                    transform: translateY(-2px) !important;
                }
                .btn-gradient-premium:disabled {
                    opacity: 0.65 !important;
                    cursor: not-allowed !important;
                }
                .hover-white:hover {
                    color: #fff !important;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 0.8s linear infinite;
                }
                .bg-success\/15 {
                    background-color: rgba(16, 185, 129, 0.15) !important;
                }
                .rounded-12 {
                    border-radius: 12px !important;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
