"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { 
    Sparkles, UploadCloud, Target, CheckCircle, ArrowLeft, KeyRound, Check, 
    Plus, AlertCircle, RefreshCw, X, FileText, Link2, CheckCircle2, ChevronRight,
    Terminal, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import { subscribeToAuthChanges } from "../../../authState";
import AiWorkflowProgress from "../../../components/AiWorkflowProgress";

export default function KeywordOptimizerPage() {
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    
    // File upload states
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Job input states
    const [inputType, setInputType] = useState("text"); // 'text' | 'url'
    const [jobDesc, setJobDesc] = useState("");
    const [jobUrl, setJobUrl] = useState("");

    // Optimization option states
    const [options, setOptions] = useState({
        atsKeywords: true,
        techSkills: true,
        softSkills: true,
        certifications: false,
        actionVerbs: true
    });
    const [scope, setScope] = useState("entire"); // 'entire' | 'skills' | 'projects'

    const [loading, setLoading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
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
                        const data = await res.json();
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
        setSelectedResumeId(""); // Deselect dropdown if file uploaded
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setFileBase64("");
        setResumeText("");
    };

    const toggleOption = (key) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAnalyze = async () => {
        if (!fileBase64 && !selectedResumeId && !resumeText) {
            showToast("Please upload a resume PDF/TXT or select a saved resume.", "error");
            return;
        }
        if (inputType === "text" && !jobDesc.trim()) {
            showToast("Please paste a job description.", "error");
            return;
        }
        if (inputType === "url" && !jobUrl.trim()) {
            showToast("Please paste a job URL.", "error");
            return;
        }

        setLoading(true);
        setResult(null);
        setProgressStep(0);

        // Timed step rotator
        const interval = setInterval(() => {
            setProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 1500);

        try {
            let payload = { 
                jobDesc: inputType === "text" ? jobDesc : "",
                jobUrl: inputType === "url" ? jobUrl : "",
                options,
                scope
            };
            
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
                payload.resumeText = resumeText;
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
            showToast("Keywords optimized successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to analyze keywords.", "error");
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    };

    const handleApplyKeywords = async () => {
        if (!result || !result.missingKeywords) return;
        if (!selectedResumeId) {
            showToast("One-click optimization requires selecting a saved resume. Please create/save a resume on the site first.", "info");
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

            {/* AI Workflow Tracker */}
            <AiWorkflowProgress currentStep={4} />

            {/* Breadcrumb */}
            <div className="container pt-3">
                <Link href="/ai-tools" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }} className="hover-white">
                    <ArrowLeft size={16} /> Back to AI Tools Suite
                </Link>
            </div>

            {/* Hero */}
            <section style={{ textAlign: "center", padding: "30px 24px 20px" }}>
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(251, 113, 133, 0.12)", border: "1px solid rgba(251, 113, 133, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#fb7185", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px" }}>
                        <KeyRound size={13} /> Keyword Gap Analyzer
                    </div>
                    <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "800", marginBottom: "16px", background: "linear-gradient(135deg, #fff 40%, #c0c1ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Resume Keyword Optimizer
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
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
                                            setResumeText("");
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

                            {/* Or Upload PDF/TXT zone */}
                            {(!selectedResumeId) && (
                                <div className="mb-4">
                                    {!file ? (
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileRef.current?.click()}
                                            className="builder-import-zone"
                                            style={{
                                                border: `1.5px dashed ${isDragging ? "#fb7185" : "rgba(255,255,255,0.15)"}`,
                                                background: isDragging ? "rgba(251, 113, 133, 0.05)" : "rgba(255,255,255,0.01)",
                                                textAlign: "center",
                                                padding: "24px 20px",
                                                borderRadius: "16px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: "none" }} onChange={handleFileChange} />
                                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                                <div className="import-icon-container" style={{ background: "rgba(251, 113, 133, 0.08)", borderColor: "rgba(251, 113, 133, 0.2)" }}>
                                                    <UploadCloud size={22} color="#fb7185" />
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
                                </div>
                            )}

                            {/* Job Description Tabs */}
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

                            {/* Job Description Textarea */}
                            {inputType === "text" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Paste Job Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                        placeholder={"Paste the complete job description here...\n\nExample:\n• Responsibilities\n• Requirements\n• Qualifications\n• Skills\n• Experience"}
                                        rows={6}
                                        className="form-control glass-input-custom"
                                        style={{ fontSize: "0.9rem", resize: "none" }}
                                        maxLength={20000}
                                    />
                                    <div className="d-flex justify-content-end mt-2">
                                        <span className={`small ${jobDesc.length >= 18000 ? "text-danger" : "text-white-50"}`} style={{ fontSize: "0.75rem" }}>
                                            {jobDesc.length.toLocaleString()} / 20,000
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Job URL Input */}
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

                            {/* Options Checklists */}
                            <div className="p-3 mb-4 rounded-xl text-start" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <label className="form-label text-white fw-bold mb-2.5 small d-block">Target Categories</label>
                                <div className="d-flex flex-wrap gap-2.5">
                                    {Object.entries({
                                        atsKeywords: "ATS Keywords",
                                        techSkills: "Technical Skills",
                                        softSkills: "Soft Skills",
                                        certifications: "Certifications",
                                        actionVerbs: "Action Verbs"
                                    }).map(([key, label]) => (
                                        <button 
                                            key={key}
                                            onClick={() => toggleOption(key)}
                                            className="btn btn-sm d-flex align-items-center gap-1.5 border"
                                            style={{
                                                fontSize: "0.78rem",
                                                borderRadius: "6px",
                                                background: options[key] ? "rgba(251, 113, 133, 0.1)" : "transparent",
                                                borderColor: options[key] ? "#fb7185" : "rgba(255,255,255,0.12)",
                                                color: options[key] ? "#fb7185" : "rgba(255,255,255,0.5)",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {options[key] && <Check size={12} />}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Optimize Scope */}
                            <div className="mb-4 text-start">
                                <label className="form-label text-white fw-bold mb-2 small d-block">Optimization Scope</label>
                                <div className="btn-group w-100" role="group" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "3px" }}>
                                    {[
                                        { id: "entire", label: "Entire Resume" },
                                        { id: "skills", label: "Skills Only" },
                                        { id: "projects", label: "Projects Only" }
                                    ].map(sc => (
                                        <button
                                            key={sc.id}
                                            type="button"
                                            onClick={() => setScope(sc.id)}
                                            className={`btn btn-sm py-2 ${scope === sc.id ? "bg-white/10 text-white" : "text-white-50"}`}
                                            style={{ fontSize: "0.78rem", border: "none", borderRadius: "6px", transition: "all 0.2s" }}
                                        >
                                            {sc.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={(!fileBase64 && !selectedResumeId && !resumeText) || (inputType === "text" && !jobDesc.trim()) || (inputType === "url" && !jobUrl.trim()) || loading}
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
                                        <span>Analyzing Keywords...</span>
                                    </>
                                ) : (
                                    <>
                                        <Target size={18} /> Optimize Keywords
                                    </>
                                )}
                            </button>

                            {/* Progress Timeline */}
                            {loading && (
                                <div className="p-4 rounded-2xl border border-white/10 bg-black/40 mt-4 text-start" style={{ animation: "fadeUp 0.3s ease" }}>
                                    <h4 className="fw-bold mb-3 small uppercase tracking-wider text-white-50">Optimization Timeline</h4>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                            <span className="small text-white-50">Profile Attached</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 1 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            )}
                                            <span className={`small ${progressStep >= 1 ? "text-white-50" : "text-white fw-bold"}`}>Extracting Current Resume Keywords...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 2 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 1 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 2 ? "text-white-50" : progressStep === 1 ? "text-white fw-bold" : "text-white-30"}`}>Scanning Target Job Post Keywords...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 3 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 2 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 3 ? "text-white-50" : progressStep === 2 ? "text-white fw-bold" : "text-white-30"}`}>Calculating ATS Keyword Density...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 4 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 3 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 4 ? "text-white-50" : progressStep === 3 ? "text-white fw-bold" : "text-white-30"}`}>Generating Rewrites & Gaps...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Keyword analysis results */}
                        {result ? (
                            <div className="col-lg-7" style={{ animation: "fadeUp 0.4s ease" }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>Keyword Analysis Results</h2>
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

                                {/* Missing Keywords Badges */}
                                <div className="p-4 mb-4" style={{ background: "rgba(239, 68, 68, 0.02)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                        Missing Keywords ({result.missingKeywords.length})
                                    </h3>
                                    {result.missingKeywords.length === 0 ? (
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", margin: 0 }}>Awesome! No missing keywords detected.</p>
                                    ) : (
                                        <div className="d-flex flex-wrap gap-2">
                                            {result.missingKeywords.map((kw, i) => (
                                                <span key={i} className="badge bg-red-950 text-red-300 border border-red-800/40 px-2.5 py-1.5" style={{ fontSize: "0.8rem", borderRadius: "8px" }}>
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Existing Keywords Badges */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#34d399", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                        Existing Keywords ({result.keywordsFound.length})
                                    </h3>
                                    <div className="d-flex flex-wrap gap-2">
                                        {result.keywordsFound.map((kw, i) => (
                                            <span key={i} className="badge bg-emerald-950/20 text-emerald-400 border border-emerald-800/20 px-2.5 py-1.5 d-inline-flex align-items-center gap-1.5" style={{ fontSize: "0.8rem", borderRadius: "8px" }}>
                                                <CheckCircle2 size={12} className="text-emerald-400" /> {kw.keyword} <span className="opacity-50">({kw.count})</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Weak Action Verbs */}
                                {result.weakKeywords && result.weakKeywords.length > 0 && (
                                    <div className="p-4 mb-4" style={{ background: "rgba(245, 158, 11, 0.02)", border: "1px solid rgba(245, 158, 11, 0.15)", borderRadius: "16px" }}>
                                        <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                            Weak Action Verbs & Suggestions
                                        </h3>
                                        <div className="row g-2">
                                            {result.weakKeywords.map((wk, i) => (
                                                <div key={i} className="col-sm-6">
                                                    <div className="p-3 rounded-lg border border-white/5 bg-white/2" style={{ background: "rgba(255,255,255,0.01)" }}>
                                                        <div style={{ fontSize: "0.68rem" }} className="text-danger uppercase fw-bold tracking-wider mb-1">Instead of:</div>
                                                        <div className="fw-semibold text-white-50 text-truncate" style={{ fontSize: "0.88rem" }}>"{wk.weak}"</div>
                                                        <div className="my-2 border-top border-white/5"></div>
                                                        <div style={{ fontSize: "0.68rem" }} className="text-emerald-400 uppercase fw-bold tracking-wider mb-1">Use Premium verb:</div>
                                                        <div className="fw-bold text-white d-flex align-items-center justify-content-between" style={{ fontSize: "0.92rem" }}>
                                                            <span>{wk.suggested}</span>
                                                            <button 
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(wk.suggested);
                                                                    showToast(`Copied "${wk.suggested}" to clipboard`, "success");
                                                                }}
                                                                className="btn btn-sm btn-link p-0 text-white-50 hover-white text-decoration-none"
                                                                style={{ fontSize: "0.7rem" }}
                                                            >
                                                                Copy
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bullet point suggestions / rewrites */}
                                {result.rewriteSuggestions && result.rewriteSuggestions.length > 0 && (
                                    <div className="p-4 mb-4" style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px solid rgba(99, 102, 241, 0.15)", borderRadius: "16px" }}>
                                        <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
                                            AI Suggestions & Bullet Rewrites
                                        </h3>
                                        <div className="d-flex flex-column gap-3">
                                            {result.rewriteSuggestions.map((rw, i) => (
                                                <div key={i} className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px" }}>
                                                    <div className="mb-2">
                                                        <span className="text-danger fw-bold uppercase tracking-wider" style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>Replace:</span>
                                                        <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>"{rw.original}"</span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-success fw-bold uppercase tracking-wider" style={{ fontSize: "0.65rem", display: "block", marginBottom: "2px" }}>With (ATS Optimized):</span>
                                                        <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: "500" }}>"{rw.suggested}"</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(rw.suggested);
                                                            showToast("Copied optimized bullet suggestion!", "success");
                                                        }}
                                                        className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 px-2.5 py-1.5 mt-2"
                                                        style={{ fontSize: "0.75rem", borderRadius: "6px" }}
                                                    >
                                                        Copy optimized suggestion
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Keyword Density Progress Bars */}
                                <div className="p-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px" }}>
                                        ATS Keyword Density Analysis
                                    </h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                        {result.keywordsFound.slice(0, 8).map((kd, idx) => {
                                            const density = kd.density || (kd.count * 0.4);
                                            const status = kd.status || (density > 4 ? "Stuffing" : density >= 1.5 ? "Optimal" : "Low");
                                            return (
                                                <div key={idx}>
                                                    <div className="d-flex justify-content-between text-white-50 mb-1" style={{ fontSize: "0.82rem" }}>
                                                        <span>{kd.keyword} <small className="opacity-40">({kd.count} mentions)</small></span>
                                                        <span style={{ color: status === "Stuffing" ? "#f87171" : status === "Optimal" ? "#4ade80" : "#fbbf24", fontWeight: "600" }}>
                                                            {density.toFixed(1)}% ({status})
                                                        </span>
                                                    </div>
                                                    <div className="progress" style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                                                        <div 
                                                            className="progress-bar" 
                                                            style={{ 
                                                                width: `${Math.min(density * 15, 100)}%`, 
                                                                background: status === "Stuffing" ? "#ef4444" : status === "Optimal" ? "#10b981" : "#f59e0b", 
                                                                borderRadius: "3px" 
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-white-50 small mt-3 leading-normal" style={{ fontSize: "0.78rem" }}>
                                        * Optimal keyword density is between <b>1.5% and 4.0%</b>. Going above 4.5% can lead to keyword stuffing penalties in older ATS parsers.
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center text-center p-5 text-white-50">
                                <KeyRound size={48} className="mb-3 text-white-30" style={{ opacity: 0.3 }} />
                                <div>Click "Optimize Keywords" to analyze resume keyword compatibility.</div>
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
                    border-color: rgba(251, 113, 133, 0.6) !important;
                    box-shadow: 0 8px 32px rgba(251, 113, 133, 0.08) !important;
                }
                .active-tab {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
                }
                .hover-bg-glow:hover {
                    background: rgba(255, 255, 255, 0.04) !important;
                    border-color: rgba(251, 113, 133, 0.2) !important;
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
                .text-white-30 {
                    color: rgba(255,255,255,0.3) !important;
                }
            `}</style>
        </div>
    );
}
