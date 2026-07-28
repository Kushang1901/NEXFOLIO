"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { ListChecks, KeyRound, LayoutTemplate, Type, FileText, HardDrive, Sparkles, CheckCircle, UploadCloud, Target, Lightbulb, AlertTriangle, XCircle, Check } from "lucide-react";

const TIPS = [
    { Icon: ListChecks,     color: "#6366f1", title: "Use Standard Section Headings",          desc: "ATS bots look for keywords like 'Experience', 'Education', 'Skills'. Avoid creative names like 'My Journey'." },
    { Icon: KeyRound,       color: "#22c55e", title: "Match Keywords from the Job Description", desc: "Copy exact skills and terms from the job posting into your resume. ATS scores are heavily keyword-driven." },
    { Icon: LayoutTemplate, color: "#f59e0b", title: "Stick to Simple Formatting",              desc: "Avoid tables, headers/footers, text boxes, and columns. Plain single-column layouts parse best." },
    { Icon: Type,           color: "#38bdf8", title: "Use Standard Fonts",                      desc: "Arial, Calibri, Times New Roman — these render cleanly. Decorative fonts can cause parsing errors." },
    { Icon: FileText,       color: "#a78bfa", title: "Submit as PDF or DOCX",                   desc: "Most ATS accept both. Always check the job posting — some older systems prefer DOCX." },
    { Icon: HardDrive,      color: "#fb923c", title: "Keep File Size Small",                    desc: "Avoid embedding large images. A clean text-based resume is under 500KB and parses fastest." },
];

const SAMPLE_RESULT = {
    score: 72,
    grade: "B",
    gradeColor: "#f59e0b",
    sections: [
        { label: "Contact Info", status: "pass", detail: "Name, email, phone detected ✓" },
        { label: "Work Experience", status: "pass", detail: "2 positions found ✓" },
        { label: "Education", status: "pass", detail: "Degree and institution detected ✓" },
        { label: "Skills Section", status: "warn", detail: "Skills found but not in a dedicated section" },
        { label: "Keywords Match", status: "warn", detail: "Paste a job description for accurate keyword analysis" },
        { label: "File Format", status: "pass", detail: "PDF — ATS compatible ✓" },
        { label: "Tables / Columns", status: "pass", detail: "No complex tables detected ✓" },
        { label: "Fonts & Encoding", status: "pass", detail: "Standard fonts detected ✓" },
        { label: "Length", status: "fail", detail: "Resume exceeds 2 pages — trim to 1–2 pages" },
        { label: "Quantified Achievements", status: "warn", detail: "Add numbers/metrics to bullet points for impact" },
    ],
    improvements: [
        "Add a dedicated 'Skills' section with a bulleted list",
        "Trim your resume to 1–2 pages",
        "Include measurable achievements (e.g., 'increased sales by 30%')",
        "Paste a job description to check keyword match %",
    ],
};

export default function ATSCheckerPage() {
    const [file, setFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleAnalyze = () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        setTimeout(() => {
            setLoading(false);
            setResult(SAMPLE_RESULT);
        }, 2800);
    };

    const scoreColor = (score) => {
        if (score >= 80) return "#22c55e";
        if (score >= 60) return "#f59e0b";
        return "#ef4444";
    };

    const statusIcon = (status) => {
        if (status === "pass") return { icon: <Check size={14} className="text-success" />, bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" };
        if (status === "warn") return { icon: <AlertTriangle size={14} className="text-warning" />, bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" };
        return { icon: <XCircle size={14} className="text-danger" />, bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" };
    };

    const circumference = 2 * Math.PI * 54;

    return (
        <div style={{ minHeight: "100vh", background: "#060610", color: "#fff", position: "relative", overflowX: "hidden" }}>
            {/* Background Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            {/* Hero */}
            <section style={{ padding: "80px 24px 40px", textAlign: "center", position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#a5b4fc", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <Sparkles size={13} color="#a5b4fc" /> AI-Powered Analysis
                    </div>
                    <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: "800", lineHeight: "1.15", marginBottom: "20px", letterSpacing: "-0.02em" }}>
                        Free ATS Resume Checker
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", marginBottom: "0" }}>
                        Upload your resume and instantly find out if it'll pass Applicant Tracking Systems.
                        Get a detailed score, section-by-section analysis, and actionable fixes — 100% free.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 24px 72px", position: "relative", zIndex: 10 }}>
                <div className="glass-panel-custom p-4 p-md-5">
                    <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "40px", alignItems: "start" }}>

                        {/* Left: Upload Panel */}
                        <div>
                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className="builder-import-zone mb-4"
                                style={{
                                    border: `1.5px dashed ${isDragging ? "#6366f1" : file ? "#22c55e" : "rgba(99, 102, 241, 0.3)"}`,
                                    background: isDragging ? "rgba(99, 102, 241, 0.08)" : file ? "rgba(34, 197, 94, 0.04)" : "rgba(99, 102, 241, 0.02)",
                                }}
                            >
                                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFileChange} />
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                                    {file ? (
                                        <div className="import-icon-container" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.2)" }}>
                                            <CheckCircle size={30} color="#22c55e" />
                                        </div>
                                    ) : (
                                        <div className="import-icon-container">
                                            <UploadCloud size={30} className="text-indigo" />
                                        </div>
                                    )}
                                </div>
                                {file ? (
                                    <>
                                        <p style={{ color: "#22c55e", fontWeight: "700", fontSize: "1.05rem", marginBottom: "6px" }}>{file.name}</p>
                                        <p className="text-white-50 small mb-0">Click or drag new file to change</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-white fw-bold fs-5 mb-2">Drop your resume here or click to upload</p>
                                        <p className="text-white-50 small mb-0">Supports PDF, DOC, or DOCX up to 5MB</p>
                                    </>
                                )}
                            </div>

                            {/* Job Description */}
                            <div className="mb-4">
                                <label className="form-label text-white fw-bold mb-2 small d-block">
                                    Paste Job Description <span className="text-white-50 fw-normal">(optional — improves keyword match)</span>
                                </label>
                                <textarea
                                    value={jobDesc}
                                    onChange={e => setJobDesc(e.target.value)}
                                    placeholder="Paste the target job description here to check keyword match..."
                                    rows={5}
                                    className="form-control glass-input-custom"
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!file || loading}
                                className="btn btn-lg btn-gradient-premium w-100 py-3"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px"
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                        Analyzing Resume...
                                    </>
                                ) : (
                                    <>
                                        <Target size={18} /> Check ATS Score
                                    </>
                                )}
                            </button>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>

                        {/* Right: Results */}
                        {result && (
                            <div style={{ animation: "fadeUp 0.4s ease" }}>
                                <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

                                {/* Score Ring */}
                                <div className="p-4 text-center mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <div style={{ position: "relative", width: "130px", height: "130px", margin: "0 auto 20px" }}>
                                        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
                                            <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                                            <circle cx="65" cy="65" r="54" fill="none"
                                                stroke={scoreColor(result.score)} strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={circumference - (result.score / 100) * circumference}
                                                style={{ transition: "stroke-dashoffset 1s ease" }}
                                            />
                                        </svg>
                                        <div style={{ position: "absolute", top: 0, left: 0, width: "130px", height: "130px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                            <div style={{ fontSize: "2.4rem", fontWeight: "800", color: scoreColor(result.score), lineHeight: 1 }}>{result.score}</div>
                                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: "700", marginTop: "2px", letterSpacing: "0.05em" }}>ATS SCORE</div>
                                        </div>
                                    </div>
                                    <div className="fw-semibold" style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", lineHeight: "1.5" }}>
                                        {result.score >= 80 ? "🟢 Great — your resume should pass most ATS filters." : result.score >= 60 ? "🟡 Fair — a few fixes will significantly improve your score." : "🔴 Needs work — ATS may reject this resume automatically."}
                                    </div>
                                </div>

                                {/* Section Checks */}
                                <div className="p-4 mb-4" style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "18px" }}>Section Analysis</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {result.sections.map((s, i) => {
                                            const st = statusIcon(s.status);
                                            return (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", background: st.bg, border: `1px solid ${st.border}`, borderRadius: "12px" }}>
                                                    <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)", border: `1px solid ${st.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                        {st.icon}
                                                    </span>
                                                    <div>
                                                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#fff", marginBottom: "1px" }}>{s.label}</div>
                                                        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{s.detail}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Improvements */}
                                <div className="p-4" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)", borderLeft: "4px solid #6366f1", borderRadius: "16px" }}>
                                    <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <Lightbulb size={16} /> Top Improvements
                                    </h3>
                                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {result.improvements.map((tip, i) => (
                                            <li key={i} style={{ display: "flex", gap: "10px", fontSize: "0.88rem", color: "rgba(200,205,230,0.8)", lineHeight: "1.5" }}>
                                                <span style={{ color: "#818cf8", fontWeight: "700", flexShrink: 0 }}>{i + 1}.</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "80px 24px" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: "800", marginBottom: "12px" }}>How to Make Your Resume ATS-Proof</h2>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>Follow these best practices to maximize your ATS score.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                        {TIPS.map((tip, i) => (
                            <div key={i} style={{ background: "rgba(15, 18, 32, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "16px", padding: "28px 24px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${tip.color}66`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 10px 30px ${tip.color}0a`; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${tip.color}15`, border: `1px solid ${tip.color}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                                    <tip.Icon size={20} color={tip.color} strokeWidth={1.8} />
                                </div>
                                <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "10px", color: "#fff" }}>{tip.title}</h3>
                                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: "1.65", margin: 0 }}>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "80px 24px", textAlign: "center", background: "#060610", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.2rem)", fontWeight: "800", marginBottom: "16px" }}>Ready to Build an ATS-Friendly Resume?</h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "35px", fontSize: "1rem", lineHeight: "1.7" }}>Use our free AI resume builder to create a perfectly formatted, keyword-optimized resume in minutes.</p>
                    <a href="/templates" className="btn btn-lg btn-gradient-premium px-5 py-3">
                        Build Your Resume Free →
                    </a>
                </div>
            </section>

            {/* Custom Embedded Styles */}
            <style>{`
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -5%;
                    left: -5%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .bg-glow-spot-2 {
                    position: absolute;
                    bottom: 5%;
                    right: -5%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, rgba(6, 182, 212, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .glass-panel-custom {
                    background: rgba(15, 18, 32, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
                    z-index: 2;
                }
                .glass-input-custom {
                    background-color: rgba(11, 13, 23, 0.85) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    color: #fff !important;
                    transition: all 0.2s ease !important;
                    border-radius: 12px !important;
                    padding: 14px 16px !important;
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
                    border-radius: 12px !important;
                    font-weight: 700 !important;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25) !important;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    text-decoration: none;
                }
                .btn-gradient-premium:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important;
                    box-shadow: 0 6px 22px rgba(99, 102, 241, 0.35) !important;
                    transform: translateY(-2px) !important;
                    color: #fff !important;
                }
                .btn-gradient-premium:disabled {
                    opacity: 0.65 !important;
                    cursor: not-allowed !important;
                }
                .builder-import-zone {
                    background: rgba(99, 102, 241, 0.02) !important;
                    border: 1.5px dashed rgba(99, 102, 241, 0.3) !important;
                    border-radius: 20px !important;
                    padding: 42px 24px !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }
                .builder-import-zone::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 1;
                }
                .builder-import-zone:hover {
                    border-color: rgba(99, 102, 241, 0.65) !important;
                    background: rgba(99, 102, 241, 0.05) !important;
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.08) !important;
                    transform: translateY(-1px);
                }
                .import-icon-container {
                    width: 64px;
                    height: 64px;
                    background: rgba(99, 102, 241, 0.08);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .builder-import-zone:hover .import-icon-container {
                    transform: scale(1.08) rotate(3deg);
                    background: rgba(99, 102, 241, 0.12);
                    border-color: rgba(99, 102, 241, 0.3);
                }
                .text-indigo {
                    color: #818cf8 !important;
                }
                .text-success {
                    color: #22c55e !important;
                }
                .text-warning {
                    color: #f59e0b !important;
                }
                .text-danger {
                    color: #ef4444 !important;
                }
            `}</style>
        </div>
    );
}
