"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { subscribeToAuthChanges } from "../../authState";
import { LayoutDashboard, Plus, FileText, Palette, Pencil, Eye, Trash2, Lightbulb } from "lucide-react";

// Sample data — replace with real API calls from your DB
const SAMPLE_RESUMES = [
    { id: "res_001", name: "Software Engineer Resume", template: "Developer", updatedAt: "2025-06-30", preview: "#0f172a", accentColor: "#38bdf8", initials: "JD" },
    { id: "res_002", name: "Internship Application", template: "Nordic", updatedAt: "2025-06-22", preview: "#f8fafc", accentColor: "#2563eb", initials: "JD" },
    { id: "res_003", name: "Marketing Role — Creative", template: "Aurora", updatedAt: "2025-06-15", preview: "#0f172a", accentColor: "#22d3ee", initials: "JD" },
];

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

export default function MyResumesPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((loggedUser) => {
            setUser(loggedUser);
            setLoading(false);
            if (!loggedUser) {
                router.push("/?triggerAuth=true");
            } else {
                // TODO: Replace with real API call: fetch(`/api/resumes?email=${loggedUser.email}`)
                setResumes(SAMPLE_RESUMES);
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, [router]);

    const handleDelete = (id) => {
        setResumes(prev => prev.filter(r => r.id !== id));
        setDeleteTarget(null);
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>Loading your resumes...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Navbar />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>

            {/* Header */}
            <section style={{ background: "linear-gradient(160deg, #0a0a1a 0%, #000 70%)", padding: "56px 24px 40px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ maxWidth: "1040px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <LayoutDashboard size={14} /> Dashboard
                        </div>
                        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: "800", marginBottom: "8px", letterSpacing: "-0.02em" }}>My Resumes</h1>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem" }}>
                            {resumes.length === 0 ? "You haven't created any resumes yet." : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} saved`}
                        </p>
                    </div>
                    <Link href="/templates" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "12px", color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "0.95rem", boxShadow: "0 4px 16px rgba(99,102,241,0.35)", transition: "opacity 0.2s", whiteSpace: "nowrap" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        <Plus size={16} /> Create New Resume
                    </Link>
                </div>
            </section>

            <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "48px 24px" }}>

                {resumes.length === 0 ? (
                    /* Empty State */
                    <div style={{ textAlign: "center", padding: "80px 24px", animation: "fadeUp 0.4s ease" }}>
                        <div style={{ width: "96px", height: "96px", background: "rgba(99,102,241,0.1)", border: "2px dashed rgba(99,102,241,0.3)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
                            <FileText size={40} color="#6366f1" />
                        </div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "12px" }}>No resumes yet</h2>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.97rem", marginBottom: "32px", maxWidth: "380px", margin: "0 auto 32px", lineHeight: "1.7" }}>
                            Create your first resume in minutes using our AI-powered builder with 18+ professional templates.
                        </p>
                        <Link href="/templates" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "12px", color: "#fff", textDecoration: "none", fontWeight: "700", fontSize: "1rem", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>
                            <Palette size={16} /> Browse Templates
                        </Link>
                    </div>
                ) : (
                    /* Resume Grid */
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "24px", animation: "fadeUp 0.4s ease" }}>

                        {resumes.map((resume, idx) => (
                            <div key={resume.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", overflow: "hidden", transition: "all 0.2s ease", animationDelay: `${idx * 0.05}s` }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(99,102,241,0.12)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                {/* Preview Thumbnail */}
                                <div style={{ height: "160px", background: resume.preview, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${resume.accentColor}22, transparent)` }} />
                                    <div style={{ textAlign: "center", position: "relative" }}>
                                        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: `${resume.accentColor}22`, border: `2px solid ${resume.accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: "800", color: resume.accentColor, margin: "0 auto 10px" }}>{resume.initials}</div>
                                        <div style={{ fontSize: "0.72rem", color: resume.accentColor, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", background: `${resume.accentColor}18`, border: `1px solid ${resume.accentColor}35`, borderRadius: "999px", padding: "3px 12px" }}>{resume.template}</div>
                                    </div>
                                    {/* Lines decoration */}
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} style={{ position: "absolute", bottom: `${20 + i * 14}px`, left: "16px", right: "16px", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }} />
                                    ))}
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: "18px 20px" }}>
                                    <h3 style={{ fontSize: "0.97rem", fontWeight: "700", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resume.name}</h3>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: "18px" }}>Updated {timeAgo(resume.updatedAt)}</p>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => router.push(`/resume/${resume.id}`)}
                                            style={{ flex: 1, padding: "9px 0", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "9px", color: "#a5b4fc", fontSize: "0.82rem", fontWeight: "600", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.22)"; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#a5b4fc"; }}
                                        >
                                            <Pencil size={12} /> Edit
                                        </button>
                                        <button
                                            onClick={() => router.push(`/preview?id=${resume.id}`)}
                                            style={{ flex: 1, padding: "9px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px", color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: "600", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                                        >
                                            <Eye size={12} /> Preview
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(resume.id)}
                                            style={{ padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "9px", color: "#ef4444", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Create New Card */}
                        <Link href="/templates" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "280px", background: "rgba(255,255,255,0.02)", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "18px", cursor: "pointer", textDecoration: "none", transition: "all 0.2s ease", gap: "12px", padding: "32px" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.05)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        >
                            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a5b4fc" }}>
                                <Plus size={24} />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontWeight: "700", color: "rgba(255,255,255,0.7)", marginBottom: "4px", fontSize: "0.95rem" }}>Create New Resume</p>
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Choose from 18+ templates</p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            {/* Tips banner */}
            {resumes.length > 0 && (
                <div style={{ maxWidth: "1040px", margin: "0 auto 48px", padding: "0 24px" }}>
                    <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "20px 24px", display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                        <Lightbulb size={22} color="#a5b4fc" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: "700", marginBottom: "4px", color: "#a5b4fc", fontSize: "0.9rem" }}>Pro Tip</p>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.86rem", margin: 0, lineHeight: "1.6" }}>
                                Tailor a different resume for each job application. Use our <Link href="/ats-checker" style={{ color: "#6366f1", fontWeight: "600" }}>ATS Checker</Link> to optimize your resume for each role before applying.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteTarget && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
                    <div style={{ background: "linear-gradient(145deg, #1c2027, #11141a)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "20px", padding: "36px", maxWidth: "400px", width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", animation: "fadeUp 0.25s ease" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                            <Trash2 size={40} color="#ef4444" />
                        </div>
                        <h3 style={{ fontWeight: "800", marginBottom: "10px", fontSize: "1.2rem" }}>Delete Resume?</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "28px", fontSize: "0.9rem", lineHeight: "1.6" }}>This action cannot be undone. Your resume will be permanently deleted.</p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteTarget)} style={{ flex: 1, padding: "12px", background: "rgba(239,68,68,0.15)", border: "1.5px solid rgba(239,68,68,0.4)", borderRadius: "10px", color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "0.9rem" }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
