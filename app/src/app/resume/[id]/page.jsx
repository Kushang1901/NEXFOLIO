"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Lock, Home } from "lucide-react";

import ClassicTemplate from "../../../templates/ClassicTemplate";
import ModernTemplate from "../../../templates/ModernTemplate";
import CreativeTemplate from "../../../templates/CreativeTemplate";
import MinimalistTemplate from "../../../templates/MinimalistTemplate";
import ExecutiveTemplate from "../../../templates/ExecutiveTemplate";
import DeveloperTemplate from "../../../templates/DeveloperTemplate";
import ElegantTemplate from "../../../templates/ElegantTemplate";
import AccentTemplate from "../../../templates/AccentTemplate";
import NavyEleganceTemplate from "../../../templates/NavyEleganceTemplate";
import ModernMinimalistTemplate from "../../../templates/ModernMinimalistTemplate";
import EmeraldTemplate from "../../../templates/EmeraldTemplate";
import SlateTwoColumnTemplate from "../../../templates/SlateTwoColumnTemplate";
import SunriseTemplate from "../../../templates/SunriseTemplate";
import MidnightTemplate from "../../../templates/MidnightTemplate";
import NordicTemplate from "../../../templates/NordicTemplate";
import CrimsonTemplate from "../../../templates/CrimsonTemplate";
import AuroraTemplate from "../../../templates/AuroraTemplate";
import TimelineTemplate from "../../../templates/TimelineTemplate";
import CompactATSTemplate from "../../../templates/CompactATSTemplate";
import GraduateTemplate from "../../../templates/GraduateTemplate";
import SwissGridTemplate from "../../../templates/SwissGridTemplate";
import ProductManagerTemplate from "../../../templates/ProductManagerTemplate";
import DataAnalystTemplate from "../../../templates/DataAnalystTemplate";
import BentoTemplate from "../../../templates/BentoTemplate";
import IvyLeagueTemplate from "../../../templates/IvyLeagueTemplate";
import BlueprintTemplate from "../../../templates/BlueprintTemplate";
import ConsultantTemplate from "../../../templates/ConsultantTemplate";
import PortfolioResumeTemplate from "../../../templates/PortfolioResumeTemplate";

import { normalizeResumeData } from "../../../utils/resumeAdapter";
import { showToast } from "../../../utils/toast";

export default function PublicResumePage() {
    const { id } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    
    // Privacy protection & statistics
    const [isLocked, setIsLocked] = useState(false);
    const [password, setPassword] = useState("");
    const [realId, setRealId] = useState(null);

    // Scaling for responsiveness
    const [scale, setScale] = useState(1);
    const [parentHeight, setParentHeight] = useState("auto");

    // Dynamic Scaling Effect for Mobile Preview
    useEffect(() => {
        const previewEl = document.getElementById("resume-preview");
        const containerEl = document.querySelector(".preview-viewport-container");
        
        if (!previewEl || !containerEl) return;

        const updateScale = () => {
            const containerWidth = containerEl.clientWidth;
            const targetWidth = 794; // A4 width in pixels
            
            let newScale = 1;
            if (containerWidth < targetWidth) {
                newScale = Math.max(0.1, (containerWidth - 24) / targetWidth);
            }
            
            setScale(newScale);
            
            // Calculate height based on scale
            const previewHeight = previewEl.scrollHeight || previewEl.offsetHeight || 1123;
            setParentHeight(`${previewHeight * newScale}px`);
        };

        const resizeObserver = new ResizeObserver(() => {
            updateScale();
        });

        resizeObserver.observe(containerEl);
        resizeObserver.observe(previewEl);

        const timer = setTimeout(updateScale, 150);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timer);
        };
    }, [selectedTemplate, resumeData]);

    const FREE_TEMPLATES = ["modern", "creative", "product_manager", "bento"];
    const isCurrentTemplatePremium = !FREE_TEMPLATES.includes(selectedTemplate);

    const fetchPublicResume = async (pass = "") => {
        try {
            setLoading(true);
            setError(null);
            const query = pass ? `&password=${encodeURIComponent(pass)}` : "";
            const res = await fetch(`/api/resumes?id=${id}${query}`);
            
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401 && data.error === "Incorrect password") {
                    showToast("Incorrect password. Please try again.", "error");
                    setIsLocked(true);
                    return;
                }
                if (res.status === 401 || res.status === 404) {
                    throw new Error(data.error || "This resume is private or does not exist.");
                }
                throw new Error("Failed to load resume.");
            }

            if (data.isLocked) {
                setIsLocked(true);
                setRealId(data.id);
                return;
            }

            setIsLocked(false);
            setRealId(data.id);

            if (data.resumeData) {
                setResumeData(data.resumeData);
            }
            if (data.selectedTemplate) {
                setSelectedTemplate(data.selectedTemplate);
            }
            setIsPaid(data.isPaid || false);

            // Increment unique view stat on success
            fetch("/api/resume-sharing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "increment_stat", resumeId: data.id, statType: "view" })
            }).catch(err => console.error("Stats View Log Error:", err));

        } catch (err) {
            console.error("Error fetching public resume:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchPublicResume();
    }, [id]);

    useEffect(() => {
        if (resumeData?.fullName) {
            document.title = `${resumeData.fullName} - Professional Resume`;
        } else {
            document.title = "Shared Resume - CVGrid";
        }
    }, [resumeData]);

    const downloadAsPDF = async () => {
        setIsDownloading(true);
        if (!isPaid) {
            setShowWatermark(true);
            await new Promise((resolve) => setTimeout(resolve, 150));
        }
        try {
            const resume = document.getElementById("resume-preview");
            if (!resume) return;

            const html2canvas = (await import("html2canvas")).default;
            const jsPDF = (await import("jspdf")).default;

            // Wait for all custom web fonts to be fully loaded
            if (typeof document !== "undefined" && document.fonts) {
                await document.fonts.ready;
            }

            const canvas = await html2canvas(resume, {
                scale: 2,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Proportional height in mm
            
            const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

            pdf.save(`${resumeData?.fullName ? resumeData.fullName.replace(/\s+/g, "_") : "Resume"}.pdf`);
            showToast("Resume downloaded as PDF successfully!", "success");

            // Log download stat
            if (realId) {
                fetch("/api/resume-sharing", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "increment_stat", resumeId: realId, statType: "download" })
                }).catch(err => console.error("Stats Download Log Error:", err));
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PDF. Please try again.", "error");
        } finally {
            setIsDownloading(false);
            setShowWatermark(false);
        }
    };

    if (loading) {
        return (
            <div 
                style={{
                    background: "radial-gradient(circle at center, #0e0e1e 0%, #05050a 100%)",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Decorative glows */}
                <div style={{ position: "absolute", top: "20%", left: "30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "20%", right: "30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", zIndex: 10 }}>
                    <div style={{ position: "relative", width: "64px", height: "64px" }}>
                        {/* Outer glowing ring */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                border: "3px solid rgba(99, 102, 241, 0.12)",
                                borderTopColor: "#6366f1",
                                animation: "cvgrid-spin 0.8s linear infinite",
                            }}
                        />
                        {/* Middle ring */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "8px",
                                borderRadius: "50%",
                                border: "2px solid rgba(139, 92, 246, 0.08)",
                                borderTopColor: "#8b5cf6",
                                animation: "cvgrid-spin-reverse 1.2s linear infinite",
                            }}
                        />
                        {/* Center glowing orb */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "20px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                boxShadow: "0 0 16px rgba(168, 85, 247, 0.7)",
                                animation: "cvgrid-pulse 1s ease-in-out infinite",
                            }}
                        />
                    </div>

                    <p 
                        style={{
                            fontFamily: "var(--font-space-grotesk), sans-serif",
                            fontSize: "1.1rem",
                            fontWeight: "500",
                            letterSpacing: "0.02em",
                            background: "linear-gradient(90deg, #ffffff 0%, #b6c4ff 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            margin: 0,
                            animation: "cvgrid-text-fade 1.5s ease-in-out infinite alternate"
                        }}
                    >
                        Loading resume details...
                    </p>
                </div>

                {/* Inline animations */}
                <style>{`
                    @keyframes cvgrid-spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes cvgrid-spin-reverse {
                        to { transform: rotate(-360deg); }
                    }
                    @keyframes cvgrid-pulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.25); opacity: 0.8; }
                    }
                    @keyframes cvgrid-text-fade {
                        from { opacity: 0.6; }
                        to { opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: "#060610" }}>
                <div className="card p-5 text-center text-white" style={{
                    maxWidth: "460px",
                    width: "100%",
                    background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                }}>
                    <div className="card-body p-0">
                        <div className="d-flex justify-content-center mb-4">
                            <div style={{ width: "70px", height: "70px", borderRadius: "18px", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Lock size={36} color="#818cf8" />
                            </div>
                        </div>
                        <h3 className="fw-bold mb-2">Password Protected</h3>
                        <p className="text-white-50 mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                            The owner has secured this resume. Please enter the password to view.
                        </p>
                        
                        <div className="mb-4">
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Enter password..." 
                                className="form-control" 
                                style={{
                                    backgroundColor: "rgba(11, 13, 23, 0.85)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    padding: "12px 14px",
                                    textAlign: "center"
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") fetchPublicResume(password);
                                }}
                            />
                        </div>

                        <button 
                            onClick={() => fetchPublicResume(password)} 
                            className="btn btn-primary w-100 py-2.5 fw-semibold" 
                            style={{ 
                                borderRadius: "10px", 
                                background: "linear-gradient(135deg, #6366f1, #4f46e5)", 
                                border: "none" 
                            }}
                        >
                            Unlock Resume
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center px-3">
                <div className="card p-5 text-center text-white" style={{
                    maxWidth: "500px",
                    width: "90%",
                    background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                    borderRadius: "20px",
                    border: "1px solid rgba(142, 144, 160, 0.25)",
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                }}>
                    <div className="card-body p-0">
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                            <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Lock size={40} color="#f59e0b" />
                            </div>
                        </div>
                        <h3 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>Resume is Private</h3>
                        <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                            {error}
                        </p>
                        <a href="/" className="btn btn-primary py-2.5 px-4 fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", border: "none" }}>
                            <Home size={16} /> Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const data = normalizeResumeData(resumeData);

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case "modern":
                return <ModernTemplate data={data} />;
            case "creative":
                return <CreativeTemplate data={data} />;
            case "minimalist":
                return <MinimalistTemplate data={data} />;
            case "executive":
                return <ExecutiveTemplate data={data} />;
            case "developer":
                return <DeveloperTemplate data={data} />;
            case "elegant":
                return <ElegantTemplate data={data} />;
            case "accent":
                return <AccentTemplate data={data} />;
            case "navy_elegance":
                return <NavyEleganceTemplate data={data} />;
            case "minimalist_bw":
                return <ModernMinimalistTemplate data={data} />;
            case "emerald":
                return <EmeraldTemplate data={data} />;
            case "slate_two_column":
                return <SlateTwoColumnTemplate data={data} />;
            case "sunrise":
                return <SunriseTemplate data={data} />;
            case "midnight":
                return <MidnightTemplate data={data} />;
            case "nordic":
                return <NordicTemplate data={data} />;
            case "crimson":
                return <CrimsonTemplate data={data} />;
            case "aurora":
                return <AuroraTemplate data={data} />;
            case "timeline":
                return <TimelineTemplate data={data} />;
            case "compact_ats":
                return <CompactATSTemplate data={data} />;
            case "graduate":
                return <GraduateTemplate data={data} />;
            case "swiss_grid":
                return <SwissGridTemplate data={data} />;
            case "product_manager":
                return <ProductManagerTemplate data={data} />;
            case "data_analyst":
                return <DataAnalystTemplate data={data} />;
            case "bento":
                return <BentoTemplate data={data} />;
            case "ivy_league":
                return <IvyLeagueTemplate data={data} />;
            case "blueprint":
                return <BlueprintTemplate data={data} />;
            case "consultant":
                return <ConsultantTemplate data={data} />;
            case "portfolio_resume":
                return <PortfolioResumeTemplate data={data} />;
            default:
                return <ClassicTemplate data={data} />;
        }
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            {/* FLOATING TOP BAR */}
            <div className="no-print sticky-top border-bottom border-secondary" style={{
                background: "rgba(10, 14, 21, 0.85)",
                backdropFilter: "blur(12px)",
                zIndex: 1030
            }}>
                <div className="container py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <h5 className="mb-0 fw-bold text-white text-truncate" style={{ maxWidth: "250px" }}>
                            {resumeData?.fullName || "Candidate Resume"}
                        </h5>
                        <span className="badge text-bg-info text-dark text-uppercase font-monospace px-2 py-1" style={{ fontSize: "0.65rem", fontWeight: "700" }}>
                            Shared View
                        </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-white-50 small d-none d-md-inline me-2">
                            Powered by CVGrid
                        </span>
                        <button 
                            onClick={downloadAsPDF} 
                            disabled={isDownloading}
                            className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2" 
                            style={{ borderRadius: "8px", fontWeight: "600" }}
                        >
                            {isDownloading ? (
                                <>
                                    <i className="fas fa-circle-notch fa-spin"></i> Compiling...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-download"></i> Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* RESUME PREVIEW CONTAINER */}
            <div className="container py-5">
                <div 
                    className="preview-viewport-container d-flex justify-content-center py-2"
                    style={{ width: "100%", overflow: "hidden" }}
                >
                    <div 
                        className="preview-viewport-shadow"
                        style={{
                            width: `${794 * scale}px`,
                            height: parentHeight,
                            overflow: "hidden",
                            position: "relative",
                            transition: "width 0.15s ease, height 0.15s ease",
                            borderRadius: "12px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
                        }}
                    >
                        <div
                            id="resume-preview"
                            className="bg-white text-dark"
                            style={{
                                width: "794px",
                                minHeight: "1123px",
                                boxSizing: "border-box",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                transform: `scale(${scale})`,
                                transformOrigin: "top left",
                                overflow: "hidden",
                                fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                            }}
                        >
                            {/* Watermark Overlay for Unpaid Resume */}
                            {!isPaid && showWatermark && isCurrentTemplatePremium && (
                                <div className="watermark-overlay" style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    pointerEvents: "none",
                                    zIndex: 99,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    padding: "120px 0",
                                    boxSizing: "border-box",
                                    overflow: "hidden"
                                }}>
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div key={idx} style={{
                                            fontSize: "90px",
                                            color: "rgba(128, 128, 128, 0.11)",
                                            fontWeight: "900",
                                            transform: "rotate(-30deg) scale(1.1)",
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                            width: "100%",
                                            userSelect: "none",
                                            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                                            letterSpacing: "10px",
                                            margin: "40px 0"
                                        }}>
                                            CVGRID
                                        </div>
                                    ))}
                                </div>
                            )}
                            {renderTemplate()}
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT STYLES */}
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background-color: white !important;
                    }
                    #resume-preview {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                }
            `}</style>

            {/* DOWNLOAD PROGRESS LOADER */}
            {isDownloading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(10, 14, 21, 0.85)",
                    backdropFilter: "blur(12px)",
                    zIndex: 10000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div className="card text-center p-5 text-white animate-fade-in" style={{
                        maxWidth: "400px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(13, 110, 253, 0.25)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}>
                        <div className="card-body">
                            <div className="mb-4">
                                <i className="fas fa-circle-notch fa-spin text-primary" style={{ fontSize: "3rem" }}></i>
                            </div>
                            <h4 className="fw-bold mb-3">Compiling PDF</h4>
                            <p className="text-white-50 mb-0">
                                Optimizing layout and preparing print-ready file...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
