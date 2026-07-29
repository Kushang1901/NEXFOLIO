"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import { 
    Briefcase, Key, Compass, GraduationCap, Award, BookOpen, Layers, Smile, 
    Terminal, Sparkles, ArrowLeft, RefreshCw, AlertCircle, Upload, Link2, 
    FileText, CheckCircle2, ChevronRight, X, Sparkle
} from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";

export default function JobAnalyzerPage() {
    const [inputType, setInputType] = useState("text"); // 'text' | 'url' | 'file'
    const [jobDesc, setJobDesc] = useState("");
    const [jobUrl, setJobUrl] = useState("");
    const [fileData, setFileData] = useState(null); // { base64, mimeType, name }
    const [dragActive, setDragActive] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [result, setResult] = useState(null);

    const loadingSteps = [
        "Analyzing Job Posting...",
        "Extracting Core Skills...",
        "Identifying Keywords...",
        "Formatting Analysis..."
    ];

    const SAMPLE_JD = `Position: Senior Frontend Engineer
Company: TechCorp Solutions
Location: Remote (US/Canada)

Responsibilities:
- Architect and build scalable, responsive web applications using React.js, Next.js, and TypeScript.
- Collaborate with product managers, UX designers, and backend engineers to define and implement feature specifications.
- Optimize application performance for maximum speed, scalability, and seamless user experience.
- Write high-quality, maintainable, and well-tested code, participating in peer code reviews.

Required Skills:
- 5+ years of professional web development experience.
- Strong proficiency in modern JavaScript/TypeScript and CSS/SCSS (TailwindCSS is a plus).
- Extensive hands-on experience with React.js (hooks, state management) and Next.js.
- Experience with RESTful APIs, GraphQL, and client-side caching strategies.
- Familiarity with version control (Git) and CI/CD pipelines.

Qualifications:
- Bachelor's or Master's degree in Computer Science, Software Engineering, or a related field (or equivalent practical experience).`;

    const handleLoadSample = () => {
        setJobDesc(SAMPLE_JD);
        setInputType("text");
        showToast("Sample job description loaded!", "success");
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const validTypes = ["application/pdf", "text/plain"];
        if (!validTypes.includes(file.type) && !file.name.endsWith(".txt")) {
            showToast("Supported formats: PDF or TXT only.", "error");
            return;
        }

        const reader = new FileReader();
        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
            reader.onload = (e) => {
                setJobDesc(e.target.result);
                setInputType("text");
                showToast("Text file loaded successfully!", "success");
            };
            reader.readAsText(file);
        } else {
            reader.onload = (e) => {
                const base64 = e.target.result.split(",")[1];
                setFileData({
                    base64,
                    mimeType: file.type,
                    name: file.name
                });
                showToast("PDF document attached successfully!", "success");
            };
            reader.readAsDataURL(file);
        }
    };

    const clearFile = () => {
        setFileData(null);
    };

    const handleAnalyze = async () => {
        let payload = {};

        if (inputType === "text") {
            if (!jobDesc.trim()) {
                showToast("Please paste a job description.", "error");
                return;
            }
            payload = { jobDesc };
        } else if (inputType === "url") {
            if (!jobUrl.trim()) {
                showToast("Please paste a job posting URL.", "error");
                return;
            }
            payload = { jobUrl };
        } else if (inputType === "file") {
            if (!fileData) {
                showToast("Please upload a PDF or TXT file first.", "error");
                return;
            }
            payload = {
                fileBase64: fileData.base64,
                fileMimeType: fileData.mimeType
            };
        }

        setLoading(true);
        setResult(null);
        setLoadingStep(0);

        // Loading steps rotator
        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
        }, 2000);

        try {
            const res = await fetch("/api/ai/job-analyzer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to analyze job description");
            }

            const data = await res.json();
            setResult(data);
            showToast("Analysis complete!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to analyze job description.", "error");
        } finally {
            clearInterval(interval);
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
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#a855f7", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Briefcase size={13} /> Job Post Parser
                    </div>
                    <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "800", marginBottom: "16px", background: "linear-gradient(135deg, #fff 40%, #c0c1ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Job Description Analyzer
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
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
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>Job Posting Details</h2>
                                <button 
                                    onClick={handleLoadSample} 
                                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5"
                                    style={{ fontSize: "0.8rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }}
                                >
                                    <Sparkle size={12} /> Try Sample JD
                                </button>
                            </div>

                            {/* Selection Tabs */}
                            <div className="d-flex p-1 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                                <button 
                                    onClick={() => setInputType("text")}
                                    className={`flex-fill py-2 btn text-center d-flex align-items-center justify-content-center gap-2 ${inputType === "text" ? "active-tab text-white" : "text-white-50"}`}
                                    style={{ border: "none", fontSize: "0.85rem", borderRadius: "8px", transition: "all 0.2s" }}
                                >
                                    <FileText size={14} /> Paste Description
                                </button>
                                <button 
                                    onClick={() => setInputType("url")}
                                    className={`flex-fill py-2 btn text-center d-flex align-items-center justify-content-center gap-2 ${inputType === "url" ? "active-tab text-white" : "text-white-50"}`}
                                    style={{ border: "none", fontSize: "0.85rem", borderRadius: "8px", transition: "all 0.2s" }}
                                >
                                    <Link2 size={14} /> Import Job URL
                                </button>
                                <button 
                                    onClick={() => setInputType("file")}
                                    className={`flex-fill py-2 btn text-center d-flex align-items-center justify-content-center gap-2 ${inputType === "file" ? "active-tab text-white" : "text-white-50"}`}
                                    style={{ border: "none", fontSize: "0.85rem", borderRadius: "8px", transition: "all 0.2s" }}
                                >
                                    <Upload size={14} /> Upload File
                                </button>
                            </div>
                            
                            {/* Paste Description Area */}
                            {inputType === "text" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Paste Job Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                        placeholder={"Paste the complete job description here...\n\nExample:\n• Responsibilities\n• Required Skills\n• Qualifications\n• Experience"}
                                        rows={12}
                                        className="form-control glass-input-custom"
                                        style={{ fontSize: "0.9rem", resize: "none" }}
                                        maxLength={20000}
                                    />
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>
                                            Supports: LinkedIn • Indeed • Naukri • Glassdoor • Careers Page
                                        </span>
                                        <span className={`small ${jobDesc.length >= 18000 ? "text-danger" : "text-white-50"}`} style={{ fontSize: "0.75rem" }}>
                                            {jobDesc.length.toLocaleString()} / 20,000 characters
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Job URL Input */}
                            {inputType === "url" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Paste Job Posting URL <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={jobUrl}
                                        onChange={(e) => setJobUrl(e.target.value)}
                                        placeholder="https://www.linkedin.com/jobs/view/..."
                                        className="form-control glass-input-custom"
                                        style={{ fontSize: "0.9rem" }}
                                    />
                                    <div className="mt-2 text-white-50 small" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                                        LinkedIn • Indeed • Naukri • Glassdoor • Company Career Pages
                                    </div>
                                </div>
                            )}

                            {/* File Upload Drag & Drop */}
                            {inputType === "file" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Upload Job Description File <span className="text-danger">*</span>
                                    </label>
                                    {!fileData ? (
                                        <div 
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`drag-zone text-center p-5 rounded-2xl d-flex flex-col items-center justify-center gap-3 cursor-pointer ${dragActive ? "drag-zone-active" : ""}`}
                                            onClick={() => document.getElementById("file-picker").click()}
                                            style={{
                                                border: "2px dashed rgba(255,255,255,0.15)",
                                                background: "rgba(255,255,255,0.01)",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <input 
                                                id="file-picker" 
                                                type="file" 
                                                accept=".pdf,.txt" 
                                                className="d-none" 
                                                onChange={handleFileSelect} 
                                            />
                                            <Upload className="w-10 h-10 text-[#a855f7]/80" />
                                            <div>
                                                <div className="fw-bold mb-1" style={{ fontSize: "0.9rem" }}>Drag & Drop file here</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>or click to browse from device</div>
                                            </div>
                                            <div className="badge bg-white/5 border border-white/10 px-2.5 py-1 text-white-50" style={{ fontSize: "0.7rem" }}>
                                                Supports: PDF, TXT
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 d-flex align-items-center justify-content-between rounded-2xl" style={{ background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)" }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7" }}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-truncate" style={{ fontSize: "0.85rem", maxWidth: "200px" }}>{fileData.name}</div>
                                                    <div className="text-white-50" style={{ fontSize: "0.75rem" }}>
                                                        {Math.round(fileData.base64.length * 0.75 / 1024)} KB
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={clearFile} 
                                                className="btn p-1 text-white-50 hover-white"
                                                style={{ background: "transparent", border: "none" }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={
                                    loading ||
                                    (inputType === "text" && !jobDesc.trim()) ||
                                    (inputType === "url" && !jobUrl.trim()) ||
                                    (inputType === "file" && !fileData)
                                }
                                className="btn btn-lg btn-gradient-premium w-100 py-3 mt-2"
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
                                        <span>{loadingSteps[loadingStep]}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} /> ✨ Analyze Job Description
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Right Column: Extracted Cards */}
                        {result ? (
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

                                {/* Required & Preferred Skills cards */}
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
                                    <ul className="ps-0 mb-0" style={{ listStyle: "none" }}>
                                        {result.responsibilities.map((resp, i) => (
                                            <li key={i} className="mb-2 d-flex align-items-start gap-2 text-white-90" style={{ fontSize: "0.88rem" }}>
                                                <CheckCircle2 size={16} className="text-[#34d399] mt-0.5 flex-shrink-0" />
                                                <span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Important ATS Keywords */}
                                <div className="p-4 mb-5" style={{ background: "rgba(236, 72, 153, 0.02)", border: "1px solid rgba(236, 72, 153, 0.15)", borderRadius: "16px" }}>
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

                                {/* AI Recommendations Panel */}
                                <div className="p-4 mb-4 rounded-2xl border" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)", borderColor: "rgba(168, 85, 247, 0.2)" }}>
                                    <h3 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                                        <Sparkles size={18} className="text-[#a855f7]" /> AI Recommendations & Next Steps
                                    </h3>
                                    <div className="d-flex flex-col gap-3">
                                        <Link href="/ats-checker" className="d-flex align-items-center justify-content-between p-3 rounded-xl hover-bg-glow no-underline text-white" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Check ATS Match Score</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>Scan your resume against these parsed keywords.</div>
                                            </div>
                                            <ChevronRight size={18} className="text-white-50" />
                                        </Link>
                                        <Link href="/cover-letter" className="d-flex align-items-center justify-content-between p-3 rounded-xl hover-bg-glow no-underline text-white" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Generate Target Cover Letter</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>Write an tailored cover letter matching these duties.</div>
                                            </div>
                                            <ChevronRight size={18} className="text-white-50" />
                                        </Link>
                                        <Link href="/ai-tools/interview-generator" className="d-flex align-items-center justify-content-between p-3 rounded-xl hover-bg-glow no-underline text-white" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
                                            <div>
                                                <div className="fw-bold" style={{ fontSize: "0.88rem" }}>Practice Mock Interview</div>
                                                <div className="text-white-50" style={{ fontSize: "0.75rem" }}>Generate mock questions for this exact seniority level.</div>
                                            </div>
                                            <ChevronRight size={18} className="text-white-50" />
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center text-center p-5 text-white-50">
                                <Briefcase size={48} className="mb-3 text-white-30" style={{ opacity: 0.3 }} />
                                <div>Click "Analyze Job Description" to parse the blueprint parameters.</div>
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
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, rgba(168, 85, 247, 0) 70%);
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
                .active-tab {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
                }
                .drag-zone-active {
                    border-color: #a855f7 !important;
                    background: rgba(168, 85, 247, 0.03) !important;
                }
                .hover-bg-glow:hover {
                    background: rgba(255, 255, 255, 0.04) !important;
                    border-color: rgba(168, 85, 247, 0.2) !important;
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
                .text-white-30 { color: rgba(255, 255, 255, 0.3) !important; }
            `}</style>
        </div>
    );
}
