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

import { normalizeResumeData } from "../../utils/resumeAdapter";
import { useRouter } from "next/navigation";

export default function Preview() {
    const router = useRouter();
    const [resumeData, setResumeData] = useState(null);
    const [aiOutput, setAiOutput] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("classic");

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

    const handleDownload = async () => {
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
        pdf.save("Resume.pdf");
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
                    <button onClick={handleEdit} className="btn btn-outline-light" suppressHydrationWarning>
                        ✏️ Edit
                    </button>
                    <button onClick={handleDownload} className="btn btn-primary" suppressHydrationWarning>
                        📄 Download PDF
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
        </div>
    );
}
