"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { Sparkles, UploadCloud, Target, CheckCircle, ArrowLeft, KeyRound, Check, Plus, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import { subscribeToAuthChanges } from "../../../authState";

export default function KeywordOptimizerPage() {
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [result, setResult] = useState(null);
    const fileRef = useRef(null);

    // Fetch user's cloud resumes if authenticated
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            setUser(loggedUser);
            if (loggedUser) {
                try {
                    const res = await fetch("/api/resumes");
                    if (res.ok) {
                        const data = await res.ok ? await res.json() : [];
                        setResumes(data);
                        if (data.length > 0) {
                            setSelectedResumeId(data[0].id);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching resumes:", err);
                }
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) processFile(dropped);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) processFile(e.target.files[0]);
    };

    const processFile = (selectedFile) => {
        if (selectedFile.size > 5 * 1024 * 1024) {
            showToast("File size exceeds 5MB limit", "error");
            return;
        }
        setFile(selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            setFileBase64(reader.result);
        };
        setSelectedResumeId(""); // Deselect dropdown if file uploaded
    };

    const handleAnalyze = async () => {
        if (!fileBase64 && !selectedResumeId) {
            showToast("Please upload a resume PDF or select a saved resume.", "error");
            return;
        }
        if (!jobDesc.trim()) {
            showToast("Please paste a job description.", "error");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            let payload = { jobDesc };
            
            if (selectedResumeId) {
                const targetRes = resumes.find(r => r.id === parseInt(selectedResumeId));
                if (targetRes) {
                    payload.resumeText = `
                        Summary: ${targetRes.resumeData.professionalSummary || ""}
                        Skills: ${targetRes.resumeData.skills || ""}
                        Projects: ${targetRes.resumeData.projects || ""}
                        Experience: ${JSON.stringify(targetRes.resumeData.experience || {})}
                    `;
                }
            } else {
                payload.fileBase64 = fileBase64;
            }

            const res = await fetch("/api/ai/keyword-optimizer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to optimize keywords");
            }

            const data = await res.json();
            setResult(data);
            showToast("Keywords analyzed successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to analyze keywords.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApplyKeywords = async () => {
        if (!result || !result.missingKeywords) return;
        if (!selectedResumeId) {
            showToast("One-click optimization requires selecting a saved resume. Please create or save a resume on the site first.", "info");
            return;
        }

        setApplying(true);
        try {
            const targetResume = resumes.find(r => r.id === parseInt(selectedResumeId));
            if (!targetResume) throw new Error("Selected resume not found.");

            // Add missing keywords to skills field
            const currentSkills = targetResume.resumeData.skills || "";
            const skillsArr = currentSkills.split(",").map(s => s.trim()).filter(Boolean);
            
            result.missingKeywords.forEach(kw => {
                if (!skillsArr.some(s => s.toLowerCase() === kw.toLowerCase())) {
                    skillsArr.push(kw);
                }
            });

            const updatedResumeData = {
                ...targetResume.resumeData,
                skills: skillsArr.join(", ")
            };

            const res = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: targetResume.id,
                    resumeName: targetResume.resumeName,
                    resumeData: updatedResumeData,
                    selectedTemplate: targetResume.selectedTemplate,
                    isPublic: targetResume.isPublic,
                    shareableLink: targetResume.shareableLink
                })
            });

            if (!res.ok) throw new Error("Failed to update resume on database.");

            showToast("Successfully added missing keywords to your resume skills list!", "success");
            
            // Refresh local resumes state
            setResumes(prev => prev.map(r => r.id === targetResume.id ? { ...r, resumeData: updatedResumeData } : r));
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to apply suggested keywords.", "error");
        } finally {
            setApplying(false);
        }
    };

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
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(251, 113, 133, 0.12)", border: "1px solid rgba(251, 113, 133, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#fb7185", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <KeyRound size={13} /> Keyword Gap Analyzer
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "16px" }}>
                        Resume Keyword Optimizer
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Find missing ATS keywords and optimize your resume's search visibility in one click. Add skills directly to your stored profile templates.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* Left Column: Form Inputs */}
                        <div className={result ? "col-lg-5" : "col-lg-12"}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>Compare Profile</h2>

                            {/* Saved Resumes Dropdown */}
                            {user && resumes.length > 0 && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Select Saved Resume
                                    </label>
                                    <select 
                                        value={selectedResumeId} 
                                        onChange={(e) => {
                                            setSelectedResumeId(e.target.value);
                                            setFile(null);
                                            setFileBase64("");
                                        }}
                                        className="form-select glass-input-custom w-100"
                                        style={{ background: "rgba(11, 13, 23, 0.85)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
                                    >
                                        <option value="">-- Choose one of your resumes --</option>
                                        {resumes.map(r => (
                                            <option key={r.id} value={r.id}>{r.resumeName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Or Upload PDF zone */}
                            {(!selectedResumeId) && (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current?.click()}
                                    className="builder-import-zone mb-4"
                                    style={{
                                        border: `1.5px dashed ${isDragging ? "#fb7185" : file ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                                        background: isDragging ? "rgba(251, 113, 133, 0.05)" : file ? "rgba(34, 197, 94, 0.03)" : "rgba(255,255,255,0.01)",
                                        textAlign: "center",
                                        padding: "36px 20px",
                                        borderRadius: "16px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileChange} />
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                                        {file ? (
                                            <div className="import-icon-container" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.2)" }}>
                                                <CheckCircle size={26} color="#22c55e" />
                                            </div>
                                        ) : (
                                            <div className="import-icon-container" style={{ background: "rgba(251, 113, 133, 0.08)", borderColor: "rgba(251, 113, 133, 0.2)" }}>
                                                <UploadCloud size={26} color="#fb7185" />
                                            </div>
                                        )}
                                    </div>
                                    {file ? (
                                        <>
                                            <p style={{ color: "#22c55e", fontWeight: "700", fontSize: "0.95rem", marginBottom: "4px" }}>{file.name}</p>
                                            <p className="text-white-50 small mb-0">Click or drag new PDF to change</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-white fw-semibold mb-1" style={{ fontSize: "1rem" }}>Upload PDF Resume</p>
                                            <p className="text-white-50 small mb-0">Drop file here or click to browse</p>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Job Description Textarea */}
                            <div className="mb-4">
                                <label className="form-label text-white fw-bold mb-2 small d-block">
                                    Paste Job Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    placeholder="Paste the target job description here to analyze keywords..."
                                    rows={8}
                                    className="form-control glass-input-custom"
                                    style={{ fontSize: "0.9rem" }}
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={(!fileBase64 && !selectedResumeId) || !jobDesc.trim() || loading}
                                className="btn btn-lg btn-gradient-premium w-100 py-3"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    fontSize: "1rem"
                                }}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Analyzing Keywords...
                                    </>
                                ) : (
                                    <>
                                        <Target size={18} /> Optimize Keywords
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Column: Keyword analysis results */}
                        {result && (
                            <div className="col-lg-7" style={{ animation: "fadeUp 0.4s ease" }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>Keyword Overview</h2>
                                    {selectedResumeId ? (
                                        <button 
                                            onClick={handleApplyKeywords}
                                            disabled={applying || result.missingKeywords.length === 0}
                                            className="btn btn-sm btn-gradient-premium d-flex align-items-center gap-2 px-3.5 py-2.5"
                                            style={{ borderRadius: "8px", fontSize: "0.85rem", background: "linear-gradient(135deg, #10b981, #059669)" }}
                                        >
                                            {applying ? (
                                                <RefreshCw size={14} className="animate-spin" />
                                            ) : (
                                                <Plus size={14} />
                                            )}
                                            Apply Missing Keywords
                                        </button>
                                    ) : (
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>
                                            <AlertCircle size={14} /> Link a saved resume above to enable one-click apply.
                                        </div>
                                    )}
                                </div>

                                {/* Keywords Found Badges */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                        Keywords Found ({result.keywordsFound.length})
                                    </h3>
                                    <div className="d-flex flex-wrap gap-2">
                                        {result.keywordsFound.map((kw, i) => (
                                            <span key={i} className="badge bg-success/10 text-success border border-success/20 px-2.5 py-1.5 d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.8rem", borderRadius: "8px" }}>
                                                <Check size={12} /> {kw.keyword} <span className="opacity-50">({kw.count})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Missing Keywords Badges */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                        Missing Keywords ({result.missingKeywords.length})
                                    </h3>
                                    {result.missingKeywords.length === 0 ? (
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", margin: 0 }}>Awesome! No missing keywords detected.</p>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-2">
                                            {result.missingKeywords.map((kw, i) => (
                                                <span key={i} className="badge bg-danger/10 text-danger border border-danger/20 px-2.5 py-1.5" style={{ fontSize: "0.8rem", borderRadius: "8px" }}>
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Suggested Keywords Badges */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                        Suggested Action Keywords
                                    </h3>
                                    <div className="d-flex flex-wrap gap-2">
                                        {result.suggestedKeywords.map((kw, i) => (
                                            <span key={i} className="badge bg-indigo/10 text-indigo border border-indigo/20 px-2.5 py-1.5" style={{ fontSize: "0.8rem", borderRadius: "8px", color: "#a5b4fc" }}>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Keyword Density Progress Bars */}
                                <div className="p-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px" }}>
                                        Keyword Density Analysis
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                        {result.keywordDensity.map((kd, idx) => (
                                            <div key={idx}>
                                                <div className="d-flex justify-content-between text-white-50 mb-1" style={{ fontSize: "0.82rem" }}>
                                                    <span>{kd.keyword}</span>
                                                    <span style={{ color: kd.density > 4 ? "#f87171" : kd.density >= 1.5 ? "#4ade80" : "#fbbf24", fontWeight: "600" }}>
                                                        {kd.density}% {kd.density > 4 ? "(Stuffed)" : kd.density >= 1.5 ? "(Optimal)" : "(Low)"}
                                                    </span>
                                                </div>
                                                <div className="progress" style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ 
                                                            width: `${Math.min(kd.density * 15, 100)}%`, 
                                                            background: kd.density > 4 ? "#ef4444" : kd.density >= 1.5 ? "#10b981" : "#f59e0b", 
                                                            borderRadius: "3px" 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-white-50 small mt-3 leading-normal" style={{ fontSize: "0.78rem" }}>
                                        * Optimal keyword density is between <b>1.5% and 4.0%</b>. Going above 4.5% can lead to keyword stuffing penalties in older ATS parsers.
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -10%;
                    left: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(251, 113, 133, 0.04) 0%, rgba(251, 113, 133, 0) 70%);
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
                    border-color: rgba(251, 113, 133, 0.45) !important;
                    box-shadow: 0 0 12px rgba(251, 113, 133, 0.15) !important;
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
                .builder-import-zone {
                    transition: all 0.25s ease;
                }
                .builder-import-zone:hover {
                    border-color: rgba(251, 113, 133, 0.6) !important;
                    box-shadow: 0 8px 32px rgba(251, 113, 133, 0.08) !important;
                }
                .import-icon-container {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                .bg-indigo\/10 {
                    background-color: rgba(99, 102, 241, 0.1) !important;
                }
                .bg-success\/10 {
                    background-color: rgba(16, 185, 129, 0.1) !important;
                }
                .bg-danger\/10 {
                    background-color: rgba(239, 68, 68, 0.1) !important;
                }
                .text-indigo {
                    color: #a5b4fc !important;
                }
            `}</style>
        </div>
    );
}
