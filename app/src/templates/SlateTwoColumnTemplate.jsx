
import React from "react";

export default function SlateTwoColumnTemplate({ data }) {
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

    
    if (data?.isPage2) {
        return (
            <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', -apple-system, sans-serif", color: "#1e293b" }}>
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
                    if (!projs.length) return <section className="mb-4 pb-2"><h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>Academic &amp; Personal Projects</h5><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4 pb-2">
                            <h5 className="text-uppercase fw-bold border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>Academic &amp; Personal Projects</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #64748b", paddingLeft: "12px", paddingTop: "4px", paddingBottom: "4px", background: "#f8fafc", borderRadius: "0 6px 6px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b", marginBottom: "3px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>
                                                {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
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
        <div className="d-flex flex-row" style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#334155", minHeight: "297mm", boxSizing: "border-box", width: "794px" }}>
            {/* Sidebar Column */}
            <div className="p-4 p-md-5" style={{ width: "254px", background: "#f8fafc", borderRight: "1px solid #e2e8f0", flexShrink: 0, boxSizing: "border-box" }}>
                <div className="sidebar-col w-100">
                    <div className="text-center mb-4">
                        {data.basics.photo && (
                            <img
                                src={data.basics.photo}
                                alt="Profile"
                                style={{
                                    width: "110px",
                                    height: "110px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "3px solid #64748b",
                                    marginBottom: "16px",
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto"
                                }}
                            />
                        )}
                        <h2 className="fw-bold mb-1" style={{ fontSize: "1.75rem", color: "#1e293b" }}>{data.basics.name}</h2>
                        {data.basics.role && (
                            <p className="text-muted fw-semibold text-uppercase small mb-0" style={{ letterSpacing: "1px" }}>
                                {data.basics.role}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <h6 className="text-uppercase fw-bold text-slate-700 border-bottom pb-2 mb-3" style={{ color: "#475569", letterSpacing: "0.5px" }}>Contact</h6>
                        <div className="small space-y-2" style={{ lineHeight: "1.7" }}>
                            <div><i className="fas fa-envelope me-2 text-slate-500"></i>{data.basics.email}</div>
                            <div><i className="fas fa-phone me-2 text-slate-500"></i>{data.basics.phone}</div>
                        </div>
                    </div>

                    {Object.keys(links).length > 0 && (
                        <div className="mb-4">
                            <h6 className="text-uppercase fw-bold text-slate-700 border-bottom pb-2 mb-3" style={{ color: "#475569", letterSpacing: "0.5px" }}>Links</h6>
                            <div className="small space-y-2" style={{ lineHeight: "1.7" }}>
                                {links.linkedin && (
                                    <div>
                                        <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-slate-600 text-decoration-none hover:underline">
                                            <i className="fab fa-linkedin me-2 text-slate-500"></i>{getUsername(links.linkedin, "linkedin")}
                                        </a>
                                    </div>
                                )}
                                {links.github && (
                                    <div>
                                        <a href={links.github} target="_blank" rel="noreferrer" className="text-slate-600 text-decoration-none hover:underline">
                                            <i className="fab fa-github me-2 text-slate-500"></i>{getUsername(links.github, "github")}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Main Content Column (540px width) */}
            <div className="p-4 p-md-5 main-col flex-grow-1" style={{ width: "540px", background: "#ffffff", boxSizing: "border-box", flexShrink: 0 }}>
                {/* Summary */}
                {data.summary && (
                    <section className="mb-4 pb-2">
                        <h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>
                            Profile Summary
                        </h5>
                        <p style={{ lineHeight: "1.6", fontSize: "0.95rem" }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && (
                    <section className="mb-4 pb-2">
                        <h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>
                            Job Experience
                        </h5>
                        {typeof data.experience === "string" ? (
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.experience}</p>
                        ) : (
                            <div className="mb-2" style={{ fontSize: "0.95rem" }}>
                                <div className="d-flex justify-content-between align-items-baseline fw-bold text-slate-800">
                                    <span>{data.experience.role}</span>
                                    <span className="text-muted small fw-normal">{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small" style={{ fontStyle: "italic" }}>
                                    <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                    {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                                </div>
                                {data.experience.description && (
                                    <p className="mt-2 mb-0" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                        {data.experience.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* Internship */}
                {data.internship && (
                    <section className="mb-4 pb-2">
                        <h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>
                            Internship
                        </h5>
                        <div className="mb-2" style={{ fontSize: "0.95rem" }}>
                            <div className="d-flex justify-content-between align-items-baseline fw-bold text-slate-800">
                                <span>{data.internship.field}</span>
                                <span className="text-muted small fw-normal">{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="text-muted small" style={{ fontStyle: "italic" }}>
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
                    if (!projs.length) return <section className="mb-4 pb-2"><h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>Academic &amp; Personal Projects</h5><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4 pb-2">
                            <h5 className="text-uppercase fw-bold border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>Academic &amp; Personal Projects</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #64748b", paddingLeft: "12px", paddingTop: "4px", paddingBottom: "4px", background: "#f8fafc", borderRadius: "0 6px 6px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b", marginBottom: "3px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>
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
                    <section className="mb-4 pb-2">
                        <h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>
                            Education
                        </h5>
                        <div className="space-y-3">
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-2" style={{ fontSize: "0.95rem" }}>
                                    <div className="fw-bold text-slate-800">{edu.course}</div>
                                    <div className="text-muted">{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {data.achievements && (
                    <section className="mb-4 pb-2">
                        <h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>
                            Achievements & Certifications
                        </h5>
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.achievements}</p>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section className="mb-4 pb-2">
                        <h5 className="text-uppercase fw-bold text-slate-800 border-bottom pb-2 mb-3" style={{ color: "#1e293b", letterSpacing: "0.5px" }}>
                            Skills &amp; Competencies
                        </h5>
                        <div className="d-flex flex-wrap gap-1.5 pt-1">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="bg-slate-200 text-slate-700 border-0 px-2.5 py-1 rounded small" style={{ fontSize: "0.8rem", backgroundColor: "#e2e8f0", fontWeight: "600", color: "#334155" }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
