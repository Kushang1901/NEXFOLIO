"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { subscribeToAuthChanges } from "../../authState";
import { showToast } from "../../utils/toast";
import { normalizeResumeData } from "../../utils/resumeAdapter";
import { LayoutDashboard, Plus, FileText, Palette, Pencil, Eye, Trash2, Lightbulb } from "lucide-react";

import ClassicTemplate from "../../templates/ClassicTemplate";
import ModernTemplate from "../../templates/ModernTemplate";
import CreativeTemplate from "../../templates/CreativeTemplate";
import MinimalistTemplate from "../../templates/MinimalistTemplate";
import ExecutiveTemplate from "../../templates/ExecutiveTemplate";
import DeveloperTemplate from "../../templates/DeveloperTemplate";
import ElegantTemplate from "../../templates/ElegantTemplate";
import AccentTemplate from "../../templates/AccentTemplate";
import NavyEleganceTemplate from "../../templates/NavyEleganceTemplate";
import ModernMinimalistTemplate from "../../templates/ModernMinimalistTemplate";
import EmeraldTemplate from "../../templates/EmeraldTemplate";
import SlateTwoColumnTemplate from "../../templates/SlateTwoColumnTemplate";
import SunriseTemplate from "../../templates/SunriseTemplate";
import MidnightTemplate from "../../templates/MidnightTemplate";
import NordicTemplate from "../../templates/NordicTemplate";
import CrimsonTemplate from "../../templates/CrimsonTemplate";
import AuroraTemplate from "../../templates/AuroraTemplate";
import TimelineTemplate from "../../templates/TimelineTemplate";
import CompactATSTemplate from "../../templates/CompactATSTemplate";
import GraduateTemplate from "../../templates/GraduateTemplate";
import SwissGridTemplate from "../../templates/SwissGridTemplate";
import ProductManagerTemplate from "../../templates/ProductManagerTemplate";
import DataAnalystTemplate from "../../templates/DataAnalystTemplate";
import BentoTemplate from "../../templates/BentoTemplate";
import IvyLeagueTemplate from "../../templates/IvyLeagueTemplate";
import BlueprintTemplate from "../../templates/BlueprintTemplate";
import ConsultantTemplate from "../../templates/ConsultantTemplate";
import PortfolioResumeTemplate from "../../templates/PortfolioResumeTemplate";

const TEMPLATE_THEMES = {
    classic: { bg: "#1e1e2e", color: "#6c71c4" },
    modern: { bg: "#0d1b2a", color: "#4f8ef7" },
    creative: { bg: "#22092c", color: "#f43f5e" },
    minimalist: { bg: "#1b1b1b", color: "#a3a3a3" },
    executive: { bg: "#0b132b", color: "#38bdf8" },
    developer: { bg: "#0c1020", color: "#4ade80" },
    elegant: { bg: "#282a36", color: "#bd93f9" },
    accent: { bg: "#1f2d3d", color: "#00b4db" },
    navy_elegance: { bg: "#0d1b2a", color: "#3b82f6" },
    minimalist_bw: { bg: "#111111", color: "#ffffff" },
    emerald: { bg: "#022c22", color: "#0f766e" },
    slate_two_column: { bg: "#1e293b", color: "#64748b" },
    sunrise: { bg: "#3c1503", color: "#f48c06" },
    midnight: { bg: "#090514", color: "#7c3aed" },
    nordic: { bg: "#0f172a", color: "#2563eb" },
    crimson: { bg: "#1c1917", color: "#be123c" },
    aurora: { bg: "#041c16", color: "#22d3ee" },
    timeline: { bg: "#031d1a", color: "#0d9488" },
};

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

const getInitials = (name) => {
    if (!name) return "CV";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const TEMPLATE_COMPONENTS = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    minimalist: MinimalistTemplate,
    executive: ExecutiveTemplate,
    developer: DeveloperTemplate,
    elegant: ElegantTemplate,
    accent: AccentTemplate,
    navy_elegance: NavyEleganceTemplate,
    minimalist_bw: ModernMinimalistTemplate,
    emerald: EmeraldTemplate,
    slate_two_column: SlateTwoColumnTemplate,
    sunrise: SunriseTemplate,
    midnight: MidnightTemplate,
    nordic: NordicTemplate,
    crimson: CrimsonTemplate,
    aurora: AuroraTemplate,
    timeline: TimelineTemplate,
    compact_ats: CompactATSTemplate,
    graduate: GraduateTemplate,
    swiss_grid: SwissGridTemplate,
    product_manager: ProductManagerTemplate,
    data_analyst: DataAnalystTemplate,
    bento: BentoTemplate,
    ivy_league: IvyLeagueTemplate,
    blueprint: BlueprintTemplate,
    consultant: ConsultantTemplate,
    portfolio_resume: PortfolioResumeTemplate,
};

function ResumeMiniPreview({ template, resumeData }) {
    const [containerWidth, setContainerWidth] = useState(290);
    const containerRef = React.useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.getBoundingClientRect().width);
            }
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const data = normalizeResumeData(resumeData);
    const TemplateComponent = TEMPLATE_COMPONENTS[template] || ClassicTemplate;

    // Standard unscaled width of A4 template is 794px.
    const scale = containerWidth / 794;
    const unscaledHeight = 160 / scale;

    return (
        <div 
            ref={containerRef} 
            style={{ 
                width: "100%", 
                height: "160px", 
                overflow: "hidden", 
                position: "relative",
                backgroundColor: "#ffffff"
            }}
        >
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "794px",
                height: `${unscaledHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: "none",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                color: "#000000"
            }}>
                <TemplateComponent data={data} />
            </div>
        </div>
    );
}

export default function MyResumesPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            setUser(loggedUser);
            if (!loggedUser) {
                router.push("/?triggerAuth=true");
            } else {
                const userEmail = loggedUser.email || `github-${loggedUser.uid}@cvgrid.in`;
                try {
                    setLoading(true);
                    const res = await fetch(`/api/resumes?email=${encodeURIComponent(userEmail)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setResumes(data);
                    } else {
                        showToast("Failed to load your resumes.", "error");
                    }
                } catch (err) {
                    console.error("Error fetching resumes:", err);
                    showToast("Error connecting to database.", "error");
                } finally {
                    setLoading(false);
                }
            }
        });
        return () => { if (typeof unsubscribe === "function") unsubscribe(); };
    }, [router]);

    const handleDelete = async (id) => {
        if (!user) return;
        const userEmail = user.email || `github-${user.uid}@cvgrid.in`;
        try {
            const res = await fetch(`/api/resumes?id=${id}&email=${encodeURIComponent(userEmail)}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setResumes(prev => prev.filter(r => r.id !== id));
                showToast("Resume deleted successfully!", "success");
            } else {
                const errData = await res.json().catch(() => ({}));
                showToast(errData.error || "Failed to delete resume.", "error");
            }
        } catch (err) {
            console.error("Error deleting resume:", err);
            showToast("Failed to delete resume. Please try again.", "error");
        } finally {
            setDeleteTarget(null);
        }
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

                        {resumes.map((resume, idx) => {
                            const name = resume.resumeName || "Untitled Resume";
                            const template = resume.selectedTemplate || "classic";
                            const theme = TEMPLATE_THEMES[template] || { bg: "#0d0d1e", color: "#6366f1" };
                            const initials = getInitials(name);

                            return (
                                <div key={resume.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", overflow: "hidden", transition: "all 0.2s ease", animationDelay: `${idx * 0.05}s` }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${theme.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${theme.color}12`; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                                >
                                    {/* Preview Thumbnail */}
                                    <div style={{ height: "160px", position: "relative", overflow: "hidden" }}>
                                        <ResumeMiniPreview template={template} resumeData={resume.resumeData} />
                                    </div>

                                    {/* Card Body */}
                                    <div style={{ padding: "18px 20px" }}>
                                        <h3 style={{ fontSize: "0.97rem", fontWeight: "700", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</h3>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: "18px" }}>Updated {timeAgo(resume.updatedAt)}</p>

                                        {/* Actions */}
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => router.push(`/builder?id=${resume.id}`)}
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
                            );
                        })}

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
