import React from "react";

export default function ModernTemplate({ data }) {

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
        <div className="d-flex" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* LEFT SIDEBAR */}
            <div
                className="p-4 text-white"
                style={{ width: "32%", background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #0f172a 100%)", flexShrink: 0 }}
            >
                <div className="text-center mb-4">
                    {data.basics.photo && (
                        <img
                            src={data.basics.photo}
                            alt="Profile"
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginBottom: "15px",
                                border: "3px solid rgba(255, 255, 255, 0.8)",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                                display: "block",
                                margin: "0 auto 15px"
                            }}
                        />
                    )}

                    <h3 className="fw-bold text-white mb-1" style={{ fontSize: "1.45rem", letterSpacing: "-0.02em" }}>{data.basics.name}</h3>
                    {data.basics.role && (
                        <span className="badge mt-1 text-uppercase text-white tracking-wider" 
                              style={{ 
                                  fontSize: "0.68rem", 
                                  letterSpacing: "1px", 
                                  background: "rgba(255, 255, 255, 0.15)",
                                  border: "1px solid rgba(255, 255, 255, 0.25)",
                                  borderRadius: "6px",
                                  padding: "5px 10px",
                                  display: "inline-block"
                              }}>
                            {data.basics.role}
                        </span>
                    )}
                </div>

                {/* Contact Card */}
                <div className="p-3 rounded-3 mb-4" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div className="d-flex flex-column gap-2.5" style={{ fontSize: "0.82rem" }}>
                        <div className="d-flex align-items-center gap-2.5 text-white-50 text-truncate">
                            <i className="fas fa-envelope text-white opacity-75" style={{ width: "16px" }}></i>
                            <span className="text-white text-truncate" title={data.basics.email}>{data.basics.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2.5 text-white-50">
                            <i className="fas fa-phone text-white opacity-75" style={{ width: "16px" }}></i>
                            <span className="text-white">{data.basics.phone}</span>
                        </div>
                        {links.github && (
                            <a href={links.github} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2.5 text-white text-decoration-none text-truncate hover-opacity-100">
                                <i className="fab fa-github text-white opacity-75" style={{ width: "16px" }}></i>
                                <span className="text-white text-truncate">{getUsername(links.github, "github")}</span>
                            </a>
                        )}
                        {links.linkedin && (
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2.5 text-white text-decoration-none text-truncate hover-opacity-100">
                                <i className="fab fa-linkedin text-white opacity-75" style={{ width: "16px" }}></i>
                                <span className="text-white text-truncate">{getUsername(links.linkedin, "linkedin")}</span>
                            </a>
                        )}
                        {links.portfolio && (
                            <a href={links.portfolio} target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2.5 text-white text-decoration-none text-truncate hover-opacity-100">
                                <i className="fa-solid fa-globe text-white opacity-75" style={{ width: "16px" }}></i>
                                <span className="text-white text-truncate">{getUsername(links.portfolio, "portfolio")}</span>
                            </a>
                        )}
                    </div>
                </div>

                <hr style={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

                <h6 className="fw-bold text-uppercase tracking-wider mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1.5px", color: "rgba(255, 255, 255, 0.8)" }}>Skills</h6>
                <div className="d-flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                        <span
                            key={i}
                            className="px-2.5 py-1 rounded-pill"
                            style={{
                                fontSize: "0.75rem",
                                background: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                color: "#ffffff",
                                fontWeight: "500",
                                letterSpacing: "0.2px",
                                display: "inline-block"
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="p-5" style={{ width: "68%" }}>
                {/* SUMMARY */}
                <section className="mb-4">
                    <h5 className="fw-bold">PROFILE</h5>
                    <p>{data.summary}</p>
                </section>

                {/* EDUCATION */}
                <section className="mb-4">
                    <h5 className="fw-bold">EDUCATION</h5>
                    {data.education.map((edu, i) => (
                        <p key={i}>
                            <strong>{edu.course}</strong><br />
                            {edu.start} – {edu.end}
                        </p>
                    ))}
                </section>

                {/* EXPERIENCE */}
                {data.experience && (
                    <section className="mb-4">
                        <h5 className="fw-bold">JOB EXPERIENCE</h5>
                        {typeof data.experience === "string" ? (
                            <p style={{ whiteSpace: "pre-line" }}>{data.experience}</p>
                        ) : (
                            <div className="mb-2">
                                <div className="d-flex justify-content-between align-items-baseline">
                                    <span className="fw-bold">{data.experience.role}</span>
                                    <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small italic">
                                    <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                    {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                                </div>
                                {data.experience.description && (
                                    <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
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
                        <h5 className="fw-bold">INTERNSHIP</h5>
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold">{data.internship.field}</span>
                                <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="text-muted small italic">
                                {data.internship.company}
                            </div>
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
                    if (!projects.length) return <section><h5 className="fw-bold">PROJECTS</h5><p style={{ whiteSpace: "pre-line" }}>{data.projects}</p></section>;
                    return (
                        <section>
                            <h5 className="fw-bold">PROJECTS</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {projects.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #0d6efd", paddingLeft: "12px", paddingTop: "4px", paddingBottom: "4px", background: "#f0f4ff", borderRadius: "0 6px 6px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0d6efd", marginBottom: "4px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "disc" }}>
                                                {proj.bullets.map((b, j) => (
                                                    <li key={j} style={{ fontSize: "0.83rem", color: "#374151", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
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
                        <h5 className="fw-bold">ACHIEVEMENTS</h5>
                        <p style={{ whiteSpace: "pre-line" }}>
                            {data.achievements}
                        </p>
                    </section>
                )}

            </div>
        </div>
    );
}
