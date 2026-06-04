"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getRecaptchaToken } from "../../utils/recaptcha";
import { subscribeToAuthChanges } from "../../authState";

export default function ResumeBuilder() {
    const router = useRouter();

    /* ================= YEARS ================= */
    const MAX_YEAR = 2028;
    const MIN_YEAR = 1980;

    const getYears = (startFrom = MAX_YEAR) =>
        Array.from(
            { length: startFrom - MIN_YEAR + 1 },
            (_, i) => startFrom - i
        );

    /* ================= STATE ================= */
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
            startYear: "",
            endYear: ""
        },

        hasPostGraduation: false,
        postGraduation: {
            course: "",
            startYear: "",
            endYear: ""
        },

        hasPhd: false,
        phd: {
            course: "",
            startYear: "",
            endYear: ""
        },

        projects: "",
        achievements: "",

        experience: "",
        skills: ""
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem("resumeData");
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }

        let activeEmail = null;
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            if (user && user.email) {
                activeEmail = user.email;
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
            }
        });

        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);


    /* ================= HANDLERS ================= */
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

        try {
            const recaptchaToken = await getRecaptchaToken("GENERATE_RESUME").catch(() => "MOCK_TOKEN");

            // Save complete data
            sessionStorage.setItem("resumeData", JSON.stringify(formData));

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
Graduation: ${formData.graduation.course}
(${formData.graduation.startYear} - ${formData.graduation.endYear})

Post Graduation:
${formData.hasPostGraduation
                    ? `${formData.postGraduation.course} (${formData.postGraduation.startYear} - ${formData.postGraduation.endYear})`
                    : "Not Applicable"}

PhD:
${formData.hasPhd
                    ? `${formData.phd.course} (${formData.phd.startYear} - ${formData.phd.endYear})`
                    : "Not Applicable"}

Projects:
${formData.projects || "Not provided"}

Experience:
${formData.experience || "Not provided"}

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
            alert(err.message || "AI generation failed. Please try again.");
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
                            <h1 className="display-5 fw-bold mb-4 text-center">
                                Build Your Resume
                            </h1>
                            <p className="text-white-50 text-center mb-5">
                                Fill in your details and let AI craft your professional resume
                            </p>

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
                                                Start Year
                                            </label>
                                            <select
                                                className="form-select bg-dark text-white border-secondary"
                                                id="gradStart"
                                                value={formData.graduation.startYear}
                                                onChange={(e) => handleNestedChange("graduation", "startYear", e.target.value)}
                                                required
                                                suppressHydrationWarning
                                            >
                                                <option value="">Select Year</option>
                                                {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="gradEnd" className="form-label fw-semibold">
                                                End Year
                                            </label>
                                            <select
                                                className="form-select bg-dark text-white border-secondary"
                                                id="gradEnd"
                                                value={formData.graduation.endYear}
                                                onChange={(e) => handleNestedChange("graduation", "endYear", e.target.value)}
                                                required
                                                suppressHydrationWarning
                                            >
                                                <option value="">Select Year</option>
                                                {formData.graduation.startYear &&
                                                    getYears(MAX_YEAR).filter(y => y > formData.graduation.startYear)
                                                        .map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
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
                                                        Start Year
                                                    </label>
                                                    <select
                                                        className="form-select bg-dark text-white border-secondary"
                                                        id="pgStart"
                                                        value={formData.postGraduation.startYear}
                                                        onChange={(e) => handleNestedChange("postGraduation", "startYear", e.target.value)}
                                                        suppressHydrationWarning
                                                    >
                                                        <option value="">Select Year</option>
                                                        {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="pgEnd" className="form-label fw-semibold">
                                                        End Year
                                                    </label>
                                                    <select
                                                        className="form-select bg-dark text-white border-secondary"
                                                        id="pgEnd"
                                                        value={formData.postGraduation.endYear}
                                                        onChange={(e) => handleNestedChange("postGraduation", "endYear", e.target.value)}
                                                        suppressHydrationWarning
                                                    >
                                                        <option value="">Select Year</option>
                                                        {formData.postGraduation.startYear &&
                                                            getYears(MAX_YEAR).filter(y => y > formData.postGraduation.startYear)
                                                                .map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
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
                                                        Start Year
                                                    </label>
                                                    <select
                                                        className="form-select bg-dark text-white border-secondary"
                                                        id="phdStart"
                                                        value={formData.phd.startYear}
                                                        onChange={(e) => handleNestedChange("phd", "startYear", e.target.value)}
                                                        suppressHydrationWarning
                                                    >
                                                        <option value="">Select Year</option>
                                                        {getYears().map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="phdEnd" className="form-label fw-semibold">
                                                        End Year
                                                    </label>
                                                    <select
                                                        className="form-select bg-dark text-white border-secondary"
                                                        id="phdEnd"
                                                        value={formData.phd.endYear}
                                                        onChange={(e) => handleNestedChange("phd", "endYear", e.target.value)}
                                                        suppressHydrationWarning
                                                    >
                                                        <option value="">Select Year</option>
                                                        {formData.phd.startYear &&
                                                            getYears(MAX_YEAR).filter(y => y > formData.phd.startYear)
                                                                .map(y => <option key={y} value={y}>{y}</option>)}
                                                    </select>
                                                </div>
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


                                {/* EXPERIENCE */}
                                <div className="mb-4">
                                    <label htmlFor="experience" className="form-label fw-semibold">
                                        Experience
                                    </label>
                                    <textarea
                                        className="form-control bg-dark text-white border-secondary"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Software Engineer - Company Name&#10;Jan 2024 - Present&#10;- Developed web applications using React and Node.js&#10;- Collaborated with cross-functional teams"
                                        suppressHydrationWarning
                                    ></textarea>
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
                        <p className="mb-0">&copy; 2024 ResumeCraft AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
