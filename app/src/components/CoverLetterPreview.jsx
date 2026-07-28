import React from "react";

export default function CoverLetterPreview({ data, selectedTemplate, coverLetterText }) {
    if (!data) return null;

    const name = data.basics?.name || "Your Name";
    const email = data.basics?.email || "email@example.com";
    const phone = data.basics?.phone || "";
    const role = data.basics?.role || "";
    const photo = data.basics?.photo || "";
    const links = data.basics?.links || {};

    const getUsername = (url, type) => {
        if (!url) return "";
        try {
            const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
            if (type === "github") return cleanUrl.replace("github.com/", "");
            if (type === "linkedin") return cleanUrl.replace("linkedin.com/in/", "");
            return cleanUrl;
        } catch {
            return url;
        }
    };

    // Styling definitions matching template systems
    const getTemplateStyles = () => {
        switch (selectedTemplate) {
            case "executive":
                return {
                    fontFamily: "'Inter', sans-serif",
                    headerBg: "#1b2a4a",
                    headerColor: "#ffffff",
                    accentColor: "#3b82f6",
                    containerPadding: "0"
                };
            case "developer":
                return {
                    fontFamily: "Courier New, Courier, monospace",
                    headerBg: "#0f172a",
                    headerColor: "#38bdf8",
                    accentColor: "#38bdf8",
                    containerPadding: "2rem"
                };
            case "elegant":
                return {
                    fontFamily: "Georgia, serif",
                    headerBg: "transparent",
                    headerColor: "#1a202c",
                    accentColor: "#4a5568",
                    containerPadding: "3rem"
                };
            case "emerald":
                return {
                    fontFamily: "'Inter', sans-serif",
                    headerBg: "#f0fdfa",
                    headerColor: "#0f766e",
                    accentColor: "#0f766e",
                    containerPadding: "2rem"
                };
            case "navy_elegance":
                return {
                    fontFamily: "'Inter', sans-serif",
                    headerBg: "#0f172a",
                    headerColor: "#ffffff",
                    accentColor: "#3b82f6",
                    containerPadding: "0"
                };
            case "creative":
                return {
                    fontFamily: "'Inter', sans-serif",
                    headerBg: "#f8fafc",
                    headerColor: "#4f46e5",
                    accentColor: "#4f46e5",
                    containerPadding: "2rem"
                };
            default: // classic, modern, minimalist, accent, minimalist_bw, slate_two_column
                return {
                    fontFamily: "'Inter', sans-serif",
                    headerBg: "transparent",
                    headerColor: "#0d6efd",
                    accentColor: "#0d6efd",
                    containerPadding: "3rem"
                };
        }
    };

    const styles = getTemplateStyles();

    // Template specific header renders
    const renderHeader = () => {
        switch (selectedTemplate) {
            case "executive":
                return (
                    <div>
                        <div className="p-5 text-center text-white" style={{ backgroundColor: styles.headerBg }}>
                            <h1 className="fw-bold mb-1 text-uppercase" style={{ letterSpacing: "1px" }}>{name}</h1>
                            {role && <p className="mb-0 text-uppercase text-light small fw-semibold" style={{ letterSpacing: "2px", opacity: 0.8 }}>{role}</p>}
                        </div>
                        <div className="bg-light py-3 px-5 border-bottom d-flex justify-content-center flex-wrap gap-4 text-dark small">
                            <span><i className="fas fa-envelope me-2 text-muted"></i>{email}</span>
                            {phone && <span><i className="fas fa-phone me-2 text-muted"></i>{phone}</span>}
                            {links.linkedin && <span><i className="fab fa-linkedin me-2 text-primary"></i>{getUsername(links.linkedin, "linkedin")}</span>}
                            {links.github && <span><i className="fab fa-github me-2"></i>{getUsername(links.github, "github")}</span>}
                        </div>
                    </div>
                );

            case "navy_elegance":
                return (
                    <div>
                        <div className="p-4 text-center text-white" style={{ backgroundColor: styles.headerBg, borderBottom: `4px solid ${styles.accentColor}` }}>
                            <h2 className="fw-bold mb-1">{name}</h2>
                            {role && <p className="mb-0 text-white-50 text-uppercase small">{role}</p>}
                        </div>
                        <div className="py-3 px-5 bg-light d-flex justify-content-center flex-wrap gap-4 text-dark small border-bottom">
                            <span>{email}</span>
                            {phone && <span>• {phone}</span>}
                            {links.linkedin && <span>• LinkedIn: {getUsername(links.linkedin, "linkedin")}</span>}
                        </div>
                    </div>
                );

            case "developer":
                return (
                    <div className="p-4 border-bottom border-secondary" style={{ backgroundColor: styles.headerBg, color: "#ffffff" }}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div>
                                <h2 className="fw-bold" style={{ color: styles.headerColor }}>const candidate = "{name}";</h2>
                                {role && <p className="text-muted small mb-0">// Role: {role}</p>}
                            </div>
                            <div className="small monospace-font text-white-50">
                                <div>email: "{email}"</div>
                                {phone && <div>phone: "{phone}"</div>}
                                {links.github && <div>github: "{getUsername(links.github, "github")}"</div>}
                            </div>
                        </div>
                    </div>
                );

            case "elegant":
                return (
                    <div className="text-center pb-4" style={{ borderBottom: "3px double #e2e8f0" }}>
                        <h1 className="fw-normal mb-1 font-serif" style={{ fontStyle: "italic", fontSize: "2.5rem" }}>{name}</h1>
                        {role && <p className="text-muted text-uppercase small mb-3" style={{ letterSpacing: "1.5px" }}>{role}</p>}
                        <div className="d-flex justify-content-center flex-wrap gap-3 text-muted small">
                            <span>{email}</span>
                            {phone && <span>| {phone}</span>}
                            {links.portfolio && <span>| {getUsername(links.portfolio, "portfolio")}</span>}
                        </div>
                    </div>
                );

            case "accent":
                return (
                    <div>
                        <div style={{ height: "6px", background: "linear-gradient(to right, #00b4db, #0083b0)" }}></div>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h2 className="fw-bold mb-0 text-dark">{name}</h2>
                                {role && <p className="text-muted mb-0 small">{role}</p>}
                            </div>
                            <div className="text-end small text-muted">
                                <div>{email}</div>
                                {phone && <div>{phone}</div>}
                            </div>
                        </div>
                    </div>
                );

            case "emerald":
                return (
                    <div className="p-4 border-bottom border-2 d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ borderColor: styles.accentColor, backgroundColor: styles.headerBg }}>
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: styles.headerColor }}>{name}</h2>
                            {role && <p className="text-muted small mb-0">{role}</p>}
                        </div>
                        <div className="text-end small">
                            <div className="fw-semibold" style={{ color: styles.accentColor }}>{email}</div>
                            {phone && <div className="text-muted">{phone}</div>}
                        </div>
                    </div>
                );

            default: // classic, modern, creative, minimalist, minimalist_bw, slate_two_column
                return (
                    <div className="d-flex flex-column align-items-center text-center pb-4 border-bottom">
                        {photo && (
                            <img
                                src={photo}
                                alt="Profile"
                                className="rounded-circle mb-3 border border-2 border-primary"
                                style={{ width: "90px", height: "90px", objectFit: "cover" }}
                            />
                        )}
                        <h2 className="fw-bold mb-1 text-dark">{name}</h2>
                        {role && <p className="text-primary fw-semibold mb-2">{role}</p>}
                        <div className="d-flex justify-content-center flex-wrap gap-3 text-muted small">
                            <span><i className="fas fa-envelope me-1"></i>{email}</span>
                            {phone && <span><i className="fas fa-phone me-1"></i>{phone}</span>}
                            {links.linkedin && <span><i className="fab fa-linkedin me-1"></i>{getUsername(links.linkedin, "linkedin")}</span>}
                        </div>
                    </div>
                );
        }
    };

    const todayDate = new Date().toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div 
            className="bg-white text-dark shadow-lg h-100" 
            style={{ 
                fontFamily: styles.fontFamily, 
                minHeight: "297mm", // A4 Aspect ratio container
                display: "flex",
                flexDirection: "column"
            }}
        >
            {/* Template Letterhead Header */}
            {renderHeader()}

            {/* Letter Body Container */}
            <div className="flex-grow-1 p-5 d-flex flex-column text-dark" style={{ lineHeight: "1.6", fontSize: "10.5pt" }}>
                {/* Date */}
                <div className="mb-4 text-muted small">
                    {todayDate}
                </div>

                {/* Cover Letter Content */}
                <div 
                    className="cover-letter-text-content flex-grow-1" 
                    style={{ whiteSpace: "pre-line", color: "#2d3748" }}
                >
                    {coverLetterText || "Your AI cover letter text will appear here once generated."}
                </div>
            </div>
        </div>
    );
}
