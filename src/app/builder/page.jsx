"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getRecaptchaToken } from "../../utils/recaptcha";
import { subscribeToAuthChanges } from "../../authState";
import { showToast } from "../../utils/toast";

/* ================= PARSE / SERIALIZE HELPERS ================= */
const parseProjectsText = (text) => {
    if (!text) return [];
    const lines = text.split("\n");
    const list = [];
    let currentProj = null;
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
            if (currentProj) {
                currentProj.description += (currentProj.description ? "\n" : "") + trimmed;
            }
        } else {
            if (currentProj) list.push(currentProj);
            currentProj = { title: trimmed, description: "" };
        }
    }
    if (currentProj) list.push(currentProj);
    return list;
};

const serializeProjectsList = (list) => {
    return list.map(p => {
        const title = p.title.trim();
        const desc = p.description.trim().split("\n").map(line => {
            const l = line.trim();
            if (!l) return "";
            if (l.startsWith("-") || l.startsWith("•") || l.startsWith("*")) return l;
            return `- ${l}`;
        }).filter(Boolean).join("\n");
        return `${title}\n${desc}`;
    }).filter(Boolean).join("\n\n");
};

const parseAchievementsText = (text) => {
    if (!text) return [];
    return text.split("\n").map(l => l.trim().replace(/^[•\-\*\s]+/, "")).filter(Boolean);
};

const serializeAchievementsList = (list) => {
    return list.map(item => {
        const cleaned = item.trim();
        if (!cleaned) return "";
        return `• ${cleaned}`;
    }).filter(Boolean).join("\n");
};

const parseSkillsText = (text) => {
    if (!text) return [];
    return text.split(",").map(s => s.trim()).filter(Boolean);
};

const serializeSkillsList = (list) => {
    return list.join(", ");
};

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
        "Polishing content phrasing with our AI writer...",
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

    /* ================= TAGS & LISTS STATE BUFFERS ================= */
    const POPULAR_SKILLS = [
        "React.js", "Next.js", "JavaScript", "HTML5/CSS3", "Python", "Java", 
        "Node.js", "Express.js", "MongoDB", "SQL", "PostgreSQL", "Git & GitHub", 
        "Docker", "REST APIs", "TypeScript", "AWS", "Machine Learning", "C++",
        "TailwindCSS", "Redux", "GraphQL", "Figma"
    ];
    const [skillsList, setSkillsList] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [projectsList, setProjectsList] = useState([]);
    const [achievementsList, setAchievementsList] = useState([]);

    // Keep buffers in sync with formData loaded from DB/sessionStorage
    useEffect(() => {
        if (formData.projects !== undefined) {
            if (serializeProjectsList(projectsList) !== formData.projects) {
                const parsed = parseProjectsText(formData.projects);
                setProjectsList(parsed);
            }
        }
    }, [formData.projects, projectsList]);

    useEffect(() => {
        if (formData.achievements !== undefined) {
            if (serializeAchievementsList(achievementsList) !== formData.achievements) {
                const parsed = parseAchievementsText(formData.achievements);
                setAchievementsList(parsed);
            }
        }
    }, [formData.achievements, achievementsList]);

    useEffect(() => {
        if (formData.skills !== undefined) {
            if (serializeSkillsList(skillsList) !== formData.skills) {
                const parsed = parseSkillsText(formData.skills);
                setSkillsList(parsed);
            }
        }
    }, [formData.skills, skillsList]);

    /* ================= STATE CONTROLS ================= */
    const handleAddSkill = (skill) => {
        const cleaned = skill.trim();
        if (!cleaned) return;
        if (skillsList.includes(cleaned)) {
            setSkillInput("");
            return;
        }
        const updated = [...skillsList, cleaned];
        setSkillsList(updated);
        setSkillInput("");
        
        const serialized = updated.join(", ");
        setFormData(prev => {
            const upd = { ...prev, skills: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleRemoveSkill = (skill) => {
        const updated = skillsList.filter(s => s !== skill);
        setSkillsList(updated);
        
        const serialized = updated.join(", ");
        setFormData(prev => {
            const upd = { ...prev, skills: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleAddProject = () => {
        const updated = [...projectsList, { title: "", description: "" }];
        setProjectsList(updated);
        
        const serialized = serializeProjectsList(updated);
        setFormData(prev => {
            const upd = { ...prev, projects: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleUpdateProject = (index, field, value) => {
        const updated = [...projectsList];
        updated[index] = { ...updated[index], [field]: value };
        setProjectsList(updated);
        
        const serialized = serializeProjectsList(updated);
        setFormData(prev => {
            const upd = { ...prev, projects: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleRemoveProject = (index) => {
        const updated = projectsList.filter((_, idx) => idx !== index);
        setProjectsList(updated);
        
        const serialized = serializeProjectsList(updated);
        setFormData(prev => {
            const upd = { ...prev, projects: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleAddAchievement = () => {
        const updated = [...achievementsList, ""];
        setAchievementsList(updated);
        
        const serialized = serializeAchievementsList(updated);
        setFormData(prev => {
            const upd = { ...prev, achievements: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleUpdateAchievement = (index, value) => {
        const updated = [...achievementsList];
        updated[index] = value;
        setAchievementsList(updated);
        
        const serialized = serializeAchievementsList(updated);
        setFormData(prev => {
            const upd = { ...prev, achievements: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

    const handleRemoveAchievement = (index) => {
        const updated = achievementsList.filter((_, idx) => idx !== index);
        setAchievementsList(updated);
        
        const serialized = serializeAchievementsList(updated);
        setFormData(prev => {
            const upd = { ...prev, achievements: serialized };
            sessionStorage.setItem("resumeData", JSON.stringify(upd));
            return upd;
        });
    };

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

    const handleRemovePhoto = () => {
        setFormData(prev => {
            const updated = { ...prev, profilePhoto: "" };
            sessionStorage.setItem("resumeData", JSON.stringify(updated));
            return updated;
        });

        // Clear the file input in the DOM
        const fileInput = document.querySelector('input[type="file"][accept="image/*"]');
        if (fileInput) {
            fileInput.value = "";
        }

        // Also remove photo from Neon Postgres if logged in
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user && user.email) {
                try {
                    await fetch("/api/user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email, photoUrl: "" })
                    });
                } catch (err) {
                    console.error("Failed to delete photo from Postgres:", err);
                }
            }
        });
        if (typeof unsubscribe === "function") unsubscribe();
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
                try {
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
                        console.error("Cloud auto-save failed on submit");
                    }
                } catch (err) {
                    console.error("Cloud auto-save error on submit:", err);
                }
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
                console.error("❌ AI API response was not OK:", errData);
                throw new Error(errData.error || "AI generation failed");
            }

            console.log("✅ AI API response succeeded:", res.status);
            const data = await res.json();
            console.log("📄 AI Generated data result size:", data.result?.length || 0);

            sessionStorage.setItem("aiOutput", data.result);
            console.log("➡️ Navigating to /preview via window.location.href");
            window.location.href = resumeId ? `/preview?id=${resumeId}` : "/preview";

        } catch (err) {
            console.error("🔥 handleSubmit caught error:", err);
            showToast(err.message || "AI generation failed. Please try again.", "error");
        } finally {
            setIsLoading(false);
            console.log("🏁 AI generation process finished.");
        }
    };

    /* ================= UI ================= */
    return (
        <div className="builder-page-container text-white min-vh-100 position-relative">
            {/* Background Spotlights */}
            <div className="bg-glow-spot-1" aria-hidden="true"></div>
            <div className="bg-glow-spot-2" aria-hidden="true"></div>

            <Navbar />

            <div className="container-fluid px-md-5 py-4 position-relative" style={{ zIndex: 5 }}>
                <div className="row justify-content-center">
                    <div className="col-xl-11 col-xxl-10">
                        <div className="glass-panel-custom p-4 p-md-5">
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
                            <div className="builder-import-zone mb-5">
                                <div className="text-center">
                                    <div className="import-icon-container mb-3 mx-auto">
                                        <i className="fas fa-file-invoice text-indigo" style={{ fontSize: "2rem" }}></i>
                                    </div>
                                    <h3 className="h5 fw-bold mb-2 text-white">Import from Existing Resume</h3>
                                    <p className="text-white-50 small mb-4 px-3" style={{ maxWidth: "450px", margin: "0 auto" }}>
                                        Upload your PDF resume, and our AI will pre-fill the form fields below.
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
                                            className={`btn-upload-premium ${isImporting ? 'disabled' : ''} px-4 py-2 fw-semibold d-flex align-items-center gap-2`}
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
                                        <div className="mt-3 d-flex align-items-center gap-3">
                                            <div style={{ position: "relative", display: "inline-block" }}>
                                                <img
                                                    src={formData.profilePhoto}
                                                    alt="Profile Preview"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        objectFit: "cover",
                                                        borderRadius: "50%",
                                                        border: "3px solid #0d6efd",
                                                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        position: "absolute",
                                                        top: "-5px",
                                                        right: "-5px",
                                                        width: "28px",
                                                        height: "28px",
                                                        padding: "0",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        border: "2px solid #212529",
                                                        boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                                                        cursor: "pointer",
                                                        zIndex: 5
                                                    }}
                                                    title="Remove Photo"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm fw-semibold px-3"
                                                onClick={handleRemovePhoto}
                                            >
                                                Remove Photo
                                            </button>
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
                                    <label className="form-label fw-semibold text-white d-flex justify-content-between align-items-center">
                                        <span>Projects</span>
                                        <button
                                            type="button"
                                            onClick={handleAddProject}
                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                            style={{ borderRadius: "6px" }}
                                            suppressHydrationWarning
                                        >
                                            + Add Project
                                        </button>
                                    </label>

                                    {projectsList.length === 0 ? (
                                        <div className="text-center py-4 bg-dark border-secondary mb-3" style={{ borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                                            <p className="text-white-50 small mb-0">No projects added yet. Click "+ Add Project" to showcase your work.</p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3 mb-3">
                                            {projectsList.map((proj, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="builder-project-card position-relative mb-3 animate-fade-in"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveProject(idx)}
                                                        className="position-absolute btn-remove-item"
                                                        style={{ top: "16px", right: "16px" }}
                                                        title="Remove Project"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>

                                                    <div className="row g-3">
                                                        <div className="col-12 col-md-10">
                                                            <label className="form-label small text-white-50 fw-semibold">Project Name / Title</label>
                                                            <input
                                                                type="text"
                                                                className="form-control bg-black text-white border-secondary"
                                                                placeholder="e.g. SoundWave E-Commerce Website"
                                                                value={proj.title}
                                                                onChange={(e) => handleUpdateProject(idx, "title", e.target.value)}
                                                                style={{ borderRadius: "8px", height: "38px" }}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label small text-white-50 fw-semibold d-flex justify-content-between">
                                                                <span>Project Details / Responsibilities</span>
                                                                <span className="text-muted small">One point per line</span>
                                                            </label>
                                                            <textarea
                                                                className="form-control bg-black text-white border-secondary"
                                                                rows="3"
                                                                placeholder="- Built a fully responsive online store with modern UI&#10;- Implemented secure checkout flow"
                                                                value={proj.description}
                                                                onChange={(e) => handleUpdateProject(idx, "description", e.target.value)}
                                                                style={{ borderRadius: "8px", fontSize: "0.9rem" }}
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ACHIEVEMENTS / CERTIFICATIONS */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-white d-flex justify-content-between align-items-center">
                                        <span>Achievements / Certifications (Optional)</span>
                                        <button
                                            type="button"
                                            onClick={handleAddAchievement}
                                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                                            style={{ borderRadius: "6px" }}
                                            suppressHydrationWarning
                                        >
                                            + Add Achievement
                                        </button>
                                    </label>

                                    {achievementsList.length === 0 ? (
                                        <div className="text-center py-4 bg-dark border-secondary mb-3" style={{ borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                                            <p className="text-white-50 small mb-0">No achievements added yet. Click "+ Add Achievement".</p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-2 mb-3">
                                            {achievementsList.map((ach, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="builder-achievement-item animate-fade-in"
                                                >
                                                    <input
                                                        type="text"
                                                        className="form-control bg-black text-white border-secondary flex-grow-1"
                                                        placeholder="e.g. AWS Certified Developer"
                                                        value={ach}
                                                        onChange={(e) => handleUpdateAchievement(idx, e.target.value)}
                                                        style={{ borderRadius: "8px", height: "38px" }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAchievement(idx)}
                                                        className="btn btn-remove-item p-2 d-flex align-items-center justify-content-center"
                                                        style={{ width: "38px", height: "38px" }}
                                                        title="Remove Achievement"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* SKILLS */}
                                <div className="mb-5">
                                    <label className="form-label fw-semibold text-white d-flex justify-content-between align-items-center">
                                        <span>Skills</span>
                                        <span className="text-white-50 small">Add relevant skills</span>
                                    </label>
                                    
                                    {/* Active Skills Pills */}
                                    <div className="d-flex flex-wrap gap-2 mb-3 p-3 bg-dark border-secondary" style={{ borderRadius: "12px", minHeight: "60px", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        {skillsList.length === 0 ? (
                                            <span className="text-white-50 small my-auto">No skills added yet. Click suggestions below or type your own.</span>
                                        ) : (
                                            skillsList.map((skill, index) => (
                                                <span 
                                                    key={index} 
                                                    className="badge text-white d-flex align-items-center gap-1.5 px-3 py-2 animate-fade-in"
                                                    style={{ borderRadius: "20px", fontSize: "0.9rem", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)" }}
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="border-0 bg-transparent text-white-50 p-0"
                                                        style={{ fontSize: "0.9rem", lineHeight: 1, cursor: "pointer" }}
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))
                                        )}
                                    </div>

                                    {/* Skill input field */}
                                    <div className="d-flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            className="form-control bg-black text-white border-secondary"
                                            placeholder="Type a skill (e.g. Docker) and press Enter"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddSkill(skillInput);
                                                }
                                            }}
                                            style={{ borderRadius: "8px", height: "42px" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddSkill(skillInput)}
                                            className="btn btn-primary px-4"
                                            style={{ borderRadius: "8px" }}
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Suggested/Popular Skills */}
                                    <div className="mb-2">
                                        <small className="text-white-50 d-block mb-2 fw-semibold">Popular Skills Suggestions:</small>
                                        <div className="d-flex flex-wrap gap-1.5">
                                            {POPULAR_SKILLS.filter(s => !skillsList.includes(s)).slice(0, 12).map(skill => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => handleAddSkill(skill)}
                                                    className="btn btn-sm px-2.5 py-1"
                                                    style={{
                                                        background: "rgba(255, 255, 255, 0.03)",
                                                        border: "1px solid rgba(255, 255, 255, 0.06)",
                                                        color: "rgba(255, 255, 255, 0.65)",
                                                        borderRadius: "20px",
                                                        fontSize: "0.8rem",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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

            <style>{`
                .builder-page-container {
                    background: radial-gradient(circle at top, #111424 0%, #06070c 100%);
                    position: relative;
                    overflow-x: hidden;
                }
                .bg-glow-spot-1 {
                    position: absolute;
                    top: -10%;
                    left: -5%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .bg-glow-spot-2 {
                    position: absolute;
                    bottom: 5%;
                    right: -5%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, rgba(6, 182, 212, 0) 70%);
                    z-index: 1;
                    pointer-events: none;
                }
                .glass-panel-custom {
                    background: rgba(15, 18, 32, 0.65);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(16px);
                    border-radius: 24px;
                    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
                    z-index: 2;
                }
                .glass-panel-custom .form-control,
                .glass-panel-custom .form-select {
                    background-color: rgba(11, 13, 23, 0.85) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    color: #fff !important;
                    transition: all 0.2s ease !important;
                }
                .glass-panel-custom .form-control:focus,
                .glass-panel-custom .form-select:focus {
                    border-color: rgba(99, 102, 241, 0.5) !important;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.25) !important;
                    background-color: rgba(11, 13, 23, 0.95) !important;
                }
                
                /* Project Cards */
                .builder-project-card {
                    background: rgba(15, 18, 32, 0.45) !important;
                    border: 1px solid rgba(255, 255, 255, 0.06) !important;
                    border-left: 4px solid #6366f1 !important;
                    border-radius: 14px !important;
                    padding: 24px !important;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .builder-project-card:hover {
                    border-color: rgba(99, 102, 241, 0.3) !important;
                    background: rgba(15, 18, 32, 0.6) !important;
                    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.06);
                }
                .btn-remove-item {
                    color: rgba(255, 255, 255, 0.35) !important;
                    font-size: 1.15rem;
                    transition: all 0.2s ease;
                    background: none;
                    border: none;
                    outline: none;
                }
                .btn-remove-item:hover {
                    color: rgba(239, 68, 68, 1) !important;
                    transform: scale(1.15);
                }
                
                /* Achievements List */
                .builder-achievement-item {
                    background: rgba(15, 18, 32, 0.35) !important;
                    border: 1px solid rgba(255, 255, 255, 0.06) !important;
                    border-radius: 10px !important;
                    padding: 8px 12px !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 12px !important;
                    transition: all 0.2s ease !important;
                }
                .builder-achievement-item:hover {
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    background: rgba(15, 18, 32, 0.5) !important;
                }
                
                .btn-gradient-premium {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none;
                    color: #fff;
                    border-radius: 10px;
                    font-weight: 600;
                    padding: 14px 28px;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-gradient-premium:hover:not(:disabled) {
                    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
                    transform: translateY(-2px);
                    color: #fff;
                }
                
                /* Import Area styling */
                .builder-import-zone {
                    background: rgba(99, 102, 241, 0.03) !important;
                    border: 1px dashed rgba(99, 102, 241, 0.35) !important;
                    border-radius: 20px !important;
                    padding: 35px 24px !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    position: relative;
                    overflow: hidden;
                }
                .builder-import-zone::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 1;
                }
                .builder-import-zone:hover {
                    border-color: rgba(99, 102, 241, 0.6) !important;
                    background: rgba(99, 102, 241, 0.06) !important;
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.08) !important;
                    transform: translateY(-2px);
                }
                .import-icon-container {
                    width: 70px;
                    height: 70px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .builder-import-zone:hover .import-icon-container {
                    transform: scale(1.1) rotate(5deg);
                    background: rgba(99, 102, 241, 0.15);
                    border-color: rgba(99, 102, 241, 0.35);
                }
                .text-indigo {
                    color: #818cf8 !important;
                }
                
                .btn-upload-premium {
                    background: rgba(99, 102, 241, 0.1) !important;
                    border: 1px solid rgba(99, 102, 241, 0.4) !important;
                    color: #fff !important;
                    border-radius: 12px !important;
                    font-weight: 600 !important;
                    transition: all 0.2s ease !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                }
                .btn-upload-premium:hover:not(.disabled) {
                    background: rgba(99, 102, 241, 0.25) !important;
                    border-color: rgba(99, 102, 241, 0.7) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2) !important;
                }
                .btn-upload-premium.disabled {
                    opacity: 0.6 !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
            `}</style>
        </div>
    );
}
