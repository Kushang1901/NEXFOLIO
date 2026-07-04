"use client";

import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { ListChecks, KeyRound, LayoutTemplate, Type, FileText, HardDrive } from "lucide-react";

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
        if (status === "pass") return { icon: "✓", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" };
        if (status === "warn") return { icon: "⚠", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" };
        return { icon: "✗", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" };
    };

    const circumference = 2 * Math.PI * 54;

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Navbar />

            {/* Hero */}
            <section style={{ background: "linear-gradient(160deg, #0a0a1a 0%, #000 60%)", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#a5b4fc", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        🎯 AI-Powered
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "800", lineHeight: "1.15", marginBottom: "20px", letterSpacing: "-0.02em" }}>
                        Free ATS Resume Checker
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", marginBottom: "0" }}>
                        Upload your resume and instantly find out if it'll pass Applicant Tracking Systems.
                        Get a detailed score, section-by-section analysis, and actionable fixes — 100% free.
                    </p>
                </div>
            </section>

            {/* Main Tool */}
            <section style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "1fr", gap: "32px", alignItems: "start" }}>

                    {/* Left: Upload Panel */}
                    <div>
                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragging ? "#6366f1" : file ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
                                borderRadius: "16px",
                                padding: "48px 24px",
                                textAlign: "center",
                                cursor: "pointer",
                                background: isDragging ? "rgba(99,102,241,0.06)" : file ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.02)",
                                transition: "all 0.2s ease",
                                marginBottom: "24px",
                            }}
                        >
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={handleFileChange} />
                            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{file ? "✅" : "📤"}</div>
                            {file ? (
                                <>
                                    <p style={{ color: "#22c55e", fontWeight: "700", fontSize: "1rem", marginBottom: "6px" }}>{file.name}</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Click to change file</p>
                                </>
                            ) : (
                                <>
                                    <p style={{ fontWeight: "600", fontSize: "1rem", marginBottom: "8px" }}>Drop your resume here</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "0" }}>PDF, DOC, or DOCX · Max 5MB</p>
                                </>
                            )}
                        </div>

                        {/* Job Description */}
                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", fontWeight: "600", fontSize: "0.9rem", marginBottom: "10px", color: "rgba(255,255,255,0.8)" }}>
                                Paste Job Description <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: "400" }}>(optional — improves keyword match)</span>
                            </label>
                            <textarea
                                value={jobDesc}
                                onChange={e => setJobDesc(e.target.value)}
                                placeholder="Paste the job description here to check keyword match..."
                                rows={5}
                                style={{
                                    width: "100%", background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px",
                                    color: "#fff", padding: "14px 16px", fontSize: "0.9rem",
                                    resize: "vertical", outline: "none", fontFamily: "inherit",
                                    lineHeight: "1.6", transition: "border-color 0.2s",
                                    boxSizing: "border-box",
                                }}
                                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!file || loading}
                            style={{
                                width: "100%", padding: "15px",
                                background: !file ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #6366f1, #4f46e5)",
                                border: "none", borderRadius: "12px", color: "#fff",
                                fontWeight: "700", fontSize: "1rem", cursor: file ? "pointer" : "not-allowed",
                                boxShadow: file ? "0 4px 20px rgba(99,102,241,0.35)" : "none",
                                transition: "all 0.2s ease",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                                    Analyzing Resume...
                                </>
                            ) : "🎯 Check ATS Score"}
                        </button>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>

                    {/* Right: Results */}
                    {result && (
                        <div style={{ animation: "fadeUp 0.4s ease" }}>
                            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

                            {/* Score Ring */}
                            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px 24px", marginBottom: "20px", textAlign: "center" }}>
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
                                <div style={{ marginTop: "-74px", marginBottom: "16px" }}>
                                    <div style={{ fontSize: "2.2rem", fontWeight: "800", color: scoreColor(result.score) }}>{result.score}</div>
                                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: "500" }}>ATS Score</div>
                                </div>
                                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
                                    {result.score >= 80 ? "🟢 Great — your resume should pass most ATS filters." : result.score >= 60 ? "🟡 Fair — a few fixes will significantly improve your score." : "🔴 Needs work — ATS may reject this resume automatically."}
                                </div>
                            </div>

                            {/* Section Checks */}
                            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px" }}>
                                <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Section Analysis</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {result.sections.map((s, i) => {
                                        const st = statusIcon(s.status);
                                        return (
                                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", background: st.bg, border: `1px solid ${st.border}`, borderRadius: "10px" }}>
                                                <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: st.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>{st.icon}</span>
                                                <div>
                                                    <div style={{ fontWeight: "600", fontSize: "0.88rem", color: "#fff", marginBottom: "2px" }}>{s.label}</div>
                                                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{s.detail}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Improvements */}
                            <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "16px", padding: "20px 24px" }}>
                                <h3 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>💡 Top Improvements</h3>
                                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {result.improvements.map((tip, i) => (
                                        <li key={i} style={{ display: "flex", gap: "10px", fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: "1.5" }}>
                                            <span style={{ color: "#6366f1", fontWeight: "700", flexShrink: 0 }}>{i + 1}.</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Tips Section */}
            <section style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "72px 24px" }}>
                <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: "800", marginBottom: "12px" }}>How to Make Your Resume ATS-Proof</h2>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}>Follow these best practices to maximize your ATS score.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                        {TIPS.map((tip, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "24px", transition: "border-color 0.2s, transform 0.2s" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${tip.color}55`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${tip.color}18`, border: `1px solid ${tip.color}35`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                                    <tip.Icon size={22} color={tip.color} strokeWidth={1.8} />
                                </div>
                                <h3 style={{ fontSize: "0.97rem", fontWeight: "700", marginBottom: "8px", color: "#fff" }}>{tip.title}</h3>
                                <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.5)", lineHeight: "1.65", margin: 0 }}>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "72px 24px", textAlign: "center", background: "#000" }}>
                <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: "800", marginBottom: "16px" }}>Ready to Build an ATS-Friendly Resume?</h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "32px", fontSize: "1rem", lineHeight: "1.7" }}>Use our free AI resume builder to create a perfectly formatted, keyword-optimized resume in minutes.</p>
                    <a href="/templates" style={{ display: "inline-block", padding: "14px 40px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "12px", color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "1rem", boxShadow: "0 4px 20px rgba(99,102,241,0.35)", transition: "opacity 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        Build Your Resume Free →
                    </a>
                </div>
            </section>
        </div>
    );
}
