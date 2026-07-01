"use client";

import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Navbar from "../../components/Navbar";

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

import { normalizeResumeData } from "../../utils/resumeAdapter";
import { useRouter } from "next/navigation";
import { showToast } from "../../utils/toast";
import { subscribeToAuthChanges } from "../../authState";

export default function Preview() {
    const router = useRouter();
    const [resumeData, setResumeData] = useState(null);
    const [aiOutput, setAiOutput] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadType, setDownloadType] = useState(null); // 'png' or 'pdf'
    const [isDownloading, setIsDownloading] = useState(false);

    const [activeLanguage, setActiveLanguage] = useState("original");
    const [translatedResumeData, setTranslatedResumeData] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // Sharing States
    const [resumeId, setResumeId] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [shareableLink, setShareableLink] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const [isSharingLoading, setIsSharingLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const fetchSharingStatus = async (id, email) => {
        try {
            const res = await fetch(`/api/resumes?id=${id}&email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                setIsPublic(data.isPublic || false);
                setShareableLink(data.shareableLink || "");
            }
        } catch (err) {
            console.error("Error fetching sharing status:", err);
        }
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem("resumeData");
        const savedAI = sessionStorage.getItem("aiOutput");
        const savedTemplate = sessionStorage.getItem("selectedTemplate") || "classic";
        const savedId = sessionStorage.getItem("resumeId");

        if (savedData) setResumeData(JSON.parse(savedData));
        if (savedAI && savedAI !== "undefined") setAiOutput(savedAI);
        setSelectedTemplate(savedTemplate);
        if (savedId) {
            setResumeId(savedId);
        }

        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            if (loggedUser && loggedUser.email) {
                setUserEmail(loggedUser.email);
                if (savedId) {
                    await fetchSharingStatus(savedId, loggedUser.email);
                }
            }
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    const handleTranslate = async (lang) => {
        if (lang === "original") {
            setActiveLanguage("original");
            setTranslatedResumeData(null);
            return;
        }

        setIsTranslating(true);
        setActiveLanguage(lang);
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeData,
                    targetLanguage: lang
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Translation failed");
            }

            const data = await response.json();
            setTranslatedResumeData(data);
            showToast(`Resume translated to ${lang} successfully!`, "success");
        } catch (err) {
            console.error("Translation API error:", err);
            showToast(err.message || "Failed to translate resume.", "error");
            setActiveLanguage("original");
            setTranslatedResumeData(null);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleEdit = () => {
        router.push("/builder");
    };

    const handleDownload = () => {
        setShowDownloadModal(true);
    };

    const downloadAsPNG = async () => {
        setIsDownloading(true);
        setDownloadType("png");
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const resume = document.getElementById("resume-preview");
            if (!resume) return;

            const canvas = await html2canvas(resume, {
                scale: 2,
                useCORS: true
            });
            const imgData = canvas.toDataURL("image/png");
            
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${resumeData?.fullName ? resumeData.fullName.replace(/\s+/g, "_") : "Resume"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setShowDownloadModal(false);
            showToast("Resume downloaded as PNG successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PNG. Please try again.", "error");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };

    const downloadAsPDF = async () => {
        setIsDownloading(true);
        setDownloadType("pdf");
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const resume = document.getElementById("resume-preview");
            if (!resume) return;

            const canvas = await html2canvas(resume, {
                scale: 2,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resumeData?.fullName ? resumeData.fullName.replace(/\s+/g, "_") : "Resume"}.pdf`);
            setShowDownloadModal(false);
            showToast("Resume downloaded as PDF successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PDF. Please try again.", "error");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };

    const handleTogglePublic = async (e) => {
        const checked = e.target.checked;
        setIsSharingLoading(true);
        try {
            const origin = window.location.origin;
            const newLink = checked ? `${origin}/resume/${resumeId}` : "";
            
            const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    id: resumeId,
                    resumeName: resumeData.fullName ? `${resumeData.fullName}'s Resume` : "My Resume",
                    resumeData: resumeData,
                    selectedTemplate: selectedTemplate,
                    isPublic: checked,
                    shareableLink: newLink
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update sharing settings.");
            }

            setIsPublic(checked);
            setShareableLink(newLink);
            showToast(checked ? "Resume is now publicly shareable!" : "Resume is now private.", "success");
        } catch (err) {
            console.error("Error updating sharing status:", err);
            showToast("Failed to update sharing settings.", "error");
        } finally {
            setIsSharingLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (!shareableLink) return;
        navigator.clipboard.writeText(shareableLink);
        showToast("Shareable link copied to clipboard!", "success");
    };

    if (!resumeData) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
                <Navbar />
                <h3>No resume data found</h3>
            </div>
        );
    }

    /* ================= NORMALIZE DATA ================= */
    const data = normalizeResumeData(
        activeLanguage !== "original" && translatedResumeData ? translatedResumeData : resumeData
    );

    /* ================= TEMPLATE LOGIC ================= */
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

            default:
                return <ClassicTemplate data={data} />;
        }
    };

    /* ================= UI ================= */
    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="d-flex justify-content-end align-items-center gap-3 mb-4 no-print flex-wrap">
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="lang-selector" className="text-white-50 small mb-0 me-1 fw-semibold d-none d-md-inline">
                            <i className="fas fa-language"></i> Language:
                        </label>
                        <select
                            id="lang-selector"
                            className="form-select form-select-sm bg-dark text-white border-secondary py-2 px-3"
                            style={{ width: "150px", borderRadius: "8px" }}
                            value={activeLanguage}
                            onChange={(e) => handleTranslate(e.target.value)}
                            disabled={isTranslating}
                        >
                            <option value="original">Original (English)</option>
                            <option value="Spanish">Español (Spanish)</option>
                            <option value="French">Français (French)</option>
                            <option value="German">Deutsch (German)</option>
                            <option value="Japanese">日本語 (Japanese)</option>
                            <option value="Chinese">中文 (Chinese)</option>
                            <option value="Hindi">हिन्दी (Hindi)</option>
                            <option value="Arabic">العربية (Arabic)</option>
                            <option value="Portuguese">Português (Portuguese)</option>
                            <option value="Italian">Italiano (Italian)</option>
                        </select>
                    </div>

                    <button onClick={handleEdit} className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "8px" }} suppressHydrationWarning>
                        <i className="fas fa-pen"></i> Edit
                    </button>
                    {resumeId && (
                        <button onClick={() => setShowShareModal(true)} className="btn btn-outline-info d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "8px" }} suppressHydrationWarning>
                            <i className="fas fa-share-alt"></i> Share
                        </button>
                    )}
                    <button onClick={handleDownload} className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "8px" }} suppressHydrationWarning>
                        <i className="fas fa-download"></i> Download Resume
                    </button>
                </div>

                <div
                    id="resume-preview"
                    className="bg-white text-dark"
                    style={{
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.5)"
                    }}
                >
                    {renderTemplate()}
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

            {/* DOWNLOAD FORMAT MODAL */}
            {showDownloadModal && !isDownloading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(10, 14, 21, 0.8)",
                    backdropFilter: "blur(8px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div className="card text-center p-5 text-white animate-fade-in" style={{
                        maxWidth: "500px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(142, 144, 160, 0.25)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}>
                        <div className="card-body position-relative p-0">
                            <button 
                                onClick={() => setShowDownloadModal(false)}
                                className="btn-close btn-close-white position-absolute"
                                style={{ top: "-25px", right: "-25px" }}
                                aria-label="Close"
                            ></button>
                            
                            <h3 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>Choose Export Format</h3>
                            <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem" }}>
                                Select your preferred file format to download your resume.
                            </p>
                            
                            <div className="row g-3">
                                <div className="col-6">
                                    <button 
                                        onClick={downloadAsPNG}
                                        className="btn btn-outline-info w-100 p-4 d-flex flex-column align-items-center justify-content-center"
                                        style={{
                                            borderRadius: "16px",
                                            borderWidth: "1.5px",
                                            transition: "all 0.2s ease",
                                            background: "rgba(13, 202, 240, 0.05)"
                                        }}
                                    >
                                        <i className="fas fa-file-image fa-2x mb-3 text-info"></i>
                                        <span className="fw-bold fs-5 mb-1">PNG Image</span>
                                        <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>Best for sharing</span>
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button 
                                        onClick={downloadAsPDF}
                                        className="btn btn-outline-primary w-100 p-4 d-flex flex-column align-items-center justify-content-center"
                                        style={{
                                            borderRadius: "16px",
                                            borderWidth: "1.5px",
                                            transition: "all 0.2s ease",
                                            background: "rgba(13, 110, 253, 0.05)"
                                        }}
                                    >
                                        <i className="fas fa-file-pdf fa-2x mb-3 text-primary"></i>
                                        <span className="fw-bold fs-5 mb-1">PDF File</span>
                                        <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>Best for printing/ATS</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <button 
                                    onClick={() => setShowDownloadModal(false)}
                                    className="btn btn-link text-white-50 text-decoration-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            <h4 className="fw-bold mb-3">
                                {downloadType === "png" ? "Generating Image" : "Compiling PDF"}
                            </h4>
                            <p className="text-white-50 mb-0">
                                {downloadType === "png" 
                                    ? "Converting your resume layouts to high-res PNG..." 
                                    : "Optimizing structure and creating print-ready PDF..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TRANSLATION PROGRESS LOADER */}
            {isTranslating && (
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
                                <i className="fas fa-language fa-spin text-info" style={{ fontSize: "3rem" }}></i>
                            </div>
                            <h4 className="fw-bold mb-3">
                                Translating Resume
                            </h4>
                            <p className="text-white-50 mb-0">
                                AI is translating your professional details to {activeLanguage}...
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* SHARE MODAL */}
            {showShareModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(10, 14, 21, 0.8)",
                    backdropFilter: "blur(8px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div className="card p-5 text-white animate-fade-in" style={{
                        maxWidth: "550px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(142, 144, 160, 0.25)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}>
                        <div className="card-body position-relative p-0">
                            <button 
                                onClick={() => setShowShareModal(false)}
                                className="btn-close btn-close-white position-absolute"
                                style={{ top: "-25px", right: "-25px" }}
                                aria-label="Close"
                            ></button>
                            
                            <h3 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: "-0.01em" }}>
                                <i className="fas fa-share-alt text-info"></i> Share Your Resume
                            </h3>
                            <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem" }}>
                                Publish your resume online so recruiters and employers can view or download it directly.
                            </p>
                            
                            <div className="p-3 mb-4 rounded-3" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="mb-1 fw-bold text-white">Public Sharing</h6>
                                        <span className="text-white-50 small" style={{ fontSize: "0.8rem" }}>
                                            {isPublic ? "Anyone with the link can view" : "Only you can access"}
                                        </span>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            role="switch" 
                                            id="public-share-switch"
                                            checked={isPublic}
                                            onChange={handleTogglePublic}
                                            disabled={isSharingLoading}
                                            style={{ width: "2.5em", height: "1.25em", cursor: "pointer" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {isPublic && (
                                <div className="mb-4">
                                    <label className="form-label text-white-50 small fw-semibold">Shareable Web Resume Link</label>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control bg-dark text-white border-secondary"
                                            value={shareableLink} 
                                            readOnly 
                                            style={{ fontSize: "0.9rem", borderRadius: "8px 0 0 8px" }}
                                        />
                                        <button 
                                            className="btn btn-info text-dark fw-bold" 
                                            onClick={handleCopyLink}
                                            type="button"
                                            style={{ borderRadius: "0 8px 8px 0" }}
                                        >
                                            <i className="fas fa-copy"></i> Copy
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button 
                                    onClick={() => setShowShareModal(false)}
                                    className="btn btn-secondary px-4"
                                    style={{ borderRadius: "8px" }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
