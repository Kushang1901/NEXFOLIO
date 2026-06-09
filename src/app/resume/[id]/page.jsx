"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

import { normalizeResumeData } from "../../../utils/resumeAdapter";
import { showToast } from "../../../utils/toast";

export default function PublicResumePage() {
    const { id } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchPublicResume = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/resumes?id=${id}`);
                if (!res.ok) {
                    if (res.status === 401 || res.status === 404) {
                        throw new Error("This resume is private or does not exist.");
                    }
                    throw new Error("Failed to load resume.");
                }
                const data = await res.json();
                
                if (data.resumeData) {
                    setResumeData(data.resumeData);
                }
                if (data.selectedTemplate) {
                    setSelectedTemplate(data.selectedTemplate);
                }
            } catch (err) {
                console.error("Error fetching public resume:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicResume();
    }, [id]);

    useEffect(() => {
        if (resumeData?.fullName) {
            document.title = `${resumeData.fullName} - Professional Resume`;
        } else {
            document.title = "Shared Resume - Nexfolio";
        }
    }, [resumeData]);

    const downloadAsPDF = async () => {
        setIsDownloading(true);
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
            showToast("Resume downloaded as PDF successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PDF. Please try again.", "error");
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <div className="spinner-border text-info mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="fs-5">Loading resume details...</p>
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
                    <div className="card-body">
                        <div className="mb-4">
                            <i className="fas fa-lock fa-3x text-warning"></i>
                        </div>
                        <h3 className="fw-bold mb-3">🔒 Resume is Private</h3>
                        <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem" }}>
                            {error}
                        </p>
                        <a href="/" className="btn btn-primary px-4 py-2" style={{ borderRadius: "8px" }}>
                            Go to Homepage
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
                            Powered by Nexfolio
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
                    id="resume-preview"
                    className="bg-white text-dark mx-auto"
                    style={{
                        borderRadius: "12px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                        maxWidth: "850px"
                    }}
                >
                    {renderTemplate()}
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
