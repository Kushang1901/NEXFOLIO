"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../../authState";
import { showToast } from "../../utils/toast";
import CoverLetterPreview from "../../components/CoverLetterPreview";
import { normalizeResumeData } from "../../utils/resumeAdapter";
import Link from "next/link";
import { Sparkles, SlidersHorizontal, Loader2, FileDown, Eye, FileSignature, Briefcase, ChevronRight } from "lucide-react";

export default function CoverLetterGenerator() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    
    // Resume options list
    const [resumesList, setResumesList] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("session"); // "session" or ID number
    const [selectedResumeData, setSelectedResumeData] = useState(null);

    // Custom/Manual mode states
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualName, setManualName] = useState("");
    const [manualRole, setManualRole] = useState("");
    const [manualEmail, setManualEmail] = useState("");
    const [manualPhone, setManualPhone] = useState("");
    const [manualLinkedIn, setManualLinkedIn] = useState("");
    
    // AI Custom Instructions
    const [customInstructions, setCustomInstructions] = useState("");

    // Cloud Saved Cover Letters
    const [savedLettersList, setSavedLettersList] = useState([]);
    const [selectedLetterId, setSelectedLetterId] = useState("new");
    const [letterName, setLetterName] = useState("My Cover Letter");
    const [isSaving, setIsSaving] = useState(false);

    // Cover Letter generation inputs
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [hiringManager, setHiringManager] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [tone, setTone] = useState("Professional");
    const [selectedTemplate, setSelectedTemplate] = useState("classic");

    // Output & UX states
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingJobDesc, setIsGeneratingJobDesc] = useState(false);
    const [isGeneratingFocus, setIsGeneratingFocus] = useState(false);
    const [coverLetterText, setCoverLetterText] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState(null); // 'png' or 'pdf'

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user && user.email) {
                setUserEmail(user.email);
                setLoadingAuth(false);
                await fetchSavedResumes(user.email);
                await fetchSavedLetters();
                loadInitialResumeData();
            } else {
                setUserEmail(null);
                setLoadingAuth(false);          
                loadInitialResumeData();
            }
        });

        // Load templates configuration if preset
        const presetTemplate = sessionStorage.getItem("selectedTemplate") || "classic";
        setSelectedTemplate(presetTemplate);

        return () => unsubscribe();
    }, [router]);

    const fetchSavedResumes = async (email) => {
        try {
            const response = await fetch(`/api/resumes?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const data = await response.json();
                setResumesList(data);
            }
        } catch (err) {
            console.error("Error loading user resumes:", err);
        }
    };

    const fetchSavedLetters = async () => {
        try {
            const response = await fetch("/api/cover-letters");
            if (response.ok) {
                const data = await response.json();
                setSavedLettersList(data);
            }
        } catch (err) {
            console.error("Error loading user cover letters:", err);
        }
    };

    const loadInitialResumeData = () => {
        const sessionData = sessionStorage.getItem("resumeData");
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                setSelectedResumeData(parsed);
            } catch (err) {
                console.error("Error parsing session resumeData:", err);
            }
        }
    };

    // Load selected resume (session draft or cloud save)
    useEffect(() => {
        if (selectedResumeId === "session") {
            loadInitialResumeData();
        } else if (userEmail && selectedResumeId) {
            fetchSingleResume(userEmail, selectedResumeId);
        }
    }, [selectedResumeId, userEmail]);

    const fetchSingleResume = async (email, id) => {
        try {
            const response = await fetch(`/api/resumes?email=${encodeURIComponent(email)}&id=${id}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedResumeData(data.resumeData);
                if (data.selectedTemplate) {
                    setSelectedTemplate(data.selectedTemplate);
                }
            }
        } catch (err) {
            console.error("Error fetching single resume details:", err);
            showToast("Failed to load selected resume details.", "error");
        }
    };

    const getActiveResumeData = () => {
        if (isManualMode) {
            return {
                basics: {
                    name: manualName,
                    role: manualRole,
                    email: manualEmail,
                    phone: manualPhone,
                    links: {
                        linkedin: manualLinkedIn
                    }
                }
            };
        }
        return selectedResumeData;
    };

    const handleSelectLetter = async (letterId) => {
        setSelectedLetterId(letterId);
        if (letterId === "new") {
            setLetterName("My Cover Letter");
            setJobTitle("");
            setCompanyName("");
            setHiringManager("");
            setJobDescription("");
            setTone("Professional");
            setCoverLetterText("");
            setCustomInstructions("");
            setIsManualMode(false);
            return;
        }

        try {
            const response = await fetch(`/api/cover-letters?id=${letterId}`);
            if (response.ok) {
                const data = await response.json();
                setLetterName(data.letterName || "My Cover Letter");
                setJobTitle(data.jobTitle || "");
                setCompanyName(data.companyName || "");
                setHiringManager(data.hiringManager || "");
                setTone(data.tone || "Professional");
                setSelectedTemplate(data.selectedTemplate || "classic");
                setCoverLetterText(data.letterText || "");
                
                if (data.candidateData) {
                    setIsManualMode(true);
                    setManualName(data.candidateData.basics?.name || "");
                    setManualRole(data.candidateData.basics?.role || "");
                    setManualEmail(data.candidateData.basics?.email || "");
                    setManualPhone(data.candidateData.basics?.phone || "");
                    setManualLinkedIn(data.candidateData.basics?.links?.linkedin || "");
                } else {
                    setIsManualMode(false);
                }
            }
        } catch (err) {
            console.error("Error fetching single cover letter details:", err);
            showToast("Failed to load cover letter details.", "error");
        }
    };

    const handleSave = async () => {
        if (!jobTitle || !companyName || !coverLetterText) {
            showToast("Please generate a cover letter and fill in job details before saving.", "error");
            return;
        }
        
        setIsSaving(true);
        try {
            const body = {
                letterName,
                jobTitle,
                companyName,
                hiringManager,
                tone,
                selectedTemplate,
                letterText: coverLetterText,
                candidateData: isManualMode ? getActiveResumeData() : null
            };
            
            if (selectedLetterId !== "new") {
                body.id = selectedLetterId;
            }
            
            const response = await fetch("/api/cover-letters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error("Failed to save cover letter");
            }
            
            const result = await response.json();
            showToast("Cover letter saved successfully!", "success");
            
            if (selectedLetterId === "new") {
                setSelectedLetterId(result.id);
            }
            
            await fetchSavedLetters();
        } catch (err) {
            console.error(err);
            showToast("Failed to save cover letter.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLetter = async (id) => {
        if (!confirm("Are you sure you want to delete this saved cover letter?")) return;
        
        try {
            const response = await fetch(`/api/cover-letters?id=${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                showToast("Cover letter deleted.", "success");
                if (selectedLetterId === id) {
                    handleSelectLetter("new");
                }
                await fetchSavedLetters();
            } else {
                showToast("Failed to delete cover letter.", "error");
            }
        } catch (err) {
            console.error("Delete cover letter error:", err);
            showToast("Failed to delete cover letter.", "error");
        }
    };

    const handleAIJobDescription = async () => {
        if (!jobTitle || !companyName) {
            showToast("Please enter Target Job Title and Company Name first.", "error");
            return;
        }
        setIsGeneratingJobDesc(true);
        try {
            const response = await fetch("/api/cover-letter/ai-helper", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "job-description",
                    jobTitle,
                    companyName
                })
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || "Failed to generate job description");
            }
            const data = await response.json();
            setJobDescription(data.result);
            showToast("Job description generated successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to generate job description.", "error");
        } finally {
            setIsGeneratingJobDesc(false);
        }
    };

    const handleAIFocusInstructions = async () => {
        const activeResume = getActiveResumeData();
        if (!activeResume) {
            showToast("Please load a resume or toggle Manual Details first.", "error");
            return;
        }
        if (isManualMode && !manualName) {
            showToast("Please enter Candidate Name first.", "error");
            return;
        }
        setIsGeneratingFocus(true);
        try {
            const response = await fetch("/api/cover-letter/ai-helper", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "focus-instructions",
                    jobTitle,
                    companyName,
                    candidateInfo: activeResume,
                    jobDescription
                })
            });
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || "Failed to generate focus instructions");
            }
            const data = await response.json();
            setCustomInstructions(data.result);
            showToast("Focus instructions recommended!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to recommend focus areas.", "error");
        } finally {
            setIsGeneratingFocus(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        const activeResume = getActiveResumeData();
        if (!activeResume) {
            showToast("No resume data found. Please build a resume first or toggle Manual Details.", "error");
            return;
        }
        if (isManualMode && !manualName) {
            showToast("Please enter Candidate Name in Manual Mode.", "error");
            return;
        }
        if (!jobTitle || !companyName || !jobDescription) {
            showToast("Please fill in Job Title, Company Name, and Job Description.", "error");
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidateInfo: activeResume,
                    jobTitle,
                    companyName,
                    jobDescription,
                    hiringManager,
                    tone,
                    customInstructions
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "AI generation failed");
            }

            const data = await response.json();
            setCoverLetterText(data.result);
            showToast("Cover letter drafted successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to generate cover letter.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // HTML2Canvas & jsPDF exports
    const downloadAsPNG = async () => {
        setIsDownloading(true);
        setDownloadType("png");
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const letter = document.getElementById("cover-letter-printable");
            if (!letter) return;

            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(letter, {
                scale: 2,
                useCORS: true
            });
            const imgData = canvas.toDataURL("image/png");
            
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `Cover_Letter_${companyName.replace(/\s+/g, "_") || "Draft"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Cover letter downloaded as PNG!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PNG.", "error");
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
            const letter = document.getElementById("cover-letter-printable");
            if (!letter) return;

            const html2canvas = (await import("html2canvas")).default;
            const jsPDF = (await import("jspdf")).default;

            // Wait for all custom web fonts to be fully loaded
            if (typeof document !== "undefined" && document.fonts) {
                await document.fonts.ready;
            }

            const canvas = await html2canvas(letter, {
                scale: 2,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Proportional height in mm
            
            const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Cover_Letter_${companyName.replace(/\s+/g, "_") || "Draft"}.pdf`);
            showToast("Cover letter downloaded as PDF!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PDF.", "error");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
        }
    };

    if (loadingAuth) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <Navbar />
                <div className="spinner-border text-info mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="fs-5">Setting up Cover Letter Engine...</p>
            </div>
        );
    }

    const activeResumeData = getActiveResumeData();
    const normalizedData = activeResumeData ? normalizeResumeData(activeResumeData) : null;

    return (
        <div className="cover-letter-page-container text-white min-vh-100 d-flex flex-column">
            {/* Background Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            <div className="container-fluid px-4 py-4 flex-grow-1 position-relative" style={{ zIndex: 5 }}>
                <div className="row g-4 h-100">
                    
                    {/* LEFT SIDEBAR: INPUT & CONTROLS */}
                    <div className="col-lg-5 d-flex flex-column">
                        <div className="glass-panel-custom p-4 flex-grow-1 d-flex flex-column justify-content-between" style={{ minHeight: "85vh" }}>
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <FileSignature size={22} className="text-indigo" />
                                    <h1 className="h3 fw-bold mb-0 text-white animate-fade-in">AI Cover Letter Generator</h1>
                                </div>
                                <p className="text-white-50 small mb-3">Tailor a professional cover letter specifically to your target job using AI.</p>

                                {/* Saved Letters Management Dropdown */}
                                {userEmail && (
                                    <div className="col-12 bg-dark-custom p-3 rounded-3 border-glass mb-4 d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <label className="form-label text-white-50 fw-semibold small mb-0">Saved Cover Letters</label>
                                            {selectedLetterId !== "new" && (
                                                <button
                                                    onClick={() => handleDeleteLetter(selectedLetterId)}
                                                    className="btn btn-sm btn-outline-danger py-0 px-2 fw-semibold"
                                                    style={{ fontSize: "0.75rem", borderRadius: "4px" }}
                                                >
                                                    Delete Current
                                                </button>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <select
                                                className="form-select bg-dark text-white border-glass flex-grow-1"
                                                value={selectedLetterId}
                                                onChange={(e) => handleSelectLetter(e.target.value)}
                                                style={{ borderRadius: "8px", height: "38px" }}
                                            >
                                                <option value="new">Create New Cover Letter...</option>
                                                {savedLettersList.map((letter) => (
                                                    <option key={letter.id} value={letter.id}>
                                                        {letter.letterName} ({letter.companyName})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="d-flex gap-2 mt-1">
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-white border-glass py-1 px-2.5 flex-grow-1"
                                                placeholder="Document Name (e.g. Google SWE Letter)"
                                                value={letterName}
                                                onChange={(e) => setLetterName(e.target.value)}
                                                style={{ borderRadius: "6px", fontSize: "0.85rem", height: "34px" }}
                                            />
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving || !coverLetterText}
                                                className="btn btn-indigo btn-sm py-1 px-3 d-flex align-items-center gap-1.5"
                                                style={{ borderRadius: "6px", fontSize: "0.85rem", whiteSpace: "nowrap", backgroundColor: "#4f46e5", border: "none", color: "#ffffff" }}
                                            >
                                                {isSaving ? <Loader2 className="spinner-icon fa-spin" size={14} /> : "Save"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleGenerate} className="row g-3">
                                    {/* Resume Source selector */}
                                    <div className="col-12">
                                        <label className="form-label text-white-50 fw-semibold small">Choose Resume Profile</label>
                                        <select
                                            className="form-select bg-dark-custom text-white border-glass"
                                            value={selectedResumeId}
                                            disabled={isManualMode}
                                            onChange={(e) => setSelectedResumeId(e.target.value)}
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        >
                                            <option value="session">Active Session Resume (Latest Draft)</option>
                                            {resumesList.map((res) => (
                                                <option key={res.id} value={res.id}>{res.resumeName} (Cloud Save)</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Manual Mode Toggle */}
                                    <div className="col-12 d-flex align-items-center justify-content-between py-2 bg-dark-custom px-3 rounded-3 border-glass">
                                        <div className="d-flex flex-column">
                                            <span className="small fw-semibold text-white">Manual Profile Details</span>
                                            <span className="text-white-50" style={{ fontSize: "0.75rem" }}>Input credentials without a resume draft</span>
                                        </div>
                                        <div className="form-check form-switch mb-0">
                                            <input
                                                className="form-check-input cursor-pointer"
                                                type="checkbox"
                                                role="switch"
                                                checked={isManualMode}
                                                onChange={(e) => setIsManualMode(e.target.checked)}
                                                id="manualModeSwitch"
                                            />
                                        </div>
                                    </div>

                                    {/* Manual Input Fields */}
                                    {isManualMode && (
                                        <div className="col-12 row g-2 mt-0 px-2 py-3 bg-dark-custom rounded-3 border-glass" style={{ border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                                            <div className="col-md-6 mt-1">
                                                <label className="form-label text-white-50 fw-semibold small mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-glass"
                                                    placeholder="e.g. John Doe"
                                                    value={manualName}
                                                    onChange={(e) => setManualName(e.target.value)}
                                                    required={isManualMode}
                                                    style={{ borderRadius: "6px", height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </div>
                                            <div className="col-md-6 mt-1">
                                                <label className="form-label text-white-50 fw-semibold small mb-1">Professional Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-glass"
                                                    placeholder="e.g. Frontend Engineer"
                                                    value={manualRole}
                                                    onChange={(e) => setManualRole(e.target.value)}
                                                    style={{ borderRadius: "6px", height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label text-white-50 fw-semibold small mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control bg-dark text-white border-glass"
                                                    placeholder="e.g. john@example.com"
                                                    value={manualEmail}
                                                    onChange={(e) => setManualEmail(e.target.value)}
                                                    style={{ borderRadius: "6px", height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label text-white-50 fw-semibold small mb-1">Phone</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-glass"
                                                    placeholder="e.g. +1 234 567 89"
                                                    value={manualPhone}
                                                    onChange={(e) => setManualPhone(e.target.value)}
                                                    style={{ borderRadius: "6px", height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </div>
                                            <div className="col-12 mt-2">
                                                <label className="form-label text-white-50 fw-semibold small mb-1">LinkedIn / Portfolio URL</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-glass"
                                                    placeholder="e.g. linkedin.com/in/johndoe"
                                                    value={manualLinkedIn}
                                                    onChange={(e) => setManualLinkedIn(e.target.value)}
                                                    style={{ borderRadius: "6px", height: "36px", fontSize: "0.85rem" }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Job Title & Company */}
                                    <div className="col-md-6">
                                        <label className="form-label text-white-50 fw-semibold small">Target Job Title</label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark-custom text-white border-glass"
                                            placeholder="e.g. Software Engineer"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            required
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-white-50 fw-semibold small">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark-custom text-white border-glass"
                                            placeholder="e.g. Google"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            required
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        />
                                    </div>

                                    {/* Hiring Manager & Tone */}
                                    <div className="col-md-6">
                                        <label className="form-label text-white-50 fw-semibold small">Hiring Manager Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark-custom text-white border-glass"
                                            placeholder="e.g. Jane Doe (Optional)"
                                            value={hiringManager}
                                            onChange={(e) => setHiringManager(e.target.value)}
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-white-50 fw-semibold small">Writing Tone</label>
                                        <select
                                            className="form-select bg-dark-custom text-white border-glass"
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value)}
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        >
                                            <option value="Professional">Professional</option>
                                            <option value="Enthusiastic">Enthusiastic</option>
                                            <option value="Creative">Creative</option>
                                            <option value="Confident">Confident</option>
                                            <option value="Conversational">Conversational</option>
                                        </select>
                                    </div>

                                    {/* Template Letterhead selection */}
                                    <div className="col-12">
                                        <label className="form-label text-white-50 fw-semibold small">Letterhead Design Theme</label>
                                        <select
                                            className="form-select bg-dark-custom text-white border-glass text-capitalize"
                                            value={selectedTemplate}
                                            onChange={(e) => setSelectedTemplate(e.target.value)}
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        >
                                            <option value="classic">Classic (Clean Accent)</option>
                                            <option value="modern">Modern (Sidebar layout)</option>
                                            <option value="executive">Executive (Deep Navy Banner)</option>
                                            <option value="developer">Developer (Syntax terminal theme)</option>
                                            <option value="elegant">Elegant (Georgia Double-Border)</option>
                                            <option value="accent">Accent Line (Gradient top line)</option>
                                            <option value="navy_elegance">Navy Elegance (Corporate Banner)</option>
                                            <option value="emerald">Emerald Professional (Teal accent)</option>
                                        </select>
                                    </div>

                                    {/* AI Focus instructions */}
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-1.5">
                                            <label className="form-label text-white-50 fw-semibold small mb-0">Additional AI Instructions / Focus Areas (Optional)</label>
                                            <button
                                                type="button"
                                                onClick={handleAIFocusInstructions}
                                                disabled={isGeneratingFocus}
                                                className="btn btn-sm btn-outline-info py-0.5 px-2 d-flex align-items-center gap-1.5 fw-semibold"
                                                style={{ fontSize: "0.75rem", borderRadius: "6px", height: "24px", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.4)", backgroundColor: "transparent" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                            >
                                                {isGeneratingFocus ? (
                                                    <Loader2 className="spinner-icon fa-spin" size={12} />
                                                ) : (
                                                    <Sparkles size={12} />
                                                )}
                                                Suggest Focus
                                            </button>
                                        </div>
                                        <textarea
                                            className="form-control bg-dark-custom text-white border-glass"
                                            rows="2"
                                            placeholder="e.g. Focus on my React experience, Keep it under 250 words, highlight leadership roles..."
                                            value={customInstructions}
                                            onChange={(e) => setCustomInstructions(e.target.value)}
                                            style={{ borderRadius: "8px", padding: "10px", fontSize: "0.85rem" }}
                                        ></textarea>
                                    </div>

                                    {/* Job Description */}
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-1.5">
                                            <label className="form-label text-white-50 fw-semibold small mb-0">Job Description / Requirements</label>
                                            <button
                                                type="button"
                                                onClick={handleAIJobDescription}
                                                disabled={isGeneratingJobDesc}
                                                className="btn btn-sm btn-outline-info py-0.5 px-2 d-flex align-items-center gap-1.5 fw-semibold"
                                                style={{ fontSize: "0.75rem", borderRadius: "6px", height: "24px", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.4)", backgroundColor: "transparent" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                            >
                                                {isGeneratingJobDesc ? (
                                                    <Loader2 className="spinner-icon fa-spin" size={12} />
                                                ) : (
                                                    <Sparkles size={12} />
                                                )}
                                                Generate Sample
                                            </button>
                                        </div>
                                        <textarea
                                            className="form-control bg-dark-custom text-white border-glass"
                                            rows="5"
                                            placeholder="Paste the target job description details here..."
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            required
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                        ></textarea>
                                    </div>

                                    {/* Submit Action */}
                                    <div className="col-12 pt-2">
                                        <button
                                            type="submit"
                                            className="btn btn-gradient-premium w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 animate-fade-in"
                                            disabled={isGenerating || (!activeResumeData && !isManualMode)}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="spinner-icon fa-spin" size={18} />
                                                    AI is Drafting Letter...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={16} />
                                                    Generate Styled Cover Letter
                                                </>
                                            )}
                                        </button>
                                        {!activeResumeData && !isManualMode && (
                                            <small className="text-danger mt-2 d-block text-center fw-semibold">
                                                * Build a resume draft, select a profile, or toggle Manual Profile to generate.
                                            </small>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* TEXT EDITOR (Only visible if letter text is generated) */}
                            {coverLetterText && (
                                <div className="mt-4 pt-3 border-top border-glass">
                                    <label className="form-label text-white-50 fw-semibold small d-flex justify-content-between">
                                        <span>Edit Generated Text</span>
                                        <span className="text-muted small">(Changes update preview instantly)</span>
                                    </label>
                                    <textarea
                                        className="form-control bg-dark-custom text-white border-glass"
                                        rows="8"
                                        value={coverLetterText}
                                        onChange={(e) => setCoverLetterText(e.target.value)}
                                        style={{ fontSize: "0.9rem", lineHeight: "1.45", borderRadius: "10px" }}
                                    ></textarea>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: PRINT PREVIEW & EXPORTS */}
                    <div className="col-lg-7 d-flex flex-column h-100">
                        <div className="glass-panel-custom p-4 flex-grow-1 d-flex flex-column justify-content-between" style={{ minHeight: "85vh" }}>
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                    <h4 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                                        <Eye size={18} className="text-indigo" />
                                        Styled Print Preview
                                    </h4>
                                    {coverLetterText && (
                                        <div className="d-flex gap-2">
                                            <button
                                                onClick={downloadAsPDF}
                                                className="btn btn-sm btn-glass d-flex align-items-center gap-1.5 px-3 py-2"
                                                style={{ borderRadius: "6px" }}
                                            >
                                                <i className="fas fa-file-pdf text-danger"></i> PDF
                                            </button>
                                            <button
                                                onClick={downloadAsPNG}
                                                className="btn btn-sm btn-glass d-flex align-items-center gap-1.5 px-3 py-2"
                                                style={{ borderRadius: "6px" }}
                                            >
                                                <i className="fas fa-file-image text-info"></i> PNG
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div 
                                    className="preview-outer-wrapper-custom overflow-auto" 
                                    style={{ 
                                        borderRadius: "12px", 
                                        maxHeight: "72vh", 
                                        background: "#1e2230",
                                        border: "1px solid rgba(255, 255, 255, 0.06)",
                                        boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.4)",
                                        padding: "24px 12px"
                                    }}
                                >
                                    {activeResumeData ? (
                                        <div id="cover-letter-printable" className="bg-white text-dark mx-auto" style={{
                                            width: "210mm",
                                            minHeight: "297mm",
                                            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                                            boxSizing: "border-box",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}>
                                            <CoverLetterPreview
                                                data={normalizedData}
                                                selectedTemplate={selectedTemplate}
                                                coverLetterText={coverLetterText}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center text-white-50 py-5 my-5">
                                            <FileSignature size={48} className="text-white-50 mb-3" />
                                            <p className="fs-5 mb-1 text-white animate-fade-in">Preview is not ready</p>
                                            <p className="small px-4 text-center">Build your resume draft first or enable Manual Profile to generate the styled letterhead credentials.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .cover-letter-page-container {
                    background: radial-gradient(circle at top, #111424 0%, #06070c 100%);
                    position: relative;
                    overflow-x: hidden;
                }
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -15%;
                    left: -5%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .bg-glow-spot-2 {
                    position: absolute;
                    bottom: 10%;
                    right: -5%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, rgba(6, 182, 212, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .glass-panel-custom {
                    background: rgba(15, 18, 32, 0.65);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 20px;
                    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
                    z-index: 2;
                }
                .bg-dark-custom {
                    background-color: rgba(11, 13, 23, 0.85) !important;
                }
                .border-glass {
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    transition: all 0.2s ease;
                }
                .border-glass:focus {
                    border-color: rgba(99, 102, 241, 0.5) !important;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.25) !important;
                    background-color: rgba(11, 13, 23, 0.95) !important;
                }
                .btn-glass {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: #cbd5e1;
                    font-weight: 500;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-glass:hover {
                    background: rgba(255, 255, 255, 0.09);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    transform: translateY(-1px);
                }
                .btn-gradient-premium {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none;
                    color: #fff;
                    border-radius: 10px;
                    font-weight: 600;
                    padding: 12px 24px;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-gradient-premium:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
                    transform: translateY(-2px);
                    color: #fff;
                }
                .btn-gradient-premium:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .spinner-icon {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* DOWNLOAD PROGRESS OVERLAY */}
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
                                {downloadType === "png" ? "Rendering Image" : "Compiling Document PDF"}
                            </h4>
                            <p className="text-white-50 mb-0">
                                {downloadType === "png" 
                                    ? "Exporting cover letter layout to high-res PNG image..." 
                                    : "Structuring styles and creating a printable vector PDF..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
