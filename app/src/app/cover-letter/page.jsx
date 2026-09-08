"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../../authState";
import { showToast } from "../../utils/toast";
import CoverLetterPreview from "../../components/CoverLetterPreview";
import { normalizeResumeData } from "../../utils/resumeAdapter";
import { Sparkles, SlidersHorizontal, Loader2, Eye, FileSignature, Briefcase, UploadCloud, CheckCircle, XCircle, Lock, Unlock } from "lucide-react";
import AiWorkflowProgress from "../../components/AiWorkflowProgress";

// ─── Grivo mascot SVG ───────────────────────────────────────────────────────
const GrivoIcon = ({ size = 24, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={style}>
        <defs>
            <linearGradient id="grivo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#grivo-grad)" />
        <rect x="8" y="10" width="4" height="4" rx="1" fill="white" />
        <rect x="24" y="10" width="4" height="4" rx="1" fill="white" />
        <rect x="6" y="18" width="24" height="10" rx="5" fill="white" opacity="0.9" />
        <circle cx="12" cy="23" r="2" fill="#6366f1" />
        <circle cx="18" cy="23" r="2" fill="#8b5cf6" />
        <circle cx="24" cy="23" r="2" fill="#6366f1" />
        <path d="M13 10 L18 6 L23 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
);

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
    const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);

    // Output & UX states
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGeneratingJobDesc, setIsGeneratingJobDesc] = useState(false);
    const [isGeneratingFocus, setIsGeneratingFocus] = useState(false);
    const [coverLetterText, setCoverLetterText] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadType, setDownloadType] = useState(null); // 'png' or 'pdf'
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    // Upload & GRIVO states
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileBase64, setUploadedFileBase64] = useState(null);
    const [isDraggingUpload, setIsDraggingUpload] = useState(false);
    const [showGrivoModal, setShowGrivoModal] = useState(false);
    const [grivoStatus, setGrivoStatus] = useState("idle"); // 'idle' | 'generating' | 'success' | 'error'
    const [grivoMessage, setGrivoMessage] = useState("");
    const uploadFileRef = React.useRef(null);


    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user) {
                const emailVal = user.email || `github-${user.uid}@cvgrid.in`;
                setUserEmail(emailVal);
                setLoadingAuth(false);
                await fetchSavedResumes(emailVal);
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
            setIsPaid(false);
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
                setIsPaid(data.isPaid || false);
                
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
                candidateData: isManualMode ? getActiveResumeData() : null,
                isPaid
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

    const autoSaveCoverLetter = async () => {
        if (!jobTitle || !companyName || !coverLetterText) {
            throw new Error("Missing required cover letter fields.");
        }
        
        let currentLetterId = selectedLetterId;
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
        
        if (currentLetterId !== "new") {
            body.id = currentLetterId;
        }
        
        const response = await fetch("/api/cover-letters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error("Failed to auto-save cover letter before purchase.");
        }
        
        const result = await response.json();
        if (currentLetterId === "new") {
            setSelectedLetterId(result.id);
            currentLetterId = result.id;
        }
        
        await fetchSavedLetters();
        return currentLetterId;
    };

    const handleRazorpayPayment = async () => {
        if (!userEmail) {
            showToast("You must be logged in to purchase premium cover letter templates.", "error");
            return;
        }

        const currentLetterId = selectedLetterId === "new" ? null : selectedLetterId;

        try {
            // 1. Create order on the backend (₹99 cover letter payment)
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_order",
                    coverLetterId: currentLetterId,
                    type: "cover_letter"
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create payment order");
            }

            const { orderId, amount, currency } = await response.json();

            // 2. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TDTM6sBKdckc4Y",
                amount: amount,
                currency: currency,
                name: "CVGrid Premium",
                description: "Unlock Premium Cover Letter Template",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        setIsDownloading(true);
                        // 3. Verify payment on backend
                        const verifyRes = await fetch("/api/payments", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "verify_payment",
                                coverLetterId: currentLetterId,
                                type: "cover_letter",
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setIsPaid(true);
                            showToast("Payment Successful! Premium template unlocked.", "success");
                        } else {
                            throw new Error(verifyData.error || "Payment verification failed");
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        showToast(err.message || "Payment verification failed. Please contact support.", "error");
                    } finally {
                        setIsDownloading(false);
                    }
                },
                prefill: {
                    email: userEmail
                },
                theme: {
                    color: "#6366f1"
                },
                modal: {
                    ondismiss: function () {
                        showToast("Payment cancelled.", "warning");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Razorpay error:", err);
            showToast(err.message || "Could not launch payment gateway.", "error");
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
        if (!jobTitle) {
            showToast("Please enter a Target Job Title first.", "error");
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
        if (!activeResume && !uploadedFileBase64) {
            showToast("Upload a CV or load a resume profile / manual details first.", "error");
            return;
        }
        if (isManualMode && !manualName && !uploadedFileBase64) {
            showToast("Please enter Candidate Name in Manual Mode.", "error");
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
                    jobDescription,
                    ...(uploadedFileBase64
                        ? { resumeData: uploadedFileBase64, resumeMimeType: uploadedFile?.type || "application/pdf" }
                        : { candidateInfo: activeResume }
                    )
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

    const handleUploadResumeFile = (file) => {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ];

        if (file.size > MAX_SIZE) {
            showToast(`File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max limit is 10MB.`, "error");
            return;
        }

        if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
            showToast("Invalid file format. Please upload PDF or DOCX.", "error");
            return;
        }

        setUploadedFile(file);
        
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(",")[1];
            setUploadedFileBase64(base64);
            showToast("Resume uploaded successfully!", "success");
        };
        reader.onerror = () => {
            showToast("Failed to read file.", "error");
        };
        reader.readAsDataURL(file);
    };

    const clearUploadedFile = () => {
        setUploadedFile(null);
        setUploadedFileBase64(null);
        if (uploadFileRef.current) uploadFileRef.current.value = "";
        showToast("Upload cleared.", "info");
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        const activeResume = getActiveResumeData();
        const isUploadSelected = !!uploadedFileBase64;

        if (!activeResume && !isUploadSelected && !isManualMode) {
            showToast("No resume data found. Please build a resume first, toggle Manual Details, or upload a resume file at the top.", "error");
            return;
        }
        if (isManualMode && !manualName && !isUploadSelected) {
            showToast("Please enter Candidate Name in Manual Mode.", "error");
            return;
        }
        if (!jobTitle || !jobDescription) {
            showToast("Please fill in Job Title and Job Description.", "error");
            return;
        }

        setIsGenerating(true);
        if (isUploadSelected) {
            setShowGrivoModal(true);
            setGrivoStatus("generating");
            setGrivoMessage(`Hi! I'm GRIVO. 🤖 I am reading your uploaded resume "${uploadedFile?.name || 'file.pdf'}" and drafting a professional cover letter specifically for the ${jobTitle} role${companyName ? ` at ${companyName}` : ""}. Please hold on for a moment!`);
        }

        try {
            const body = {
                jobTitle,
                companyName,
                jobDescription,
                hiringManager,
                tone,
                customInstructions
            };

            if (isUploadSelected) {
                body.resumeData = uploadedFileBase64;
                body.resumeMimeType = uploadedFile.type;
            } else {
                body.candidateInfo = activeResume;
            }

            const response = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "AI generation failed");
            }

            const data = await response.json();
            
            if (isUploadSelected) {
                setCoverLetterText(data.result);
                if (data.basics) {
                    setSelectedResumeData({ basics: data.basics });
                }
                setGrivoStatus("success");
                setGrivoMessage(`Hurrah! Your cover letter is ready! 🎉 I've successfully extracted your profile details and tailored the cover letter to match your requirements. Feel free to view or download it!`);
                showToast("Cover letter generated by GRIVO!", "success");
            } else {
                setCoverLetterText(data.result);
                showToast("Cover letter drafted successfully!", "success");
                setShowPreviewModal(true);
            }
        } catch (err) {
            console.error(err);
            if (isUploadSelected) {
                setGrivoStatus("error");
                setGrivoMessage(`Oops! I hit a snag while generating your cover letter: ${err.message || "Unknown error"}. Please check your connection and try again!`);
            }
            showToast(err.message || "Failed to generate cover letter.", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // HTML2Canvas & jsPDF exports
    const downloadAsPNG = async () => {
        if (selectedTemplate !== "classic" && !isPaid) {
            showToast("This premium template requires a ₹99 upgrade.", "error");
            handleRazorpayPayment();
            return;
        }
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
            link.download = `Cover_Letter_${(companyName || "Draft").replace(/\s+/g, "_")}.png`;
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
        if (selectedTemplate !== "classic" && !isPaid) {
            showToast("This premium template requires a ₹99 upgrade.", "error");
            handleRazorpayPayment();
            return;
        }
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
            pdf.save(`Cover_Letter_${(companyName || "Draft").replace(/\s+/g, "_")}.pdf`);
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
                        Setting up Cover Letter Engine...
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

    const activeResumeData = getActiveResumeData();
    const normalizedData = activeResumeData ? normalizeResumeData(activeResumeData) : null;
    const canGenerate = !!uploadedFileBase64 || !!activeResumeData || isManualMode;

    return (
        <div className="cl-page text-white min-vh-100 d-flex flex-column">
            <div className="cl-glow-1" aria-hidden="true" />
            <div className="cl-glow-2" aria-hidden="true" />

            <Navbar />
            <AiWorkflowProgress currentStep={5} />

            <div className="container px-3 px-md-4 py-4 flex-grow-1 position-relative" style={{ zIndex: 5 }}>
                <div className="row justify-content-center">

                    <div className="col-xl-8 col-lg-10 col-md-12 d-flex flex-column">
                        <div className="cl-glass-panel p-4 p-md-5 flex-grow-1 d-flex flex-column" style={{ minHeight: "80vh" }}>

                            {/* Header */}
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <div className="cl-icon-badge"><FileSignature size={18} /></div>
                                <h1 className="h3 fw-bold mb-0 text-white">AI Cover Letter Generator</h1>
                            </div>
                            <p className="text-white-50 small mb-4" style={{ paddingLeft: "46px" }}>
                                Tailor a professional cover letter to your target job using Gemini AI.
                            </p>

                            <form onSubmit={handleGenerate} className="d-flex flex-column gap-3">

                                {/* ══ OPTION 1 — Upload Existing CV ══ */}
                                <div className="cl-option-box cl-option-upload">
                                    <div className="cl-option-label">
                                        <UploadCloud size={12} />
                                        Option 1 — Upload Existing Resume
                                    </div>

                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDraggingUpload(true); }}
                                        onDragLeave={() => setIsDraggingUpload(false)}
                                        onDrop={(e) => { e.preventDefault(); setIsDraggingUpload(false); const f = e.dataTransfer.files[0]; if (f) handleUploadResumeFile(f); }}
                                        onClick={() => uploadFileRef.current?.click()}
                                        className="cl-drop-zone"
                                        style={{
                                            borderColor: isDraggingUpload ? "#6366f1" : uploadedFile ? "#22c55e" : "rgba(99,102,241,0.3)",
                                            background: isDraggingUpload ? "rgba(99,102,241,0.08)" : uploadedFile ? "rgba(34,197,94,0.05)" : "rgba(99,102,241,0.03)"
                                        }}
                                    >
                                        <input ref={uploadFileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                                            onChange={(e) => { if (e.target.files[0]) handleUploadResumeFile(e.target.files[0]); }} />

                                        {uploadedFile ? (
                                            <>
                                                <div className="cl-upload-success-icon"><CheckCircle size={24} color="#22c55e" /></div>
                                                <span className="fw-bold small text-truncate" style={{ color: "#4ade80", maxWidth: "240px" }}>{uploadedFile.name}</span>
                                                <span className="text-white-50" style={{ fontSize: "0.72rem" }}>AI will use this file · click or drag to replace</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="cl-upload-icon"><UploadCloud size={26} /></div>
                                                <span className="fw-bold small text-white">Click or drag your resume here</span>
                                                <span className="text-white-50" style={{ fontSize: "0.73rem" }}>PDF or DOCX · AI extracts all your details automatically</span>
                                            </>
                                        )}
                                    </div>

                                    {uploadedFile && (
                                        <button type="button" onClick={clearUploadedFile}
                                            className="btn btn-sm btn-outline-danger mt-2 py-0 px-2 fw-semibold"
                                            style={{ fontSize: "0.74rem", borderRadius: "5px" }}>
                                            ✕ Clear file
                                        </button>
                                    )}
                                </div>

                                {/* ── OR Divider ── */}
                                <div className="cl-or-divider">
                                    <span className="cl-or-line" />
                                    <span className="cl-or-pill">OR</span>
                                    <span className="cl-or-line" />
                                </div>

                                {/* ══ OPTION 2 — Profile / Manual ══ */}
                                <div className={`cl-option-box cl-option-profile${uploadedFileBase64 ? " cl-option-dimmed" : ""}`}>
                                    <div className="cl-option-label">
                                        <SlidersHorizontal size={12} />
                                        Option 2 — Use Resume Profile or Manual Details
                                        {uploadedFileBase64 && <span className="ms-2 cl-override-badge">Overridden by upload</span>}
                                    </div>

                                    {/* Saved Cover Letters (logged-in) */}
                                    {userEmail && (
                                        <div className="cl-nested-card mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <label className="form-label text-white-50 fw-semibold mb-0" style={{ fontSize: "0.78rem" }}>
                                                    <i className="fas fa-bookmark me-1" style={{ color: "#818cf8" }} />
                                                    Saved Cover Letters
                                                </label>
                                                {selectedLetterId !== "new" && (
                                                    <button type="button" onClick={() => handleDeleteLetter(selectedLetterId)}
                                                        className="btn btn-sm btn-outline-danger py-0 px-2"
                                                        style={{ fontSize: "0.73rem", borderRadius: "4px" }}>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <select className="form-select cl-input mb-2" value={selectedLetterId}
                                                onChange={(e) => handleSelectLetter(e.target.value)}
                                                disabled={!!uploadedFileBase64}>
                                                <option value="new">+ Create New Cover Letter</option>
                                                {savedLettersList.map(l => (
                                                    <option key={l.id} value={l.id}>{l.letterName} ({l.companyName})</option>
                                                ))}
                                            </select>
                                            <div className="d-flex gap-2">
                                                <input type="text" className="form-control cl-input flex-grow-1"
                                                    placeholder="Letter name..."
                                                    value={letterName} onChange={(e) => setLetterName(e.target.value)}
                                                    style={{ height: "34px", fontSize: "0.84rem" }} />
                                                <button type="button" onClick={handleSave} disabled={isSaving || !coverLetterText}
                                                    className="cl-save-btn d-flex align-items-center gap-1">
                                                    {isSaving
                                                        ? <Loader2 size={13} className="cl-spin" />
                                                        : <><i className="fas fa-cloud-upload-alt" style={{ fontSize: "0.75rem" }} /> Save</>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Resume Profile selector */}
                                    <div className="mb-3">
                                        <label className="cl-field-label">
                                            <i className="fas fa-id-card me-1" style={{ color: "#818cf8" }} />
                                            Choose Resume Profile
                                        </label>
                                        <select className="form-select cl-input" value={selectedResumeId}
                                            onChange={(e) => setSelectedResumeId(e.target.value)}
                                            disabled={isManualMode || !!uploadedFileBase64}>
                                            <option value="session">Active Session Resume (Latest Draft)</option>
                                            {resumesList.map(r => (
                                                <option key={r.id} value={r.id}>{r.resumeName} (Cloud Save)</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Manual mode toggle */}
                                    <div className="cl-manual-toggle mb-2">
                                        <div>
                                            <span className="small fw-semibold text-white">Manual Profile</span>
                                            <br /><span className="text-white-50" style={{ fontSize: "0.73rem" }}>Enter info without a resume draft</span>
                                        </div>
                                        <div className="form-check form-switch mb-0">
                                            <input className="form-check-input" type="checkbox" role="switch"
                                                checked={isManualMode} disabled={!!uploadedFileBase64}
                                                onChange={(e) => setIsManualMode(e.target.checked)}
                                                id="manualModeSwitch" />
                                        </div>
                                    </div>

                                    {/* Manual input fields */}
                                    {isManualMode && !uploadedFileBase64 && (
                                        <div className="cl-manual-fields row g-2 mt-1">
                                            <div className="col-md-6">
                                                <label className="cl-field-label">Full Name <span className="text-danger">*</span></label>
                                                <input type="text" className="form-control cl-input" placeholder="John Doe"
                                                    value={manualName} onChange={(e) => setManualName(e.target.value)}
                                                    required style={{ height: "36px", fontSize: "0.84rem" }} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="cl-field-label">Professional Title</label>
                                                <input type="text" className="form-control cl-input" placeholder="Frontend Engineer"
                                                    value={manualRole} onChange={(e) => setManualRole(e.target.value)}
                                                    style={{ height: "36px", fontSize: "0.84rem" }} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="cl-field-label">Email</label>
                                                <input type="email" className="form-control cl-input" placeholder="john@example.com"
                                                    value={manualEmail} onChange={(e) => setManualEmail(e.target.value)}
                                                    style={{ height: "36px", fontSize: "0.84rem" }} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="cl-field-label">Phone</label>
                                                <input type="text" className="form-control cl-input" placeholder="+1 234 567 89"
                                                    value={manualPhone} onChange={(e) => setManualPhone(e.target.value)}
                                                    style={{ height: "36px", fontSize: "0.84rem" }} />
                                            </div>
                                            <div className="col-12">
                                                <label className="cl-field-label">LinkedIn / Portfolio</label>
                                                <input type="text" className="form-control cl-input" placeholder="linkedin.com/in/johndoe"
                                                    value={manualLinkedIn} onChange={(e) => setManualLinkedIn(e.target.value)}
                                                    style={{ height: "36px", fontSize: "0.84rem" }} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ══ SHARED JOB TARGET DETAILS ══ */}
                                <div className="cl-job-section">
                                    <div className="cl-section-label">
                                        <Briefcase size={12} />
                                        Job Target Details
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="cl-field-label">Target Job Title <span className="text-danger">*</span></label>
                                            <input type="text" className="form-control cl-input"
                                                placeholder="e.g. Software Engineer"
                                                value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="cl-field-label">Company Name <span className="cl-optional">(Optional)</span></label>
                                            <input type="text" className="form-control cl-input"
                                                placeholder="e.g. Google"
                                                value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="cl-field-label">Hiring Manager <span className="cl-optional">(Optional)</span></label>
                                            <input type="text" className="form-control cl-input"
                                                placeholder="e.g. Jane Doe"
                                                value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="cl-field-label">Writing Tone</label>
                                            <select className="form-select cl-input" value={tone} onChange={(e) => setTone(e.target.value)}>
                                                <option>Professional</option>
                                                <option>Enthusiastic</option>
                                                <option>Creative</option>
                                                <option>Confident</option>
                                                <option>Conversational</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <div className="position-relative w-100">
                                                <label className="cl-field-label">Letterhead Design Theme</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                                                    className="form-select cl-input d-flex align-items-center justify-content-between text-start w-100 px-3"
                                                    style={{ height: "42px", cursor: "pointer", background: "rgba(11,13,23,0.85)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        {selectedTemplate === "classic" ? (
                                                            <Unlock size={14} className="text-success" />
                                                        ) : (
                                                            <Lock size={14} style={{ color: "#f97316" }} />
                                                        )}
                                                        <span className="text-white">
                                                            {selectedTemplate === "classic" && "Classic (Clean Accent)"}
                                                            {selectedTemplate === "modern" && "Modern (Sidebar layout)"}
                                                            {selectedTemplate === "executive" && "Executive (Deep Navy Banner)"}
                                                            {selectedTemplate === "developer" && "Developer (Syntax terminal)"}
                                                            {selectedTemplate === "elegant" && "Elegant (Georgia Double-Border)"}
                                                            {selectedTemplate === "accent" && "Accent Line (Gradient top line)"}
                                                            {selectedTemplate === "navy_elegance" && "Navy Elegance (Corporate Banner)"}
                                                            {selectedTemplate === "emerald" && "Emerald Professional (Teal accent)"}
                                                        </span>
                                                    </div>
                                                </button>

                                                {isTemplateDropdownOpen && (
                                                    <>
                                                        <div 
                                                            onClick={() => setIsTemplateDropdownOpen(false)} 
                                                            style={{ position: "fixed", inset: 0, zIndex: 998 }}
                                                        />
                                                        <div
                                                            className="position-absolute w-100 mt-1"
                                                            style={{
                                                                background: "#111425",
                                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                                                borderRadius: "10px",
                                                                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                                                                zIndex: 999,
                                                                maxHeight: "300px",
                                                                overflowY: "auto",
                                                                padding: "6px"
                                                            }}
                                                        >
                                                            {[
                                                                { value: "classic", label: "Classic (Clean Accent)", isPremium: false },
                                                                { value: "modern", label: "Modern (Sidebar layout)", isPremium: true },
                                                                { value: "executive", label: "Executive (Deep Navy Banner)", isPremium: true },
                                                                { value: "developer", label: "Developer (Syntax terminal)", isPremium: true },
                                                                { value: "elegant", label: "Elegant (Georgia Double-Border)", isPremium: true },
                                                                { value: "accent", label: "Accent Line (Gradient top line)", isPremium: true },
                                                                { value: "navy_elegance", label: "Navy Elegance (Corporate Banner)", isPremium: true },
                                                                { value: "emerald", label: "Emerald Professional (Teal accent)", isPremium: true }
                                                            ].map((opt) => (
                                                                <button
                                                                    key={opt.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedTemplate(opt.value);
                                                                        setIsTemplateDropdownOpen(false);
                                                                    }}
                                                                    className="w-100 text-start px-3 py-2 d-flex align-items-center gap-2 transition-all"
                                                                    style={{
                                                                        background: opt.value === selectedTemplate ? "rgba(99, 102, 241, 0.15)" : "transparent",
                                                                        border: "none",
                                                                        borderRadius: "6px",
                                                                        color: opt.value === selectedTemplate ? "#818cf8" : "#fff",
                                                                        fontSize: "0.85rem",
                                                                        margin: "2px 0"
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        if (opt.value !== selectedTemplate) {
                                                                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (opt.value !== selectedTemplate) {
                                                                            e.currentTarget.style.background = "transparent";
                                                                        }
                                                                    }}
                                                                >
                                                                    {opt.isPremium ? (
                                                                        <Lock size={14} style={{ color: "#f97316" }} />
                                                                    ) : (
                                                                        <Unlock size={14} className="text-success" />
                                                                    )}
                                                                    <span>{opt.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label className="cl-field-label mb-0">Additional AI Instructions <span className="cl-optional">(Optional)</span></label>
                                                <button type="button" onClick={handleAIFocusInstructions} disabled={isGeneratingFocus} className="cl-ai-btn">
                                                    {isGeneratingFocus ? <Loader2 size={11} className="cl-spin" /> : <Sparkles size={11} />}
                                                    Suggest Focus
                                                </button>
                                            </div>
                                            <textarea className="form-control cl-input" rows="2"
                                                placeholder="e.g. Focus on React experience, keep under 250 words, highlight leadership..."
                                                value={customInstructions} onChange={(e) => setCustomInstructions(e.target.value)}
                                                style={{ fontSize: "0.85rem" }} />
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label className="cl-field-label mb-0">Job Description / Requirements <span className="text-danger">*</span></label>
                                                <button type="button" onClick={handleAIJobDescription} disabled={isGeneratingJobDesc} className="cl-ai-btn">
                                                    {isGeneratingJobDesc ? <Loader2 size={11} className="cl-spin" /> : <Sparkles size={11} />}
                                                    Generate Sample
                                                </button>
                                            </div>
                                            <textarea className="form-control cl-input" rows="5"
                                                placeholder="Paste the job description here..."
                                                value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                                                required style={{ fontSize: "0.85rem" }} />
                                        </div>

                                        {/* Generate Button & View Preview Button */}
                                        <div className="col-12 pt-2 d-flex flex-column flex-sm-row gap-3">
                                            <button type="submit" disabled={isGenerating || !canGenerate}
                                                className="cl-generate-btn flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                                style={{ height: "48px" }}>
                                                {isGenerating
                                                    ? <><Loader2 size={18} className="cl-spin" /> AI is Drafting Letter...</>
                                                    : <><Sparkles size={16} /> Generate Styled Cover Letter</>
                                                }
                                            </button>

                                            {coverLetterText && (
                                                <button type="button" onClick={() => setShowPreviewModal(true)}
                                                    className="cl-save-btn d-flex align-items-center justify-content-center gap-2 px-4"
                                                    style={{ height: "48px", borderRadius: "12px", border: "1px solid rgba(99,102,241,0.5)", background: "rgba(99,102,241,0.12)", color: "#fff", fontWeight: "600" }}>
                                                    <Eye size={18} /> View Preview &amp; Download
                                                </button>
                                            )}
                                        </div>

                                        {!canGenerate && (
                                            <div className="col-12">
                                                <small className="text-danger mt-1 d-block text-center fw-semibold" style={{ fontSize: "0.77rem" }}>
                                                    * Upload a resume OR select / enter profile details above to generate.
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── PREVIEW POPUP MODAL ────────────────────────────────────── */}
            {showPreviewModal && (
                <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,7,12,0.85)", backdropFilter: "blur(18px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                    <div style={{ width: "95vw", height: "90vh", background: "linear-gradient(145deg, #111425, #080912)", borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 25px 60px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,18,32,0.5)" }}>
                            <div className="d-flex align-items-center gap-2">
                                <div className="cl-icon-badge" style={{ width: "32px", height: "32px" }}><Eye size={15} /></div>
                                <h4 className="fw-bold mb-0 text-white" style={{ fontSize: "1.15rem" }}>Styled Cover Letter Preview</h4>
                            </div>
                            
                            <div className="d-flex align-items-center gap-3">
                                {/* Razorpay Unlock button */}
                                {selectedTemplate !== "classic" && !isPaid && (
                                    <button onClick={handleRazorpayPayment} className="btn py-2 px-3 fw-bold d-flex align-items-center gap-2" 
                                        style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", color: "#fff", borderRadius: "10px", border: "none", boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)", fontSize: "0.85rem" }}>
                                        <i className="fas fa-crown text-warning" /> Unlock Premium Template (₹99)
                                    </button>
                                )}

                                {/* Download buttons */}
                                <div className="d-flex gap-2">
                                    <button onClick={downloadAsPDF} className="cl-dl-btn cl-dl-btn-pdf py-2 px-3 d-flex align-items-center gap-1.5">
                                        {selectedTemplate !== "classic" && !isPaid && <i className="fas fa-lock small text-white-50" />}
                                        <i className="fas fa-file-pdf" /> Download PDF
                                    </button>
                                    <button onClick={downloadAsPNG} className="cl-dl-btn cl-dl-btn-png py-2 px-3 d-flex align-items-center gap-1.5">
                                        {selectedTemplate !== "classic" && !isPaid && <i className="fas fa-lock small text-white-50" />}
                                        <i className="fas fa-file-image" /> Download PNG
                                    </button>
                                </div>
                                
                                {/* Close Button */}
                                <button onClick={() => setShowPreviewModal(false)} className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", borderRadius: "50%", padding: 0, color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                                    <i className="fas fa-times" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="flex-grow-1 p-4 overflow-hidden" style={{ minHeight: 0 }}>
                            <div className="row h-100 g-4">
                                
                                {/* Left Column: Editor */}
                                <div className="col-lg-5 d-flex flex-column h-100" style={{ minHeight: 0 }}>
                                    <div className="d-flex flex-column h-100 p-3" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px" }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-white-50" style={{ fontSize: "0.85rem" }}>Edit Generated Text</span>
                                            <span className="text-white-50" style={{ fontSize: "0.72rem" }}>Changes update preview instantly</span>
                                        </div>
                                        <textarea 
                                            className="form-control cl-input flex-grow-1" 
                                            value={coverLetterText} 
                                            onChange={(e) => setCoverLetterText(e.target.value)} 
                                            style={{ fontSize: "0.88rem", lineHeight: "1.6", resize: "none", background: "rgba(11,13,23,0.95)" }} 
                                        />
                                    </div>
                                </div>
                                
                                {/* Right Column: Preview wrapper */}
                                <div className="col-lg-7 d-flex flex-column h-100" style={{ minHeight: 0 }}>
                                    <div className="cl-preview-wrapper flex-grow-1 overflow-auto p-3" style={{ background: "#1e2230" }}>
                                        {normalizedData ? (
                                            <div id="cover-letter-printable" className="bg-white text-dark mx-auto" style={{
                                                width: "210mm", minHeight: "297mm",
                                                boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                                                boxSizing: "border-box", position: "relative", overflow: "hidden"
                                            }}>
                                                <CoverLetterPreview data={normalizedData} selectedTemplate={selectedTemplate} coverLetterText={coverLetterText} />
                                            </div>
                                        ) : (
                                            <div className="text-center py-5 text-white-50">Preview is loading...</div>
                                        )}
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* ── STYLES ──────────────────────────────────────────────────── */}
            <style>{`
                .cl-page {
                    background: radial-gradient(circle at top, #111424 0%, #06070c 100%);
                    position: relative;
                    overflow-x: hidden;
                }
                .cl-glow-1 {
                    position: absolute; top: -10%; left: -5%;
                    width: 700px; height: 700px;
                    background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
                    z-index: 1; pointer-events: none;
                }
                .cl-glow-2 {
                    position: absolute; bottom: 5%; right: -5%;
                    width: 700px; height: 700px;
                    background: radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%);
                    z-index: 1; pointer-events: none;
                }
                .cl-glass-panel {
                    background: rgba(15,18,32,0.65);
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 24px;
                    box-shadow: 0 15px 45px rgba(0,0,0,0.5);
                    z-index: 2;
                }
                /* Icon badge */
                .cl-icon-badge {
                    width: 38px; height: 38px; border-radius: 10px;
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.25);
                    display: flex; align-items: center; justify-content: center;
                    color: #818cf8; flex-shrink: 0;
                }
                /* Inputs */
                .cl-input {
                    background-color: rgba(11,13,23,0.85) !important;
                    border: 1px solid rgba(255,255,255,0.08) !important;
                    color: #fff !important;
                    border-radius: 8px !important;
                    transition: all 0.2s ease !important;
                }
                .cl-input:focus {
                    border-color: rgba(99,102,241,0.5) !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
                    background-color: rgba(11,13,23,0.95) !important;
                }
                .cl-input option { background: #1a1d2e; }
                .cl-field-label {
                    font-size: 0.78rem; font-weight: 600;
                    color: rgba(255,255,255,0.5);
                    margin-bottom: 5px; display: block;
                }
                .cl-optional { font-weight: 400; color: rgba(255,255,255,0.3); }
                /* Option boxes */
                .cl-option-box {
                    background: rgba(10,14,21,0.5);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px; padding: 16px;
                    transition: border-color 0.25s;
                }
                .cl-option-upload { border-color: rgba(99,102,241,0.22); }
                .cl-option-upload:hover { border-color: rgba(99,102,241,0.42); }
                .cl-option-profile { border-color: rgba(99,102,241,0.18); }
                .cl-option-dimmed { opacity: 0.42; pointer-events: none; user-select: none; }
                .cl-option-label {
                    font-size: 0.71rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.07em;
                    color: rgba(255,255,255,0.35);
                    margin-bottom: 12px;
                    display: flex; align-items: center; gap: 6px;
                }
                .cl-override-badge {
                    background: rgba(239,68,68,0.12); color: #f87171;
                    border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 4px; padding: 1px 7px;
                    font-size: 0.67rem; text-transform: none;
                    letter-spacing: 0; font-weight: 600;
                }
                /* Drop zone */
                .cl-drop-zone {
                    border: 1.5px dashed; border-radius: 12px;
                    padding: 20px 16px; text-align: center; cursor: pointer;
                    display: flex; flex-direction: column; align-items: center; gap: 7px;
                    transition: all 0.2s ease;
                }
                .cl-drop-zone:hover { filter: brightness(1.08); }
                .cl-upload-icon {
                    width: 52px; height: 52px; border-radius: 50%;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.25);
                    display: flex; align-items: center; justify-content: center;
                    color: #818cf8; margin-bottom: 4px; transition: all 0.2s;
                }
                .cl-drop-zone:hover .cl-upload-icon {
                    background: rgba(99,102,241,0.18); transform: translateY(-2px);
                }
                .cl-upload-success-icon {
                    width: 48px; height: 48px; border-radius: 50%;
                    background: rgba(34,197,94,0.1);
                    border: 1px solid rgba(34,197,94,0.25);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 4px;
                }
                /* OR divider */
                .cl-or-divider { display: flex; align-items: center; gap: 10px; margin: 2px 0; }
                .cl-or-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
                .cl-or-pill {
                    font-size: 0.71rem; font-weight: 800; letter-spacing: 0.14em;
                    color: rgba(255,255,255,0.3);
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px; padding: 3px 14px; white-space: nowrap;
                }
                /* Nested card */
                .cl-nested-card {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px; padding: 12px;
                }
                /* Manual toggle */
                .cl-manual-toggle {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 10px 14px; border-radius: 10px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.06);
                }
                /* Manual fields */
                .cl-manual-fields {
                    padding: 14px; border-radius: 10px;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(99,102,241,0.18);
                }
                /* Job section */
                .cl-job-section {
                    background: rgba(10,14,21,0.4);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px; padding: 18px;
                }
                .cl-section-label {
                    font-size: 0.71rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.07em;
                    color: rgba(255,255,255,0.35);
                    margin-bottom: 14px;
                    display: flex; align-items: center; gap: 6px;
                }
                /* Save button */
                .cl-save-btn {
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.35);
                    color: #c7d2fe; border-radius: 6px;
                    font-size: 0.82rem; font-weight: 600;
                    padding: 0 14px; height: 34px;
                    display: flex; align-items: center; gap: 5px;
                    transition: all 0.2s; white-space: nowrap; cursor: pointer;
                }
                .cl-save-btn:hover:not(:disabled) {
                    background: rgba(99,102,241,0.28);
                    border-color: rgba(99,102,241,0.6); color: #fff;
                }
                .cl-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                /* AI helper buttons */
                .cl-ai-btn {
                    display: flex; align-items: center; gap: 4px;
                    font-size: 0.72rem; font-weight: 600;
                    background: rgba(56,189,248,0.06);
                    border: 1px solid rgba(56,189,248,0.28);
                    color: #38bdf8; border-radius: 6px;
                    padding: 2px 9px; height: 22px;
                    transition: all 0.2s; cursor: pointer;
                }
                .cl-ai-btn:hover:not(:disabled) {
                    background: rgba(56,189,248,0.14);
                    border-color: rgba(56,189,248,0.5);
                }
                .cl-ai-btn:disabled { opacity: 0.45; cursor: not-allowed; }
                /* Generate button */
                .cl-generate-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none; color: #fff; border-radius: 12px;
                    font-weight: 700; padding: 13px 24px; font-size: 0.95rem;
                    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
                    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                    letter-spacing: 0.01em;
                }
                .cl-generate-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                    box-shadow: 0 6px 22px rgba(99,102,241,0.45);
                    transform: translateY(-2px); color: #fff;
                }
                .cl-generate-btn:disabled { opacity: 0.55; cursor: not-allowed; }
                /* Download buttons */
                .cl-dl-btn {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #cbd5e1; font-size: 0.82rem; font-weight: 600;
                    border-radius: 8px; padding: 6px 14px;
                    display: flex; align-items: center; gap: 6px;
                    transition: all 0.2s; cursor: pointer;
                }
                .cl-dl-btn:hover {
                    background: rgba(255,255,255,0.09);
                    border-color: rgba(255,255,255,0.2);
                    color: #fff; transform: translateY(-1px);
                }
                .cl-dl-btn-pdf:hover { border-color: rgba(239,68,68,0.4); color: #f87171; }
                .cl-dl-btn-png:hover { border-color: rgba(6,182,212,0.4); color: #22d3ee; }
                /* Preview */
                .cl-preview-wrapper {
                    border-radius: 14px; background: #1e2230;
                    border: 1px solid rgba(255,255,255,0.06);
                    box-shadow: inset 0 4px 20px rgba(0,0,0,0.4);
                    padding: 20px 12px; max-height: 76vh;
                }
                .cl-preview-placeholder-icon {
                    width: 72px; height: 72px; border-radius: 50%;
                    background: rgba(99,102,241,0.08);
                    border: 1px solid rgba(99,102,241,0.18);
                    display: flex; align-items: center; justify-content: center;
                }
                .cl-placeholder-steps {
                    display: flex; flex-direction: column; gap: 10px;
                    width: 100%; max-width: 340px;
                }
                .cl-step {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 10px; font-size: 0.83rem;
                    color: rgba(255,255,255,0.6); text-align: left;
                }
                .cl-step-num {
                    width: 22px; height: 22px; border-radius: 50%;
                    background: rgba(99,102,241,0.2);
                    border: 1px solid rgba(99,102,241,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.7rem; font-weight: 700; color: #818cf8; flex-shrink: 0;
                }
                /* Animations */
                .cl-spin { animation: cl-spin-anim 1s linear infinite; }
                @keyframes cl-spin-anim { to { transform: rotate(360deg); } }
                @keyframes cvgrid-spin { to { transform: rotate(360deg); } }
                @keyframes cvgrid-pulse {
                    0%,100% { transform: scale(1); opacity: 0.2; }
                    50% { transform: scale(1.15); opacity: 0.45; }
                }
                @keyframes cl-progress-slide {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            `}</style>

            {/* Download overlay */}
            {isDownloading && (
                <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(10,14,21,0.88)", backdropFilter: "blur(14px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ maxWidth: "400px", width: "90%", background: "linear-gradient(145deg,#1c2027,#11141a)", borderRadius: "22px", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 15px 35px rgba(0,0,0,0.7)", padding: "40px", textAlign: "center", color: "#fff" }}>
                        <div className="cl-preview-placeholder-icon mx-auto mb-4" style={{ width: "64px", height: "64px" }}>
                            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "1.8rem", color: "#818cf8" }} />
                        </div>
                        <h4 className="fw-bold mb-2">{downloadType === "png" ? "Rendering Image..." : "Compiling PDF..."}</h4>
                        <p className="text-white-50 mb-0 small">{downloadType === "png" ? "Exporting cover letter to high-res PNG..." : "Generating a print-ready vector PDF..."}</p>
                    </div>
                </div>
            )}

            {/* GRIVO modal */}
            {showGrivoModal && (
                <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,7,12,0.82)", backdropFilter: "blur(14px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ maxWidth: "480px", width: "90%", background: "linear-gradient(145deg,#111322,#080911)", borderRadius: "24px", border: "1px solid rgba(99,102,241,0.22)", boxShadow: "0 25px 60px rgba(0,0,0,0.85), 0 0 40px rgba(99,102,241,0.08) inset", padding: "36px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: "-20%", left: "-20%", width: "180px", height: "180px", background: "radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)", filter: "blur(25px)", pointerEvents: "none" }} />
                        <div style={{ position: "absolute", bottom: "-20%", right: "-20%", width: "180px", height: "180px", background: "radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)", filter: "blur(25px)", pointerEvents: "none" }} />

                        <div className="d-flex flex-column align-items-center text-center">
                            {/* GRIVO Icon with orbit ring */}
                            <div className="mb-4 position-relative" style={{ width: "96px", height: "96px" }}>
                                <div style={{ position: "absolute", inset: "-10px", borderRadius: "24px", border: "2px dashed rgba(99,102,241,0.35)", animation: grivoStatus === "generating" ? "cvgrid-spin 10s linear infinite" : "none" }} />
                                <div style={{ position: "absolute", inset: 0, borderRadius: "18px", background: "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))", filter: "blur(10px)", animation: "cvgrid-pulse 1.5s ease-in-out infinite" }} />
                                <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(12,15,32,0.85)", borderRadius: "18px", border: "1px solid rgba(99,102,241,0.28)" }}>
                                    <GrivoIcon size={52} />
                                </div>
                            </div>

                            {/* Speech bubble */}
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", width: "100%", marginBottom: "22px" }}>
                                <h5 className="fw-bold mb-2" style={{ color: "#818cf8", letterSpacing: "0.04em" }}>GRIVO AI</h5>
                                <p className="mb-0 text-white-50 small" style={{ lineHeight: "1.65" }}>{grivoMessage}</p>
                            </div>

                            {/* Status */}
                            {grivoStatus === "generating" ? (
                                <div className="w-100">
                                    <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: "10px" }}>
                                        <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1)", backgroundSize: "200% 100%", animation: "cl-progress-slide 1.5s linear infinite", borderRadius: "3px" }} />
                                    </div>
                                    <span className="text-white-50" style={{ fontSize: "0.75rem" }}>Reading resume · Tailoring content · Polishing tone</span>
                                </div>
                            ) : grivoStatus === "success" ? (
                                <div className="w-100">
                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3" style={{ color: "#4ade80" }}>
                                        <CheckCircle size={20} color="#4ade80" />
                                        <span className="fw-bold">Cover Letter Ready!</span>
                                    </div>
                                    <button onClick={() => { setShowGrivoModal(false); setShowPreviewModal(true); }} className="cl-generate-btn w-100">
                                        View My Cover Letter ✨
                                    </button>
                                </div>
                            ) : (
                                <div className="w-100">
                                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3" style={{ color: "#f87171" }}>
                                        <XCircle size={20} color="#f87171" />
                                        <span className="fw-bold">Something went wrong</span>
                                    </div>
                                    <button onClick={() => setShowGrivoModal(false)} className="btn btn-secondary w-100 py-2 fw-bold" style={{ borderRadius: "10px" }}>
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
