"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { Sparkles, UploadCloud, Target, CheckCircle, AlertTriangle, XCircle, Lightbulb, FileText, ArrowLeft, Download, RefreshCw } from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";

export default function MatchScorePage() {
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileRef = useRef(null);

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
    };

    const handleAnalyze = async () => {
        if (!fileBase64) {
            showToast("Please upload a resume first.", "error");
            return;
        }
        if (!jobDesc.trim()) {
            showToast("Please paste a job description.", "error");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/ai/match-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileBase64, jobDesc }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to analyze match score");
            }

            const data = await res.json();
            setResult(data);
            showToast("Analysis completed successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to analyze resume match.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        if (!result) return;
        const textReport = `
CVGRID AI CAREER PLATFORM - MATCH SCORE ANALYSIS REPORT
=====================================================
Overall Match Score: ${result.overallMatchScore}%
ATS Compatibility Score: ${result.atsScore}%

CATEGORY SCORES:
- Skills Match: ${result.skillsMatch}%
- Experience Match: ${result.experienceMatch}%
- Education Match: ${result.educationMatch}%
- Project Match: ${result.projectMatch}%
- Keyword Match: ${result.keywordMatch}%

STRENGTHS:
${result.strengths.map(s => `- ${s}`).join("\n")}

MISSING SKILLS:
${result.missingSkills.map(s => `- ${s}`).join("\n")}

WEAKNESSES:
${result.weaknesses.map(w => `- ${w}`).join("\n")}

AI SUGGESTIONS:
${result.suggestions.map(s => `- ${s}`).join("\n")}

REWRITE SUGGESTIONS:
${result.rewriteSuggestions.map((r, i) => `${i+1}. Original: "${r.original}"\n   Suggested: "${r.suggested}"\n`).join("\n")}
        `;

        const blob = new Blob([textReport], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file ? file.name.split(".")[0] : "Resume"}_Match_Analysis_Report.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const scoreColor = (score) => {
        if (score >= 80) return "#22c55e"; // green
        if (score >= 60) return "#f59e0b"; // yellow
        return "#ef4444"; // red
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
            {/* Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            {/* Breadcrumb / Back Link */}
            <div className="container pt-5">
                <Link href="/ai-tools" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }} className="hover-white">
                    <ArrowLeft size={16} /> Back to AI Tools Suite
                </Link>
            </div>

            {/* Hero */}
            <section style={{ textAlign: "center", padding: "40px 24px 20px" }}>
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#38bdf8", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Sparkles size={13} /> Job Match Engine
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "16px" }}>
                        Resume & Job Match Score
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Calculate the matching percentage of your resume against any target job description. Identify keyword gaps, strengths, weaknesses, and get automated resume rewrites.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div className="row g-5">
                        {/* Left Side: Upload & Input Form */}
                        <div className={result ? "col-lg-5" : "col-lg-12"}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>Analyze Profile Match</h2>

                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className="builder-import-zone mb-4"
                                style={{
                                    border: `1.5px dashed ${isDragging ? "#38bdf8" : file ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                                    background: isDragging ? "rgba(56, 189, 248, 0.05)" : file ? "rgba(34, 197, 94, 0.03)" : "rgba(255,255,255,0.01)",
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
                                        <div className="import-icon-container" style={{ background: "rgba(56, 189, 248, 0.08)", borderColor: "rgba(56, 189, 248, 0.2)" }}>
                                            <UploadCloud size={26} color="#38bdf8" />
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
                                        <p className="text-white fw-semibold mb-1" style={{ fontSize: "1rem" }}>Upload your Resume PDF</p>
                                        <p className="text-white-50 small mb-0">Drag and drop file here or click to browse</p>
                                    </>
                                )}
                            </div>

                            {/* Job Description Textarea */}
                            <div className="mb-4">
                                <label className="form-label text-white fw-bold mb-2 small d-block">
                                    Target Job Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    placeholder="Paste the target job description here to analyze match..."
                                    rows={8}
                                    className="form-control glass-input-custom"
                                    style={{ fontSize: "0.9rem" }}
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!file || !jobDesc.trim() || loading}
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
                                        Analyzing Match Score...
                                    </>
                                ) : (
                                    <>
                                        <Target size={18} /> Analyze Match
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Side: Results */}
                        {result && (
                            <div className="col-lg-7" style={{ animation: "fadeUp 0.4s ease" }}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>Analysis Results</h2>
                                    <button 
                                        onClick={handleDownloadReport}
                                        className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 px-3 py-2"
                                        style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                                    >
                                        <Download size={14} /> Download Report
                                    </button>
                                </div>

                                {/* Scores Summary */}
                                <div className="row g-3 mb-4">
                                    {/* Overall Score */}
                                    <div className="col-sm-6">
                                        <div className="p-4 text-center h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <div style={{ fontSize: "2.4rem", fontWeight: "800", color: scoreColor(result.overallMatchScore), lineHeight: 1, marginBottom: "8px" }}>
                                                {result.overallMatchScore}%
                                            </div>
                                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>Overall Match Score</div>
                                        </div>
                                    </div>
                                    {/* ATS Score */}
                                    <div className="col-sm-6">
                                        <div className="p-4 text-center h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <div style={{ fontSize: "2.4rem", fontWeight: "800", color: scoreColor(result.atsScore), lineHeight: 1, marginBottom: "8px" }}>
                                                {result.atsScore}%
                                            </div>
                                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>ATS Compatibility Score</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Breakdown */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px" }}>Match Breakdown</h3>
                                    
                                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                        {[
                                            { label: "Skills Match", val: result.skillsMatch },
                                            { label: "Experience Match", val: result.experienceMatch },
                                            { label: "Education Match", val: result.educationMatch },
                                            { label: "Project Match", val: result.projectMatch },
                                            { label: "Keyword Match", val: result.keywordMatch },
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <div className="d-flex justify-content-between text-white-50 mb-1" style={{ fontSize: "0.82rem" }}>
                                                    <span>{item.label}</span>
                                                    <span style={{ color: scoreColor(item.val), fontWeight: "600" }}>{item.val}%</span>
                                                </div>
                                                <div className="progress" style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                                                    <div className="progress-bar" style={{ width: `${item.val}%`, background: scoreColor(item.val), borderRadius: "3px", transition: "width 1s ease" }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths / Weaknesses / Suggestions */}
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(34, 197, 94, 0.03)", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Strengths</h3>
                                            <ul className="ps-3 mb-0" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
                                                {result.strengths.map((str, i) => <li key={i} className="mb-2">{str}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Weaknesses</h3>
                                            <ul className="ps-3 mb-0" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
                                                {result.weaknesses.map((wk, i) => <li key={i} className="mb-2">{wk}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 mb-4" style={{ background: "rgba(245, 158, 11, 0.02)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Lightbulb size={16} /> Key Missing Skills & Suggestions
                                    </h3>
                                    <div className="mb-3">
                                        <span className="text-white-50 small d-block mb-2">Missing Skills from Job Description:</span>
                                        <div className="d-flex flex-wrap gap-2">
                                            {result.missingSkills.map((sk, i) => (
                                                <span key={i} className="badge bg-danger/10 text-danger border border-danger/20 px-2.5 py-1.5" style={{ fontSize: "0.75rem", borderRadius: "6px" }}>
                                                    {sk}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <ul className="ps-3 mb-0" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
                                        {result.suggestions.map((sug, i) => <li key={i} className="mb-2">{sug}</li>)}
                                    </ul>
                                </div>

                                {/* AI Rewrite Suggestions */}
                                <div className="p-4" style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px solid rgba(99, 102, 241, 0.15)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>AI Rewrite Recommendations</h3>
                                    
                                    <div className="d-flex flex-column gap-3">
                                        {result.rewriteSuggestions.map((rw, i) => (
                                            <div key={i} className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px" }}>
                                                <div className="mb-2">
                                                    <span className="text-danger fw-bold uppercase tracking-wider" style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Original Resume Bullet:</span>
                                                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>"{rw.original}"</span>
                                                </div>
                                                <div>
                                                    <span className="text-success fw-bold uppercase tracking-wider" style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>AI Optimized Bullet (ATS-Friendly):</span>
                                                    <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: "500" }}>"{rw.suggested}"</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Style injections */}
            <style jsx global>{`
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -10%;
                    left: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, rgba(56, 189, 248, 0) 70%);
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
                    border-color: rgba(56, 189, 248, 0.45) !important;
                    box-shadow: 0 0 12px rgba(56, 189, 248, 0.15) !important;
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
                    border-color: rgba(56, 189, 248, 0.6) !important;
                    box-shadow: 0 8px 32px rgba(56, 189, 248, 0.08) !important;
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
            `}</style>
        </div>
    );
}
