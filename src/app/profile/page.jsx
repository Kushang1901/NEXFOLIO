"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../../authState";
import { auth } from "../../firebase";
import { deleteUser, signOut } from "firebase/auth";
import Link from "next/link";
import { showToast } from "../../utils/toast";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState("");
    const [saveError, setSaveError] = useState("");

    // Form inputs
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        photoUrl: "",
    });

    // Subscribed state
    const [dbUser, setDbUser] = useState(null);

    // Resumes state
    const [resumes, setResumes] = useState([]);
    const [loadingResumes, setLoadingResumes] = useState(true);

    const fetchUserResumes = async (userEmail) => {
        try {
            setLoadingResumes(true);
            const response = await fetch(`/api/resumes?email=${encodeURIComponent(userEmail)}`);
            if (response.ok) {
                const data = await response.json();
                setResumes(data);
            }
        } catch (err) {
            console.error("Error fetching user resumes:", err);
        } finally {
            setLoadingResumes(false);
        }
    };

    const handleLoadResume = (id) => {
        router.push(`/builder?id=${id}`);
    };

    const handlePreviewResume = async (id) => {
        try {
            setActionLoading(true);
            const res = await fetch(`/api/resumes?email=${encodeURIComponent(user.email)}&id=${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.resumeData) {
                    sessionStorage.setItem("resumeData", JSON.stringify(data.resumeData));
                }
                if (data.selectedTemplate) {
                    sessionStorage.setItem("selectedTemplate", data.selectedTemplate);
                }
                sessionStorage.setItem("resumeId", id);
                sessionStorage.setItem("aiOutput", ""); // Reset AI output to let preview page fetch/generate
                router.push("/preview");
            } else {
                showToast("Failed to load resume details.", "error");
            }
        } catch (err) {
            console.error("Error loading resume preview:", err);
            showToast("Error loading resume preview.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteResume = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this resume? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            setActionLoading(true);
            const response = await fetch(`/api/resumes?email=${encodeURIComponent(user.email)}&id=${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                showToast("Resume deleted successfully!", "success");
                await fetchUserResumes(user.email);
            } else {
                showToast("Failed to delete resume.", "error");
            }
        } catch (err) {
            console.error("Delete resume error:", err);
            showToast("An error occurred while deleting the resume.", "error");
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (loggedUser) => {
            if (loggedUser) {
                setUser(loggedUser);
                // Fetch details from PostgreSQL
                try {
                    const response = await fetch(`/api/user?email=${encodeURIComponent(loggedUser.email)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setDbUser(data);
                        setFormData({
                            firstName: data.firstName || loggedUser.displayName?.split(" ")[0] || "",
                            lastName: data.lastName || loggedUser.displayName?.split(" ").slice(1).join(" ") || "",
                            photoUrl: data.photoUrl || loggedUser.photoURL || "",
                        });
                    } else {
                        // Fallback settings if not in DB yet
                        setFormData({
                            firstName: loggedUser.displayName?.split(" ")[0] || "",
                            lastName: loggedUser.displayName?.split(" ").slice(1).join(" ") || "",
                            photoUrl: loggedUser.photoURL || "",
                        });
                    }
                } catch (err) {
                    console.error("Error fetching database user:", err);
                }

                // Fetch resumes
                await fetchUserResumes(loggedUser.email);

                setLoading(false);
            } else {
                setUser(null);
                setDbUser(null);
                setLoading(false);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setSaveSuccess("");
        setSaveError("");

        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    photoUrl: formData.photoUrl
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save profile changes.");
            }

            setSaveSuccess("Profile changes saved successfully! Please refresh or navigate to update all views.");
            
            // Dispatch custom event to notify Navbar and other components to update
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth-state-change"));
            }
        } catch (err) {
            console.error("Save profile error:", err);
            setSaveError(err.message || "An error occurred while saving profile changes.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = async () => {
        setActionLoading(true);
        if (typeof window !== "undefined") {
            localStorage.removeItem("mock_user");
            window.dispatchEvent(new Event("auth-state-change"));
        }
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Firebase SignOut error:", err);
        }
        setActionLoading(false);
        showToast("Logged out successfully");
        router.push("/");
    };

    const handleDeleteAccount = async () => {
        const firstConfirm = window.confirm(
            "Are you absolutely sure you want to delete your account? This will permanently erase your profile and all resumes."
        );
        if (!firstConfirm) return;

        const secondConfirm = window.confirm(
            "FINAL CONFIRMATION: This action is permanent and cannot be undone. Click OK to delete."
        );
        if (!secondConfirm) return;

        setActionLoading(true);
        try {
            const userEmail = user?.email;

            // 1. Delete from DB
            if (userEmail) {
                const response = await fetch(`/api/user?email=${encodeURIComponent(userEmail)}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete user record from database.");
                }
            }

            // 2. Delete from Firebase
            const firebaseUser = auth.currentUser;
            if (firebaseUser) {
                await deleteUser(firebaseUser);
            }

            // 3. Clear localStorage Mock
            if (typeof window !== "undefined") {
                localStorage.removeItem("mock_user");
                window.dispatchEvent(new Event("auth-state-change"));
            }

            setActionLoading(false);
            showToast("Account deleted successfully.");
            router.push("/signup");
        } catch (err) {
            console.error("Delete account error:", err);
            setActionLoading(false);
            if (err.code === "auth/requires-recent-login") {
                showToast("Security Action Required: Deleting your account requires a recent login. Please log out, log in again, and retry account deletion.", "error");
            } else {
                showToast(err.message || "Failed to delete account. Please try again.", "error");
            }
        }
    };

    if (loading) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <div className="spinner-border text-info mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="fs-5">Loading profile...</p>
            </div>
        );
    }

    if (!user) return null;

    const email = user.email;
    const isMock = user.uid?.startsWith("mock_user_");
    const provider = isMock ? "Mock Authentication" : (dbUser?.provider || "Email / Firebase");
    const initialLetter = (formData.firstName || email).charAt(0).toUpperCase();

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    font-family: 'Inter', sans-serif !important;
                    background-color: #0f131b !important;
                    color: #dfe2ed !important;
                }
                .glass-card {
                    background: rgba(28, 32, 39, 0.7) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(142, 144, 160, 0.2) !important;
                    border-radius: 16px;
                }
                .profile-avatar-large {
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    border: 4px solid #38bdf8;
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
                }
                .profile-avatar-large-placeholder {
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(56, 189, 248, 0.1);
                    color: #38bdf8;
                    font-size: 3.5rem;
                    font-weight: bold;
                    border: 4px solid #38bdf8;
                    border-radius: 50%;
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
                }
                .form-control-dark {
                    background-color: rgba(15, 19, 27, 0.8) !important;
                    border: 1px solid rgba(142, 144, 160, 0.3) !important;
                    color: #dfe2ed !important;
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .form-control-dark:focus {
                    border-color: #38bdf8 !important;
                    box-shadow: 0 0 8px rgba(56, 189, 248, 0.3) !important;
                    outline: none;
                    background-color: rgba(15, 19, 27, 0.9) !important;
                }
                .form-control-dark:disabled {
                    background-color: rgba(28, 32, 39, 0.5) !important;
                    border-color: rgba(142, 144, 160, 0.1) !important;
                    color: #8e90a0 !important;
                }
                .section-header-title {
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }
                .badge-provider {
                    background-color: rgba(56, 189, 248, 0.1);
                    color: #38bdf8;
                    border: 1px solid rgba(56, 189, 248, 0.2);
                    border-radius: 50px;
                    font-size: 0.8rem;
                    padding: 0.35rem 0.75rem;
                }
            ` }} />

            <Navbar />

            <main className="flex-grow-1 py-5">
                <div className="container">
                    
                    {/* Header Bar */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-5">
                        <div>
                            <button 
                                onClick={() => router.back()} 
                                className="btn btn-link text-white-50 text-decoration-none d-flex align-items-center gap-1.5 mb-2 p-0"
                            >
                                <i className="fas fa-arrow-left" style={{ fontSize: "0.95rem" }}></i>
                                Back to Previous Page
                            </button>
                            <h1 className="section-header-title mb-1 text-white">Account Settings</h1>
                            <p className="text-white-50 mb-0">Manage your profile details, visual preferences, and authentication preferences.</p>
                        </div>
                    </div>

                    <div className="row g-4">
                        
                        {/* LEFT COLUMN: Avatar & Summary Card */}
                        <div className="col-lg-4">
                            <div className="glass-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-between">
                                <div className="w-100">
                                    {/* Avatar image container */}
                                    <div className="d-flex justify-content-center mb-3">
                                        {formData.photoUrl ? (
                                            <img 
                                                src={formData.photoUrl} 
                                                alt="User Profile" 
                                                className="rounded-circle profile-avatar-large"
                                                onError={(e) => {
                                                    // Suppress broken image icons
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="profile-avatar-large-placeholder">
                                                {initialLetter}
                                            </div>
                                        )}
                                    </div>

                                    {/* Identity */}
                                    <h3 className="fw-bold mb-1">{formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : "Nexfolio Member"}</h3>
                                    <p className="text-white-50 mb-3">{email}</p>
                                    
                                    <div className="d-inline-block badge-provider mb-4">
                                        {provider}
                                    </div>
                                </div>

                                {/* Danger Zone Action Buttons */}
                                <div className="w-100 pt-4 border-top border-secondary d-flex flex-column gap-2.5">
                                    <button 
                                        onClick={handleLogout}
                                        disabled={actionLoading}
                                        className="btn btn-outline-light w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                    >
                                        <i className="fas fa-sign-out-alt" style={{ fontSize: "0.95rem" }}></i>
                                        Log Out Session
                                    </button>

                                    <button 
                                        onClick={handleDeleteAccount}
                                        disabled={actionLoading}
                                        className="btn btn-outline-danger w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                    >
                                        <i className="fas fa-trash-alt" style={{ fontSize: "0.95rem" }}></i>
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Interactive Settings Form */}
                        <div className="col-lg-8">
                            <div className="glass-card p-4 p-md-5 h-100">
                                <h3 className="fw-bold mb-4 text-white">Personal Information</h3>
                                
                                {saveSuccess && (
                                    <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                                        <i className="fas fa-check-circle" style={{ fontSize: "1.1rem" }}></i>
                                        <div>{saveSuccess}</div>
                                    </div>
                                )}

                                {saveError && (
                                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                                        <i className="fas fa-exclamation-circle" style={{ fontSize: "1.1rem" }}></i>
                                        <div>{saveError}</div>
                                    </div>
                                )}

                                <form onSubmit={handleSaveProfile} className="row g-4">
                                    
                                    {/* First Name */}
                                    <div className="col-md-6">
                                        <label className="form-label text-white-50 fw-semibold" htmlFor="firstName">First Name</label>
                                        <input 
                                            type="text" 
                                            id="firstName" 
                                            name="firstName" 
                                            className="form-control form-control-dark"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter first name"
                                            required
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div className="col-md-6">
                                        <label className="form-label text-white-50 fw-semibold" htmlFor="lastName">Last Name</label>
                                        <input 
                                            type="text" 
                                            id="lastName" 
                                            name="lastName" 
                                            className="form-control form-control-dark"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter last name"
                                            required
                                        />
                                    </div>

                                    {/* Email (Disabled) */}
                                    <div className="col-12">
                                        <label className="form-label text-white-50 fw-semibold" htmlFor="profileEmail">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="profileEmail" 
                                            className="form-control form-control-dark" 
                                            value={email} 
                                            disabled 
                                        />
                                        <div className="form-text text-muted mt-1.5" style={{ fontSize: "0.8rem" }}>
                                            Your primary login email address cannot be changed.
                                        </div>
                                    </div>

                                    {/* Profile Photo URL */}
                                    <div className="col-12">
                                        <label className="form-label text-white-50 fw-semibold" htmlFor="photoUrl">Profile Photo URL</label>
                                        <input 
                                            type="url" 
                                            id="photoUrl" 
                                            name="photoUrl" 
                                            className="form-control form-control-dark" 
                                            value={formData.photoUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/avatar.jpg" 
                                        />
                                        <div className="form-text text-muted mt-1.5" style={{ fontSize: "0.8rem" }}>
                                            Provide an image link (e.g. from Unsplash, Cloudinary, etc.) to set your custom profile avatar.
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12 pt-3">
                                        <button 
                                            type="submit" 
                                            disabled={actionLoading}
                                            className="btn btn-primary px-4 py-2.5 fw-semibold d-flex align-items-center gap-2"
                                            style={{
                                                background: "#4a72f3",
                                                border: "none",
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 15px rgba(74, 114, 243, 0.3)"
                                            }}
                                        >
                                            {actionLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save" style={{ fontSize: "0.95rem" }}></i>
                                                    Save Profile Changes
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>

                    {/* MY SAVED RESUMES SECTION */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="glass-card p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                                    <h3 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">folder_open</span>
                                        My Saved Resumes
                                    </h3>
                                    <Link href="/templates" className="btn btn-primary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-1.5" style={{ borderRadius: "8px" }}>
                                        <i className="fas fa-plus"></i> Create New Resume
                                    </Link>
                                </div>

                                {loadingResumes ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-info mb-2" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="text-white-50 small mb-0">Loading your saved resumes...</p>
                                    </div>
                                ) : resumes.length === 0 ? (
                                    <div className="text-center py-5 text-white-50 border border-secondary border-dashed rounded-3" style={{ borderRadius: "12px" }}>
                                        <i className="fas fa-folder-open fa-3x mb-3 text-muted"></i>
                                        <p className="fs-5 mb-2">No saved resumes found</p>
                                        <p className="small mb-4">You haven't saved any resumes to the cloud yet.</p>
                                        <Link href="/templates" className="btn btn-outline-primary px-4 py-2 fw-semibold" style={{ borderRadius: "8px" }}>
                                            Create Your First Resume
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        {resumes.map((resume) => (
                                            <div className="col-md-6 col-lg-4" key={resume.id}>
                                                <div className="card h-100 bg-black border border-secondary p-3" style={{ borderRadius: "12px" }}>
                                                    <div className="card-body p-0 d-flex flex-column justify-content-between">
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h5 className="fw-bold mb-1 text-white text-truncate" style={{ maxWidth: "80%" }}>
                                                                    {resume.resumeName}
                                                                </h5>
                                                                <span className="badge text-bg-primary text-uppercase px-2 py-1" style={{ fontSize: "0.65rem" }}>
                                                                    {resume.selectedTemplate.replace("_", " ")}
                                                                </span>
                                                            </div>
                                                            <p className="text-white-50 small mb-4">
                                                                Last updated: {new Date(resume.updatedAt).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                onClick={() => handleLoadResume(resume.id)}
                                                                className="btn btn-sm btn-outline-info flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 py-2"
                                                                style={{ borderRadius: "6px" }}
                                                            >
                                                                <i className="fas fa-edit"></i> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handlePreviewResume(resume.id)}
                                                                className="btn btn-sm btn-outline-light flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 py-2"
                                                                style={{ borderRadius: "6px" }}
                                                            >
                                                                <i className="fas fa-eye"></i> View
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteResume(resume.id)}
                                                                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center px-2.5 py-2"
                                                                style={{ borderRadius: "6px" }}
                                                                title="Delete Resume"
                                                            >
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
