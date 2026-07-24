"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { Sparkles, UploadCloud, Target, HelpCircle, ArrowLeft, RefreshCw, ChevronDown, ChevronUp, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";

export default function InterviewGeneratorPage() {
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState("All");
    const [expandedIndex, setExpandedIndex] = useState(null);
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

    const handleGenerate = async () => {
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
        setExpandedIndex(null);

        try {
            const res = await fetch("/api/ai/interview-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileBase64, jobDesc }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to generate interview questions");
            }

            const data = await res.json();
            setResult(data);
            showToast("Interview questions generated successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to generate questions.", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Filter questions based on category tabs
    const categories = ["All", "HR", "Technical", "Project-based", "Behavioral", "Scenario-based", "Coding"];
    
    const filteredQuestions = result?.questions.filter(q => {
        if (activeTab === "All") return true;
        return q.category.toLowerCase().includes(activeTab.toLowerCase()) || activeTab.toLowerCase().includes(q.category.toLowerCase());
    }) || [];

    const difficultyBadgeColor = (diff) => {
        const d = diff.toLowerCase();
        if (d.includes("easy")) return { bg: "rgba(34,197,94,0.1)", text: "#4ade80", border: "rgba(34,197,94,0.2)" };
        if (d.includes("hard")) return { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(239,68,68,0.2)" };
        return { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.2)" }; // medium
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
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(167, 139, 250, 0.12)", border: "1px solid rgba(167, 139, 250, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <HelpCircle size={13} /> Interview Coach
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", marginBottom: "16px" }}>
                        AI Interview Prep Generator
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Generate highly relevant interview questions (HR, Technical, Behavioral, Scenario, Coding) matching your resume against the target role. Read suggested expert answers to prepare effectively.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* Left Column: Form Input */}
                        <div className={result ? "col-lg-5" : "col-lg-12"}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>Upload & Target</h2>
                            
                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className="builder-import-zone mb-4"
                                style={{
                                    border: `1.5px dashed ${isDragging ? "#a78bfa" : file ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                                    background: isDragging ? "rgba(167, 139, 250, 0.05)" : file ? "rgba(34, 197, 94, 0.03)" : "rgba(255,255,255,0.01)",
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
                                        <div className="import-icon-container" style={{ background: "rgba(167, 139, 250, 0.08)", borderColor: "rgba(167, 139, 250, 0.2)" }}>
                                            <UploadCloud size={26} color="#a78bfa" />
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
                                        <p className="text-white fw-semibold mb-1" style={{ fontSize: "1rem" }}>Upload Resume PDF</p>
                                        <p className="text-white-50 small mb-0">Drag and drop file here or click to browse</p>
                                    </>
                                )}
                            </div>

                            {/* Job Description Textarea */}
                            <div className="mb-4">
                                <label className="form-label text-white fw-bold mb-2 small d-block">
                                    Paste Target Job Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    placeholder="Paste the job description to generate relevant questions..."
                                    rows={8}
                                    className="form-control glass-input-custom"
                                    style={{ fontSize: "0.9rem" }}
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
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
                                        Generating Questions...
                                    </>
                                ) : (
                                    <>
                                        <Award size={18} /> Generate Questions
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Column: Q&A Results with Filter Tabs */}
                        {result && (
                            <div className="col-lg-7" style={{ animation: "fadeUp 0.4s ease" }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>Questions Generated</h2>
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 px-3 py-2"
                                        style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                                    >
                                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Regenerate Questions
                                    </button>
                                </div>

                                {/* Category Tabs */}
                                <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hidden">
                                    {categories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { setActiveTab(cat); setExpandedIndex(null); }}
                                            className={`btn btn-sm px-3 py-2 text-nowrap`}
                                            style={{
                                                borderRadius: "8px",
                                                fontSize: "0.82rem",
                                                fontWeight: "600",
                                                background: activeTab === cat ? "rgba(167, 139, 250, 0.12)" : "rgba(255,255,255,0.03)",
                                                border: `1px solid ${activeTab === cat ? "rgba(167, 139, 250, 0.35)" : "rgba(255,255,255,0.06)"}`,
                                                color: activeTab === cat ? "#a78bfa" : "rgba(255,255,255,0.7)"
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Questions List */}
                                <div className="d-flex flex-column gap-3">
                                    {filteredQuestions.length === 0 ? (
                                        <div className="text-center py-5 text-white-50" style={{ background: "rgba(15, 18, 32, 0.4)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                                            No questions found for category "{activeTab}".
                                        </div>
                                    ) : (
                                        filteredQuestions.map((q, idx) => {
                                            const dbg = difficultyBadgeColor(q.difficulty);
                                            const isExpanded = expandedIndex === idx;
                                            return (
                                                <div 
                                                    key={idx} 
                                                    style={{ 
                                                        background: "rgba(15, 18, 32, 0.4)", 
                                                        border: `1px solid ${isExpanded ? "rgba(167, 139, 250, 0.25)" : "rgba(255, 255, 255, 0.06)"}`, 
                                                        borderRadius: "16px" 
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    {/* Header Trigger */}
                                                    <div 
                                                        onClick={() => toggleExpand(idx)}
                                                        className="p-4 d-flex justify-content-between align-items-start gap-3 cursor-pointer select-none"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <div style={{ flexGrow: 1 }}>
                                                            {/* Badges */}
                                                            <div className="d-flex gap-2 align-items-center mb-2">
                                                                <span className="badge bg-purple-950/20 text-purple-300 border border-purple-800/20 px-2 py-1" style={{ fontSize: "0.7rem", borderRadius: "4px" }}>
                                                                    {q.category}
                                                                </span>
                                                                <span 
                                                                    className="badge px-2 py-1 border"
                                                                    style={{ 
                                                                        fontSize: "0.7rem", 
                                                                        borderRadius: "4px",
                                                                        backgroundColor: dbg.bg,
                                                                        color: dbg.text,
                                                                        borderColor: dbg.border
                                                                    }}
                                                                >
                                                                    {q.difficulty}
                                                                </span>
                                                            </div>
                                                            <h3 className="mb-0 text-white fw-semibold" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                                                                {q.question}
                                                            </h3>
                                                        </div>
                                                        <div className="text-white-50 mt-1 flex-shrink-0">
                                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </div>
                                                    </div>

                                                    {/* Expandable Suggested Answer Panel */}
                                                    {isExpanded && (
                                                        <div className="px-4 pb-4 pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", animation: "slideDown 0.2s ease" }}>
                                                            <style>{`@keyframes slideDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:800px; } }`}</style>
                                                            <div className="pt-3">
                                                                <span className="fw-bold uppercase tracking-wider text-white-50 d-block mb-2" style={{ fontSize: "0.68rem" }}>AI Suggested Answer & Interview Tips:</span>
                                                                <div className="text-white-80 p-3 leading-relaxed" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "10px", fontSize: "0.85rem", whiteSpace: "pre-line" }}>
                                                                    {q.answer}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
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
                    background: radial-gradient(circle, rgba(167, 139, 250, 0.04) 0%, rgba(167, 139, 250, 0) 70%);
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
                    border-color: rgba(167, 139, 250, 0.45) !important;
                    box-shadow: 0 0 12px rgba(167, 139, 250, 0.15) !important;
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
                    border-color: rgba(167, 139, 250, 0.6) !important;
                    box-shadow: 0 8px 32px rgba(167, 139, 250, 0.08) !important;
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
                .bg-purple-950\/20 {
                    background-color: rgba(167, 139, 250, 0.06) !important;
                }
                .text-purple-300 {
                    color: #d8b4fe !important;
                }
                .text-white-80 {
                    color: rgba(255,255,255,0.8) !important;
                }
                .scrollbar-hidden::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hidden {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
}
