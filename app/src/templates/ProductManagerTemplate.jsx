import React from "react";

export default function ProductManagerTemplate({ data }) {
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
            </div>
        );
    }

    return (
        <div style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif", padding: "2.5rem 3rem" }}>
            {/* HEADER */}
            <div className="d-flex align-items-center gap-4 mb-3">
                {data.basics.photo && (
                    <img src={data.basics.photo} alt="Profile" style={{ width: "75px", height: "75px", objectFit: "cover", borderRadius: "8px", border: "2px solid #4f46e5", flexShrink: 0 }} />
                )}
                <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "26px", color: "#0f172a", letterSpacing: "-0.5px" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="fw-bold mb-2" style={{ fontSize: "13px", color: "#4f46e5" }}>{data.basics.role}</h5>}
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
            {data.summary && (
                <section style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "12.5px", lineHeight: "1.65", color: "#334155", borderLeft: "4px solid #4f46e5", paddingLeft: "14px", margin: 0 }}>
                        {data.summary}
                    </p>
                </section>
            )}

            {/* JOB EXPERIENCE */}
            {data.experience && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 className="fw-bold border-bottom pb-1.5 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px", borderColor: "#e2e8f0" }}>Professional Experience</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "12px", lineHeight: "1.6", whiteSpace: "pre-line", margin: 0, color: "#334155" }}>{data.experience}</p>
                    ) : (
                        <div>
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                <span style={{ color: "#0f172a" }}>{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1" style={{ fontSize: "11.5px", color: "#4f46e5", fontWeight: "500" }}>
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* INTERNSHIP */}
            {data.internship && (() => {
                const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                    ? data.internship.bullets
                    : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                return (
                    <section style={{ marginBottom: "20px" }}>
                        <h5 className="fw-bold border-bottom pb-1.5 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px", borderColor: "#e2e8f0" }}>Internships &amp; Apprenticeships</h5>
                        <div>
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold" style={{ fontSize: "12.5px", color: "#0f172a" }}>{data.internship.field}</span>
                                <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#4f46e5", fontStyle: "italic", marginTop: "2px" }}>
                                {data.internship.company}
                            </div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "6px 0 0", paddingLeft: "16px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.45", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                );
            })()}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 className="fw-bold border-bottom pb-1.5 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px", borderColor: "#e2e8f0" }}>Education</h5>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                <span style={{ color: "#0f172a" }}>{edu.course}</span>
                                <span className="text-muted small">{edu.start} – {edu.end}</span>
                            </div>
                            {edu.college && (
                                <div className="text-muted" style={{ fontSize: "11.5px", marginTop: "2px" }}>
                                    {edu.college}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* ACHIEVEMENTS */}
            {data.achievements && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 className="fw-bold border-bottom pb-1.5 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px", borderColor: "#e2e8f0" }}>Key Achievements &amp; Impact</h5>
                    <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                        {data.achievements}
                    </p>
                </section>
            )}

            {/* CORE SKILLS */}
            {data.skills && data.skills.length > 0 && (
                <section style={{ marginBottom: "16px" }}>
                    <h5 className="fw-bold border-bottom pb-1.5 text-uppercase" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px", borderColor: "#e2e8f0" }}>Areas of Expertise</h5>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "11.5px", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 11px", background: "#f8fafc", color: "#1e293b", fontWeight: "500" }}>{skill}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* Fallback projects if single page */}
            {data.projects && !data.isPage2 && (() => {
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
                if (!projs.length) return null;
                return (
                    <section className="mt-3">
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
        </div>
    );
}
