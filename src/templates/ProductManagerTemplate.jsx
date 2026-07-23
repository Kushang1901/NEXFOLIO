import React from "react";

export default function ProductManagerTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
            {/* HEADER */}
            <div className="d-flex align-items-center gap-4 mb-4">
                {data.basics.photo && (
                    <img src={data.basics.photo} alt="Profile" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "2px solid #4f46e5", flexShrink: 0 }} />
                )}
                <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "26px", color: "#0f172a", letterSpacing: "-0.5px" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="fw-bold mb-2" style={{ fontSize: "14px", color: "#4f46e5" }}>{data.basics.role}</h5>}
                    <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: "11.5px" }}>
                        <span>Email: {data.basics.email}</span>
                        <span>•</span>
                        <span>Phone: {data.basics.phone}</span>
                        {links.linkedin && (
                            <>
                                <span>•</span>
                                <a href={links.linkedin} className="text-decoration-none text-muted">LinkedIn: {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</a>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* SUMMARY / VALUE PROP */}
            <section className="mb-4">
                <p className="border-start border-4 border-indigo-600 ps-3" style={{ fontSize: "12.5px", lineHeight: "1.6", color: "#334155", borderLeft: "4px solid #4f46e5", margin: 0 }}>
                    {data.summary}
                </p>
            </section>

            {/* JOB EXPERIENCE */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold border-bottom pb-1 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Professional Experience</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "13px" }}>
                                <span>{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: "11.5px" }}>
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

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
                if (!projs.length) return <section className="mb-4"><h5 className="fw-bold border-bottom pb-1 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Key Projects &amp; Launches</h5><p style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold border-bottom pb-1 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Key Projects &amp; Launches</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #4f46e5", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "rgba(79, 70, 229, 0.04)", borderRadius: "0 4px 4px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "12px", color: "#0f172a", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#334155", lineHeight: "1.5" }}>
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
            {data.internship && (
                <section className="mb-4">
                    <h5 className="fw-bold border-bottom pb-1 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Internships</h5>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span className="fw-bold" style={{ fontSize: "12px" }}>{data.internship.field}</span>
                            <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="text-muted small italic">
                            {data.internship.company}
                        </div>
                    </div>
                </section>
            )}

            {/* EDUCATION */}
            <section className="mb-4">
                <h5 className="fw-bold border-bottom pb-1 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Education</h5>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2">
                        <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                            <span>{edu.course}</span>
                            <span className="text-muted small">{edu.start} – {edu.end}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* CORE SKILLS */}
            {data.skills.length > 0 && (
                <section>
                    <h5 className="fw-bold border-bottom pb-1 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Areas of Expertise</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "11px", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "3px 8px", background: "#f8fafc", color: "#334155", fontWeight: "500" }}>{skill}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
