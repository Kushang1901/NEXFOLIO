import React from "react";

export default function BentoTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    
    if (data?.isPage2) {
        return (
            <div className="p-4 bg-light" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
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
                    if (!projs.length) return <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}><h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Projects</h6><p style={{ fontSize: "11.5px", lineHeight: "1.4", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></div>;
                    return (
                        <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
                            <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Projects</h6>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", borderTop: "3px solid #6366f1" }}>
                                        <div style={{ fontWeight: "700", fontSize: "11.5px", color: "#0f172a", marginBottom: "5px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10.5px", color: "#475569", lineHeight: "1.5" }}>
                                                {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    }

    return (
        <div className="p-4 bg-light" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
            {/* GRID LAYOUT CONTAINER */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                
                {/* 1. HEADER CARD (Full Width span) */}
                <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px 24px" }} className="d-flex align-items-center justify-content-between">
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: "28px", color: "#0f172a", letterSpacing: "-0.5px" }}>{data.basics.name}</h1>
                        {data.basics.role && <h5 className="fw-bold text-primary mb-0" style={{ fontSize: "13.5px", color: "#6366f1" }}>{data.basics.role}</h5>}
                    </div>
                    {data.basics.photo && (
                        <img
                            src={data.basics.photo}
                            alt="Profile"
                            style={{
                                width: "68px",
                                height: "68px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "2px solid #e2e8f0"
                            }}
                        />
                    )}
                </div>

                {/* 2. BIO PROFILE (Full Width span) */}
                {data.summary && (
                    <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 22px" }}>
                        <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Profile Statement</h6>
                        <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", margin: 0 }}>{data.summary}</p>
                    </div>
                )}

                {/* 3. JOB EXPERIENCE (Full Width span) */}
                {data.experience && (
                    <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 22px" }}>
                        <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Experience</h6>
                        {typeof data.experience === "string" ? (
                            <p style={{ fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                        ) : (
                            <div>
                                <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                    <span>{data.experience.role}</span>
                                    <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="text-primary mb-1.5" style={{ fontSize: "11.5px", color: "#6366f1", fontWeight: "600" }}>
                                    {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                                </div>
                                {data.experience.description && (
                                    <p style={{ fontSize: "11.5px", lineHeight: "1.55", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                                        {data.experience.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. EDUCATION BLOCK */}
                {data.education && data.education.length > 0 && (
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 20px" }}>
                        <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Education</h6>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <div className="fw-bold" style={{ fontSize: "12px", color: "#0f172a" }}>{edu.course}</div>
                                {edu.college && <div className="text-muted" style={{ fontSize: "11px" }}>{edu.college}</div>}
                                <div className="text-muted small">{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 5. INTERNSHIP BLOCK */}
                {data.internship && (() => {
                    const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                        ? data.internship.bullets
                        : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                    return (
                        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 20px" }}>
                            <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Internships</h6>
                            <div className="fw-bold" style={{ fontSize: "12px", color: "#0f172a" }}>{data.internship.field}</div>
                            <div style={{ fontSize: "11.5px", color: "#6366f1", fontWeight: "600", marginTop: "2px" }}>{data.internship.company}</div>
                            <div className="text-muted small mt-1">{data.internship.start} – {data.internship.end}</div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "8px 0 0", paddingLeft: "16px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ fontSize: "11px", color: "#334155", lineHeight: "1.45", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })()}

                {/* 6. CONTACT BOX */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 20px" }}>
                    <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Connect</h6>
                    <div style={{ fontSize: "11.5px", color: "#334155" }}>
                        <div className="mb-1"><strong>Email:</strong> {data.basics.email}</div>
                        <div className="mb-1"><strong>Phone:</strong> {data.basics.phone}</div>
                        {links.linkedin && <div className="mb-1"><strong>LinkedIn:</strong> {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                        {links.github && <div><strong>GitHub:</strong> {links.github.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                    </div>
                </div>

                {/* 7. SKILLS WIDGET */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 20px" }}>
                    <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Toolbox</h6>
                    <div className="d-flex flex-wrap gap-1.5" style={{ gap: "6px" }}>
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "10.5px", background: "#f1f5f9", padding: "3.5px 9px", borderRadius: "6px", fontWeight: "600", color: "#475569" }}>{skill}</span>
                        ))}
                    </div>
                </div>

                {/* 8. ACHIEVEMENTS BLOCK (Full Width span) */}
                {data.achievements && (
                    <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px 22px" }}>
                        <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Achievements &amp; Honors</h6>
                        <p style={{ fontSize: "11.5px", lineHeight: "1.6", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                            {data.achievements}
                        </p>
                    </div>
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
                        <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
                            <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Projects</h6>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", borderTop: "3px solid #6366f1" }}>
                                        <div style={{ fontWeight: "700", fontSize: "11.5px", color: "#0f172a", marginBottom: "5px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "10.5px", color: "#475569", lineHeight: "1.5" }}>
                                                {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
