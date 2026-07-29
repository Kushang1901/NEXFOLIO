"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { Share2, Lock, Eye, EyeOff, Download, ShieldCheck, ArrowLeft, RefreshCw, Copy, QrCode, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import { subscribeToAuthChanges } from "../../../authState";
import QRCode from "qrcode";

export default function ResumeSharingPage() {
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);

    // Sharing Settings Form States
    const [privacyOption, setPrivacyOption] = useState("public");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [slug, setSlug] = useState("");

    // Statistics States
    const [stats, setStats] = useState({
        viewCount: 0,
        downloadCount: 0,
        lastViewed: null
    });

    const qrCanvasRef = useRef(null);

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

    // 2. Fetch specific sharing details & statistics
    useEffect(() => {
        if (!selectedResumeId) return;

        const fetchSharingStats = async () => {
            try {
                const res = await fetch(`/api/resume-sharing?id=${selectedResumeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPrivacyOption(data.privacyOption || "public");
                    setSlug(data.slug || "");
                    setPassword(""); // Clear input password for security
                    setShowPassword(false);
                    setStats({
                        viewCount: data.viewCount || 0,
                        downloadCount: data.downloadCount || 0,
                        lastViewed: data.lastViewed ? new Date(data.lastViewed).toLocaleString() : "Never"
                    });
                }
            } catch (err) {
                console.error("Error fetching sharing stats:", err);
            }
        };

        fetchSharingStats();
    }, [selectedResumeId]);

    // 3. Render QR Code
    const publicUrl = typeof window !== "undefined"
        ? `${window.location.origin}/resume/${slug || selectedResumeId}`
        : "";

    useEffect(() => {
        if (!publicUrl || !qrCanvasRef.current) return;
        QRCode.toCanvas(qrCanvasRef.current, publicUrl, {
            width: 150,
            margin: 2,
            color: {
                dark: "#080b11",
                light: "#ffffff"
            }
        }, (err) => {
            if (err) console.error("Error generating QR code:", err);
        });
    }, [publicUrl, privacyOption, slug]);

    // 4. Save Sharing Settings
    const handleSaveSettings = async () => {
        if (!selectedResumeId) return;
        setSavingSettings(true);

        try {
            const res = await fetch("/api/resume-sharing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "update_settings",
                    resumeId: selectedResumeId,
                    privacyOption,
                    password,
                    slug
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to update sharing settings");
            }

            const data = await res.json();
            // Sync local resumes slug
            setResumes(prev => prev.map(r => r.id === parseInt(selectedResumeId) ? { ...r, slug: data.slug } : r));
            showToast("Sharing configurations saved successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to update sharing settings.", "error");
        } finally {
            setSavingSettings(false);
        }
    };

    // 5. Copy public link to clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        showToast("Public share link copied to clipboard!", "success");
    };

    // 6. Share handlers
    const shareMessage = `Check out my professional resume built on CVGrid: ${publicUrl}`;
    const mailSubject = "Professional Resume - CVGrid";

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
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
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34, 211, 238, 0.12)", border: "1px solid rgba(34, 211, 238, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#22d3ee", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Share2 size={13} /> Social Sharing
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "16px" }}>
                        Public Resume Sharing
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Generate public links, download custom QR codes, and share your resume directly via social channels. Adjust privacy, view detailed traffic logs, and lock with passwords.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    
                    {/* Resume Selector */}
                    <div className="mb-5 max-w-md">
                        <label className="form-label text-white fw-bold mb-2 small d-block">Select Resume to Share</label>
                        {loadingResumes ? (
                            <div className="text-white-50 small">Loading resumes...</div>
                        ) : resumes.length === 0 ? (
                            <div className="text-danger small">No saved resumes found. Create a resume template first!</div>
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

                    {selectedResumeId && (
                        <div className="row g-5">
                            
                            {/* Left Side: Controls & Privacy Form */}
                            <div className="col-lg-6">
                                <h2 className="fw-bold mb-4" style={{ fontSize: "1.2rem" }}>Configure Privacy & Links</h2>
                                
                                {/* Privacy Options */}
                                <div className="mb-4">
                                    <label className="form-label text-white-50 fw-bold mb-2 small d-block">Privacy Settings</label>
                                    <div className="d-flex flex-column gap-2">
                                        {[
                                            { id: "public", title: "Public", desc: "Anyone with the link can view your resume." },
                                            { id: "private", title: "Private", desc: "Only you can view your resume." },
                                            { id: "password", title: "Password Protected", desc: "Viewers must enter a password to open the link." }
                                        ].map(opt => (
                                            <label 
                                                key={opt.id}
                                                className="p-3 border rounded-12 cursor-pointer d-flex gap-3 align-items-start transition-all"
                                                style={{
                                                    cursor: "pointer",
                                                    background: privacyOption === opt.id ? "rgba(34, 211, 238, 0.04)" : "transparent",
                                                    borderColor: privacyOption === opt.id ? "rgba(34, 211, 238, 0.3)" : "rgba(255,255,255,0.06)",
                                                    borderRadius: "12px"
                                                }}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name="privacyOption" 
                                                    checked={privacyOption === opt.id}
                                                    onChange={() => setPrivacyOption(opt.id)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <span className="fw-bold text-white d-block mb-1" style={{ fontSize: "0.88rem" }}>{opt.title}</span>
                                                    <span className="text-white-50 small" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>{opt.desc}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Password field */}
                                {privacyOption === "password" && (
                                    <div className="mb-4" style={{ animation: "fadeUp 0.2s ease" }}>
                                        <label className="form-label text-white fw-bold mb-2 small d-block">Set View Password</label>
                                        <div 
                                            className="d-flex align-items-center"
                                            style={{
                                                backgroundColor: "rgba(11, 13, 23, 0.85)",
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                                borderRadius: "12px",
                                                padding: "14px 16px",
                                                transition: "all 0.2s ease",
                                                position: "relative"
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.45)";
                                                e.currentTarget.style.boxShadow = "0 0 12px rgba(34, 211, 238, 0.15)";
                                                e.currentTarget.style.backgroundColor = "rgba(11, 13, 23, 0.95)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                                                e.currentTarget.style.boxShadow = "none";
                                                e.currentTarget.style.backgroundColor = "rgba(11, 13, 23, 0.85)";
                                            }}
                                        >
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter view password..."
                                                className="border-0 bg-transparent text-white w-100 p-0"
                                                style={{ 
                                                    outline: "none", 
                                                    fontSize: "0.9rem",
                                                    lineHeight: "1"
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="border-0 bg-transparent text-white-50 p-0 ms-2 d-flex align-items-center transition-all hover-white"
                                                style={{ outline: "none", cursor: "pointer" }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Custom Slug */}
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Custom URL Slug <span className="text-white-50 fw-normal">(Optional)</span>
                                    </label>
                                    <div 
                                        className="d-flex align-items-center"
                                        style={{
                                            backgroundColor: "rgba(11, 13, 23, 0.85)",
                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                            borderRadius: "12px",
                                            padding: "14px 16px",
                                            transition: "all 0.2s ease"
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.45)";
                                            e.currentTarget.style.boxShadow = "0 0 12px rgba(34, 211, 238, 0.15)";
                                            e.currentTarget.style.backgroundColor = "rgba(11, 13, 23, 0.95)";
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                                            e.currentTarget.style.boxShadow = "none";
                                            e.currentTarget.style.backgroundColor = "rgba(11, 13, 23, 0.85)";
                                        }}
                                    >
                                        <span 
                                            className="font-monospace text-white-50"
                                            style={{ 
                                                fontSize: "0.85rem", 
                                                userSelect: "none",
                                                borderRight: "1px solid rgba(255, 255, 255, 0.12)",
                                                paddingRight: "12px",
                                                marginRight: "12px",
                                                lineHeight: "1"
                                            }}
                                        >
                                            cvgrid.in/resume/
                                        </span>
                                        <input 
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            placeholder="username-slug"
                                            className="border-0 bg-transparent text-white w-100 p-0"
                                            style={{ 
                                                outline: "none", 
                                                fontSize: "0.9rem",
                                                lineHeight: "1"
                                            }}
                                        />
                                    </div>
                                    <small className="text-white-50 small mt-1.5 d-block">
                                        Only letters, numbers, hyphens, and underscores are allowed.
                                    </small>
                                </div>

                                <button
                                    onClick={handleSaveSettings}
                                    disabled={savingSettings}
                                    className="btn btn-lg btn-gradient-premium w-100 py-3"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        fontSize: "1rem",
                                        background: "linear-gradient(135deg, #22d3ee, #0891b2)",
                                        border: "none",
                                        boxShadow: "0 4px 15px rgba(34, 211, 238, 0.2)"
                                    }}
                                >
                                    {savingSettings ? (
                                        <>
                                            <RefreshCw size={18} className="animate-spin" /> Saving Settings...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={18} /> Save Settings
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Right Side: Stats Panel & Sharing actions */}
                            <div className="col-lg-6">
                                <h2 className="fw-bold mb-4" style={{ fontSize: "1.2rem" }}>Sharing Actions & Stats</h2>

                                {/* Link Copy Board */}
                                {privacyOption !== "private" && (
                                    <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                        <label className="form-label text-white-50 fw-bold mb-2 small d-block">Copy Shareable Link</label>
                                        <div className="d-flex gap-2">
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={publicUrl}
                                                className="form-control glass-input-custom font-monospace flex-grow"
                                                style={{ fontSize: "0.8rem" }}
                                            />
                                            <button 
                                                onClick={handleCopyLink}
                                                className="btn btn-primary d-flex align-items-center justify-content-center"
                                                style={{ width: "48px", borderRadius: "12px", background: "rgba(34, 211, 238, 0.12)", border: "1px solid rgba(34, 211, 238, 0.3)", color: "#22d3ee" }}
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>

                                        {/* Social Share Buttons */}
                                        <div className="d-flex gap-2 mt-3 flex-wrap">
                                            {/* WhatsApp */}
                                            <a 
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2"
                                                style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                            >
                                                <MessageSquare size={14} className="text-success" /> WhatsApp
                                            </a>
                                            {/* LinkedIn */}
                                            <a 
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2"
                                                style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                            >
                                                <svg style={{ width: 14, height: 14, fill: "#0a66c2" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
                                            </a>
                                            {/* X */}
                                            <a 
                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2"
                                                style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                            >
                                                <svg style={{ width: 14, height: 14, fill: "#ffffff" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X / Twitter
                                            </a>
                                            {/* Email */}
                                            <a 
                                                href={`mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(shareMessage)}`}
                                                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2"
                                                style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                            >
                                                <Mail size={14} /> Email
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* QR Code & Traffic Stats */}
                                <div className="row g-4">
                                    {/* QR Code */}
                                    {privacyOption !== "private" && (
                                        <div className="col-sm-5">
                                            <div className="p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                                <QrCode size={16} className="text-white-50 mb-2" />
                                                <span className="text-white-50 small mb-3">Scan QR Code</span>
                                                <div style={{ background: "#fff", padding: "6px", borderRadius: "8px", display: "inline-flex" }}>
                                                    <canvas ref={qrCanvasRef} style={{ width: "110px", height: "110px" }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Grid */}
                                    <div className={privacyOption !== "private" ? "col-sm-7" : "col-sm-12"}>
                                        <div className="p-4 h-100 d-flex flex-column justify-content-between" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
                                                Access Traffic Logs
                                            </h3>
                                            
                                            <div className="d-flex flex-column gap-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(34,211,238,0.1)", display: "flex", alignItems: "center", justifyDocument: "center", justifyContent: "center", color: "#22d3ee" }}>
                                                        <Eye size={16} />
                                                    </div>
                                                    <div>
                                                        <span className="text-white-50 small d-block" style={{ fontSize: "0.72rem" }}>View Count</span>
                                                        <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{stats.viewCount} unique hits</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyDocument: "center", justifyContent: "center", color: "#10b981" }}>
                                                        <Download size={16} />
                                                    </div>
                                                    <div>
                                                        <span className="text-white-50 small d-block" style={{ fontSize: "0.72rem" }}>Download Count</span>
                                                        <span className="fw-bold" style={{ fontSize: "0.95rem" }}>{stats.downloadCount} downloads</span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyDocument: "center", justifyContent: "center", color: "#818cf8" }}>
                                                        <Lock size={16} />
                                                    </div>
                                                    <div>
                                                        <span className="text-white-50 small d-block" style={{ fontSize: "0.72rem" }}>Last Visited</span>
                                                        <span className="fw-bold" style={{ fontSize: "0.85rem" }}>{stats.lastViewed}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <style jsx global>{`
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -10%;
                    left: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(34, 211, 238, 0.04) 0%, rgba(34, 211, 238, 0) 70%);
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
                    padding: 14px 16px !important;
                    transition: all 0.2s ease !important;
                }
                .glass-input-custom:focus {
                    border-color: rgba(34, 211, 238, 0.45) !important;
                    box-shadow: 0 0 12px rgba(34, 211, 238, 0.15) !important;
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
            `}</style>
        </div>
    );
}
