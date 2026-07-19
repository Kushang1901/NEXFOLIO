"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { subscribeToAuthChanges } from "../../authState";
import { Search, Sparkles, SlidersHorizontal, RefreshCw, Crown, Unlock } from "lucide-react";
import { templateList } from "../../templates/templatesData";

export default function TemplateSelection() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((loggedUser) => {
            setUser(loggedUser);
        });

        // Parse category from URL query parameter on mount
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get("category");
            if (cat) {
                setSelectedCategory(cat);
            }
        }

        // Custom event listener for same-page category changes from Navbar
        const handleCategoryChange = (e) => {
            if (e.detail) {
                setSelectedCategory(e.detail);
            }
        };

        window.addEventListener("categoryChange", handleCategoryChange);

        return () => {
            unsubscribe();
            window.removeEventListener("categoryChange", handleCategoryChange);
        };
    }, [router]);

    const selectTemplate = (id) => {
        sessionStorage.removeItem("resumeId");
        sessionStorage.removeItem("resumeData");
        sessionStorage.removeItem("aiOutput");
        sessionStorage.setItem("selectedTemplate", id);
        if (user) {
            router.push("/builder");
        } else {
            router.push("/?triggerAuth=true");
        }
    };

    const categories = [
        { id: "all", label: "All Layouts" },
        { id: "professional", label: "Professional" },
        { id: "minimalist", label: "Minimalist" },
        { id: "creative", label: "Creative" },
        { id: "tech", label: "Tech / Code" },
    ];


    const filteredTemplates = templateList.filter(tpl => {
        const matchesCategory = selectedCategory === "all" || tpl.category === selectedCategory || (selectedCategory === "tech" && tpl.category === "tech");
        const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              tpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              tpl.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-black text-white min-vh-100" style={{ position: "relative", overflowX: "hidden" }}>
            {/* Top decorative spotlight glow */}
            <div style={glowSpotlightStyle} />

            <Navbar />

            <div className="container py-5 px-4" style={{ position: "relative", zIndex: 5 }}>
                {/* ── Hero Section ── */}
                <div className="text-center mb-5" style={{ animation: "fadeInDown 0.8s ease-out" }}>
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={badgeStyle}>
                        <Sparkles size={14} color="#a5b4fc" />
                        <span style={{ fontSize: "0.78rem", fontWeight: "600", letterSpacing: "0.05em", textTransform: "uppercase", color: "#a5b4fc" }}>Recruiter-Approved Layouts</span>
                    </div>
                    <h1 style={heroTitleStyle}>
                        Choose Your Resume Template
                    </h1>
                    <p style={heroSubStyle}>
                        Select a professionally designed, ATS-friendly template to kickstart your career. 
                        Fully customizable, print-ready, and 100% free.
                    </p>
                </div>

                {/* ── Search & Filters ── */}
                <div className="row justify-content-center mb-5" style={{ animation: "fadeInUp 0.8s ease-out 0.2s" }}>
                    <div className="col-lg-10">
                        <div style={filterContainerStyle}>
                            {/* Category tabs */}
                            <div className="d-flex flex-wrap gap-2 align-items-center" style={{ flex: 1 }}>
                                <SlidersHorizontal size={14} style={{ color: "rgba(255,255,255,0.45)", marginRight: "4px" }} className="d-none d-sm-block" />
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            ...categoryTabStyle,
                                            ...(selectedCategory === cat.id ? activeCategoryTabStyle : {})
                                        }}
                                        className="btn btn-sm"
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search input */}
                            <div style={searchWrapperStyle}>
                                <Search size={16} style={{ color: "rgba(255,255,255,0.4)", position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                                <input
                                    type="text"
                                    placeholder="Search templates (e.g. ATS, code, minimal)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={searchInputStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Templates Grid ── */}
                <div className="row g-4 justify-content-center" style={{ animation: "fadeInUp 0.8s ease-out 0.4s" }}>
                    {filteredTemplates.length > 0 ? (
                        filteredTemplates.map(tpl => {
                            const FREE_TEMPLATES = ["modern", "creative", "product_manager", "bento"];
                            const isPremium = !FREE_TEMPLATES.includes(tpl.id);
                            return (
                                <div key={tpl.id} className="col-md-6 col-lg-4 col-xl-3">
                                    <div
                                        className="template-card-container"
                                        style={cardContainerStyle}
                                        onClick={() => selectTemplate(tpl.id)}
                                        position="relative"
                                    >
                                        {/* Preview Block */}
                                        <div className="template-card-preview-wrapper" style={{ ...previewWrapperStyle, position: "relative" }}>
                                            {/* Free/Premium Badge */}
                                            <div style={{
                                                position: "absolute",
                                                top: "12px",
                                                right: "12px",
                                                zIndex: 10,
                                                padding: "4px 10px",
                                                borderRadius: "20px",
                                                fontSize: "0.68rem",
                                                fontWeight: "700",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                background: isPremium 
                                                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" // Premium gold
                                                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Free green
                                                color: "#fff",
                                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                                            }}>
                                                <div className="d-flex align-items-center gap-1">
                                                    {isPremium ? (
                                                        <>
                                                            <Crown size={12} className="text-white" />
                                                            <span>Premium</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Unlock size={12} className="text-white" />
                                                            <span>Free</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div style={{ height: "230px", width: "100%" }}>
                                                {tpl.preview}
                                            </div>
                                            {/* Hover Overlay */}
                                            <div className="template-card-hover-overlay" style={hoverOverlayStyle}>
                                                <button className="select-template-btn" style={selectBtnStyle}>
                                                    Use Layout
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Footer Info */}
                                        <div style={cardFooterStyle}>
                                            <h3 style={cardTitleStyle}>{tpl.name}</h3>
                                            <p style={cardDescStyle}>{tpl.desc}</p>
                                            <div style={tagGroupStyle}>
                                                {tpl.tags.map((tag, idx) => (
                                                    <span key={idx} style={tagStyle}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-5 w-100">
                            <RefreshCw size={36} className="text-muted spin-animation mb-3" />
                            <h4 className="text-muted mb-2">No templates found</h4>
                            <p className="text-white-50 small">Try adjusting your filters or search keywords.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium CSS Styles (injected dynamically) */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeInDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                /* Template Card Container hover states */
                .template-card-container {
                    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .template-card-container:hover {
                    transform: translateY(-8px);
                    border-color: rgba(99, 102, 241, 0.38) !important;
                    background: rgba(255, 255, 255, 0.04) !important;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.65), 0 0 20px rgba(99, 102, 241, 0.08) !important;
                }
                
                /* Preview Container hover effect */
                .template-card-preview-wrapper {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    transition: border-color 0.25s;
                }
                .template-card-container:hover .template-card-preview-wrapper {
                    border-color: rgba(99, 102, 241, 0.3);
                }
                
                /* Overlay Fade In */
                .template-card-hover-overlay {
                    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .template-card-container:hover .template-card-hover-overlay {
                    opacity: 1 !important;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                
                /* Button Hover animation */
                .select-template-btn {
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .template-card-container:hover .select-template-btn {
                    transform: scale(1.05) translateY(0) !important;
                }
                
                /* General spin effect for empty state */
                .spin-animation {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            ` }} />
        </div>
    );
}

// ── Styles ──
const glowSpotlightStyle = {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "1200px",
    height: "500px",
    background: "radial-gradient(circle at 50% -120px, rgba(99, 102, 241, 0.14) 0%, rgba(99, 102, 241, 0.03) 50%, transparent 80%)",
    pointerEvents: "none",
    zIndex: 1,
};

const badgeStyle = {
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.18)",
};

const heroTitleStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "2.8rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #ffffff 0%, #dbe2ff 50%, #a5b4fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.02em",
};

const heroSubStyle = {
    fontSize: "1.05rem",
    lineHeight: "1.6",
    color: "rgba(255, 255, 255, 0.55)",
    maxWidth: "600px",
    margin: "14px auto 0",
};

const filterContainerStyle = {
    background: "rgba(13, 13, 16, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "16px",
    padding: "12px 18px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
};

const categoryTabStyle = {
    background: "transparent",
    border: "1px solid transparent",
    color: "rgba(255, 255, 255, 0.65)",
    borderRadius: "20px",
    padding: "6px 14px",
    fontSize: "0.85rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
};

const activeCategoryTabStyle = {
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    borderColor: "rgba(99, 102, 241, 0.25)",
    color: "#ffffff",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
};

const searchWrapperStyle = {
    position: "relative",
    flex: "1 1 280px",
    minWidth: "220px",
};

const searchInputStyle = {
    width: "100%",
    padding: "8px 16px 8px 38px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "0.85rem",
    outline: "none",
    transition: "all 0.2s ease",
};

const cardContainerStyle = {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "18px",
    padding: "14px",
    height: "100%",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const previewWrapperStyle = {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    transition: "border-color 0.25s",
};

const hoverOverlayStyle = {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    pointerEvents: "none",
};

const selectBtnStyle = {
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "white",
    border: "none",
    padding: "9px 18px",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.82rem",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.35)",
    transform: "translateY(8px)",
};

const cardFooterStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "0 4px",
};

const cardTitleStyle = {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#ffffff",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "0.01em",
};

const cardDescStyle = {
    margin: 0,
    fontSize: "0.8rem",
    lineHeight: "1.4",
    color: "rgba(255, 255, 255, 0.45)",
    minHeight: "36px", // Keep heights aligned
};

const tagGroupStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "4px",
};

const tagStyle = {
    fontSize: "0.68rem",
    fontWeight: "600",
    color: "#a5b4fc",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    padding: "2px 8px",
    borderRadius: "20px",
};
