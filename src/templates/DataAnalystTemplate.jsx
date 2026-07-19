import React from "react";

export default function DataAnalystTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="d-flex" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
            {/* SIDEBAR FOR TECH STACK & TOOLS */}
            <div className="p-4 bg-light" style={{ width: "30%", borderRight: "1px solid #e2e8f0" }}>
                {data.basics.photo && (
                    <div className="text-center mb-4">
                        <img
                            src={data.basics.photo}
                            alt="Profile"
                            style={{
                                width: "90px",
                                height: "90px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "2px solid #0891b2"
                            }}
                        />
                    </div>
                )}
                
                <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#0891b2", letterSpacing: "1px" }}>Contact</h5>
                <div style={{ fontSize: "11px", color: "#475569", lineHeight: "1.6" }} className="mb-4">
                    <div className="mb-1"><i className="fa-solid fa-envelope me-2"></i>{data.basics.email}</div>
                    <div className="mb-1"><i className="fa-solid fa-phone me-2"></i>{data.basics.phone}</div>
                    {links.linkedin && <div className="mb-1"><i className="fab fa-linkedin me-2"></i>{links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                    {links.github && <div><i className="fab fa-github me-2"></i>{links.github.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                </div>

                {data.skills.length > 0 && (
                    <div>
                        <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#0891b2", letterSpacing: "1px" }}>Toolbox</h5>
                        <div className="d-flex flex-direction-column gap-2" style={{ flexDirection: "column" }}>
                            {data.skills.map((skill, idx) => (
                                <div key={idx} style={{ fontSize: "11px", background: "#ffffff", border: "1px solid #e2e8f0", padding: "4px 8px", borderRadius: "4px", color: "#334155", fontWeight: "600" }}>{skill}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN DATA BLOCK */}
            <div className="p-4" style={{ width: "70%" }}>
                <div className="border-bottom pb-3 mb-4">
                    <h1 className="fw-bold mb-1" style={{ fontSize: "28px", color: "#0f172a" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="fw-bold mb-0" style={{ fontSize: "14px", color: "#0891b2" }}>{data.basics.role}</h5>}
                </div>

                {/* SUMMARY */}
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-2" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Professional Profile</h5>
                    <p style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155", margin: 0 }}>{data.summary}</p>
                </section>

                {/* EXPERIENCE */}
                {data.experience && (
                    <section className="mb-4">
                        <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Work Experience</h5>
                        {typeof data.experience === "string" ? (
                            <p style={{ fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                        ) : (
                            <div className="mb-3">
                                <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                    <span>{data.experience.role}</span>
                                    <span>{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="text-muted mb-1" style={{ fontSize: "11px", fontWeight: "500" }}>
                                    {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                                </div>
                                {data.experience.description && (
                                    <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#475569", whiteSpace: "pre-line", margin: 0 }}>
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
                    if (!projs.length) return <section className="mb-4"><h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Data Projects</h5><p style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4">
                            <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Data Projects</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #0891b2", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px", background: "#f0f9ff", borderRadius: "0 4px 4px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "12px", color: "#0891b2", marginBottom: "4px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#334155", lineHeight: "1.5" }}>
                                                {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })()}

                {/* EDUCATION */}
                <section className="mb-4">
                    <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Education</h5>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                <span>{edu.course}</span>
                                <span className="text-muted small">{edu.start} – {edu.end}</span>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
