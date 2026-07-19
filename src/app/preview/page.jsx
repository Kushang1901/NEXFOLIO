"use client";

import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import Script from "next/script";
import Navbar from "../../components/Navbar";
import { FileQuestion, ChevronRight, Home, LayoutGrid, Check, Search, Sparkles, X, SlidersHorizontal, Loader2, Crown, Unlock, Star } from "lucide-react";
import { templateList } from "../../templates/templatesData";

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

import { normalizeResumeData } from "../../utils/resumeAdapter";
import { useRouter } from "next/navigation";
import { showToast } from "../../utils/toast";
import { subscribeToAuthChanges } from "../../authState";
import ReviewModal from "../../components/ReviewModal";

export default function Preview() {
    const router = useRouter();
    const [resumeData, setResumeData] = useState(null);
    const [aiOutput, setAiOutput] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadType, setDownloadType] = useState(null); // 'png' or 'pdf'
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    const [scale, setScale] = useState(1);
    const [parentHeight, setParentHeight] = useState("auto");

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

    // Template Selector States
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isChangingTemplate, setIsChangingTemplate] = useState(false);
    const [templateSearchQuery, setTemplateSearchQuery] = useState("");
    const [templateSelectedCategory, setTemplateSelectedCategory] = useState("all");
    const [templateLoadingText, setTemplateLoadingText] = useState("Applying template...");

    // Review Modal States
    const [showReviewModal, setShowReviewModal] = useState(false);

    const triggerReviewPrompt = () => {
        const alreadyReviewed = localStorage.getItem("cvgrid_has_reviewed");
        if (!alreadyReviewed) {
            setShowReviewModal(true);
        }
    };

    const saveTemplateChange = async (newTemplateId) => {
        setIsChangingTemplate(true);
        setShowTemplateModal(false);

        const selectedTplName = templateList.find(t => t.id === newTemplateId)?.name || "New Layout";
        setTemplateLoadingText(`Applying ${selectedTplName} template...`);

        const timers = [
            setTimeout(() => setTemplateLoadingText("Reformatting section components..."), 350),
            setTimeout(() => setTemplateLoadingText("Polishing typography grid..."), 700),
            setTimeout(() => setTemplateLoadingText("Finalizing preview render..."), 1000)
        ];

        await new Promise((resolve) => setTimeout(resolve, 1300));
        timers.forEach(t => clearTimeout(t));

        setSelectedTemplate(newTemplateId);
        sessionStorage.setItem("selectedTemplate", newTemplateId);

        if (userEmail && resumeId && resumeData) {
            try {
                const response = await fetch("/api/resumes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: userEmail,
                        id: resumeId,
                        resumeName: resumeData.fullName ? `${resumeData.fullName}'s Resume` : "My Resume",
                        resumeData: resumeData,
                        selectedTemplate: newTemplateId,
                        isPublic: isPublic,
                        shareableLink: shareableLink
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to save template selection.");
                }
                showToast("Template updated successfully!", "success");
            } catch (err) {
                console.error("Error saving template change:", err);
                showToast("Template changed locally, but failed to sync online.", "warning");
            }
        } else {
            showToast("Template changed successfully!", "success");
        }
        setIsChangingTemplate(false);
    };

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
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        const loadResume = async (email, resumeId) => {
            try {
                const res = await fetch(`/api/resumes?email=${encodeURIComponent(email)}&id=${resumeId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.resumeData) {
                        setResumeData(data.resumeData);
                        sessionStorage.setItem("resumeData", JSON.stringify(data.resumeData));
                    }
                    if (data.selectedTemplate) {
                        setSelectedTemplate(data.selectedTemplate);
                        sessionStorage.setItem("selectedTemplate", data.selectedTemplate);
                    }
                    setResumeId(data.id);
                    sessionStorage.setItem("resumeId", data.id);
                    setIsPaid(data.isPaid || false);
                }
            } catch (err) {
                console.error("Error loading resume in preview:", err);
            }
        };

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
                const targetId = id || savedId;
                if (targetId) {
                    await fetchSharingStatus(targetId, loggedUser.email);
                    await loadResume(loggedUser.email, targetId);
                }
            }
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    // Dynamic Scaling Effect for Mobile Preview
    useEffect(() => {
        const previewEl = document.getElementById("resume-preview");
        const containerEl = document.querySelector(".preview-viewport-container");
        
        if (!previewEl || !containerEl) return;

        const updateScale = () => {
            const containerWidth = containerEl.clientWidth;
            const targetWidth = 794; // 210mm in pixels (approx)
            
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
    }, [selectedTemplate, activeLanguage, resumeData]);


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

    const handleRazorpayPayment = async () => {
        if (!resumeId || !userEmail) {
            showToast("You must be logged in to purchase premium features.", "error");
            return;
        }

        try {
            // 1. Create order on the backend
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_order",
                    resumeId: resumeId
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to create order");
            }

            const { orderId, amount, currency } = await response.json();

            // 2. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TDTM6sBKdckc4Y",
                amount: amount,
                currency: currency,
                name: "CVGrid Premium",
                description: "Unlock Clean Resume (Watermark-free, PNG, DOCX)",
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
                                resumeId: resumeId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setIsPaid(true);
                            showToast("Payment Successful! Premium unlocked.", "success");
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
            setTimeout(() => {
                triggerReviewPrompt();
            }, 1200);
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
        
        // If not paid, temporarily show the watermark for PDF generation
        if (!isPaid) {
            setShowWatermark(true);
            // Wait for React to re-render the DOM with the watermark before capturing
            await new Promise((resolve) => setTimeout(resolve, 150));
        }

        try {
            const resume = document.getElementById("resume-preview");
            if (!resume) return;

            const canvas = await html2canvas(resume, {
                scale: 2,
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = pdf.internal.pageSize.getWidth(); // 210
            const pageHeight = pdf.internal.pageSize.getHeight(); // 297
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages if there is remaining height
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // slide image up
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${resumeData?.fullName ? resumeData.fullName.replace(/\s+/g, "_") : "Resume"}.pdf`);
            setShowDownloadModal(false);
            showToast("Resume downloaded as PDF successfully!", "success");
            setTimeout(() => {
                triggerReviewPrompt();
            }, 1200);
        } catch (err) {
            console.error(err);
            showToast("Failed to download as PDF. Please try again.", "error");
        } finally {
            setIsDownloading(false);
            setDownloadType(null);
            setShowWatermark(false); // Hide the watermark again
        }
    };

    const downloadAsDOCX = async () => {
        setIsDownloading(true);
        setDownloadType("docx");
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            const resumeElement = document.getElementById("resume-preview");
            if (!resumeElement) return;

            let htmlContent = resumeElement.innerHTML;
            
            // Convert relative image sources to absolute URLs for Word compatibility
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlContent;
            const images = tempDiv.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
                const src = images[i].getAttribute("src");
                if (src && src.startsWith("/")) {
                    images[i].setAttribute("src", window.location.origin + src);
                }
            }
            htmlContent = tempDiv.innerHTML;

            // Extract all styles active on the page
            let styles = "";
            const styleSheets = document.styleSheets;
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                    if (rules) {
                        for (let j = 0; j < rules.length; j++) {
                            styles += rules[j].cssText;
                        }
                    }
                } catch (e) {
                    // Ignore cross-origin stylesheet access errors
                }
            }

            // Word-specific overrides
            const docxStyles = `
                ${styles}
                @page Section1 {
                    size: 210mm 297mm;
                    margin: 0mm;
                }
                div.Section1 {
                    page: Section1;
                    width: 210mm;
                    min-height: 297mm;
                    background-color: #ffffff;
                    color: #000000;
                }
                body {
                    background-color: #ffffff;
                }
                .no-print { display: none !important; }
            `;

            // Wrap in Microsoft Word Office HTML namespaces
            const docHtml = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                      xmlns:w='urn:schemas-microsoft-com:office:word' 
                      xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset="utf-8">
                    <title>${resumeData?.fullName || "Resume"}</title>
                    <!--[if gte mso 9]>
                    <xml>
                        <w:WordDocument>
                            <w:View>Print</w:View>
                            <w:Zoom>100</w:Zoom>
                            <w:DoNotOptimizeForBrowser/>
                        </w:WordDocument>
                    </xml>
                    <![endif]-->
                    <style>
                        ${docxStyles}
                    </style>
                </head>
                <body>
                    <div class="Section1">
                        ${htmlContent}
                    </div>
                </body>
                </html>
            `;

            // Microsoft Word MIME type
            const blob = new Blob(['\ufeff' + docHtml], {
                type: "application/msword"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${resumeData?.fullName ? resumeData.fullName.replace(/\s+/g, "_") : "Resume"}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setShowDownloadModal(false);
            showToast("Resume downloaded as editable Word file successfully!", "success");
        } catch (err) {
            console.error("DOCX download error:", err);
            showToast("Failed to download as Word file. Please try again.", "error");
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
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3" style={{ padding: "60px 0" }}>
                    <div className="card text-center p-5 text-white" style={{
                        maxWidth: "480px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
                        animation: "fadeUp 0.3s ease"
                    }}>
                        <div className="card-body p-0">
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                                <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <FileQuestion size={40} color="#a5b4fc" />
                                </div>
                            </div>
                            <h3 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>No Resume Data Found</h3>
                            <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                                We couldn't find any resume data to preview. Create a new resume or import your details to generate professional layouts.
                            </p>
                            <div className="d-flex flex-column gap-2">
                                <Link href="/templates" className="btn btn-primary py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none" }}>
                                    Create Resume <ChevronRight size={16} />
                                </Link>
                                <Link href="/" className="btn btn-outline-light py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)" }}>
                                    <Home size={16} /> Go to Homepage
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
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

    /* ================= UI ================= */
    return (
        <div className="preview-page-container text-white min-vh-100">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />


            {/* Background Spotlights */}
            <div className="bg-glow-spot-1 no-print"></div>
            <div className="bg-glow-spot-2 no-print"></div>

            <Navbar />

            <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
                {/* Custom Floating Control Toolbar */}
                <div className="control-bar-wrapper no-print mb-4">
                    <div className="control-bar d-flex justify-content-between align-items-center flex-wrap gap-4">
                        <div className="control-bar-left">
                            <h4 className="mb-1 fw-bold d-flex align-items-center gap-2 text-white">
                                <LayoutGrid size={22} className="text-indigo" />
                                Resume Preview
                            </h4>
                            <p className="text-white-50 mb-0 small fw-semibold">
                                Selected Layout: <span className="text-indigo font-monospace">{templateList.find(t => t.id === selectedTemplate)?.name || selectedTemplate}</span>
                            </p>
                        </div>
                        
                        <div className="control-bar-actions d-flex align-items-center gap-2.5 flex-wrap">
                            <div className="d-flex align-items-center gap-2 me-2">
                                <label htmlFor="lang-selector" className="text-white-50 small mb-0 me-1 fw-semibold d-none d-md-inline">
                                    <i className="fas fa-language"></i> Lang:
                                </label>
                                <select
                                    id="lang-selector"
                                    className="form-select form-select-sm bg-dark-custom text-white border-glass py-2 px-3"
                                    style={{ width: "160px", borderRadius: "8px", cursor: "pointer" }}
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
                            
                            {/* Desktop Action Buttons */}
                            <div className="d-none d-md-flex align-items-center gap-2.5">
                                <button onClick={() => setShowTemplateModal(true)} className="btn btn-glass d-flex align-items-center gap-2 px-3 py-2" suppressHydrationWarning>
                                    <SlidersHorizontal size={14} className="text-indigo" /> Change Template
                                </button>
                                
                                <button onClick={handleEdit} className="btn btn-glass d-flex align-items-center gap-2 px-3 py-2" suppressHydrationWarning>
                                    <i className="fas fa-pen text-indigo"></i> Edit
                                </button>
                                
                                {resumeId && (
                                    <button onClick={() => setShowShareModal(true)} className="btn btn-glass btn-glass-info d-flex align-items-center gap-2 px-3 py-2" suppressHydrationWarning>
                                        <i className="fas fa-share-alt"></i> Share
                                    </button>
                                )}
                                
                                <button onClick={handleDownload} className="btn btn-gradient d-flex align-items-center gap-2 px-3.5 py-2" suppressHydrationWarning>
                                    <i className="fas fa-download"></i> Download Resume
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print layout helper */}
                <div className="text-center mb-2 no-print">
                    <span className="badge text-white-50 px-3 py-2 border-glass bg-dark-custom" style={{ fontSize: "0.8rem", borderRadius: "20px" }}>
                        <i className="fas fa-print me-2 text-indigo"></i> Standard A4 Print Dimensions (210mm × 297mm)
                    </span>
                </div>

                {/* Viewport for the A4 sheet */}
                <div className="preview-viewport-container d-flex justify-content-center py-2 no-print">
                    <div 
                        className="preview-viewport-shadow"
                        style={{
                            width: `${794 * scale}px`,
                            height: parentHeight,
                            overflow: "hidden",
                            position: "relative",
                            transition: "width 0.15s ease, height 0.15s ease"
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
                                overflow: "hidden"
                            }}
                        >
                            {/* Watermark Overlay for Unpaid Resume */}
                            {!isPaid && showWatermark && (
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

            {/* Mobile Sticky Bottom Action Bar */}
            <div className="mobile-sticky-bottom-bar d-flex d-md-none no-print">
                <button onClick={() => setShowTemplateModal(true)} className="mobile-action-btn" suppressHydrationWarning>
                    <SlidersHorizontal size={18} className="text-indigo" />
                    <span>Template</span>
                </button>
                
                <button onClick={handleEdit} className="mobile-action-btn" suppressHydrationWarning>
                    <i className="fas fa-pen text-indigo" style={{ fontSize: "16px" }}></i>
                    <span>Edit</span>
                </button>
                
                {resumeId && (
                    <button onClick={() => setShowShareModal(true)} className="mobile-action-btn" suppressHydrationWarning>
                        <i className="fas fa-share-alt text-info" style={{ fontSize: "16px" }}></i>
                        <span>Share</span>
                    </button>
                )}
                
                <button onClick={handleDownload} className="mobile-action-btn primary-cta" suppressHydrationWarning>
                    <i className="fas fa-download" style={{ fontSize: "15px" }}></i>
                    <span>Download</span>
                </button>
            </div>

            <style>{`
                .preview-page-container {
                    background: radial-gradient(circle at top, #111424 0%, #06070c 100%);
                    position: relative;
                    overflow-x: hidden;
                }
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -15%;
                    left: 5%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .bg-glow-spot-2 {
                    position: absolute;
                    bottom: 5%;
                    right: 5%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(6, 182, 212, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .control-bar-wrapper {
                    background: rgba(15, 18, 32, 0.65);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 18px;
                    padding: 18px 24px;
                    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
                    position: relative;
                    z-index: 10;
                }
                .bg-dark-custom {
                    background-color: rgba(11, 13, 23, 0.85) !important;
                }
                .border-glass {
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .btn-glass {
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: #cbd5e1;
                    border-radius: 10px;
                    font-weight: 500;
                    font-size: 0.88rem;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-glass:hover {
                    background: rgba(255, 255, 255, 0.09);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: #fff;
                    transform: translateY(-2px);
                }
                .btn-glass-info {
                    color: #22d3ee;
                    border-color: rgba(34, 211, 238, 0.15);
                }
                .btn-glass-info:hover {
                    background: rgba(34, 211, 238, 0.1);
                    border-color: rgba(34, 211, 238, 0.3);
                    color: #22d3ee;
                }
                .btn-gradient {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none;
                    color: #fff;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.88rem;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-gradient:hover {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
                    transform: translateY(-2px);
                    color: #fff;
                }
                .preview-viewport-shadow {
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(99, 102, 241, 0.1);
                    border-radius: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .preview-viewport-shadow:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 35px 90px rgba(0, 0, 0, 0.8), 0 0 60px rgba(99, 102, 241, 0.15);
                }
                
                /* Template Selector Modal Styles */
                .template-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(6, 8, 15, 0.85);
                    backdrop-filter: blur(12px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .template-modal-container {
                    background: linear-gradient(145deg, #121522 0%, #0a0b12 100%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    width: 92%;
                    max-width: 1100px;
                    height: 85vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
                    animation: modalFadeUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .template-modal-header {
                    padding: 24px 32px 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .template-modal-body {
                    padding: 24px 32px;
                    overflow-y: auto;
                    flex-grow: 1;
                }
                .template-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 24px;
                }
                .template-selector-card {
                    background: rgba(22, 26, 46, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 14px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    height: 310px;
                    position: relative;
                }
                .template-selector-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(99, 102, 241, 0.45);
                    background: rgba(26, 30, 54, 0.7);
                    box-shadow: 0 12px 24px rgba(99, 102, 241, 0.12);
                }
                .template-selector-card.active {
                    border-color: #6366f1;
                    background: rgba(99, 102, 241, 0.08);
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
                }
                .tpl-preview-box {
                    height: 165px;
                    overflow: hidden;
                    position: relative;
                    background: rgba(0, 0, 0, 0.35);
                    border-radius: 13px 13px 0 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .tpl-preview-scale {
                    width: 210px;
                    height: 297px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.52);
                    transform-origin: center center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .tpl-details-box {
                    padding: 14px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex-grow: 1;
                }
                .tpl-title {
                    font-size: 0.95rem;
                    font-weight: 700;
                    margin-bottom: 4px;
                    color: #fff;
                }
                .tpl-desc {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.45);
                    line-height: 1.3;
                    margin-bottom: 8px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    height: 32px;
                }
                .active-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: #fff;
                    font-size: 0.65rem;
                    font-weight: 700;
                    padding: 3px 8px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
                    z-index: 5;
                }
                .bg-glass-tag {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.62rem;
                    padding: 1.5px 5px;
                    border-radius: 4px;
                }
                
                /* Transition Loader Overlay */
                .template-transition-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(5, 7, 12, 0.85);
                    backdrop-filter: blur(16px);
                    z-index: 10100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .loader-card {
                    max-width: 440px;
                    width: 90%;
                    background: linear-gradient(145deg, #141727 0%, #0d0f1a 100%);
                    border-radius: 24px;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.65);
                    padding: 32px;
                }
                .spinner-wrapper {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .spinner-icon {
                    color: #6366f1;
                    animation: spin 1.2s linear infinite;
                }
                .pulse-sparkle {
                    position: absolute;
                    color: #a5b4fc;
                    animation: pulse 1.8s ease-in-out infinite;
                }
                .text-glow {
                    text-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
                }
                
                /* Animations */
                @keyframes modalFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.1); }
                }

                /* Mobile Sticky Bottom Bar Styles */
                .mobile-sticky-bottom-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 72px;
                    background: rgba(11, 13, 23, 0.85);
                    backdrop-filter: blur(16px);
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 0 12px;
                }
                .mobile-action-btn {
                    background: transparent;
                    border: none;
                    color: #cbd5e1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    flex: 1;
                    height: 100%;
                    transition: all 0.2s ease;
                }
                .mobile-action-btn:active {
                    color: #fff;
                    transform: scale(0.95);
                }
                .mobile-action-btn i, .mobile-action-btn svg {
                    font-size: 1.1rem;
                }
                .mobile-action-btn.primary-cta {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: #fff;
                    border-radius: 12px;
                    height: 52px;
                    margin: 0 6px;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                    flex: 1.3;
                    gap: 4px;
                }
                .mobile-action-btn.primary-cta i {
                    font-size: 1rem;
                }

                @media (max-width: 767.98px) {
                    .preview-page-container {
                        padding-bottom: 88px;
                    }
                    .control-bar-wrapper {
                        padding: 14px 16px;
                        border-radius: 12px;
                    }
                    .control-bar-left h4 {
                        font-size: 1.1rem !important;
                    }
                }

                /* Responsive Template Modal Grid */
                @media (max-width: 575.98px) {
                    .template-modal-header {
                        padding: 16px 16px 12px !important;
                        gap: 12px !important;
                    }
                    .template-modal-body {
                        padding: 16px !important;
                    }
                    .template-grid {
                        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) !important;
                        gap: 12px !important;
                    }
                    .template-selector-card {
                        height: 200px !important;
                    }
                    .tpl-preview-box {
                        height: 110px !important;
                    }
                    .tpl-preview-scale {
                        transform: translate(-50%, -50%) scale(0.4) !important;
                    }
                    .tpl-details-box {
                        padding: 10px !important;
                    }
                    .tpl-title {
                        font-size: 0.8rem !important;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .tpl-desc {
                        display: none !important;
                    }
                    .template-modal-container {
                        width: 96% !important;
                        height: 90vh !important;
                        border-radius: 16px !important;
                    }
                }

                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    #resume-preview {
                        width: 100% !important;
                        min-height: 100vh !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>

            {/* TEMPLATE PICKER MODAL */}
            {showTemplateModal && (
                <div className="template-modal-backdrop no-print">
                    <div className="template-modal-container">
                        {/* Header */}
                        <div className="template-modal-header">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="fw-bold mb-1 d-flex align-items-center gap-2 text-white">
                                        <Sparkles size={20} className="text-indigo" />
                                        Choose Resume Template
                                    </h4>
                                    <p className="text-white-50 mb-0 small">
                                        Select a layout to instantly format your professional details. Click any card to apply.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowTemplateModal(false)}
                                    className="btn btn-glass d-flex align-items-center justify-content-center p-0 rounded-circle"
                                    style={{ width: "36px", height: "36px" }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            {/* Search and Tabs */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-1">
                                <div className="d-flex flex-wrap gap-2">
                                    {[
                                        { id: "all", label: "All Layouts" },
                                        { id: "professional", label: "Professional" },
                                        { id: "minimalist", label: "Minimalist" },
                                        { id: "creative", label: "Creative" },
                                        { id: "tech", label: "Tech / Code" }
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setTemplateSelectedCategory(cat.id)}
                                            className={`btn btn-sm px-3 py-1.5 ${templateSelectedCategory === cat.id ? 'btn-gradient' : 'btn-glass'}`}
                                            style={{ fontSize: "0.82rem" }}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="position-relative" style={{ width: "260px" }}>
                                    <Search className="position-absolute" size={14} style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm bg-dark-custom text-white border-glass py-2 px-3 ps-5"
                                        placeholder="Search templates..."
                                        style={{ fontSize: "0.85rem", borderRadius: "10px" }}
                                        value={templateSearchQuery}
                                        onChange={(e) => setTemplateSearchQuery(e.target.value)}
                                    />
                                    {templateSearchQuery && (
                                        <button 
                                            onClick={() => setTemplateSearchQuery("")}
                                            className="position-absolute btn-link text-white-50 border-0 bg-transparent"
                                            style={{ right: "12px", top: "50%", transform: "translateY(-50%)" }}
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Body / Grid */}
                        <div className="template-modal-body">
                            {templateList.filter(tpl => {
                                const matchesCategory = templateSelectedCategory === "all" || tpl.category === templateSelectedCategory || (templateSelectedCategory === "tech" && tpl.category === "tech");
                                const matchesSearch = tpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) || 
                                                      tpl.tags.some(t => t.toLowerCase().includes(templateSearchQuery.toLowerCase())) ||
                                                      tpl.desc.toLowerCase().includes(templateSearchQuery.toLowerCase());
                                return matchesCategory && matchesSearch;
                            }).length === 0 ? (
                                <div className="text-center py-5">
                                    <FileQuestion size={48} className="text-white-50 mb-3" />
                                    <h5>No matching templates found</h5>
                                    <p className="text-white-50 small">Try widening your search keywords or switching categories.</p>
                                </div>
                            ) : (
                                <div className="template-grid">
                                    {templateList.filter(tpl => {
                                        const matchesCategory = templateSelectedCategory === "all" || tpl.category === templateSelectedCategory || (templateSelectedCategory === "tech" && tpl.category === "tech");
                                        const matchesSearch = tpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) || 
                                                              tpl.tags.some(t => t.toLowerCase().includes(templateSearchQuery.toLowerCase())) ||
                                                              tpl.desc.toLowerCase().includes(templateSearchQuery.toLowerCase());
                                        return matchesCategory && matchesSearch;
                                    }).map((tpl) => {
                                        const FREE_TEMPLATES = ["modern", "creative", "product_manager", "bento"];
                                        const isPremium = !FREE_TEMPLATES.includes(tpl.id);
                                        return (
                                            <div 
                                                key={tpl.id}
                                                onClick={() => saveTemplateChange(tpl.id)}
                                                className={`template-selector-card ${selectedTemplate === tpl.id ? 'active' : ''}`}
                                                style={{ position: "relative" }}
                                            >
                                                <div style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    left: "10px",
                                                    zIndex: 10,
                                                    padding: "2.5px 8px",
                                                    borderRadius: "12px",
                                                    fontSize: "0.6rem",
                                                    fontWeight: "700",
                                                    textTransform: "uppercase",
                                                    background: isPremium 
                                                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" // Premium gold
                                                        : "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Free green
                                                    color: "#fff",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.35)"
                                                }}>
                                                    <div className="d-flex align-items-center gap-1">
                                                        {isPremium ? (
                                                            <>
                                                                <Crown size={10} className="text-white" />
                                                                <span>Premium</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Unlock size={10} className="text-white" />
                                                                <span>Free</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {selectedTemplate === tpl.id && (
                                                    <div className="active-badge">
                                                        <Check size={11} /> Active
                                                    </div>
                                                )}
                                                
                                                <div className="tpl-preview-box">
                                                    <div className="tpl-preview-scale">
                                                        {tpl.preview}
                                                    </div>
                                                </div>
                                                
                                                <div className="tpl-details-box">
                                                    <div>
                                                        <div className="tpl-title">{tpl.name}</div>
                                                        <div className="tpl-desc">{tpl.desc}</div>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-1 mt-auto">
                                                        {tpl.tags.map((tag, idx) => (
                                                            <span key={idx} className="badge bg-glass-tag">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TEMPLATE CHANGE PROGRESS LOADER */}
            {isChangingTemplate && (
                <div className="template-transition-loader no-print">
                    <div className="loader-card text-center">
                        <div className="mb-4 spinner-wrapper">
                            <Loader2 className="spinner-icon" size={48} />
                            <Sparkles className="pulse-sparkle" size={24} />
                        </div>
                        <h4 className="fw-bold mb-2 text-glow">Applying Design</h4>
                        <p className="text-white-50 mb-0 font-monospace small">
                            {templateLoadingText}
                        </p>
                    </div>
                </div>
            )}

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
                }} className="no-print">
                    
                    {!isPaid ? (
                        (() => {
                            const FREE_TEMPLATES = ["modern", "creative", "product_manager", "bento"];
                            const isCurrentTemplatePremium = !FREE_TEMPLATES.includes(selectedTemplate);
                            if (isCurrentTemplatePremium) {
                                return (
                                    /* STRICT PREMIUM TEMPLATE PAYWALL SCREEN */
                                    <div className="card p-4 p-md-5 text-white animate-fade-in" style={{
                                        maxWidth: "560px",
                                        width: "95%",
                                        background: "linear-gradient(145deg, #181926 0%, #0d0f1a 100%)",
                                        borderRadius: "24px",
                                        border: "1.5px solid rgba(245, 158, 11, 0.35)", // Gold tint border
                                        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(245, 158, 11, 0.08)"
                                    }}>
                                        <div className="card-body position-relative p-0 text-center">
                                            <button 
                                                onClick={() => setShowDownloadModal(false)}
                                                className="btn-close btn-close-white position-absolute"
                                                style={{ top: "-5px", right: "-5px", zIndex: 10 }}
                                                aria-label="Close"
                                            ></button>

                                            {/* Gold Premium Seal */}
                                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                                <div style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    borderRadius: "50%",
                                                    background: "rgba(245, 158, 11, 0.15)",
                                                    border: "1.5px solid rgba(245, 158, 11, 0.4)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <Crown size={32} className="text-warning" />
                                                </div>
                                            </div>

                                            <h3 className="fw-bold mb-2 text-white" style={{ fontSize: "1.65rem", letterSpacing: "-0.01em" }}>Premium Layout Locked</h3>
                                            
                                            <div className="d-inline-block px-3 py-1 rounded-pill mb-4" style={{
                                                background: "rgba(245, 158, 11, 0.08)",
                                                border: "1px solid rgba(245, 158, 11, 0.2)",
                                                fontSize: "0.82rem",
                                                fontWeight: "600",
                                                color: "#f59e0b"
                                            }}>
                                                Layout: {templateList.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
                                            </div>

                                            <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                                                You are using a Premium layout built for senior profiles and hiring software compatibility. Upgrade to Premium for a one-time charge of <strong>₹150</strong> to download.
                                            </p>

                                            <div style={{
                                                background: "rgba(255, 255, 255, 0.02)",
                                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                                borderRadius: "16px",
                                                padding: "16px",
                                                textAlign: "left",
                                                marginBottom: "24px"
                                            }}>
                                                <h5 className="fw-semibold text-white mb-3" style={{ fontSize: "0.9rem" }}>What's included in Premium:</h5>
                                                <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                                                    <li className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-check text-success"></i> <strong>Clean &amp; Watermark-Free</strong> exports
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-check text-success"></i> PDF, PNG, and Editable Word formats
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2">
                                                        <i className="fas fa-check text-success"></i> Unlimited downloads and edits forever
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="d-flex flex-column gap-2.5">
                                                <button 
                                                    onClick={handleRazorpayPayment}
                                                    className="btn w-100 py-3 fw-bold"
                                                    style={{
                                                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                                        border: "none",
                                                        color: "#fff",
                                                        borderRadius: "12px",
                                                        fontSize: "0.95rem",
                                                        boxShadow: "0 4px 15px rgba(245, 158, 11, 0.3)"
                                                    }}
                                                >
                                                    Upgrade for ₹150
                                                </button>
                                                
                                                <button 
                                                    onClick={() => {
                                                        setShowDownloadModal(false);
                                                        setShowTemplateModal(true);
                                                    }}
                                                    className="btn btn-outline-light w-100 py-2.5 fw-semibold"
                                                    style={{ borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.15)", fontSize: "0.88rem" }}
                                                >
                                                    Switch to a Free Template
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                /* COMPARISON MODAL FOR UNPAID (FREE TEMPLATES ONLY) */
                                <div className="card p-4 p-md-5 text-white animate-fade-in" style={{
                            maxWidth: "700px",
                            width: "95%",
                            background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                            borderRadius: "24px",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                        }}>
                            <div className="card-body position-relative p-0 text-center">
                                <button 
                                    onClick={() => setShowDownloadModal(false)}
                                    className="btn-close btn-close-white position-absolute"
                                    style={{ top: "10px", right: "10px", zIndex: 10 }}
                                    aria-label="Close"
                                ></button>

                                <h3 className="fw-bold mb-1 text-white" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>Download Your Resume</h3>
                                <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem" }}>
                                    How would you like to export your resume?
                                </p>

                                <div className="row g-4 text-start">
                                    {/* FREE COLUMN */}
                                    <div className="col-12 col-md-6">
                                        <div className="h-100 p-4 d-flex flex-column justify-content-between" style={{
                                            background: "rgba(255, 255, 255, 0.02)",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            borderRadius: "18px"
                                        }}>
                                            <div>
                                                <h4 className="fw-bold fs-5 text-white mb-3 d-flex align-items-center gap-2">
                                                    <Unlock size={18} className="text-white-50" /> Free Download
                                                </h4>
                                                <ul className="list-unstyled d-flex flex-column gap-2 mb-4 text-white-50" style={{ fontSize: "0.9rem" }}>
                                                    <li className="d-flex align-items-center gap-2 text-white-50">
                                                        <i className="fas fa-check text-success"></i> PDF Format
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2 text-white-50">
                                                        <i className="fas fa-check text-success"></i> Ready to Use
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2" style={{ color: "rgba(239, 68, 68, 0.8)" }}>
                                                        <i className="fas fa-times"></i> CVGrid Watermark
                                                    </li>
                                                </ul>
                                            </div>
                                            <button 
                                                onClick={downloadAsPDF}
                                                className="btn btn-outline-light w-100 py-2.5 fw-semibold"
                                                style={{ borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                                            >
                                                Download Free
                                            </button>
                                        </div>
                                    </div>

                                    {/* PREMIUM COLUMN */}
                                    <div className="col-12 col-md-6">
                                        <div className="h-100 p-4 d-flex flex-column justify-content-between position-relative" style={{
                                            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(13, 202, 240, 0.04) 100%)",
                                            border: "1px solid rgba(99, 102, 241, 0.25)",
                                            borderRadius: "18px"
                                        }}>
                                            <div className="position-absolute" style={{ top: "-12px", right: "20px" }}>
                                                <span className="badge bg-indigo text-white px-2.5 py-1 text-uppercase fw-bold" style={{ fontSize: "0.65rem", borderRadius: "8px", letterSpacing: "0.05em", background: "#6366f1" }}>RECOMMENDED</span>
                                            </div>
                                            <div>
                                                <h4 className="fw-bold fs-5 text-white mb-3 d-flex align-items-center gap-2">
                                                    <Crown size={18} className="text-warning" /> Premium Export <span className="text-info fs-6 fw-normal ms-auto">₹150</span>
                                                </h4>
                                                <ul className="list-unstyled d-flex flex-column gap-2 mb-4" style={{ fontSize: "0.9rem" }}>
                                                    <li className="d-flex align-items-center gap-2 text-white">
                                                        <i className="fas fa-check text-success"></i> No Watermark
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2 text-white">
                                                        <i className="fas fa-check text-success"></i> Clean Professional PDF
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2 text-white">
                                                        <i className="fas fa-check text-success"></i> Word (.docx) & PNG downloads
                                                    </li>
                                                    <li className="d-flex align-items-center gap-2 text-white">
                                                        <i className="fas fa-check text-success"></i> Unlimited Downloads
                                                    </li>
                                                </ul>
                                            </div>
                                            <button 
                                                onClick={handleRazorpayPayment}
                                                className="btn w-100 py-2.5 fw-bold btn-gradient"
                                                style={{ borderRadius: "10px" }}
                                            >
                                                Buy Premium
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button 
                                        onClick={() => setShowDownloadModal(false)}
                                        className="btn btn-link text-white-50 text-decoration-none small"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()
                ) : (
                        /* ORIGINAL UNLOCKED MODAL FOR PAID */
                        <div className="card text-center p-4 p-md-5 text-white animate-fade-in" style={{
                            maxWidth: "680px",
                            width: "95%",
                            background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                            borderRadius: "20px",
                            border: "1px solid rgba(142, 144, 160, 0.25)",
                            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                        }}>
                            <div className="card-body position-relative p-0">
                                <button 
                                    onClick={() => setShowDownloadModal(false)}
                                    className="btn-close btn-close-white position-absolute"
                                    style={{ top: "10px", right: "10px", zIndex: 10 }}
                                    aria-label="Close"
                                ></button>
                                
                                <h3 className="fw-bold mb-3 d-flex align-items-center justify-content-center gap-2" style={{ letterSpacing: "-0.01em" }}>
                                    <Crown size={22} className="text-warning" /> Choose Export Format
                                </h3>
                                <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem" }}>
                                    Premium feature unlocked! Download your clean, watermark-free resume.
                                </p>
                                
                                <div className="row g-3">
                                    <div className="col-12 col-md-4">
                                        <button 
                                            onClick={downloadAsPNG}
                                            className="btn btn-outline-info w-100 p-3.5 d-flex flex-column align-items-center justify-content-center"
                                            style={{
                                                borderRadius: "16px",
                                                borderWidth: "1.5px",
                                                transition: "all 0.2s ease",
                                                background: "rgba(13, 202, 240, 0.05)",
                                                height: "100%"
                                            }}
                                        >
                                            <i className="fas fa-file-image fa-2x mb-3 text-info"></i>
                                            <span className="fw-bold fs-6 mb-1 text-white">PNG Image</span>
                                            <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>Best for sharing</span>
                                        </button>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <button 
                                            onClick={downloadAsPDF}
                                            className="btn btn-outline-primary w-100 p-3.5 d-flex flex-column align-items-center justify-content-center"
                                            style={{
                                                borderRadius: "16px",
                                                borderWidth: "1.5px",
                                                transition: "all 0.2s ease",
                                                background: "rgba(13, 110, 253, 0.05)",
                                                height: "100%"
                                            }}
                                        >
                                            <i className="fas fa-file-pdf fa-2x mb-3 text-primary"></i>
                                            <span className="fw-bold fs-6 mb-1 text-white">PDF File</span>
                                            <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>Best for printing/ATS</span>
                                        </button>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <button 
                                            onClick={downloadAsDOCX}
                                            className="btn btn-outline-indigo w-100 p-3.5 d-flex flex-column align-items-center justify-content-center"
                                            style={{
                                                borderRadius: "16px",
                                                borderWidth: "1.5px",
                                                transition: "all 0.2s ease",
                                                background: "rgba(99, 102, 241, 0.05)",
                                                borderColor: "rgba(99, 102, 241, 0.4)",
                                                height: "100%"
                                            }}
                                        >
                                            <i className="fas fa-file-word fa-2x mb-3 text-indigo" style={{ color: "#818cf8" }}></i>
                                            <span className="fw-bold fs-6 mb-1 text-white">Word File</span>
                                            <span className="text-white-50 small" style={{ fontSize: "0.75rem" }}>100% Editable Doc</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <button 
                                        onClick={() => setShowDownloadModal(false)}
                                        className="btn btn-link text-white-50 text-decoration-none"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                }} className="no-print">
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
                                {downloadType === "png" ? "Generating Image" : (downloadType === "docx" ? "Creating Word Document" : "Compiling PDF")}
                            </h4>
                            <p className="text-white-50 mb-0">
                                {downloadType === "png" 
                                    ? "Converting your resume layouts to high-res PNG..." 
                                    : (downloadType === "docx"
                                        ? "Formatting and downloading editable Word Document..."
                                        : "Optimizing structure and creating print-ready PDF...")}
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
                }} className="no-print">
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
                }} className="no-print">
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
                                style={{ top: "10px", right: "10px", zIndex: 10 }}
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

            <ReviewModal 
                isOpen={showReviewModal} 
                onClose={() => setShowReviewModal(false)} 
                userEmail={userEmail} 
                initialUserName={resumeData?.fullName || ""} 
            />
        </div>
    );
}
