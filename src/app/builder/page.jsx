"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getRecaptchaToken } from "../../utils/recaptcha";
import { subscribeToAuthChanges } from "../../authState";
import { showToast } from "../../utils/toast";

export default function ResumeBuilder() {
    const router = useRouter();

    /* ================= YEARS & MONTHS ================= */
    const MAX_YEAR = 2028;
    const MIN_YEAR = 1980;

    const getYears = (startFrom = MAX_YEAR) =>
        Array.from(
            { length: startFrom - MIN_YEAR + 1 },
            (_, i) => startFrom - i
        );

    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    /* ================= STATE ================= */
    const [isLoading, setIsLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [resumeId, setResumeId] = useState(null);
    const [resumeName, setResumeName] = useState("My Resume");
    const [cloudSaving, setCloudSaving] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    const LOADING_MESSAGES = [
        "Analyzing your professional profile...",
        "Brainstorming compelling impact statements...",
        "Aligning achievements with ATS recommendations...",
        "Structuring education & work history...",
        "Polishing content phrasing with Gemini AI...",
        "Formatting layout & applying design tokens...",
        "Preparing final resume document preview..."
    ];

    useEffect(() => {
        if (!isLoading) {
            setCurrentMessageIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isLoading]);

    const [formData, setFormData] = useState({
        profilePhoto: "",

        fullName: "",
        role: "",

        email: "",
        phone: "",

        portfolio: "",
        linkedin: "",
        github: "",

        professionalSummary: "",

        graduation: {
            course: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: ""
        },

        hasPostGraduation: false,
        postGraduation: {
            course: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: ""
        },

        hasPhd: false,
        phd: {
            course: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: ""
        },

        hasInternship: false,
        internship: {
            field: "",
            company: "",
            ongoing: false,
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: ""
        },

        hasExperience: false,
        experience: {
            company: "",
            location: "",
            role: "",
            salary: "",
            ongoing: false,
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            description: ""
        },

        projects: "",
        achievements: "",
        skills: ""
    });

    const loadResumeFromDb = async (email, id) => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/resumes?email=${encodeURIComponent(email)}&id=${id}`);
            if (res.ok) {
                const data = await res.json();
                setResumeId(data.id);
                setResumeName(data.resumeName);
                sessionStorage.setItem("resumeId", data.id);
                if (data.resumeData) {
                    setFormData(data.resumeData);
                    sessionStorage.setItem("resumeData", JSON.stringify(data.resumeData));
                }
                if (data.selectedTemplate) {
                    sessionStorage.setItem("selectedTemplate", data.selectedTemplate);
                }
            } else {
                showToast("Failed to load saved resume.", "error");
            }
        } catch (err) {
            console.error("Error loading resume:", err);
            showToast("Error loading saved resume.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let activeEmail = null;
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user && user.email) {
                activeEmail = user.email;
                setUserEmail(user.email);

                const params = new URLSearchParams(window.location.search);
                const id = params.get("id");

                if (id) {
                    await loadResumeFromDb(user.email, id);
                } else {
                    const savedData = sessionStorage.getItem("resumeData");
                    if (savedData) {
                        try {
                            const parsed = JSON.parse(savedData);
                            if (parsed.experience && typeof parsed.experience === "string") {
                                parsed.hasExperience = true;
                                parsed.experience = {
                                    company: "",
                                    location: "",
                                    role: "",
                                    salary: "",
                                    ongoing: false,
                                    startMonth: "",
                                    startYear: "",
                                    endMonth: "",
                                    endYear: "",
                                    description: parsed.experience
                                };
                            }
                            setFormData(prev => ({ ...prev, ...parsed }));
                        } catch (err) {
                            console.error("Error parsing resumeData:", err);
                        }
                    }
                }

                try {
                    const response = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (activeEmail === user.email && data.photoUrl) {
                            setFormData(prev => {
                                if (!prev.profilePhoto) {
                                    const updated = { ...prev, profilePhoto: data.photoUrl };
                                    sessionStorage.setItem("resumeData", JSON.stringify(updated));
                                    return updated;
                                }
                                return prev;
                            });
                        }
                    }
                } catch (err) {
                    console.error("Error fetching photo from database:", err);
                }
            } else {
                activeEmail = null;
                setUserEmail(null);
                router.push("/?triggerAuth=true");
            }
        });

        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);


    /* ================= HANDLERS ================= */
    const handleCloudSave = async (e) => {
        if (e) e.preventDefault();
        if (!userEmail) {
            showToast("You must be logged in to save to cloud.", "error");
            return;
        }

        if (!resumeId) {
            setShowSaveModal(true);
            return;
        }

        setCloudSaving(true);
        try {
            const selectedTemplate = sessionStorage.getItem("selectedTemplate") || "classic";
            const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    id: resumeId,
                    resumeName,
                    resumeData: formData,
                    selectedTemplate
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update resume in the cloud");
            }

            sessionStorage.setItem("resumeId", resumeId);
            showToast("Resume saved to cloud successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to save resume", "error");
        } finally {
            setCloudSaving(false);
        }
    };

    const handleCreateCloudSave = async (nameInput) => {
        if (!nameInput.trim()) {
            showToast("Please enter a valid resume name.", "error");
            return;
        }
        setCloudSaving(true);
        setShowSaveModal(false);
        try {
            const selectedTemplate = sessionStorage.getItem("selectedTemplate") || "classic";
            const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    resumeName: nameInput,
                    resumeData: formData,
                    selectedTemplate
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create resume in the cloud");
            }

            const data = await response.json();
            setResumeId(data.id);
            sessionStorage.setItem("resumeId", data.id);
            setResumeName(nameInput);
            showToast("Resume created and saved to cloud!", "success");

            const newUrl = `${window.location.pathname}?id=${data.id}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
        } catch (err) {
            console.error(err);
            showToast(err.message || "Failed to create resume", "error");
        } finally {
            setCloudSaving(false);
        }
    };

    const handlePdfImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            showToast("Please select a valid PDF file.", "error");
            return;
        }

        setIsImporting(true);
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const base64Data = reader.result.split(',')[1];
                    const response = await fetch("/api/parse", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileBase64: base64Data })
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error || "Failed to parse PDF resume");
                    }

                    const parsedData = await response.json();
                    
                    setFormData(prev => {
                        const updated = {
                            ...prev,
                            ...parsedData,
                            profilePhoto: prev.profilePhoto
                        };
                        sessionStorage.setItem("resumeData", JSON.stringify(updated));
                        return updated;
                    });

                    showToast("Resume parsed and imported successfully!", "success");
                } catch (err) {
                    console.error("PDF import API error:", err);
                    showToast(err.message || "Failed to parse resume.", "error");
                } finally {
                    setIsImporting(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("PDF read error:", err);
            showToast("Failed to read the PDF file.", "error");
            setIsImporting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            sessionStorage.setItem("resumeData", JSON.stringify(updated));
            return updated;
        });
    };


    const handleNestedChange = (section, field, value) => {
        setFormData(prev => {
            const updated = {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };
            sessionStorage.setItem("resumeData", JSON.stringify(updated));
            return updated;
        });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => {
                const updated = { ...prev, profilePhoto: reader.result };
                sessionStorage.setItem("resumeData", JSON.stringify(updated));
                return updated;
            });

            // Persist to Neon Postgres if logged in
            const unsubscribe = subscribeToAuthChanges(async (user) => {
                if (user && user.email) {
                    try {
                        await fetch("/api/user", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: user.email, photoUrl: reader.result })
                        });
                    } catch (err) {
                        console.error("Failed to save photo to Postgres:", err);
                    }
                }
            });
            if (typeof unsubscribe === "function") unsubscribe();
        };
        reader.readAsDataURL(file);
    };



    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const recaptchaToken = await getRecaptchaToken("GENERATE_RESUME").catch(() => "MOCK_TOKEN");

            // Save complete data
            sessionStorage.setItem("resumeData", JSON.stringify(formData));

            // Auto-save to cloud if user is logged in and it's an existing cloud resume
            if (userEmail && resumeId) {
                const selectedTemplate = sessionStorage.getItem("selectedTemplate") || "classic";
                fetch("/api/resumes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: userEmail,
                        id: resumeId,
                        resumeName,
                        resumeData: formData,
                        selectedTemplate
                    })
                }).catch(err => console.error("Cloud auto-save error on submit:", err));
            }

            const prompt = `
Create a professional resume.

Name: ${formData.fullName}
Role: ${formData.role || "Not specified"}

Contact:
Email: ${formData.email}
Phone: ${formData.phone}

Professional Links:
Portfolio: ${formData.portfolio || "Not provided"}
LinkedIn: ${formData.linkedin || "Not provided"}
GitHub: ${formData.github || "Not provided"}

Professional Summary:
${formData.professionalSummary || "Generate a strong professional summary."}

Education:
Graduation: ${formData.graduation.course} (${[formData.graduation.startMonth, formData.graduation.startYear].filter(Boolean).join(" ")} - ${[formData.graduation.endMonth, formData.graduation.endYear].filter(Boolean).join(" ")})
Post Graduation: ${formData.hasPostGraduation ? `${formData.postGraduation.course} (${[formData.postGraduation.startMonth, formData.postGraduation.startYear].filter(Boolean).join(" ")} - ${[formData.postGraduation.endMonth, formData.postGraduation.endYear].filter(Boolean).join(" ")})` : "Not Applicable"}
PhD: ${formData.hasPhd ? `${formData.phd.course} (${[formData.phd.startMonth, formData.phd.startYear].filter(Boolean).join(" ")} - ${[formData.phd.endMonth, formData.phd.endYear].filter(Boolean).join(" ")})` : "Not Applicable"}

Internship:
${formData.hasInternship
    ? `Company: ${formData.internship.company}, Field/Role: ${formData.internship.field}, Duration: ${[formData.internship.startMonth, formData.internship.startYear].filter(Boolean).join(" ")} to ${formData.internship.ongoing ? "Present (Ongoing)" : [formData.internship.endMonth, formData.internship.endYear].filter(Boolean).join(" ")}`
    : "Not Applicable"}

Job Experience:
${formData.hasExperience
    ? `Company: ${formData.experience.company}, Location: ${formData.experience.location}, Position/Role: ${formData.experience.role}, Salary: ${formData.experience.salary}, Duration: ${[formData.experience.startMonth, formData.experience.startYear].filter(Boolean).join(" ")} to ${formData.experience.ongoing ? "Present (Ongoing)" : [formData.experience.endMonth, formData.experience.endYear].filter(Boolean).join(" ")}. Details/Responsibilities: ${formData.experience.description}`
    : "Not Applicable"}

Projects:
${formData.projects || "Not provided"}

Skills:
${formData.skills || "Not provided"}
`;

            const res = await fetch(
                "/api/generate",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt, recaptchaToken })
                }
            );

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "AI generation failed");
            }

            const data = await res.json();

            sessionStorage.setItem("aiOutput", data.result);
            router.push("/preview");

        } catch (err) {
            console.error(err);
            showToast(err.message || "AI generation failed. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    /* ================= UI ================= */
    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="bg-black border border-secondary p-5" style={{
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                        }}>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3 border-bottom border-secondary pb-4">
                                <div className="text-center text-md-start">
                                    <h1 className="display-6 fw-bold mb-1 text-white">
                                        {resumeId ? `Editing: ${resumeName}` : "Build Your Resume"}
                                    </h1>
                                    <p className="text-white-50 mb-0 small">
                                        Fill in your details and let AI craft your professional resume
                                    </p>
                                </div>
                                {userEmail && (
                                    <button
                                        onClick={handleCloudSave}
                                        className="btn btn-outline-info d-flex align-items-center gap-2 px-4 py-2"
                                        disabled={cloudSaving}
                                        style={{ borderRadius: "8px" }}
                                    >
                                        {cloudSaving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt"></i>
                                                Save to Cloud
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* PDF IMPORT AREA */}
                            <div className="card bg-dark border-secondary mb-5" style={{
                                borderRadius: '12px',
                                border: '1px dashed rgba(13, 110, 253, 0.4)',
                                background: 'linear-gradient(145deg, rgba(28, 32, 39, 0.6) 0%, rgba(17, 20, 26, 0.6) 100%)'
                            }}>
                                <div className="card-body p-4 text-center">
                                    <div className="mb-3">
                                        <i className="fas fa-file-invoice text-primary" style={{ fontSize: "2.5rem" }}></i>
                                    </div>
                                    <h3 className="h5 fw-bold mb-2">Import from Existing Resume</h3>
                                    <p className="text-white-50 small mb-3">
                                        Upload your PDF resume, and Gemini AI will pre-fill the form fields below.
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            id="pdf-resume-import"
                                            className="d-none"
                                            onChange={handlePdfImport}
                                            disabled={isImporting || isLoading}
                                        />
                                        <label
                                            htmlFor="pdf-resume-import"
                                            className={`btn ${isImporting ? 'btn-secondary' : 'btn-outline-primary'} px-4 py-2 fw-semibold d-flex align-items-center gap-2`}
                                            style={{ cursor: isImporting || isLoading ? 'not-allowed' : 'pointer' }}
                                        >
                                            {isImporting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Parsing PDF Resume...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-file-upload"></i>
                                                    Upload PDF Resume
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {/* BASIC INFO */}
                                <div className="mb-4">
                                    <label htmlFor="fullName" className="form-label fw-semibold">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-dark text-white border-secondary"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6 mb-4 mb-md-0">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg bg-dark text-white border-secondary"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                            suppressHydrationWarning
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label fw-semibold">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg bg-dark text-white border-secondary"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 234 567 8900"
                                            required
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                {/* ROLE */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Your Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Web Developer / Java Developer / DevOps Engineer"
                                        value={formData.role}
                                        onChange={handleChange}
                                        suppressHydrationWarning
                                    />
                                </div>

                                {/* LINKS */}
                                <div className="row mb-4">
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">Portfolio</label>
                                        <input
                                            type="url"
                                            name="portfolio"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="https://yourportfolio.com"
                                            value={formData.portfolio}
                                            onChange={handleChange}
                                            suppressHydrationWarning
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">LinkedIn</label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="https://linkedin.com/in/username"
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            suppressHydrationWarning
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold">GitHub</label>
                                        <input
                                            type="url"
                                            name="github"
                                            className="form-control bg-dark text-white border-secondary"
                                            placeholder="https://github.com/username"
                                            value={formData.github}
                                            onChange={handleChange}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>


                                {/* PROFILE PHOTO (OPTIONAL) */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Profile Photo (Optional)
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control bg-dark text-white border-secondary"
                                        onChange={handlePhotoUpload}
                                        suppressHydrationWarning
                                    />

                                    {formData.profilePhoto && (
                                        <div className="mt-3">
                                            <img
                                                src={formData.profilePhoto}
                                                alt="Profile Preview"
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                    border: "2px solid #0d6efd"
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>


                                <div className="mb-4">
                                    <label htmlFor="professionalSummary" className="form-label fw-semibold">
                                        Professional Summary
                                    </label>
                                    <textarea
                                        className="form-control bg-dark text-white border-secondary"
                                        id="professionalSummary"
                                        name="professionalSummary"
                                        value={formData.professionalSummary}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Brief overview of your professional background and career objectives"
                                        suppressHydrationWarning
                                    ></textarea>
                                    <small className="text-white-50">Optional - AI will generate if left empty</small>
                                </div>

                                {/* GRADUATION */}
                                <div className="mb-4 pb-3 border-bottom border-secondary">
                                    <h4 className="h5 fw-bold mb-3 text-primary">Graduation</h4>

                                    <div className="mb-3">
                                        <label htmlFor="gradCourse" className="form-label fw-semibold">
                                            Course/Degree
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-secondary"
                                            id="gradCourse"
                                            value={formData.graduation.course}
                                            onChange={(e) => handleNestedChange("graduation", "course", e.target.value)}
                                            placeholder="Bachelor of Science in Computer Science"
                                            required
                                            suppressHydrationWarning
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="gradStart" className="form-label fw-semibold">
                                                Start Date
                                            </label>
                                            <div className="d-flex gap-2">
                                                <select
                                                    className="form-select bg-dark text-white border-secondary"
                                                    id="gradStartMonth"
                                                    value={formData.graduation.startMonth || ""}
                                                    onChange={(e) => handleNestedChange("graduation", "startMonth", e.target.value)}
                                                    required
                                                    suppressHydrationWarning
                                                >
                                                    <option value="">Month</option>
                                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select
                                                    className="form-select bg-dark text-white border-secondary"
                                                    id="gradStart"
                                                    value={formData.graduation.startYear}
                                                    onChange={(e) => handleNestedChange("graduation", "startYear", e.target.value)}
                                                    required
                                                    suppressHydrationWarning
                                                >
                                                    <option value="">Year</option>
                                                    {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="gradEnd" className="form-label fw-semibold">
                                                End Date
                                            </label>
                                            <div className="d-flex gap-2">
                                                <select
                                                    className="form-select bg-dark text-white border-secondary"
                                                    id="gradEndMonth"
                                                    value={formData.graduation.endMonth || ""}
                                                    onChange={(e) => handleNestedChange("graduation", "endMonth", e.target.value)}
                                                    required
                                                    suppressHydrationWarning
                                                >
                                                    <option value="">Month</option>
                                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select
                                                    className="form-select bg-dark text-white border-secondary"
                                                    id="gradEnd"
                                                    value={formData.graduation.endYear}
                                                    onChange={(e) => handleNestedChange("graduation", "endYear", e.target.value)}
                                                    required
                                                    suppressHydrationWarning
                                                >
                                                    <option value="">Year</option>
                                                    {formData.graduation.startYear &&
                                                        getYears(MAX_YEAR).filter(y => y >= formData.graduation.startYear)
                                                            .map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* POST GRADUATION */}
                                <div className="mb-4 pb-3 border-bottom border-secondary">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="hasPostGrad"
                                            checked={formData.hasPostGraduation}
                                            onChange={(e) => setFormData(p => ({ ...p, hasPostGraduation: e.target.checked }))}
                                            suppressHydrationWarning
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="hasPostGrad">
                                            I have Post Graduation
                                        </label>
                                    </div>

                                    {formData.hasPostGraduation && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="pgCourse" className="form-label fw-semibold">
                                                    Course/Degree
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    id="pgCourse"
                                                    value={formData.postGraduation.course}
                                                    onChange={(e) => handleNestedChange("postGraduation", "course", e.target.value)}
                                                    placeholder="Master of Science in Data Science"
                                                    suppressHydrationWarning
                                                />
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="pgStart" className="form-label fw-semibold">
                                                        Start Date
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="pgStartMonth"
                                                            value={formData.postGraduation.startMonth || ""}
                                                            onChange={(e) => handleNestedChange("postGraduation", "startMonth", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Month</option>
                                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="pgStart"
                                                            value={formData.postGraduation.startYear}
                                                            onChange={(e) => handleNestedChange("postGraduation", "startYear", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Year</option>
                                                            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="pgEnd" className="form-label fw-semibold">
                                                        End Date
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="pgEndMonth"
                                                            value={formData.postGraduation.endMonth || ""}
                                                            onChange={(e) => handleNestedChange("postGraduation", "endMonth", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Month</option>
                                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="pgEnd"
                                                            value={formData.postGraduation.endYear}
                                                            onChange={(e) => handleNestedChange("postGraduation", "endYear", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Year</option>
                                                            {formData.postGraduation.startYear &&
                                                                getYears(MAX_YEAR).filter(y => y >= formData.postGraduation.startYear)
                                                                    .map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* PHD */}
                                <div className="mb-4 pb-3 border-bottom border-secondary">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="hasPhd"
                                            checked={formData.hasPhd}
                                            onChange={(e) => setFormData(p => ({ ...p, hasPhd: e.target.checked }))}
                                            suppressHydrationWarning
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="hasPhd">
                                            I have PhD
                                        </label>
                                    </div>

                                    {formData.hasPhd && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="phdCourse" className="form-label fw-semibold">
                                                    Field of Study
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    id="phdCourse"
                                                    value={formData.phd.course}
                                                    onChange={(e) => handleNestedChange("phd", "course", e.target.value)}
                                                    placeholder="Computer Science / Machine Learning"
                                                    suppressHydrationWarning
                                                />
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="phdStart" className="form-label fw-semibold">
                                                        Start Date
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="phdStartMonth"
                                                            value={formData.phd.startMonth || ""}
                                                            onChange={(e) => handleNestedChange("phd", "startMonth", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Month</option>
                                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="phdStart"
                                                            value={formData.phd.startYear}
                                                            onChange={(e) => handleNestedChange("phd", "startYear", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Year</option>
                                                            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="phdEnd" className="form-label fw-semibold">
                                                        End Date
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="phdEndMonth"
                                                            value={formData.phd.endMonth || ""}
                                                            onChange={(e) => handleNestedChange("phd", "endMonth", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Month</option>
                                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="phdEnd"
                                                            value={formData.phd.endYear}
                                                            onChange={(e) => handleNestedChange("phd", "endYear", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Year</option>
                                                            {formData.phd.startYear &&
                                                                getYears(MAX_YEAR).filter(y => y >= formData.phd.startYear)
                                                                    .map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* INTERNSHIP */}
                                <div className="mb-4 pb-3 border-bottom border-secondary">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="hasInternship"
                                            checked={formData.hasInternship}
                                            onChange={(e) => setFormData(p => ({ ...p, hasInternship: e.target.checked }))}
                                            suppressHydrationWarning
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="hasInternship">
                                            I have Internship experience
                                        </label>
                                    </div>

                                    {formData.hasInternship && (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="internshipField" className="form-label fw-semibold">
                                                    Field of Internship
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    id="internshipField"
                                                    value={formData.internship.field}
                                                    onChange={(e) => handleNestedChange("internship", "field", e.target.value)}
                                                    placeholder="Frontend Web Developer / Marketing Intern"
                                                    suppressHydrationWarning
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="internshipCompany" className="form-label fw-semibold">
                                                    Company Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-secondary"
                                                    id="internshipCompany"
                                                    value={formData.internship.company}
                                                    onChange={(e) => handleNestedChange("internship", "company", e.target.value)}
                                                    placeholder="Google / Tech StartUp"
                                                    suppressHydrationWarning
                                                />
                                            </div>

                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="internshipOngoing"
                                                    checked={formData.internship.ongoing}
                                                    onChange={(e) => handleNestedChange("internship", "ongoing", e.target.checked)}
                                                    suppressHydrationWarning
                                                />
                                                <label className="form-check-label text-white-50" htmlFor="internshipOngoing">
                                                    Ongoing Internship
                                                </label>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="internshipStart" className="form-label fw-semibold">
                                                        Start Date
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="internshipStartMonth"
                                                            value={formData.internship.startMonth || ""}
                                                            onChange={(e) => handleNestedChange("internship", "startMonth", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Month</option>
                                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="internshipStart"
                                                            value={formData.internship.startYear}
                                                            onChange={(e) => handleNestedChange("internship", "startYear", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Year</option>
                                                            {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                {!formData.internship.ongoing && (
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="internshipEnd" className="form-label fw-semibold">
                                                            End Date
                                                        </label>
                                                        <div className="d-flex gap-2">
                                                            <select
                                                                className="form-select bg-dark text-white border-secondary"
                                                                id="internshipEndMonth"
                                                                value={formData.internship.endMonth || ""}
                                                                onChange={(e) => handleNestedChange("internship", "endMonth", e.target.value)}
                                                                suppressHydrationWarning
                                                            >
                                                                <option value="">Month</option>
                                                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                            </select>
                                                            <select
                                                                className="form-select bg-dark text-white border-secondary"
                                                                id="internshipEnd"
                                                                value={formData.internship.endYear}
                                                                onChange={(e) => handleNestedChange("internship", "endYear", e.target.value)}
                                                                suppressHydrationWarning
                                                            >
                                                                <option value="">Year</option>
                                                                {formData.internship.startYear &&
                                                                    getYears(MAX_YEAR).filter(y => y >= formData.internship.startYear)
                                                                        .map(y => <option key={y} value={y}>{y}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* PROJECTS */}
                                <div className="mb-4">
                                    <label htmlFor="projects" className="form-label fw-semibold">
                                        Projects
                                    </label>
                                    <textarea
                                        className="form-control bg-dark text-white border-secondary"
                                        id="projects"
                                        name="projects"
                                        value={formData.projects}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="E-commerce Platform&#10;- Built a full-stack application using React and Node.js&#10;- Implemented payment gateway integration"
                                        suppressHydrationWarning
                                    ></textarea>
                                </div>

                                {/* ACHIEVEMENTS / CERTIFICATIONS */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Achievements / Certifications (Optional)
                                    </label>
                                    <textarea
                                        name="achievements"
                                        rows="4"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="• AWS Certified Developer
• Google Data Analytics Certificate
• Employee of the Month"
                                        value={formData.achievements}
                                        onChange={handleChange}
                                        suppressHydrationWarning
                                    />
                                </div>


                                {/* JOB EXPERIENCE */}
                                <div className="mb-4 pb-3 border-bottom border-secondary">
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="hasExperience"
                                            checked={formData.hasExperience}
                                            onChange={(e) => setFormData(p => ({ ...p, hasExperience: e.target.checked }))}
                                            suppressHydrationWarning
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="hasExperience">
                                            I have Job experience
                                        </label>
                                    </div>

                                    {formData.hasExperience && (
                                        <>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="expCompany" className="form-label fw-semibold">
                                                        Company Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-dark text-white border-secondary"
                                                        id="expCompany"
                                                        value={formData.experience.company || ""}
                                                        onChange={(e) => handleNestedChange("experience", "company", e.target.value)}
                                                        placeholder="Google LLC"
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="expLocation" className="form-label fw-semibold">
                                                        City & State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-dark text-white border-secondary"
                                                        id="expLocation"
                                                        value={formData.experience.location || ""}
                                                        onChange={(e) => handleNestedChange("experience", "location", e.target.value)}
                                                        placeholder="San Francisco, CA"
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="expRole" className="form-label fw-semibold">
                                                        Position / Role
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-dark text-white border-secondary"
                                                        id="expRole"
                                                        value={formData.experience.role || ""}
                                                        onChange={(e) => handleNestedChange("experience", "role", e.target.value)}
                                                        placeholder="Senior Software Engineer"
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="expSalary" className="form-label fw-semibold">
                                                        Salary per Annum
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-dark text-white border-secondary"
                                                        id="expSalary"
                                                        value={formData.experience.salary || ""}
                                                        onChange={(e) => handleNestedChange("experience", "salary", e.target.value)}
                                                        placeholder="e.g. $120,000 / 12 LPA"
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="expOngoing"
                                                    checked={formData.experience.ongoing || false}
                                                    onChange={(e) => handleNestedChange("experience", "ongoing", e.target.checked)}
                                                    suppressHydrationWarning
                                                />
                                                <label className="form-check-label text-white-50" htmlFor="expOngoing">
                                                    Ongoing Job
                                                </label>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6 mb-3 mb-md-0">
                                                    <label htmlFor="expStart" className="form-label fw-semibold">
                                                        Start Year
                                                    </label>
                                                    <select
                                                        className="form-select bg-dark text-white border-secondary"
                                                        id="expStart"
                                                        value={formData.experience.startYear || ""}
                                                        onChange={(e) => handleNestedChange("experience", "startYear", e.target.value)}
                                                        suppressHydrationWarning
                                                    >
                                                        <option value="">Select Year</option>
                                                        {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                                {!formData.experience.ongoing && (
                                                    <div className="col-md-6">
                                                        <label htmlFor="expEnd" className="form-label fw-semibold">
                                                            End Year
                                                        </label>
                                                        <select
                                                            className="form-select bg-dark text-white border-secondary"
                                                            id="expEnd"
                                                            value={formData.experience.endYear || ""}
                                                            onChange={(e) => handleNestedChange("experience", "endYear", e.target.value)}
                                                            suppressHydrationWarning
                                                        >
                                                            <option value="">Select Year</option>
                                                            {formData.experience.startYear &&
                                                                getYears(MAX_YEAR).filter(y => y >= formData.experience.startYear)
                                                                    .map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label htmlFor="expDescription" className="form-label fw-semibold">
                                                    Responsibilities / Description
                                                </label>
                                                <textarea
                                                    className="form-control bg-dark text-white border-secondary"
                                                    id="expDescription"
                                                    value={formData.experience.description || ""}
                                                    onChange={(e) => handleNestedChange("experience", "description", e.target.value)}
                                                    rows="4"
                                                    placeholder="Describe your role and key achievements..."
                                                    suppressHydrationWarning
                                                ></textarea>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* SKILLS */}
                                <div className="mb-5">
                                    <label htmlFor="skills" className="form-label fw-semibold">
                                        Skills
                                    </label>
                                    <textarea
                                        className="form-control bg-dark text-white border-secondary"
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="JavaScript, React, Node.js, Python, SQL, MongoDB"
                                        suppressHydrationWarning
                                    ></textarea>
                                    <small className="text-white-50">Separate skills with commas</small>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-primary btn-lg px-5 py-3 fw-semibold w-100"
                                        style={{
                                            fontSize: '1.1rem',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 15px rgba(13, 110, 253, 0.4)'
                                        }}
                                        suppressHydrationWarning
                                    >
                                        Generate Resume with AI
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-black border-top border-secondary py-4 mt-5">
                <div className="container">
                    <div className="text-center text-white-50">
                        <p className="mb-0">&copy; 2026 CVGrid. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* LOADING OVERLAY */}
            {isLoading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(10, 14, 21, 0.85)",
                    backdropFilter: "blur(12px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <style>{`
                        @keyframes glow-pulse {
                            0% { transform: scale(0.95); opacity: 0.6; filter: drop-shadow(0 0 10px rgba(13, 110, 253, 0.4)); }
                            50% { transform: scale(1.05); opacity: 1; filter: drop-shadow(0 0 25px rgba(13, 110, 253, 0.8)); }
                            100% { transform: scale(0.95); opacity: 0.6; filter: drop-shadow(0 0 10px rgba(13, 110, 253, 0.4)); }
                        }
                        @keyframes spin-slow {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                    <div className="card text-center p-5 text-white animate-fade-in" style={{
                        maxWidth: "500px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "24px",
                        border: "1px solid rgba(13, 110, 253, 0.25)",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)"
                    }}>
                        <div className="card-body py-4">
                            <div className="mb-4 d-flex justify-content-center align-items-center position-relative" style={{ height: "120px" }}>
                                {/* Outer rotating dashed border spinner */}
                                <div style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    border: "2px dashed rgba(13, 110, 253, 0.4)",
                                    borderTopColor: "#0d6efd",
                                    animation: "spin-slow 6s linear infinite"
                                }}></div>
                                {/* Inner pulsing AI magic wand icon */}
                                <div className="position-absolute d-flex align-items-center justify-content-center">
                                    <i className="fas fa-wand-magic-sparkles text-primary" style={{
                                        fontSize: "3rem",
                                        animation: "glow-pulse 2s infinite ease-in-out"
                                    }}></i>
                                </div>
                            </div>
                            <h3 className="fw-bold mb-3" style={{ letterSpacing: "-0.01em" }}>Crafting Your Resume</h3>
                            <p className="text-white-50 mb-4 px-3" style={{ fontSize: "1.05rem", minHeight: "48px", transition: "all 0.3s ease" }}>
                                {LOADING_MESSAGES[currentMessageIndex]}
                            </p>
                            <div className="d-flex align-items-center justify-content-center gap-2 text-primary fw-semibold" style={{ fontSize: "0.9rem" }}>
                                <i className="fas fa-circle-notch fa-spin"></i>
                                <span>AI engine is generating content...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SAVE NAME MODAL */}
            {showSaveModal && (
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
                        maxWidth: "450px",
                        width: "90%",
                        background: "linear-gradient(145deg, #1c2027 0%, #11141a 100%)",
                        borderRadius: "20px",
                        border: "1px solid rgba(142, 144, 160, 0.25)",
                        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)"
                    }}>
                        <div className="card-body p-0">
                            <h3 className="fw-bold mb-3">Name Your Resume</h3>
                            <p className="text-white-50 mb-4" style={{ fontSize: "0.95rem" }}>
                                Give this resume a name to save it to your dashboard.
                            </p>
                            <input
                                type="text"
                                id="resume-name-input"
                                className="form-control form-control-lg bg-dark text-white border-secondary mb-4"
                                placeholder="e.g. Fullstack Developer Resume"
                                defaultValue={resumeName}
                            />
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    onClick={() => setShowSaveModal(false)}
                                    className="btn btn-outline-light px-4 py-2"
                                    style={{ borderRadius: "8px" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const val = document.getElementById("resume-name-input").value;
                                        handleCreateCloudSave(val);
                                    }}
                                    className="btn btn-primary px-4 py-2"
                                    style={{ borderRadius: "8px" }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
