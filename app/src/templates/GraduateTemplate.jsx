import React from "react";

export default function GraduateTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    
    if (data?.isPage2) {
        return (
            <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
                {/* PROJECTS ONLY ON PAGE 2 */}
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
                if (!projs.length) return <section className="mb-4"><h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Academic Projects</h5><p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#374151", whiteSpace: "pre-line" }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Academic Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #1e3a8a", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#eff6ff", borderRadius: "0 4px 4px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "13px", color: "#1e3a8a", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: "#374151", lineHeight: "1.5" }}>
                                            {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })()}
            </div>
        );
    }

    return (
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
            {/* HEADER */}
            <div className="d-flex align-items-center justify-content-between border-bottom pb-4 mb-4">
                <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "28px", color: "#1e3a8a" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="text-secondary mb-2" style={{ fontSize: "14px", fontWeight: "500" }}>{data.basics.role}</h5>}
                    <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: "12px" }}>
                        <span>{data.basics.email}</span>
                        <span>|</span>
                        <span>{data.basics.phone}</span>
                    </div>
                </div>
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "3px solid #1e3a8a"
                        }}
                    />
                )}
            </div>

            {/* LINKS */}
            {(links.linkedin || links.github || links.portfolio) && (
                <div className="d-flex gap-3 mb-4 flex-wrap" style={{ fontSize: "12px" }}>
                    {links.linkedin && (
                        <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none text-primary fw-medium">
                            <i className="fab fa-linkedin me-1"></i> LinkedIn
                        </a>
                    )}
                    {links.github && (
                        <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-dark fw-medium">
                            <i className="fab fa-github me-1"></i> GitHub
                        </a>
                    )}
                    {links.portfolio && (
                        <a href={links.portfolio} target="_blank" rel="noreferrer" className="text-decoration-none text-success fw-medium">
                            <i className="fa-solid fa-globe me-1"></i> Portfolio
                        </a>
                    )}
                </div>
            )}

            {/* SUMMARY */}
            <section className="mb-4">
                <h5 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Objective</h5>
                <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#374151" }}>{data.summary}</p>
            </section>

            {/* EDUCATION */}
            <section className="mb-4">
                <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Education</h5>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span className="fw-bold" style={{ fontSize: "13px" }}>{edu.course}</span>
                            <span className="text-muted small">{edu.start} – {edu.end}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* PROJECTS */}
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
                if (!projs.length) return <section className="mb-4"><h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Academic Projects</h5><p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#374151", whiteSpace: "pre-line" }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Academic Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #1e3a8a", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#eff6ff", borderRadius: "0 4px 4px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "13px", color: "#1e3a8a", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "12px", color: "#374151", lineHeight: "1.5" }}>
                                            {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })()}

            {/* INTERNSHIP */}
            {data.internship && (() => {
                const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                    ? data.internship.bullets
                    : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Internships & Training</h5>
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold" style={{ fontSize: "13px" }}>{data.internship.field}</span>
                                <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="text-muted small italic">
                                {data.internship.company}
                            </div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "6px 0 0", paddingLeft: "18px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                );
            })()}

            {/* EXPERIENCE (if exists) */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Work Experience</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#374151", whiteSpace: "pre-line" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold" style={{ fontSize: "13px" }}>{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small italic">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                            </div>
                            {data.experience.description && (
                                <p className="mt-2" style={{ fontSize: "12px", lineHeight: "1.5", color: "#4b5563", whiteSpace: "pre-line" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* ACHIEVEMENTS */}
            {data.achievements && (
                <section className="mb-4">
                    <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Achievements & Extracurriculars</h5>
                    <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: "#374151", whiteSpace: "pre-line" }}>{data.achievements}</p>
                </section>
            )}

            {/* SKILLS */}
            {data.skills.length > 0 && (
                <section>
                    <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", color: "#1e3a8a", letterSpacing: "1px" }}>Skills & Tools</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "11px", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "4px 10px", color: "#1f2937", fontWeight: "500" }}>{skill}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
