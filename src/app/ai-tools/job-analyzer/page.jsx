"use client";

import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import { Briefcase, Key, Compass, GraduationCap, Award, BookOpen, Layers, Smile, Terminal, Sparkles, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";

export default function JobAnalyzerPage() {
    const [jobDesc, setJobDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!jobDesc.trim()) {
            showToast("Please paste a job description.", "error");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/ai/job-analyzer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDesc }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to analyze job description");
            }

            const data = await res.json();
            setResult(data);
            showToast("Job description analyzed successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to analyze job description.", "error");
        } finally {
            setLoading(false);
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
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(236, 72, 153, 0.12)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#ec4899", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Briefcase size={13} /> Job Post Parser
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "16px" }}>
                        Job Description Analyzer
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Instantly extract required skills, experience, education, seniority level, and key responsibilities from any job posting to customize your application strategy.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* Left Column: Form Input */}
                        <div className={result ? "col-lg-5" : "col-lg-12"}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>Job Posting Details</h2>
                            
                            <div className="mb-4">
                                <label className="form-label text-white fw-bold mb-2 small d-block">
                                    Paste Job Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    placeholder="Paste the target job description here..."
                                    rows={12}
                                    className="form-control glass-input-custom"
                                    style={{ fontSize: "0.9rem" }}
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!jobDesc.trim() || loading}
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
                                        Extracting Job Data...
                                    </>
                                ) : (
                                    <>
                                        <Briefcase size={18} /> Analyze Job Description
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Column: Extracted Cards */}
                        {result && (
                            <div className="col-lg-7" style={{ animation: "fadeUp 0.4s ease" }}>
                                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "24px" }}>Extracted Job Blueprint</h2>

                                {/* Top Parameters Row */}
                                <div className="row g-3 mb-4">
                                    {/* Seniority */}
                                    <div className="col-sm-6">
                                        <div className="p-3 d-flex align-items-center gap-3" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a5b4fc" }}>
                                                <Layers size={18} />
                                            </div>
                                            <div>
                                                <span className="text-white-50 d-block" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Seniority Level</span>
                                                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{result.seniorityLevel || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Experience */}
                                    <div className="col-sm-6">
                                        <div className="p-3 d-flex align-items-center gap-3" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}>
                                                <Compass size={18} />
                                            </div>
                                            <div>
                                                <span className="text-white-50 d-block" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Experience</span>
                                                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{result.experienceRequired || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Education */}
                                    <div className="col-sm-12">
                                        <div className="p-3 d-flex align-items-center gap-3" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "12px" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "rgba(56, 189, 248, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
                                                <GraduationCap size={18} />
                                            </div>
                                            <div>
                                                <span className="text-white-50 d-block" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Education Requirements</span>
                                                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{result.educationRequirements || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Summary Card */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <BookOpen size={15} /> Job Summary
                                    </h3>
                                    <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.8)", lineHeight: "1.6", margin: 0 }}>
                                        {result.jobSummary}
                                    </p>
                                </div>

                                {/* Skills Split Grid */}
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Award size={15} /> Required Skills
                                            </h3>
                                            <div className="d-flex flex-wrap gap-1.5">
                                                {result.requiredSkills.map((sk, i) => (
                                                    <span key={i} className="badge bg-sky-950 text-sky-300 border border-sky-800/40 px-2 py-1.5" style={{ fontSize: "0.75rem", borderRadius: "6px" }}>
                                                        {sk}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Sparkles size={15} /> Preferred Skills
                                            </h3>
                                            {result.preferredSkills.length === 0 ? (
                                                <span className="text-white-50 small">None specified</span>
                                            ) : (
                                                <div className="d-flex flex-wrap gap-1.5">
                                                    {result.preferredSkills.map((sk, i) => (
                                                        <span key={i} className="badge bg-purple-950 text-purple-300 border border-purple-800/40 px-2 py-1.5" style={{ fontSize: "0.75rem", borderRadius: "6px" }}>
                                                            {sk}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Technologies & Soft Skills */}
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Terminal size={15} /> Technologies
                                            </h3>
                                            <div className="d-flex flex-wrap gap-1.5">
                                                {result.technologies.map((tech, i) => (
                                                    <span key={i} className="badge bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-1.5" style={{ fontSize: "0.75rem", borderRadius: "6px" }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fb923c", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Smile size={15} /> Soft Skills
                                            </h3>
                                            <div className="d-flex flex-wrap gap-1.5">
                                                {result.softSkills.map((sk, i) => (
                                                    <span key={i} className="badge bg-orange-950 text-orange-300 border border-orange-800/40 px-2 py-1.5" style={{ fontSize: "0.75rem", borderRadius: "6px" }}>
                                                        {sk}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Responsibilities Card */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
                                        Key Responsibilities
                                    </h3>
                                    <ul className="ps-3 mb-0 text-white-50" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                                        {result.responsibilities.map((resp, i) => <li key={i} className="mb-2 text-white-90">{resp}</li>)}
                                    </ul>
                                </div>

                                {/* Important ATS Keywords */}
                                <div className="p-4" style={{ background: "rgba(236, 72, 153, 0.02)", border: "1px solid rgba(236, 72, 153, 0.15)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f472b6", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Key size={15} /> Important ATS Keywords
                                    </h3>
                                    <div className="d-flex flex-wrap gap-2">
                                        {result.importantAtsKeywords.map((kw, i) => (
                                            <span key={i} className="badge bg-pink-950 text-pink-300 border border-pink-800/40 px-2.5 py-1.5" style={{ fontSize: "0.8rem", borderRadius: "6px" }}>
                                                {kw}
                                            </span>
                                        ))}
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
                    background: radial-gradient(circle, rgba(236, 72, 153, 0.04) 0%, rgba(236, 72, 153, 0) 70%);
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
                    border-color: rgba(236, 72, 153, 0.45) !important;
                    box-shadow: 0 0 12px rgba(236, 72, 153, 0.15) !important;
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
                .bg-sky-950 { background-color: rgba(7, 89, 133, 0.2) !important; }
                .text-sky-300 { color: #7dd3fc !important; }
                .bg-purple-950 { background-color: rgba(107, 33, 168, 0.2) !important; }
                .text-purple-300 { color: #d8b4fe !important; }
                .bg-emerald-950 { background-color: rgba(6, 95, 70, 0.2) !important; }
                .text-emerald-300 { color: #6ee7b7 !important; }
                .bg-orange-950 { background-color: rgba(154, 52, 18, 0.2) !important; }
                .text-orange-300 { color: #fdba74 !important; }
                .bg-pink-950 { background-color: rgba(131, 24, 67, 0.2) !important; }
                .text-pink-300 { color: #f9a8d4 !important; }
                .text-white-90 { color: rgba(255, 255, 255, 0.9) !important; }
            `}</style>
        </div>
    );
}
