"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { 
    Sparkles, UploadCloud, Target, CheckCircle, XCircle, 
    Lightbulb, FileText, ArrowLeft, Download, RefreshCw, X, CheckCircle2,
    Link2, ChevronRight, Briefcase, Award, Smile, ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import AiWorkflowProgress from "../../../components/AiWorkflowProgress";

export default function MatchScorePage() {
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobUrl, setJobUrl] = useState("");
    const [inputType, setInputType] = useState("text"); // 'text' | 'url'
    const [isDragging, setIsDragging] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
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
        const allowedExtensions = [".pdf", ".txt"];
        const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
        
        if (selectedFile.size > 5 * 1024 * 1024) {
            showToast("File size exceeds 5MB limit", "error");
            return;
        }

        if (fileExt === ".txt") {
            setFile(selectedFile);
            setFileBase64(""); 
            const reader = new FileReader();
            reader.readAsText(selectedFile);
            reader.onload = (e) => {
                setResumeText(e.target.result);
                showToast("Resume text loaded successfully!", "success");
            };
        } else if (fileExt === ".pdf") {
            setFile(selectedFile);
            setResumeText(""); 
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = () => {
                setFileBase64(reader.result);
                showToast("Resume PDF attached successfully!", "success");
            };
        } else {
            showToast("Supported formats: PDF or TXT only.", "error");
        }
    };

    const handleAnalyze = async () => {
        if (!fileBase64 && !resumeText) {
            showToast("Please upload a resume first.", "error");
            return;
        }
        if (inputType === "text" && !jobDesc.trim()) {
            showToast("Please paste a job description.", "error");
            return;
        }
        if (inputType === "url" && !jobUrl.trim()) {
            showToast("Please enter a valid job URL.", "error");
            return;
        }

        setLoading(true);
        setResult(null);
        setProgressStep(0);

        const interval = setInterval(() => {
            setProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 1500);

        try {
            const res = await fetch("/api/ai/match-score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    fileBase64, 
                    resumeText, 
                    jobDesc: inputType === "text" ? jobDesc : "",
                    jobUrl: inputType === "url" ? jobUrl : ""
                }),
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
            clearInterval(interval);
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

RECRUITER HIRING SUMMARY:
${result.recruiterSummary || "N/A"}

STRENGTHS:
${result.strengths.map(s => `- ${s}`).join("\n")}

MISSING SKILLS:
${result.missingSkills.map(s => `- ${s}`).join("\n")}

AI SUGGESTIONS:
${result.suggestions.map(s => `- ${s}`).join("\n")}
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
        if (score >= 80) return "#22c55e"; 
        if (score >= 60) return "#fbbf24"; 
        return "#ef4444"; 
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setFileBase64("");
        setResumeText("");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>
            <Navbar />

            <AiWorkflowProgress currentStep={3} />

            <div className="container pt-3">
                <Link href="/ai-tools" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }} className="hover-white">
                    <ArrowLeft size={16} /> Back to AI Tools Suite
                </Link>
            </div>

            <section style={{ textAlign: "center", padding: "40px 24px 20px" }}>
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#38bdf8", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Sparkles size={13} /> Job Match Engine
                    </div>
                    <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "800", marginBottom: "16px", background: "linear-gradient(135deg, #fff 40%, #c0c1ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Resume & Job Match Score
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Calculate the matching percentage of your resume against any target job description. Identify keyword gaps, strengths, weaknesses, and get automated resume rewrites.
                    </p>
                </div>
            </section>

            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div className="row g-5">
                        <div className={result ? "col-lg-5" : "col-lg-12"}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>Analyze Profile Match</h2>

                            {!file ? (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current?.click()}
                                    className="builder-import-zone mb-4"
                                    style={{
                                        border: `1.5px dashed ${isDragging ? "#a855f7" : "rgba(255,255,255,0.15)"}`,
                                        background: isDragging ? "rgba(168, 85, 247, 0.03)" : "rgba(255,255,255,0.01)",
                                        textAlign: "center",
                                        padding: "24px 20px",
                                        borderRadius: "16px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: "none" }} onChange={handleFileChange} />
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                        <div className="import-icon-container" style={{ background: "rgba(168, 85, 247, 0.08)", borderColor: "rgba(168, 85, 247, 0.2)" }}>
                                            <UploadCloud size={22} color="#a855f7" />
                                        </div>
                                    </div>
                                    <p className="text-white fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>Upload your Resume</p>
                                    <p className="text-white-50 small mb-2" style={{ fontSize: "0.8rem" }}>Drag and drop file here or click to browse</p>
                                    <div className="badge bg-white/5 border border-white/10 px-2.5 py-1 text-white-50" style={{ fontSize: "0.7rem" }}>
                                        PDF • TXT (Max 5MB)
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 mb-4 d-flex align-items-center justify-content-between rounded-2xl" style={{ background: "rgba(34, 197, 94, 0.04)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(34, 197, 94, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <div className="small text-white-50 fw-bold uppercase tracking-wider mb-0.5">✔ Resume Uploaded</div>
                                            <div className="fw-bold text-truncate" style={{ fontSize: "0.88rem", maxWidth: "200px", color: "#fff" }}>{file.name}</div>
                                            <div className="text-white-50" style={{ fontSize: "0.75rem" }}>
                                                {Math.round(file.size / 1024)} KB
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={clearFile} 
                                        className="btn btn-sm btn-outline-danger px-3"
                                        style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                    >
                                        Replace
                                    </button>
                                </div>
                            )}

                            <div className="d-flex p-1 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                                <button 
                                    onClick={() => setInputType("text")}
                                    className={`flex-fill py-1.5 btn text-center d-flex align-items-center justify-content-center gap-2 ${inputType === "text" ? "active-tab text-white" : "text-white-50"}`}
                                    style={{ border: "none", fontSize: "0.82rem", borderRadius: "8px", transition: "all 0.2s" }}
                                >
                                    <FileText size={13} /> Paste JD
                                </button>
                                <button 
                                    onClick={() => setInputType("url")}
                                    className={`flex-fill py-1.5 btn text-center d-flex align-items-center justify-content-center gap-2 ${inputType === "url" ? "active-tab text-white" : "text-white-50"}`}
                                    style={{ border: "none", fontSize: "0.82rem", borderRadius: "8px", transition: "all 0.2s" }}
                                >
                                    <Link2 size={13} /> Job URL
                                </button>
                            </div>

                            {inputType === "text" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Target Job Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                        placeholder={"Paste the complete job description here...\n\nExample:\n• Responsibilities\n• Requirements\n• Qualifications\n• Skills\n• Experience"}
                                        rows={8}
                                        className="form-control glass-input-custom"
                                        style={{ fontSize: "0.9rem", resize: "none" }}
                                        maxLength={20000}
                                    />
                                    <div className="d-flex justify-content-end align-items-center mt-2">
                                        <span className={`small ${jobDesc.length >= 18000 ? "text-danger" : "text-white-50"}`} style={{ fontSize: "0.75rem" }}>
                                            {jobDesc.length.toLocaleString()} / 20,000
                                        </span>
                                    </div>
                                </div>
                            )}

                            {inputType === "url" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Paste Job URL <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={jobUrl}
                                        onChange={(e) => setJobUrl(e.target.value)}
                                        placeholder="https://www.linkedin.com/jobs/view/..."
                                        className="form-control glass-input-custom"
                                        style={{ fontSize: "0.9rem" }}
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={(!fileBase64 && !resumeText) || (inputType === "text" && !jobDesc.trim()) || (inputType === "url" && !jobUrl.trim()) || loading}
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
                                        Analyzing Match...
                                    </>
                                ) : (
                                    <>
                                        <Target size={18} /> ✨ Analyze Resume Match
                                    </>
                                )}
                            </button>

                            {loading && (
                                <div className="p-4 rounded-2xl border border-white/10 bg-black/40 mt-4 text-start" style={{ animation: "fadeUp 0.3s ease" }}>
                                    <h4 className="fw-bold mb-3 small uppercase tracking-wider text-white-50">Analysis Steps</h4>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                            <span className="small text-white-50">Resume Uploaded</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 1 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            )}
                                            <span className={`small ${progressStep >= 1 ? "text-white-50" : "text-white fw-bold"}`}>Reading Resume...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 2 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 1 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 2 ? "text-white-50" : progressStep === 1 ? "text-white fw-bold" : "text-white-30"}`}>Reading Job Description...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 3 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 2 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 3 ? "text-white-50" : progressStep === 2 ? "text-white fw-bold" : "text-white-30"}`}>Extracting Skills & Keywords...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 4 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 3 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 4 ? "text-white-50" : progressStep === 3 ? "text-white fw-bold" : "text-white-30"}`}>Comparing Profiles & Calculating ATS Match...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {result ? (
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

                                <div className="row g-3 mb-4">
                                    <div className="col-sm-6">
                                        <div className="p-4 text-center h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <div style={{ fontSize: "2.4rem", fontWeight: "800", color: scoreColor(result.overallMatchScore), lineHeight: 1, marginBottom: "8px" }}>
                                                {result.overallMatchScore}%
                                            </div>
                                            <div className="fw-bold mb-1" style={{ fontSize: "0.85rem", color: scoreColor(result.overallMatchScore) }}>
                                                {result.overallMatchScore >= 80 ? "Excellent Match" : result.overallMatchScore >= 60 ? "Good Match" : "Weak Match"}
                                            </div>
                                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>Overall Match Score</div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="p-4 text-center h-100" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                            <div style={{ fontSize: "2.4rem", fontWeight: "800", color: scoreColor(result.atsScore), lineHeight: 1, marginBottom: "8px" }}>
                                                {result.atsScore} <span style={{ fontSize: "1.2rem", fontWeight: "400" }}>/ 100</span>
                                            </div>
                                            <div className="fw-bold mb-1" style={{ fontSize: "0.85rem", color: scoreColor(result.atsScore) }}>
                                                {result.atsScore >= 80 ? "High Compatibility" : result.atsScore >= 60 ? "Medium Compatibility" : "Low Compatibility"}
                                            </div>
                                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>ATS Score</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 mb-4 rounded-2xl border" style={{ background: "rgba(168, 85, 247, 0.03)", borderColor: "rgba(168, 85, 247, 0.15)" }}>
                                    <h3 className="fw-bold mb-3 d-flex align-items-center gap-2 text-[#a855f7]" style={{ fontSize: "1rem" }}>
                                        <Briefcase size={18} /> Recruiter Summary
                                    </h3>
                                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", margin: 0 }}>
                                        {result.recruiterSummary || `Based on our analysis, this candidate shows a ${result.overallMatchScore}% alignment with the target role. They demonstrate strengths in ${result.strengths.slice(0, 2).join(", ")}. Primary improvements are detailed below.`}
                                    </p>
                                </div>

                                {result.skillsComparison && (
                                    <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                        <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Award size={15} /> Skills Match
                                        </h3>
                                        <div className="row g-2">
                                            {result.skillsComparison.map((item, idx) => (
                                                <div key={idx} className="col-6 col-sm-4">
                                                    <div className={`p-2.5 rounded-lg d-flex align-items-center justify-content-between ${item.matched ? "bg-emerald-950/20 border border-emerald-800/20" : "bg-red-950/20 border border-red-800/20"}`}>
                                                        <span className="small text-truncate text-white-90" style={{ maxWidth: "80%", fontSize: "0.8rem" }}>{item.skill}</span>
                                                        {item.matched ? (
                                                            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle size={14} className="text-red-400 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

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

                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(34, 197, 94, 0.03)", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <CheckCircle2 size={15} /> Strengths
                                            </h3>
                                            <ul className="ps-3 mb-0" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
                                                {result.strengths.map((str, i) => <li key={i} className="mb-2 text-white-90">{str}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-4 h-100" style={{ background: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "16px" }}>
                                            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                                <ShieldAlert size={15} /> Missing Keywords
                                            </h3>
                                            <div className="d-flex flex-wrap gap-1.5">
                                                {result.missingSkills.map((sk, i) => (
                                                    <span key={i} className="badge bg-red-950 text-red-300 border border-red-800/40 px-2 py-1.5" style={{ fontSize: "0.75rem", borderRadius: "6px" }}>
                                                        {sk}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 mb-4" style={{ background: "rgba(245, 158, 11, 0.02)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Lightbulb size={16} /> Resume Improvements
                                    </h3>
                                    <ul className="ps-0 mb-0" style={{ listStyle: "none" }}>
                                        {result.suggestions.map((sug, i) => (
                                            <li key={i} className="mb-2 d-flex align-items-start gap-2" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)" }}>
                                                <Sparkles size={14} className="text-[#fbbf24] mt-1 flex-shrink-0" />
                                                <span>{sug}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 mb-4" style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px solid rgba(99, 102, 241, 0.15)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>AI Rewrite Recommendations</h3>
                                    <div className="d-flex flex-column gap-3">
                                        {result.rewriteSuggestions.map((rw, i) => (
                                            <div key={i} className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px" }}>
                                                <div className="mb-2">
                                                    <span className="text-danger fw-bold uppercase tracking-wider" style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Original:</span>
                                                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>"{rw.original}"</span>
                                                </div>
                                                <div>
                                                    <span className="text-success fw-bold uppercase tracking-wider" style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>AI Optimized:</span>
                                                    <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: "500" }}>"{rw.suggested}"</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {result.interviewQuestions && (
                                    <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                        <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Smile size={16} /> Likely Interview Questions
                                        </h3>
                                        <ul className="ps-0 mb-0" style={{ listStyle: "none" }}>
                                            {result.interviewQuestions.map((q, i) => (
                                                <li key={i} className="mb-2.5 d-flex align-items-start gap-2.5" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)" }}>
                                                    <span className="badge bg-white/5 text-white-50 border border-white/10 px-1.5 py-1 text-[11px]" style={{ minWidth: "22px", textAlign: "center" }}>{i+1}</span>
                                                    <span>{q}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="p-4 mb-4 rounded-2xl border" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)", borderColor: "rgba(168, 85, 247, 0.2)" }}>
                                    <h3 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                                        <Sparkles size={18} className="text-[#a855f7]" /> CVGrid AI Next Steps
                                    </h3>
                                    <div className="d-flex flex-column gap-3">
                                        <Link href="/builder" className="d-flex align-items-center justify-content-between p-3 rounded-xl hover-bg-glow no-underline text-white" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Improve Resume</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>Optimize your resume with our professional resume builder.</div>
                                            </div>
                                            <ChevronRight size={18} className="text-white-50" />
                                        </Link>
                                        <Link href="/cover-letter" className="d-flex align-items-center justify-content-between p-3 rounded-xl hover-bg-glow no-underline text-white" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Generate Target Cover Letter</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>Write a custom-tailored cover letter for this role.</div>
                                            </div>
                                            <ChevronRight size={18} className="text-white-50" />
                                        </Link>
                                        <Link href="/ai-tools/interview-generator" className="d-flex align-items-center justify-content-between p-3 rounded-xl hover-bg-glow no-underline text-white" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Practice Mock Interview</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>Generate mock questions for this exact role.</div>
                                            </div>
                                            <ChevronRight size={18} className="text-white-50" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center text-center p-5 text-white-50">
                                <Target size={48} className="mb-3 text-white-30" style={{ opacity: 0.3 }} />
                                <div>Click "Analyze Resume Match" to run the ATS evaluation blueprint.</div>
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
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, rgba(168, 85, 247, 0) 70%);
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
                    border-color: rgba(168, 85, 247, 0.45) !important;
                    box-shadow: 0 0 12px rgba(168, 85, 247, 0.15) !important;
                    background-color: rgba(11, 13, 23, 0.95) !important;
                }
                .btn-gradient-premium {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
                    border: none !important;
                    color: #fff !important;
                    border-radius: 12px !important;
                    font-weight: 700 !important;
                    box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2) !important;
                    transition: all 0.25s ease !important;
                }
                .btn-gradient-premium:hover:not(:disabled) {
                    box-shadow: 0 6px 22px rgba(168, 85, 247, 0.35) !important;
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
                    border-color: rgba(168, 85, 247, 0.4) !important;
                    box-shadow: 0 8px 32px rgba(168, 85, 247, 0.08) !important;
                }
                .active-tab {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
                }
                .hover-bg-glow:hover {
                    background: rgba(255, 255, 255, 0.04) !important;
                    border-color: rgba(168, 85, 247, 0.2) !important;
                }
                .import-icon-container {
                    width: 44px;
                    height: 44px;
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
