"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Navbar from "../../../components/Navbar";
import Script from "next/script";
import {
    Sparkles, LayoutTemplate, ShieldCheck, ArrowLeft, RefreshCw, Crown,
    Code, Eye, Download, Lock, ExternalLink, Monitor, Tablet, Smartphone,
    Maximize2, Minimize2, Copy, Check, Palette, Terminal, Zap, FileCode, CheckCircle2, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import { subscribeToAuthChanges } from "../../../authState";
import JSZip from "jszip";
import { useSearchParams } from "next/navigation";
import {
    SAMPLE_RESUME_DATA,
    PORTFOLIO_TEMPLATES,
    ACCENT_COLORS,
    compilePortfolioTemplate,
    generateDeploymentReadme,
    generateVercelConfig,
    generateStandaloneHtml,
    normalizeResumeData
} from "../../../utils/portfolioTemplates";

function PortfolioBuilderContent() {
    const searchParams = useSearchParams();
    const queryResumeId = searchParams.get("resumeId");

    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("demo"); // "demo" or resume ID
    const [isPortfolioPaid, setIsPortfolioPaid] = useState(false);
    const [loadingResumes, setLoadingResumes] = useState(true);
    
    // Purchase modal state
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Generator states
    const [templateType, setTemplateType] = useState("bento_grid");
    const [accentColor, setAccentColor] = useState("indigo");
    const [generatingAI, setGeneratingAI] = useState(false);
    const [customPrompt, setCustomPrompt] = useState("");
    const [showCustomPromptModal, setShowCustomPromptModal] = useState(false);
    
    // Device & View States
    const [deviceView, setDeviceView] = useState("desktop"); // desktop, tablet, mobile
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copiedTab, setCopiedTab] = useState(false);

    // Generated Code States
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [activeEditorTab, setActiveEditorTab] = useState("html"); // html, css, js
    
    const iframeRef = useRef(null);
    const fullscreenIframeRef = useRef(null);

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
                        setResumes(data || []);
                        
                        if (data && data.length > 0) {
                            // If query has resumeId, select that
                            if (queryResumeId) {
                                const target = data.find(r => r.id === parseInt(queryResumeId));
                                if (target) {
                                    setSelectedResumeId(target.id.toString());
                                    setIsPortfolioPaid(target.isPortfolioPaid || false);
                                    return;
                                }
                            }
                            // Otherwise pick first saved resume
                            setSelectedResumeId(data[0].id.toString());
                            setIsPortfolioPaid(data[0].isPortfolioPaid || false);
                        } else {
                            setSelectedResumeId("demo");
                        }
                    }
                } catch (err) {
                    console.error("Error fetching resumes:", err);
                    setSelectedResumeId("demo");
                } finally {
                    setLoadingResumes(false);
                }
            } else {
                setLoadingResumes(false);
                setSelectedResumeId("demo");
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, [queryResumeId]);

    // Sync payment state when selected resume changes
    useEffect(() => {
        if (selectedResumeId === "demo") {
            setIsPortfolioPaid(false);
            return;
        }
        const selected = resumes.find(r => r.id === parseInt(selectedResumeId));
        if (selected) {
            setIsPortfolioPaid(selected.isPortfolioPaid || false);
        }
    }, [selectedResumeId, resumes]);

    // Active resume data getter
    const getActiveResumeData = () => {
        if (selectedResumeId === "demo" || resumes.length === 0) {
            return SAMPLE_RESUME_DATA;
        }
        const found = resumes.find(r => r.id === parseInt(selectedResumeId));
        return found?.resumeData || SAMPLE_RESUME_DATA;
    };

    // 2. Instant Template Compilation whenever Template, Accent, or Resume changes
    useEffect(() => {
        const activeData = getActiveResumeData();
        const compiled = compilePortfolioTemplate(activeData, templateType, accentColor);
        setHtmlCode(compiled.html);
        setCssCode(compiled.css);
        setJsCode(compiled.js);
    }, [templateType, accentColor, selectedResumeId, resumes]);

    // 3. Update preview iframe content
    const compileSourceForPreview = (html, css, js) => {
        let compiled = html || "";
        compiled = compiled.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, "");
        compiled = compiled.replace("</head>", `<style>${css || ""}</style></head>`);
        compiled = compiled.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, "");
        compiled = compiled.replace("</body>", `<script>${js || ""}</script></body>`);
        return compiled;
    };

    const updateIframeContent = () => {
        const src = compileSourceForPreview(htmlCode, cssCode, jsCode);
        
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
            doc.open();
            doc.write(src);
            doc.close();
        }
        if (fullscreenIframeRef.current) {
            const fDoc = fullscreenIframeRef.current.contentDocument || fullscreenIframeRef.current.contentWindow.document;
            fDoc.open();
            fDoc.write(src);
            fDoc.close();
        }
    };

    useEffect(() => {
        updateIframeContent();
    }, [htmlCode, cssCode, jsCode, isFullscreen]);

    // 4. AI Custom Polish with Gemini
    const handleGenerateAI = async () => {
        const activeData = getActiveResumeData();
        setGeneratingAI(true);
        try {
            const activeColorHex = ACCENT_COLORS.find(c => c.id === accentColor)?.primary || "#6366f1";
            const res = await fetch("/api/ai/portfolio-builder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData: activeData,
                    templateType,
                    accentColor: activeColorHex,
                    customInstructions: customPrompt
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "AI generation failed");
            }

            const data = await res.json();
            if (data.html && data.css) {
                setHtmlCode(data.html);
                setCssCode(data.css);
                setJsCode(data.js || "");
                setShowCustomPromptModal(false);
                showToast("✨ AI custom portfolio generated successfully!", "success");
            } else {
                throw new Error("Invalid response received from AI.");
            }
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to generate AI portfolio.", "error");
        } finally {
            setGeneratingAI(false);
        }
    };

    // 5. Razorpay Checkout for ₹499 Portfolio Upgrade
    const handlePurchase = async () => {
        if (!user) {
            showToast("Please log in to purchase the premium portfolio license.", "error");
            return;
        }
        if (selectedResumeId === "demo") {
            if (resumes.length === 0) {
                showToast("Please create or save a resume first to attach the license.", "warning");
                return;
            }
            setSelectedResumeId(resumes[0].id.toString());
        }

        const targetId = selectedResumeId === "demo" ? resumes[0]?.id : selectedResumeId;

        setPaymentProcessing(true);
        try {
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_order",
                    resumeId: targetId,
                    type: "portfolio"
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create payment order");
            }

            const { orderId, amount, currency } = await response.json();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_THQGbMwadquB87",
                amount: amount,
                currency: currency,
                name: "CVGrid Premium Portfolio",
                description: "Unlock AI Portfolio Website Generator & Code Downloader",
                order_id: orderId,
                handler: async function (res) {
                    try {
                        setPaymentProcessing(true);
                        const verifyRes = await fetch("/api/payments", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "verify_payment",
                                resumeId: targetId,
                                type: "portfolio",
                                razorpayPaymentId: res.razorpay_payment_id,
                                razorpayOrderId: res.razorpay_order_id,
                                razorpaySignature: res.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setIsPortfolioPaid(true);
                            setShowUpgradeModal(false);
                            setResumes(prev => prev.map(r => r.id === parseInt(targetId) ? { ...r, isPortfolioPaid: true } : r));
                            showToast("🎉 Payment Successful! Premium Portfolio Suite Unlocked.", "success");
                        } else {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        showToast(err.message || "Payment verification failed.", "error");
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

    // 6. Complete ZIP download (index.html, style.css, script.js, README.md, vercel.json)
    const handleDownloadZip = async () => {
        if (!htmlCode) {
            showToast("No portfolio generated to download.", "warning");
            return;
        }

        // Check license if not demo
        if (selectedResumeId !== "demo" && !isPortfolioPaid) {
            setShowUpgradeModal(true);
            return;
        }

        try {
            const activeData = normalizeResumeData(getActiveResumeData());
            const zip = new JSZip();
            zip.file("index.html", htmlCode);
            zip.file("style.css", cssCode);
            zip.file("script.js", jsCode);
            zip.file("README.md", generateDeploymentReadme(activeData));
            zip.file("vercel.json", generateVercelConfig());

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${activeData.name.replace(/\\s+/g, '_')}_Portfolio_${templateType}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast("✨ Complete Portfolio Deployment ZIP downloaded!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to compile ZIP archive.", "error");
        }
    };

    // 7. Single Standalone HTML Download
    const handleDownloadSingleHtml = () => {
        if (!htmlCode) return;
        if (selectedResumeId !== "demo" && !isPortfolioPaid) {
            setShowUpgradeModal(true);
            return;
        }
        try {
            const activeData = normalizeResumeData(getActiveResumeData());
            const singleHtml = generateStandaloneHtml(htmlCode, cssCode, jsCode);
            const blob = new Blob([singleHtml], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${activeData.name.replace(/\\s+/g, '_')}_portfolio.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("Single-file standalone HTML downloaded!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to generate standalone HTML.", "error");
        }
    };

    // 8. Copy Tab Code to Clipboard
    const handleCopyCode = () => {
        const textToCopy = activeEditorTab === "html" ? htmlCode : activeEditorTab === "css" ? cssCode : jsCode;
        navigator.clipboard.writeText(textToCopy);
        setCopiedTab(true);
        setTimeout(() => setCopiedTab(false), 2000);
        showToast(`Copied ${activeEditorTab.toUpperCase()} code to clipboard!`, "success");
    };

    // 9. Open in New Tab
    const handleOpenInNewTab = () => {
        if (!htmlCode) return;
        try {
            const fullSource = compileSourceForPreview(htmlCode, cssCode, jsCode);
            const blob = new Blob([fullSource], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error(err);
            showToast("Failed to open portfolio preview.", "error");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            {/* Ambient Background Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            {/* Breadcrumb & Navigation */}
            <div className="container pt-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <Link href="/ai-tools" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "6px" }} className="hover-white">
                        <ArrowLeft size={16} /> Back to AI Tools Suite
                    </Link>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1.5 d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.78rem", borderRadius: "999px" }}>
                            <Crown size={12} className="fill-amber-400" /> Instant Code Export
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section style={{ textAlign: "center", padding: "28px 24px 16px" }}>
                <div style={{ maxWidth: "780px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#a5b4fc", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
                        <Zap size={14} className="text-indigo-400" /> Recruiter-Grade Portfolio Engine
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: "800", marginBottom: "14px", letterSpacing: "-0.02em" }}>
                        AI Developer Portfolio Website
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Instantly transform your resume into a stunning, responsive portfolio website. Choose from 5 designer layouts, preview live across devices, and download production-ready code for GitHub Pages & Vercel.
                    </p>
                </div>
            </section>

            {/* Main Workbench */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-3 p-md-4 mb-4">
                    
                    {/* Top Control Bar: Source Profile & Theme Accent */}
                    <div className="row g-3 align-items-center justify-content-between p-3 rounded-16 mb-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        
                        {/* Profile Selection */}
                        <div className="col-lg-5 col-md-6">
                            <label className="text-white-50 fw-semibold mb-1 small d-flex align-items-center gap-1.5">
                                <span>1. Select Resume Source</span>
                                {selectedResumeId === "demo" && (
                                    <span className="badge bg-primary/20 text-indigo-300 border border-indigo-500/30" style={{ fontSize: "0.65rem" }}>Demo Profile Active</span>
                                )}
                            </label>
                            <div className="d-flex gap-2">
                                <select 
                                    value={selectedResumeId}
                                    onChange={(e) => setSelectedResumeId(e.target.value)}
                                    className="form-select glass-input-custom"
                                    style={{ fontSize: "0.88rem" }}
                                >
                                    <option value="demo">⭐ Demo Profile (Alex Rivera - Lead Full-Stack & AI)</option>
                                    {resumes.map(r => (
                                        <option key={r.id} value={r.id}>
                                            📄 {r.resumeName} {r.isPortfolioPaid ? "✨ (Unlocked)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Accent Color Palette */}
                        <div className="col-lg-4 col-md-6">
                            <label className="text-white-50 fw-semibold mb-1 small d-flex align-items-center gap-1.5">
                                <Palette size={13} /> 2. Accent Color Theme
                            </label>
                            <div className="d-flex align-items-center gap-2">
                                {ACCENT_COLORS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setAccentColor(c.id)}
                                        title={c.name}
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            background: c.primary,
                                            border: accentColor === c.id ? "3px solid #fff" : "2px solid rgba(255,255,255,0.2)",
                                            boxShadow: accentColor === c.id ? `0 0 12px ${c.primary}` : "none",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    />
                                ))}
                                <span className="text-white-50 ms-2 small" style={{ fontSize: "0.78rem" }}>
                                    {ACCENT_COLORS.find(c => c.id === accentColor)?.name}
                                </span>
                            </div>
                        </div>

                        {/* AI Polish Trigger Button */}
                        <div className="col-lg-3 col-md-12 d-flex justify-content-lg-end">
                            <button
                                onClick={() => setShowCustomPromptModal(true)}
                                className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 w-100 py-2.5 px-3"
                                style={{
                                    borderRadius: "10px",
                                    fontSize: "0.85rem",
                                    background: "rgba(99, 102, 241, 0.1)",
                                    borderColor: "rgba(99, 102, 241, 0.3)",
                                    color: "#c7d2fe"
                                }}
                            >
                                <Sparkles size={15} className="text-indigo-400" />
                                Custom AI Re-Write...
                            </button>
                        </div>
                    </div>

                    {/* Template Selector Cards */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2.5">
                            <label className="text-white fw-bold small d-flex align-items-center gap-1.5">
                                <LayoutTemplate size={14} className="text-amber-400" /> 3. Choose Portfolio Design Layout
                            </label>
                            <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>Instant client-side compile & live preview</span>
                        </div>
                        
                        <div className="row g-2.5">
                            {PORTFOLIO_TEMPLATES.map(t => {
                                const isSelected = templateType === t.id;
                                return (
                                    <div className="col-6 col-md" key={t.id} style={{ minWidth: "160px" }}>
                                        <div
                                            onClick={() => setTemplateType(t.id)}
                                            className="p-2.5 h-100 rounded-12 transition-all cursor-pointer d-flex flex-column justify-content-between"
                                            style={{
                                                cursor: "pointer",
                                                background: isSelected ? "rgba(99, 102, 241, 0.12)" : "rgba(255,255,255,0.02)",
                                                border: isSelected ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.07)",
                                                boxShadow: isSelected ? "0 8px 25px rgba(99, 102, 241, 0.25)" : "none",
                                                transform: isSelected ? "translateY(-2px)" : "none",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            <div>
                                                <div className="d-flex justify-content-between align-items-center mb-1.5">
                                                    <span className="badge px-2 py-0.5 rounded-4 text-truncate" style={{ fontSize: "0.65rem", background: isSelected ? "rgba(99, 102, 241, 0.25)" : "rgba(255,255,255,0.06)", color: isSelected ? "#c7d2fe" : "#94a3b8" }}>
                                                        {t.badge}
                                                    </span>
                                                    {isSelected && <CheckCircle2 size={13} className="text-indigo-400" />}
                                                </div>
                                                <h4 className="fw-bold mb-1" style={{ fontSize: "0.85rem", color: isSelected ? "#fff" : "rgba(255,255,255,0.85)" }}>
                                                    {t.title}
                                                </h4>
                                                <p className="text-white-50 mb-2" style={{ fontSize: "0.7rem", lineHeight: "1.3" }}>
                                                    {t.desc}
                                                </p>
                                            </div>
                                            <div className="d-flex flex-wrap gap-1 mt-auto">
                                                {t.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="badge bg-white/5 text-white-50" style={{ fontSize: "0.62rem" }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview Workspace and Code Editor */}
                    <div className="row g-3">
                        
                        {/* Interactive Preview Canvas (Top/Left on large screen) */}
                        <div className="col-lg-8">
                            <div className="p-3 rounded-16" style={{ background: "rgba(10, 13, 25, 0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                
                                {/* Device Frame Switcher Toolbar */}
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 pb-2 border-bottom" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                                    
                                    {/* Device Toggle Buttons */}
                                    <div className="d-flex align-items-center gap-1 p-1 rounded-8" style={{ background: "rgba(255,255,255,0.04)" }}>
                                        <button
                                            onClick={() => setDeviceView("desktop")}
                                            className={`btn btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${deviceView === "desktop" ? "btn-light text-dark fw-bold" : "text-white-50"}`}
                                            style={{ borderRadius: "6px", fontSize: "0.78rem" }}
                                        >
                                            <Monitor size={13} /> Desktop
                                        </button>
                                        <button
                                            onClick={() => setDeviceView("tablet")}
                                            className={`btn btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${deviceView === "tablet" ? "btn-light text-dark fw-bold" : "text-white-50"}`}
                                            style={{ borderRadius: "6px", fontSize: "0.78rem" }}
                                        >
                                            <Tablet size={13} /> Tablet (768px)
                                        </button>
                                        <button
                                            onClick={() => setDeviceView("mobile")}
                                            className={`btn btn-sm py-1 px-2.5 d-flex align-items-center gap-1.5 ${deviceView === "mobile" ? "btn-light text-dark fw-bold" : "text-white-50"}`}
                                            style={{ borderRadius: "6px", fontSize: "0.78rem" }}
                                        >
                                            <Smartphone size={13} /> Mobile (375px)
                                        </button>
                                    </div>

                                    {/* Action Utilities */}
                                    <div className="d-flex align-items-center gap-2">
                                        <button
                                            onClick={updateIframeContent}
                                            title="Reload Preview"
                                            className="btn btn-sm btn-outline-light p-1.5 px-2 text-white-50 hover-white"
                                            style={{ borderRadius: "6px", fontSize: "0.78rem" }}
                                        >
                                            <RefreshCw size={13} />
                                        </button>
                                        <button
                                            onClick={handleOpenInNewTab}
                                            className="btn btn-sm btn-outline-light py-1 px-2.5 d-flex align-items-center gap-1.5"
                                            style={{ borderRadius: "6px", fontSize: "0.78rem", color: "#e2e8f0" }}
                                        >
                                            <ExternalLink size={13} /> Open Tab
                                        </button>
                                        <button
                                            onClick={() => setIsFullscreen(true)}
                                            className="btn btn-sm btn-outline-light py-1 px-2.5 d-flex align-items-center gap-1.5"
                                            style={{ borderRadius: "6px", fontSize: "0.78rem", color: "#e2e8f0" }}
                                        >
                                            <Maximize2 size={13} /> Fullscreen
                                        </button>
                                    </div>
                                </div>

                                {/* Iframe Display Area with responsive frame simulation */}
                                <div 
                                    className="d-flex justify-content-center align-items-center p-2"
                                    style={{
                                        minHeight: "520px",
                                        background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.5) 100%)",
                                        borderRadius: "12px",
                                        overflowX: "auto"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: deviceView === "desktop" ? "100%" : deviceView === "tablet" ? "768px" : "375px",
                                            height: "560px",
                                            borderRadius: deviceView === "desktop" ? "8px" : "20px",
                                            border: deviceView === "desktop" ? "1px solid rgba(255,255,255,0.1)" : "8px solid #1e2433",
                                            boxShadow: deviceView === "desktop" ? "0 10px 30px rgba(0,0,0,0.5)" : "0 25px 50px -12px rgba(0,0,0,0.8)",
                                            overflow: "hidden",
                                            transition: "width 0.3s ease",
                                            background: "#fff"
                                        }}
                                    >
                                        <iframe
                                            ref={iframeRef}
                                            style={{ width: "100%", height: "100%", border: "none" }}
                                            title="Portfolio Live Responsive Preview"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Code Editor & Export Suite (Right column) */}
                        <div className="col-lg-4">
                            <div className="p-3 rounded-16 h-100 d-flex flex-column" style={{ background: "rgba(10, 13, 25, 0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                
                                {/* Editor Header */}
                                <div className="d-flex justify-content-between align-items-center mb-2.5">
                                    <div className="d-flex gap-1">
                                        {["html", "css", "js"].map(tab => (
                                            <button 
                                                key={tab}
                                                onClick={() => setActiveEditorTab(tab)}
                                                className="btn btn-sm px-2.5 py-1 text-uppercase"
                                                style={{
                                                    borderRadius: "6px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: "700",
                                                    background: activeEditorTab === tab ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.03)",
                                                    border: `1px solid ${activeEditorTab === tab ? "#6366f1" : "rgba(255,255,255,0.08)"}`,
                                                    color: activeEditorTab === tab ? "#fff" : "rgba(255,255,255,0.6)"
                                                }}
                                            >
                                                {tab === "html" ? "index.html" : tab === "css" ? "style.css" : "script.js"}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className="btn btn-sm btn-outline-light py-1 px-2 d-flex align-items-center gap-1 text-white-50 hover-white"
                                        style={{ borderRadius: "6px", fontSize: "0.72rem" }}
                                        title="Copy active code file"
                                    >
                                        {copiedTab ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                                        <span>{copiedTab ? "Copied!" : "Copy"}</span>
                                    </button>
                                </div>

                                {/* Code Editor Textarea */}
                                <div className="flex-grow-1 mb-3 position-relative">
                                    <textarea 
                                        value={activeEditorTab === "html" ? htmlCode : activeEditorTab === "css" ? cssCode : jsCode}
                                        onChange={(e) => {
                                            if (activeEditorTab === "html") setHtmlCode(e.target.value);
                                            else if (activeEditorTab === "css") setCssCode(e.target.value);
                                            else setJsCode(e.target.value);
                                        }}
                                        className="form-control text-white p-2.5"
                                        style={{
                                            height: "360px",
                                            background: "#05070e",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: "10px",
                                            fontSize: "0.78rem",
                                            fontFamily: "'Fira Code', 'Courier New', monospace",
                                            lineHeight: "1.45"
                                        }}
                                    />
                                </div>

                                {/* Export & Deployment Actions */}
                                <div className="p-3 rounded-12 mt-auto" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-white fw-bold small">Export & Deployment</span>
                                        {isPortfolioPaid && (
                                            <span className="badge bg-success/20 text-success border border-success/30 px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
                                                License Unlocked
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Primary Download Button */}
                                    <button
                                        onClick={handleDownloadZip}
                                        className="btn btn-gradient-premium w-100 py-2.5 mb-2 d-flex align-items-center justify-content-center gap-2"
                                        style={{
                                            borderRadius: "8px",
                                            fontSize: "0.88rem",
                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            border: "none"
                                        }}
                                    >
                                        <Download size={15} />
                                        <span>Download Full ZIP Package</span>
                                    </button>

                                    {/* Secondary Single File Download */}
                                    <button
                                        onClick={handleDownloadSingleHtml}
                                        className="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                                        style={{
                                            borderRadius: "8px",
                                            fontSize: "0.8rem",
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.1)"
                                        }}
                                    >
                                        <FileCode size={14} className="text-indigo-400" />
                                        <span>Download Standalone .HTML</span>
                                    </button>

                                    <p className="text-white-50 text-center small mt-2 mb-0" style={{ fontSize: "0.68rem" }}>
                                        Includes <code className="text-indigo-300">README.md</code> with 2-min free deploy guides for Vercel, Netlify & GitHub Pages.
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* Feature Highlights Banner */}
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="p-3 rounded-12 h-100" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="d-flex align-items-center gap-2 text-indigo-400 fw-bold mb-1 small">
                                <Zap size={14} /> Zero Lock-In Guarantee
                            </div>
                            <p className="text-white-50 small mb-0" style={{ fontSize: "0.82rem" }}>
                                Get clean, readable semantic HTML5, modern CSS, and vanilla JS. Host anywhere without proprietary platform locks.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 rounded-12 h-100" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="d-flex align-items-center gap-2 text-amber-400 fw-bold mb-1 small">
                                <Crown size={14} /> 1-Click Free Hosting
                            </div>
                            <p className="text-white-50 small mb-0" style={{ fontSize: "0.82rem" }}>
                                Drag & drop your exported ZIP straight onto Vercel or Netlify Drop, or push to GitHub Pages in under 2 minutes.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 rounded-12 h-100" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="d-flex align-items-center gap-2 text-emerald-400 fw-bold mb-1 small">
                                <Sparkles size={14} /> Next-Gen AI Copywriting
                            </div>
                            <p className="text-white-50 small mb-0" style={{ fontSize: "0.82rem" }}>
                                Powered by Gemini models to turn standard resume bullet points into captivating, recruiter-focused portfolio narratives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom AI Prompt Modal */}
            {showCustomPromptModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(6, 6, 16, 0.85)", backdropFilter: "blur(12px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <div 
                        className="card p-4 text-white" 
                        style={{
                            maxWidth: "520px",
                            width: "100%",
                            background: "linear-gradient(145deg, #1d212c 0%, #0e1117 100%)",
                            borderRadius: "20px",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
                            animation: "fadeUp 0.25s ease"
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontSize: "1.2rem" }}>
                                <Sparkles size={18} className="text-indigo-400" />
                                AI Custom Portfolio Re-Write
                            </h3>
                            <button onClick={() => setShowCustomPromptModal(false)} className="btn-close btn-close-white" />
                        </div>

                        <p className="text-white-50 small mb-3" style={{ lineHeight: "1.5" }}>
                            Instruct Gemini to highlight specific achievements, alter the voice/tone, or tailor the portfolio for specific target roles (e.g. AI Specialist, Frontend Architect, Startup Lead).
                        </p>

                        <div className="mb-3">
                            <label className="form-label text-white fw-semibold small">Custom AI Instructions</label>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="E.g., Emphasize my machine learning and Next.js projects. Make the hero tagline punchy and executive. Add a contact modal."
                                className="form-control glass-input-custom"
                                rows={4}
                                style={{ fontSize: "0.85rem" }}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                onClick={() => setShowCustomPromptModal(false)}
                                className="btn btn-outline-light py-2 px-3"
                                style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateAI}
                                disabled={generatingAI}
                                className="btn btn-gradient-premium py-2 px-4 d-flex align-items-center gap-2"
                                style={{
                                    borderRadius: "8px",
                                    fontSize: "0.85rem",
                                    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                                    border: "none"
                                }}
                            >
                                {generatingAI ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        Developing Portfolio with Gemini...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={14} />
                                        Generate with AI
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Preview Modal */}
            {isFullscreen && (
                <div style={{ position: "fixed", inset: 0, background: "#080b11", zIndex: 99999, display: "flex", flexDirection: "column" }}>
                    <div className="p-3 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(15,18,32,0.95)" }}>
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-white small">Fullscreen Interactive Preview</span>
                            <span className="badge bg-white/10 text-white-50" style={{ fontSize: "0.7rem" }}>{templateType}</span>
                        </div>
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 py-1 px-3"
                            style={{ borderRadius: "6px" }}
                        >
                            <Minimize2 size={14} /> Exit Fullscreen
                        </button>
                    </div>
                    <div style={{ flex: 1, width: "100%", height: "100%" }}>
                        <iframe
                            ref={fullscreenIframeRef}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            title="Fullscreen Portfolio Preview"
                        />
                    </div>
                </div>
            )}

            {/* Premium Unlock Modal */}
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

                        <h3 className="fw-bold mb-3" style={{ fontSize: "1.45rem", letterSpacing: "-0.01em" }}>Unlock Full Source Code Download</h3>
                        <p className="text-white-50 mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                            Download the complete production-ready source code ZIP (HTML, CSS, JS, Vercel configs & Deployment Guide) with zero watermarks.
                        </p>

                        <div className="p-3 mb-4" style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.12)", borderRadius: "12px" }}>
                            <span className="text-white-50 d-block small" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>One-Time Lifetime License</span>
                            <span className="fw-bold" style={{ fontSize: "1.6rem", color: "#fbbf24" }}>₹499</span>
                        </div>

                        <div className="d-flex gap-3">
                            <button 
                                onClick={() => setShowUpgradeModal(false)}
                                className="btn btn-outline-light w-50 py-2.5"
                                style={{ borderRadius: "10px", fontSize: "0.9rem" }}
                            >
                                Keep Previewing
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
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .bg-glow-spot-2 {
                    position: absolute;
                    bottom: -10%;
                    right: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(245, 158, 11, 0.04) 0%, rgba(245, 158, 11, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .glass-panel-custom {
                    background: rgba(15, 18, 32, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
                }
                .glass-input-custom {
                    background-color: rgba(11, 13, 23, 0.85) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    color: #fff !important;
                    border-radius: 10px !important;
                    padding: 10px 14px !important;
                    transition: all 0.2s ease !important;
                }
                .glass-input-custom:focus {
                    border-color: rgba(99, 102, 241, 0.45) !important;
                    box-shadow: 0 0 12px rgba(99, 102, 241, 0.2) !important;
                    background-color: rgba(11, 13, 23, 0.95) !important;
                }
                .btn-gradient-premium {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
                    border: none !important;
                    color: #fff !important;
                    border-radius: 10px !important;
                    font-weight: 700 !important;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25) !important;
                    transition: all 0.25s ease !important;
                }
                .btn-gradient-premium:hover:not(:disabled) {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35) !important;
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
                .rounded-12 {
                    border-radius: 12px !important;
                }
                .rounded-16 {
                    border-radius: 16px !important;
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default function PortfolioBuilderPage() {
    return (
        <Suspense fallback={<div className="p-5 text-center text-white" style={{ minHeight: "100vh", background: "#060610" }}>Loading Portfolio Suite...</div>}>
            <PortfolioBuilderContent />
        </Suspense>
    );
}
