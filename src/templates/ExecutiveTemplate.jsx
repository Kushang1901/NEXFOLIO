import React from "react";

export default function ExecutiveTemplate({ data }) {
    const links = data?.basics?.links || {};
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

    return (
        <div style={{ fontFamily: "Georgia, serif", color: "#1a1a1a" }}>
            {/* Top Corporate Navy Header */}
            <div className="p-5 text-white d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ background: "#1b2a4a" }}>
                <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "36px", letterSpacing: "1px" }}>{data.basics.name}</h1>
                    {data.basics.role && (
                        <p className="text-uppercase tracking-wider fw-semibold mb-0" style={{ color: "#a5b4fc", fontSize: "14px" }}>
                            {data.basics.role}
                        </p>
                    )}
                </div>
                <div className="text-end small lh-base" style={{ minWidth: "200px" }}>
                    <div><i className="fa-solid fa-envelope me-2"></i>{data.basics.email}</div>
                    <div><i className="fa-solid fa-phone me-2"></i>{data.basics.phone}</div>
                    {links.linkedin && (
                        <div>
                            <i className="fa-brands fa-linkedin me-2"></i>
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-white text-decoration-none hover:underline">
                                {getUsername(links.linkedin, "linkedin")}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex flex-column flex-md-row" style={{ minHeight: "600px" }}>
                {/* Left Gray Sidebar Column */}
                <div className="p-4" style={{ width: "100%", md: "35%", width: "35%", background: "#f1f5f9", borderRight: "1px solid #e2e8f0" }}>
                    {data.basics.photo && (
                        <div className="text-center mb-4">
                            <img
                                src={data.basics.photo}
                                alt="Profile"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    border: "3px solid #1b2a4a",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                                }}
                            />
                        </div>
                    )}

                    {/* Links */}
                    {Object.keys(links).length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold border-bottom pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottomColor: "#cbd5e1" }}>Links & Socials</h6>
                            <div className="d-flex flex-column gap-2 small">
                                {links.github && (
                                    <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-dark hover:underline d-flex align-items-center gap-2">
                                        <i className="fab fa-github"></i>
                                        <span>{getUsername(links.github, "github")}</span>
                                    </a>
                                )}
                                {links.portfolio && (
                                    <a href={links.portfolio} target="_blank" rel="noreferrer" className="text-decoration-none text-dark hover:underline d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-globe"></i>
                                        <span>{getUsername(links.portfolio, "portfolio")}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold border-bottom pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottomColor: "#cbd5e1" }}>Skills Expertise</h6>
                            <div className="d-flex flex-wrap gap-1">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="badge bg-secondary text-white px-2 py-1 m-1 small" style={{ background: "#475569" }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div>
                            <h6 className="fw-bold border-bottom pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottomColor: "#cbd5e1" }}>Education</h6>
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-3 small">
                                    <div className="fw-bold text-dark">{edu.course}</div>
                                    <div className="text-muted">{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Content Column */}
                <div className="p-5" style={{ width: "100%", md: "65%", width: "65%" }}>
                    {/* Summary */}
                    {data.summary && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Executive Summary</h5>
                            <p className="small text-muted" style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}>{data.summary}</p>
                        </section>
                    )}

                    {/* Professional Experience */}
                    {data.experience && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Professional Experience</h5>
                            <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.experience}</p>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Key Projects</h5>
                            <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p>
                        </section>
                    )}

                    {/* Achievements */}
                    {data.achievements && (
                        <section>
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Achievements & Leadership</h5>
                            <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.achievements}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
