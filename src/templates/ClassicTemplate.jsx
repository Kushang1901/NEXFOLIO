import React from "react";

export default function ClassicTemplate({ data }) {

    const links = data?.basics?.links || {};
    const getUsername = (url, type) => {
        if (!url) return "";

        try {
            const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

            if (type === "github") {
                return cleanUrl.replace("github.com/", "");
            }

            if (type === "linkedin") {
                return cleanUrl.replace("linkedin.com/in/", "");
            }

            if (type === "portfolio") {
                return cleanUrl;
            }

            return cleanUrl;
        } catch {
            return url;
        }
    };

    return (
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', -apple-system, sans-serif", color: "#1e293b" }}>
            {/* HEADER */}
            <div className="text-center">
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "110px",
                            height: "110px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginBottom: "14px",
                            border: "3px solid #cbd5e1",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    />
                )}

                <h1 className="fw-bold mb-1" style={{ fontSize: "2.1rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
                    {data.basics.name}
                </h1>

                {data.basics.role && (
                    <p className="fw-semibold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", color: "#3b82f6", letterSpacing: "0.08em" }}>
                        {data.basics.role}
                    </p>
                )}

                <div className="d-flex justify-content-center align-items-center gap-2.5 text-muted flex-wrap mb-2" style={{ fontSize: "0.85rem" }}>
                    {data.basics.email && (
                        <span>{data.basics.email}</span>
                    )}
                    {data.basics.email && data.basics.phone && (
                        <span className="text-muted">•</span>
                    )}
                    {data.basics.phone && (
                        <span>{data.basics.phone}</span>
                    )}
                    {data.basics.location && (data.basics.email || data.basics.phone) && (
                        <span className="text-muted">•</span>
                    )}
                    {data.basics.location && (
                        <span>{data.basics.location}</span>
                    )}
                </div>

                {/* Social Links */}
                <div className="d-flex justify-content-center align-items-center gap-4 mt-2 flex-wrap" style={{ fontSize: "0.82rem" }}>
                    {links.github && (
                        <a
                            href={links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="d-flex align-items-center gap-2 text-decoration-none text-muted hover-text-dark"
                        >
                            <i className="fab fa-github text-dark"></i>
                            <span>{getUsername(links.github, "github")}</span>
                        </a>
                    )}

                    {links.linkedin && (
                        <a
                            href={links.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="d-flex align-items-center gap-2 text-decoration-none text-muted hover-text-dark"
                        >
                            <i className="fab fa-linkedin text-primary"></i>
                            <span>{getUsername(links.linkedin, "linkedin")}</span>
                        </a>
                    )}

                    {links.portfolio && (
                        <a
                            href={links.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="d-flex align-items-center gap-2 text-decoration-none text-muted hover-text-dark"
                        >
                            <i className="fa-solid fa-globe text-success"></i>
                            <span>{getUsername(links.portfolio, "portfolio")}</span>
                        </a>
                    )}
                </div>

                {/* Neat divider line under the centered header */}
                <div style={{ borderBottom: "2px solid #0f172a", margin: "18px 0 24px 0" }}></div>
            </div>

            {/* SUMMARY */}
            {data.summary && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                        Professional Summary
                    </h5>
                    <p style={{ fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>{data.summary}</p>
                </section>
            )}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                        Education
                    </h5>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-3">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold" style={{ fontSize: "0.95rem", color: "#0f172a" }}>{edu.course}</span>
                                <span className="text-muted small fw-medium">{edu.start} – {edu.end}</span>
                            </div>
                            <div className="text-muted small fw-medium" style={{ color: "#475569" }}>{edu.institution || edu.school}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* EXPERIENCE */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                        Job Experience
                    </h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ whiteSpace: "pre-line", fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold" style={{ fontSize: "0.95rem", color: "#0f172a" }}>{data.experience.role}</span>
                                <span className="text-muted small fw-medium">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small mb-1.5">
                                <span className="fw-semibold" style={{ color: "#475569" }}>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                            </div>
                            {data.experience.description && (
                                <p className="mt-1 text-secondary" style={{ whiteSpace: "pre-line", fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* INTERNSHIP */}
            {data.internship && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                        Internship
                    </h5>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span className="fw-bold" style={{ fontSize: "0.95rem", color: "#0f172a" }}>{data.internship.field || data.internship.role}</span>
                            <span className="text-muted small fw-medium">{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="text-muted small mb-1.5 fw-semibold" style={{ color: "#475569" }}>
                            {data.internship.company} {data.internship.location && `| ${data.internship.location}`}
                        </div>
                        {data.internship.description && (
                            <p className="mt-1 text-secondary" style={{ whiteSpace: "pre-line", fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>
                                {data.internship.description}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* PROJECTS */}
            {data.projects && (() => {
                const lines = data.projects.split("\n");
                const projects = [];
                let current = null;
                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return;
                    if (trimmed.startsWith("-")) {
                        if (current) current.bullets.push(trimmed.replace(/^-\s*/, ""));
                    } else {
                        if (current) projects.push(current);
                        current = { name: trimmed, bullets: [] };
                    }
                });
                if (current) projects.push(current);
                if (!projects.length) return (
                    <section className="mb-4">
                        <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                            Projects
                        </h5>
                        <p style={{ whiteSpace: "pre-line", fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>{data.projects}</p>
                    </section>
                );
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                            Projects
                        </h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {projects.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #64748b", paddingLeft: "14px", paddingTop: "2px", paddingBottom: "2px" }}>
                                    <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0f172a", marginBottom: "4px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "disc" }}>
                                            {proj.bullets.map((b, j) => (
                                                <li key={j} style={{ fontSize: "0.88rem", color: "#334155", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })()}

            {/* ACHIEVEMENTS / CERTIFICATIONS */}
            {data.achievements && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                        Achievements & Certifications
                    </h5>
                    <p style={{ whiteSpace: "pre-line", fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>
                        {data.achievements}
                    </p>
                </section>
            )}

            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "0.95rem", letterSpacing: "0.06em", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "4px", color: "#0f172a" }}>
                        Skills
                    </h5>
                    <p style={{ fontSize: "0.9rem", lineHeight: "1.55", color: "#334155" }}>{data.skills.join(", ")}</p>
                </section>
            )}
        </div>
    );
}
