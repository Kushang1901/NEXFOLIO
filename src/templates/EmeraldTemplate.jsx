import React from "react";

export default function EmeraldTemplate({ data }) {
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
        <div className="p-5" style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#334155", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* Header Section */}
            <div className="d-flex flex-row align-items-center justify-content-between border-bottom pb-4 mb-4" style={{ borderColor: "#0f766e" }}>
                <div className="d-flex align-items-center gap-4">
                    {data.basics.photo && (
                        <img
                            src={data.basics.photo}
                            alt="Profile"
                            style={{
                                width: "95px",
                                height: "95px",
                                objectFit: "cover",
                                borderRadius: "16px",
                                border: "3px solid #0f766e"
                            }}
                        />
                    )}
                    <div>
                        <h1 className="fw-bold mb-1" style={{ color: "#0f766e", fontSize: "2.25rem" }}>{data.basics.name}</h1>
                        {data.basics.role && (
                            <p className="fw-semibold text-uppercase mb-0" style={{ letterSpacing: "1px", color: "#0d9488", fontSize: "0.95rem" }}>
                                {data.basics.role}
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-md-end small mt-3 mt-md-0" style={{ lineHeight: "1.6" }}>
                    <div><i className="fas fa-envelope me-2 text-teal" style={{ color: "#0f766e" }}></i>{data.basics.email}</div>
                    <div><i className="fas fa-phone me-2 text-teal" style={{ color: "#0f766e" }}></i>{data.basics.phone}</div>
                    <div className="d-flex flex-wrap gap-3 mt-2 justify-content-md-end">
                        {links.linkedin && (
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none hover:underline" style={{ color: "#0f766e", fontWeight: "500" }}>
                                <i className="fab fa-linkedin me-1"></i>{getUsername(links.linkedin, "linkedin")}
                            </a>
                        )}
                        {links.github && (
                            <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none hover:underline" style={{ color: "#0f766e", fontWeight: "500" }}>
                                <i className="fab fa-github me-1"></i>{getUsername(links.github, "github")}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase d-flex align-items-center gap-2 mb-3" style={{ color: "#0f766e" }}>
                        <i className="fas fa-user-circle"></i> Profile
                    </h5>
                    <p style={{ lineHeight: "1.6", fontSize: "0.95rem" }}>{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase d-flex align-items-center gap-2 mb-3" style={{ color: "#0f766e" }}>
                        <i className="fas fa-briefcase"></i> Job Experience
                    </h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2" style={{ fontSize: "0.95rem" }}>
                            <div className="d-flex justify-content-between align-items-baseline fw-bold text-slate-800" style={{ color: "#1e293b" }}>
                                <span>{data.experience.role}</span>
                                <span className="text-muted small fw-normal">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small italic">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                            </div>
                            {data.experience.description && (
                                <p className="mt-2 text-slate-600" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* Internship */}
            {data.internship && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase d-flex align-items-center gap-2 mb-3" style={{ color: "#0f766e" }}>
                        <i className="fas fa-user-tie"></i> Internship
                    </h5>
                    <div className="mb-2" style={{ fontSize: "0.95rem" }}>
                        <div className="d-flex justify-content-between align-items-baseline fw-bold text-slate-800" style={{ color: "#1e293b" }}>
                            <span>{data.internship.field}</span>
                            <span className="text-muted small fw-normal">{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="italic text-muted small">
                            {data.internship.company}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects && (() => {
                        const lines = data.projects.split("\n");
                        const projs = [];
                        let cur = null;
                        lines.forEach(line => {
                            const t = line.trim();
                            if (!t) return;
                            if (t.startsWith("-")) { if (cur) cur.bullets.push(t.replace(/^-\s*/, "")); }
                            else { if (cur) projs.push(cur); cur = { name: t, bullets: [] }; }
                        });
                        if (cur) projs.push(cur);
                        if (!projs.length) return <section className="mb-4"><div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><div style={{ width: "16px", height: "16px", background: green, borderRadius: "3px", flexShrink: 0 }}></div><h2 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px" }}>Projects</h2></div><p style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#475569", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                        return (
                            <section className="mb-4">
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                    <div style={{ width: "16px", height: "16px", background: green, borderRadius: "3px", flexShrink: 0 }}></div>
                                    <h2 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2px" }}>Projects</h2>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: `3px solid ${green}`, paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#f0fdf4", borderRadius: "0 6px 6px 0" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#065f46", marginBottom: "4px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.83rem", color: "#374151", lineHeight: "1.5" }}>
                                                    {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })()}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase d-flex align-items-center gap-2 mb-3" style={{ color: "#0f766e" }}>
                        <i className="fas fa-graduation-cap"></i> Education
                    </h5>
                    <div className="row g-3">
                        {data.education.map((edu, i) => (
                            <div key={i} className="col-6" style={{ fontSize: "0.95rem" }}>
                                <div className="fw-bold text-slate-800" style={{ color: "#1e293b" }}>{edu.course}</div>
                                <div className="text-muted">{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements */}
            {data.achievements && (
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase d-flex align-items-center gap-2 mb-3" style={{ color: "#0f766e" }}>
                        <i className="fas fa-trophy"></i> Achievements
                    </h5>
                    <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.achievements}</p>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h5 className="fw-bold text-uppercase d-flex align-items-center gap-2 mb-3" style={{ color: "#0f766e" }}>
                        <i className="fas fa-tools"></i> Skills
                    </h5>
                    <div className="d-flex flex-wrap gap-2 pt-1">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-pill border" style={{ fontSize: "0.85rem", color: "#0f766e", borderColor: "#0f766e", backgroundColor: "#f0fdfa", fontWeight: "500" }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
