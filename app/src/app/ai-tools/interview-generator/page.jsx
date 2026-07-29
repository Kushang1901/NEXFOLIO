"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { 
    Sparkles, UploadCloud, Target, HelpCircle, ArrowLeft, RefreshCw, 
    ChevronDown, ChevronUp, CheckCircle, Award, CheckCircle2, Link2, 
    ChevronRight, X, FileText, Play, Mic, Star, MessageSquare, Code
} from "lucide-react";
import Link from "next/link";
import { showToast } from "../../../utils/toast";
import { subscribeToAuthChanges } from "../../../authState";
import AiWorkflowProgress from "../../../components/AiWorkflowProgress";

export default function InterviewGeneratorPage() {
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    
    // File upload states
    const [file, setFile] = useState(null);
    const [fileBase64, setFileBase64] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Job description states
    const [inputType, setInputType] = useState("text"); // 'text' | 'url'
    const [jobDesc, setJobDesc] = useState("");
    const [jobUrl, setJobUrl] = useState("");

    // Interview Parameters
    const [interviewType, setInterviewType] = useState("Technical");
    const [experienceLevel, setExperienceLevel] = useState("0-2 Years");
    const [difficulty, setDifficulty] = useState("Medium");
    const [numQuestions, setNumQuestions] = useState(5);
    const [companyType, setCompanyType] = useState("Product");

    // UI state
    const [loading, setLoading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [result, setResult] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    
    // Interactive practice states (indexed by question index)
    const [userAnswers, setUserAnswers] = useState({});
    const [evaluations, setEvaluations] = useState({});
    const [evaluatingIndex, setEvaluatingIndex] = useState(null);
    const [revealAnswer, setRevealAnswer] = useState({});

    const fileRef = useRef(null);

    // Fetch user resumes if authenticated
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

    const handleGenerate = async () => {
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
        setExpandedIndex(null);
        setProgressStep(0);
        setUserAnswers({});
        setEvaluations({});
        setRevealAnswer({});

        // Timed step progress
        const interval = setInterval(() => {
            setProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
        }, 1500);

        try {
            let payload = { 
                jobDesc: inputType === "text" ? jobDesc : "",
                jobUrl: inputType === "url" ? jobUrl : "",
                interviewType,
                experienceLevel,
                difficulty,
                numQuestions,
                companyType
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

            const res = await fetch("/api/ai/interview-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
            clearInterval(interval);
            setLoading(false);
        }
    };

    const handleEvaluateAnswer = async (index, questionText, expertAnswer) => {
        const answer = userAnswers[index];
        if (!answer || !answer.trim()) {
            showToast("Please type your practice answer first.", "error");
            return;
        }

        setEvaluatingIndex(index);
        try {
            const res = await fetch("/api/ai/interview-questions/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: questionText,
                    userAnswer: answer,
                    expertAnswer
                })
            });

            if (!res.ok) {
                throw new Error("Failed to evaluate answer");
            }

            const feedbackData = await res.json();
            setEvaluations(prev => ({ ...prev, [index]: feedbackData }));
            showToast("Answer evaluated successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to get AI feedback.", "error");
        } finally {
            setEvaluatingIndex(null);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleAnswerChange = (index, value) => {
        setUserAnswers(prev => ({ ...prev, [index]: value }));
    };

    const toggleRevealAnswer = (index) => {
        setRevealAnswer(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const ratingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    key={i} 
                    size={14} 
                    fill={i <= rating ? "#fbbf24" : "none"} 
                    className={i <= rating ? "text-amber-400" : "text-white-30"} 
                    style={{ marginRight: "2px" }}
                />
            );
        }
        return stars;
    };

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
            {/* Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            {/* AI Workflow Tracker */}
            <AiWorkflowProgress currentStep={6} />

            {/* Breadcrumb */}
            <div className="container pt-3">
                <Link href="/ai-tools" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }} className="hover-white">
                    <ArrowLeft size={16} /> Back to AI Tools Suite
                </Link>
            </div>

            {/* Hero */}
            <section style={{ textAlign: "center", padding: "30px 24px 20px" }}>
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(167, 139, 250, 0.12)", border: "1px solid rgba(167, 139, 250, 0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "20px" }}>
                        <HelpCircle size={13} /> Interview Coach
                    </div>
                    <h1 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: "800", marginBottom: "16px", background: "linear-gradient(135deg, #fff 40%, #c0c1ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        AI Interview Prep Generator
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.05rem", lineHeight: "1.6", marginBottom: 0 }}>
                        Generate custom questions (HR, Technical, System Design, Coding) matching your resume against the target role. Practice your responses and get instant AI feedback.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container pb-5" style={{ zIndex: 10, position: "relative" }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div className="row g-5">
                        
                        {/* Left Column: Form Parameters */}
                        <div className={result ? "col-lg-5" : "col-lg-12"}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "20px" }}>Configure Mock Interview</h2>
                            
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

                            {/* Or Upload PDF/TXT */}
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
                                                border: `1.5px dashed ${isDragging ? "#a78bfa" : "rgba(255,255,255,0.15)"}`,
                                                background: isDragging ? "rgba(167, 139, 250, 0.05)" : "rgba(255,255,255,0.01)",
                                                textAlign: "center",
                                                padding: "24px 20px",
                                                borderRadius: "16px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display: "none" }} onChange={handleFileChange} />
                                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                                                <div className="import-icon-container" style={{ background: "rgba(167, 139, 250, 0.08)", borderColor: "rgba(167, 139, 250, 0.2)" }}>
                                                    <UploadCloud size={22} color="#a78bfa" />
                                                </div>
                                            </div>
                                            <p className="text-white fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>Upload your Resume</p>
                                            <p className="text-white-50 small mb-2" style={{ fontSize: "0.8rem" }}>Drag and drop file here or click to browse</p>
                                            <div className="badge bg-white/5 border border-white/10 px-2.5 py-1 text-white-50" style={{ fontSize: "0.7rem" }}>
                                                PDF • TXT (Max 5MB)
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 d-flex align-items-center justify-content-between rounded-2xl" style={{ background: "rgba(34, 197, 94, 0.04)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
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

                            {/* Job description input */}
                            {inputType === "text" && (
                                <div className="mb-4">
                                    <label className="form-label text-white fw-bold mb-2 small d-block">
                                        Paste Target Job Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                        placeholder="Paste the job description to generate relevant questions..."
                                        rows={6}
                                        className="form-control glass-input-custom"
                                        style={{ fontSize: "0.9rem", resize: "none" }}
                                    />
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

                            {/* Interview Settings Form */}
                            <div className="row g-3 mb-4 text-start">
                                {/* Interview Type */}
                                <div className="col-sm-6">
                                    <label className="form-label text-white-50 small fw-bold uppercase">Interview Type</label>
                                    <select 
                                        value={interviewType} 
                                        onChange={(e) => setInterviewType(e.target.value)}
                                        className="form-select glass-input-custom"
                                        style={{ background: "rgba(11, 13, 23, 0.85)" }}
                                    >
                                        <option value="HR">HR / Leadership</option>
                                        <option value="Technical">Technical / Coding</option>
                                        <option value="Behavioral">Behavioral (STAR)</option>
                                        <option value="Coding">Coding Round</option>
                                        <option value="System Design">System Design</option>
                                        <option value="Managerial">Managerial / Scenario</option>
                                    </select>
                                </div>

                                {/* Experience Level */}
                                <div className="col-sm-6">
                                    <label className="form-label text-white-50 small fw-bold uppercase">Experience Level</label>
                                    <select 
                                        value={experienceLevel} 
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        className="form-select glass-input-custom"
                                        style={{ background: "rgba(11, 13, 23, 0.85)" }}
                                    >
                                        <option value="Fresher">Fresher (Entry)</option>
                                        <option value="0-2 Years">0–2 Years (Junior)</option>
                                        <option value="3-5 Years">3–5 Years (Mid-level)</option>
                                        <option value="Senior">Senior (5+ Years)</option>
                                    </select>
                                </div>

                                {/* Difficulty */}
                                <div className="col-sm-6">
                                    <label className="form-label text-white-50 small fw-bold uppercase">Difficulty</label>
                                    <select 
                                        value={difficulty} 
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="form-select glass-input-custom"
                                        style={{ background: "rgba(11, 13, 23, 0.85)" }}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>

                                {/* Company Type */}
                                <div className="col-sm-6">
                                    <label className="form-label text-white-50 small fw-bold uppercase">Company Type</label>
                                    <select 
                                        value={companyType} 
                                        onChange={(e) => setCompanyType(e.target.value)}
                                        className="form-select glass-input-custom"
                                        style={{ background: "rgba(11, 13, 23, 0.85)" }}
                                    >
                                        <option value="Startup">Early Startup</option>
                                        <option value="Product">Mid-market Product</option>
                                        <option value="Service">Service-Based / IT</option>
                                        <option value="FAANG">FAANG / Big Tech</option>
                                        <option value="FinTech">FinTech / Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                    </select>
                                </div>

                                {/* Number of questions */}
                                <div className="col-12">
                                    <label className="form-label text-white-50 small fw-bold uppercase">Questions Quantity</label>
                                    <div className="btn-group w-100" role="group" style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "3px" }}>
                                        {[3, 5, 10].map(qNum => (
                                            <button
                                                key={qNum}
                                                type="button"
                                                onClick={() => setNumQuestions(qNum)}
                                                className={`btn btn-sm py-2 ${numQuestions === qNum ? "bg-white/10 text-white" : "text-white-50"}`}
                                                style={{ fontSize: "0.78rem", border: "none", borderRadius: "6px", transition: "all 0.2s" }}
                                            >
                                                {qNum} Questions
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
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
                                        <span>Generating Questions...</span>
                                    </>
                                ) : (
                                    <>
                                        <Award size={18} /> Generate Coach Questions
                                    </>
                                )}
                            </button>

                            {/* Progress Timeline */}
                            {loading && (
                                <div className="p-4 rounded-2xl border border-white/10 bg-black/40 mt-4 text-start" style={{ animation: "fadeUp 0.3s ease" }}>
                                    <h4 className="fw-bold mb-3 small uppercase tracking-wider text-white-50">Coach Progress</h4>
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
                                            <span className={`small ${progressStep >= 1 ? "text-white-50" : "text-white fw-bold"}`}>Extracting Resume Profile...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 2 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 1 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 2 ? "text-white-50" : progressStep === 1 ? "text-white fw-bold" : "text-white-30"}`}>Reading Target Job Details...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 3 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 2 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 3 ? "text-white-50" : progressStep === 2 ? "text-white fw-bold" : "text-white-30"}`}>Matching Competencies...</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {progressStep >= 4 ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : progressStep === 3 ? (
                                                <RefreshCw size={14} className="animate-spin text-[#38bdf8]" />
                                            ) : (
                                                <div style={{ width: "16px" }}></div>
                                            )}
                                            <span className={`small ${progressStep >= 4 ? "text-white-50" : progressStep === 3 ? "text-white fw-bold" : "text-white-30"}`}>Formulating Probable Recruiter Questions...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Q&A Results with Filter Tabs */}
                        {result ? (
                            <div className="col-lg-7" style={{ animation: "fadeUp 0.4s ease" }}>
                                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0 }}>Practice Interview Questions</h2>
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="btn btn-sm btn-outline-light d-flex align-items-center gap-2 px-3 py-2"
                                        style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                                    >
                                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Regenerate Set
                                    </button>
                                </div>

                                {/* Questions List */}
                                <div className="d-flex flex-column gap-3 mb-4">
                                    {result.questions.map((q, idx) => {
                                        const isExpanded = expandedIndex === idx;
                                        const myAnswer = userAnswers[idx] || "";
                                        const feedback = evaluations[idx];
                                        const isRevealed = revealAnswer[idx];
                                        
                                        return (
                                            <div 
                                                key={idx} 
                                                style={{ 
                                                    background: "rgba(15, 18, 32, 0.4)", 
                                                    border: `1px solid ${isExpanded ? "rgba(168, 85, 247, 0.25)" : "rgba(255, 255, 255, 0.06)"}`, 
                                                    borderRadius: "16px" 
                                                }}
                                                className="overflow-hidden"
                                            >
                                                {/* Header Trigger */}
                                                <div 
                                                    onClick={() => toggleExpand(idx)}
                                                    className="p-4 d-flex justify-content-between align-items-start gap-3 cursor-pointer select-none"
                                                >
                                                    <div style={{ flexGrow: 1 }} className="text-start">
                                                        <div className="d-flex gap-2.5 align-items-center mb-2 flex-wrap">
                                                            <span className="badge bg-purple-950/20 text-purple-300 border border-purple-800/20 px-2 py-1" style={{ fontSize: "0.7rem", borderRadius: "4px" }}>
                                                                {q.category}
                                                            </span>
                                                            <span className="badge bg-sky-950/20 text-sky-300 border border-sky-800/20 px-2 py-1" style={{ fontSize: "0.7rem", borderRadius: "4px" }}>
                                                                {q.difficulty}
                                                            </span>
                                                            <div className="d-inline-flex align-items-center ms-2">
                                                                <span className="small text-white-50 me-1" style={{ fontSize: "0.68rem" }}>Probability:</span>
                                                                {ratingStars(q.probability || 4)}
                                                            </div>
                                                        </div>
                                                        <h3 className="mb-0 text-white fw-semibold" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                                                            {idx + 1}. {q.question}
                                                        </h3>
                                                    </div>
                                                    <div className="text-white-50 mt-1 flex-shrink-0">
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </div>
                                                </div>

                                                {/* Expandable practice and evaluation area */}
                                                {isExpanded && (
                                                    <div className="px-4 pb-4 pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", animation: "slideDown 0.2s ease" }}>
                                                        
                                                        {/* Coding problem block if any */}
                                                        {q.codingProblem && (
                                                            <div className="p-3 my-3 rounded-lg border border-indigo/25 text-start" style={{ background: "rgba(99, 102, 241, 0.02)" }}>
                                                                <div className="d-flex align-items-center gap-2 text-[#a5b4fc] fw-bold mb-2 small">
                                                                    <Code size={14} /> Coding Problem Challenge (Time Limit: {q.codingProblem.timeLimit})
                                                                </div>
                                                                <p className="small text-white-90 font-mono mb-2" style={{ whiteSpace: "pre-line" }}>{q.codingProblem.problem}</p>
                                                                <details className="mt-2">
                                                                    <summary className="small cursor-pointer text-[#a5b4fc] fw-bold">Reveal Solution</summary>
                                                                    <pre className="p-2 mt-2 rounded bg-black/50 text-emerald-400 font-mono" style={{ fontSize: "0.78rem", overflowX: "auto" }}>
                                                                        <code>{q.codingProblem.solution}</code>
                                                                    </pre>
                                                                </details>
                                                            </div>
                                                        )}

                                                        <div className="my-3 text-start">
                                                            <label className="form-label text-white-50 small fw-bold uppercase mb-1.5">Your Practice Answer:</label>
                                                            <textarea
                                                                value={myAnswer}
                                                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                                                placeholder="Type your response to practice here..."
                                                                rows={3}
                                                                className="form-control glass-input-custom mb-3"
                                                                style={{ fontSize: "0.88rem", resize: "none" }}
                                                            />
                                                            
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    onClick={() => handleEvaluateAnswer(idx, q.question, q.answer)}
                                                                    disabled={evaluatingIndex !== null || !myAnswer.trim()}
                                                                    className="btn btn-sm btn-gradient-premium px-3 py-2"
                                                                    style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                                                >
                                                                    {evaluatingIndex === idx ? (
                                                                        <>
                                                                            <RefreshCw size={13} className="animate-spin me-1.5" />
                                                                            Evaluating...
                                                                        </>
                                                                    ) : (
                                                                        "Evaluate Answer"
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => toggleRevealAnswer(idx)}
                                                                    className="btn btn-sm btn-outline-light px-3 py-2"
                                                                    style={{ borderRadius: "8px", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.02)" }}
                                                                >
                                                                    {isRevealed ? "Hide AI Answer" : "Reveal Expert Answer"}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Evaluation feedback report */}
                                                        {feedback && (
                                                            <div className="p-3 my-3 rounded-xl text-start animate-fade-in" style={{ background: "rgba(16, 185, 129, 0.02)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
                                                                <div className="d-flex justify-content-between align-items-center mb-2.5">
                                                                    <div className="fw-bold text-emerald-400 small uppercase tracking-wider d-flex align-items-center gap-1.5">
                                                                        <CheckCircle size={14} /> Practice Feedback
                                                                    </div>
                                                                    <span className="badge bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-1" style={{ fontSize: "0.82rem" }}>
                                                                        Answer Score: {feedback.score} / 10
                                                                    </span>
                                                                </div>

                                                                <div className="mb-2">
                                                                    <span className="small text-white-50 d-block mb-1">Confidence rating:</span>
                                                                    <span className="small fw-bold text-white uppercase">{feedback.confidence}</span>
                                                                </div>

                                                                {feedback.missingPoints && feedback.missingPoints.length > 0 && (
                                                                    <div className="mb-2.5">
                                                                        <span className="small text-white-50 d-block mb-1">Missing Points:</span>
                                                                        <div className="d-flex flex-wrap gap-1.5">
                                                                            {feedback.missingPoints.map((pt, i) => (
                                                                                <span key={i} className="badge bg-white/5 border border-white/10 px-2 py-1 text-white-90" style={{ fontSize: "0.7rem" }}>
                                                                                    {pt}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <span className="small text-white-50 d-block mb-1">Evaluation & Feedback:</span>
                                                                    <p className="small text-white-90 mb-0 leading-relaxed" style={{ fontSize: "0.82rem" }}>{feedback.feedback}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Reveal ideal sample answer */}
                                                        {isRevealed && (
                                                            <div className="p-3 my-3 rounded-xl text-start bg-purple-950/10 border border-purple-800/10 animate-fade-in">
                                                                <div className="fw-bold text-[#a78bfa] small uppercase tracking-wider mb-2 d-flex align-items-center gap-1.5">
                                                                    <MessageSquare size={14} /> Expert Recommended Answer Guidelines
                                                                </div>
                                                                <p className="small text-white-90 leading-relaxed mb-0" style={{ whiteSpace: "pre-line", fontSize: "0.82rem" }}>
                                                                    {q.answer}
                                                                </p>
                                                            </div>
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Immersive Mock Voice Interview Preview Card */}
                                <div className="p-4 rounded-2xl border text-center" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.06) 100%)", borderColor: "rgba(168, 85, 247, 0.2)" }}>
                                    <div className="d-flex justify-content-center mb-3">
                                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(168, 85, 247, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7" }}>
                                            <Mic size={24} className="animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="fw-bold mb-2 text-white" style={{ fontSize: "1.1rem" }}>🎤 Start Mock Voice Interview (Beta)</h3>
                                    <p className="text-white-50 small mb-3" style={{ maxWidth: "400px", margin: "0 auto" }}>
                                        Practice aloud and let our conversational voice recruiter evaluate your speaking pace, clarity, confidence, and keyword delivery.
                                    </p>
                                    <button 
                                        onClick={() => showToast("Voice interview mode is coming soon!", "info")}
                                        className="btn btn-sm btn-gradient-premium px-4 py-2" 
                                        style={{ fontSize: "0.82rem" }}
                                    >
                                        Launch Voice Agent
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <div className="col-lg-7 d-none d-lg-flex flex-column align-items-center justify-content-center text-center p-5 text-white-50">
                                <HelpCircle size={48} className="mb-3 text-white-30" style={{ opacity: 0.3 }} />
                                <div>Click "Generate Coach Questions" to practice relevant recruiter questions.</div>
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
                    border-color: rgba(167, 139, 250, 0.6) !important;
                    box-shadow: 0 8px 32px rgba(167, 139, 250, 0.08) !important;
                }
                .active-tab {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%) !important;
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.15);
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
                .text-white-90 {
                    color: rgba(255,255,255,0.9) !important;
                }
                @keyframes slideDown {
                    from { opacity: 0; max-height: 0; }
                    to { opacity: 1; max-height: 1000px; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease forwards;
                }
            `}</style>
        </div>
    );
}
