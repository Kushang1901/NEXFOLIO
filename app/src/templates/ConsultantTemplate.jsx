import React from "react";

export default function ConsultantTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    
    if (data?.isPage2) {
        return (
            <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
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
                if (!projs.length) return <section className="mb-4"><h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Selected Case Studies &amp; Consulting Projects</h6><p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Selected Case Studies &amp; Consulting Projects</h6>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #1e3a8a", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#eff6ff", borderRadius: "0 4px 4px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "11.5px", color: "#1e3a8a", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#334155", lineHeight: "1.5" }}>
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
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
            {/* HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-2 pb-3" style={{ borderColor: "#1e3a8a" }}>
                <div className="d-flex align-items-center gap-3">
                    {data.basics.photo && (
                        <img src={data.basics.photo} alt="Profile" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%", border: "2px solid #1e3a8a", flexShrink: 0 }} />
                    )}
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: "24px", color: "#1e3a8a", letterSpacing: "1px" }}>{data.basics.name}</h1>
                        {data.basics.role && <h5 className="text-secondary mb-0" style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>{data.basics.role}</h5>}
                    </div>
                </div>
                <div style={{ fontSize: "11px", textAlign: "right", color: "#475569" }}>
                    <div>{data.basics.email}</div>
                    <div>{data.basics.phone}</div>
                    {links.linkedin && <div>{links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                </div>
            </div>

            {/* PROFILE SECTION */}
            <section className="mb-4">
                <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Executive Profile</h6>
                <p style={{ fontSize: "12px", lineHeight: "1.6", margin: 0, textAlign: "justify" }}>{data.summary}</p>
            </section>

            {/* CORE EXPERTISE */}
            {data.skills.length > 0 && (
                <section className="mb-4">
                    <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Core Competencies</h6>
                    <div className="row g-2">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="col-4">
                                <div style={{ fontSize: "11px", borderLeft: "2px solid #1e3a8a", paddingLeft: "8px", fontWeight: "500" }}>{skill}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* JOB EXPERIENCE */}
            {data.experience && (
                <section className="mb-4">
                    <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Professional Engagements</h6>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "11.5px", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                <span>{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="text-muted mb-2" style={{ fontSize: "11px", fontWeight: "500" }}>
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
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
                    <section className="mb-4">
                        <h6 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Consulting Internships &amp; Residencies</h6>
                        <div style={{ fontSize: "12.5px" }}>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>{data.internship.field}</span>
                                <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#1e3a8a", fontStyle: "italic", marginTop: "2px" }}>
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
            <section className="mb-4">
                <h6 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Education</h6>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2" style={{ fontSize: "12.5px" }}>
                        <div className="d-flex justify-content-between">
                            <strong>{edu.course}</strong>
                            <span className="text-muted small">{edu.start} – {edu.end}</span>
                        </div>
                        {edu.college && <div className="text-muted" style={{ fontSize: "11.5px", marginTop: "2px" }}>{edu.college}</div>}
                    </div>
                ))}
            </section>

            {/* ACHIEVEMENTS */}
            {data.achievements && (
                <section className="mb-3">
                    <h6 className="fw-bold text-uppercase mb-2.5" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Key Honors &amp; Achievements</h6>
                    <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                        {data.achievements}
                    </p>
                </section>
            )}

            {/* Fallback projects for single-page PNG export */}
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
                    <section className="mb-4">
                        <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Selected Case Studies &amp; Consulting Projects</h6>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #1e3a8a", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#eff6ff", borderRadius: "0 4px 4px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "11.5px", color: "#1e3a8a", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#334155", lineHeight: "1.5" }}>
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
