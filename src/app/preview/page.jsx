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

import { normalizeResumeData } from "../../utils/resumeAdapter";
import { useRouter } from "next/navigation";
import { showToast } from "../../utils/toast";

export default function Preview() {
    const router = useRouter();
    const [resumeData, setResumeData] = useState(null);
    const [aiOutput, setAiOutput] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadType, setDownloadType] = useState(null); // 'png' or 'pdf'
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const savedData = sessionStorage.getItem("resumeData");
        const savedAI = sessionStorage.getItem("aiOutput");
        const savedTemplate = sessionStorage.getItem("selectedTemplate") || "classic";

        if (savedData) setResumeData(JSON.parse(savedData));
        if (savedAI && savedAI !== "undefined") setAiOutput(savedAI);
        setSelectedTemplate(savedTemplate);
    }, []);

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

    if (!resumeData) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
                <Navbar />
                <h3>No resume data found</h3>
            </div>
        );
    }

    /* ================= NORMALIZE DATA ================= */
    const data = normalizeResumeData(resumeData);

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

            default:
                return <ClassicTemplate data={data} />;
        }
    };

    /* ================= UI ================= */
    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="d-flex justify-content-end gap-3 mb-4 no-print">
                    <button onClick={handleEdit} className="btn btn-outline-light d-flex align-items-center gap-2" suppressHydrationWarning>
                        <i className="fas fa-pen"></i> Edit
                    </button>
                    <button onClick={handleDownload} className="btn btn-primary d-flex align-items-center gap-2" suppressHydrationWarning>
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
        </div>
    );
}
