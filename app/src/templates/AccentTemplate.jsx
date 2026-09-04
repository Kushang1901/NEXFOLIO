import React from "react";

export default function AccentTemplate({ data }) {
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
            <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#1e293b", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                    if (!projs.length) return <section className="mb-4"><h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Projects</h6><p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4">
                            <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Projects</h6>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #0083b0", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#f0f9ff", borderRadius: "0 4px 4px 0" }}>
                                        <div className="fw-bold" style={{ fontSize: "0.88rem", color: "#0083b0", marginBottom: "3px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul className="text-muted" style={{ margin: 0, paddingLeft: "14px", fontSize: "0.8rem", lineHeight: "1.5" }}>
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
        <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#1e293b", minHeight: "297mm", boxSizing: "border-box", width: "100%", display: "flex", flexDirection: "column" }}>
            {/* Top Accent Color Line */}
            <div style={{ height: "6px", background: "linear-gradient(to right, #00b4db, #0083b0)" }}></div>

            <div className="p-5 flex-grow-1" style={{ flexGrow: 1 }}>
                {/* Header Grid */}
                <div className="row align-items-center mb-4">
                    <div className={data.basics.photo ? "col-8" : "col-12"}>
                        <h2 className="fw-bold mb-1" style={{ color: "#0083b0" }}>{data.basics.name}</h2>
                        {data.basics.role && (
                            <p className="text-uppercase tracking-wider fw-semibold text-secondary small mb-3">
                                {data.basics.role}
                            </p>
                        )}
                        <div className="d-flex flex-wrap gap-3 small text-muted">
                            <span><i className="fa-solid fa-envelope me-1"></i>{data.basics.email}</span>
                            <span><i className="fa-solid fa-phone me-1"></i>{data.basics.phone}</span>
                        </div>
                    </div>
                    {data.basics.photo && (
                        <div className="col-4 text-end">
                            <img
                                src={data.basics.photo}
                                alt="Profile"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    border: "2px solid #0083b0",
                                    padding: "2px"
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Social Links Row */}
                {Object.keys(links).length > 0 && (
                    <div className="d-flex gap-4 border-top border-bottom py-2 mb-4 small flex-wrap">
                        {links.github && (
                            <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-secondary hover:text-dark d-flex align-items-center gap-1">
                                <i className="fab fa-github text-primary"></i>
                                <span>{getUsername(links.github, "github")}</span>
                            </a>
                        )}
                        {links.linkedin && (
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none text-secondary hover:text-dark d-flex align-items-center gap-1">
                                <i className="fab fa-linkedin text-primary"></i>
                                <span>{getUsername(links.linkedin, "linkedin")}</span>
                            </a>
                        )}
                        {links.portfolio && (
                            <a href={links.portfolio} target="_blank" rel="noreferrer" className="text-decoration-none text-secondary hover:text-dark d-flex align-items-center gap-1">
                                <i className="fa-solid fa-globe text-primary"></i>
                                <span>{getUsername(links.portfolio, "portfolio")}</span>
                            </a>
                        )}
                    </div>
                )}

                {/* Summary */}
                {data.summary && (
                    <section className="mb-4">
                        <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Profile Summary</h6>
                        <p className="small text-muted" style={{ lineHeight: "1.6" }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && (
                    <section className="mb-4">
                        <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Job Experience</h6>
                        {typeof data.experience === "string" ? (
                            <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.experience}</p>
                        ) : (
                            <div className="mb-2 small text-muted">
                                <div className="d-flex justify-content-between align-items-baseline text-dark fw-bold">
                                    <span>{data.experience.role}</span>
                                    <span>{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="d-flex justify-content-between italic small">
                                    <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                    {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                                </div>
                                {data.experience.description && (
                                    <p className="mt-2 text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
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
                        <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Internship</h6>
                        <div className="mb-2 small text-muted">
                            <div className="d-flex justify-content-between align-items-baseline text-dark fw-bold">
                                <span>{data.internship.field}</span>
                                <span>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="italic">
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
                    if (!projs.length) return <section className="mb-4"><h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Projects</h6><p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4">
                            <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Projects</h6>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #0083b0", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#f0f9ff", borderRadius: "0 4px 4px 0" }}>
                                        <div className="fw-bold" style={{ fontSize: "0.88rem", color: "#0083b0", marginBottom: "3px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul className="text-muted" style={{ margin: 0, paddingLeft: "14px", fontSize: "0.8rem", lineHeight: "1.5" }}>
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
                        <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Education & Credentials</h6>
                        <div className="row g-2">
                            {data.education.map((edu, i) => (
                                <div key={i} className="col-6 small text-muted">
                                    <div className="fw-bold text-dark">{edu.course}</div>
                                    <div>{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {data.achievements && (
                    <section className="mb-4">
                        <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Achievements</h6>
                        <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.achievements}</p>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h6 className="fw-bold text-uppercase pb-1 mb-2" style={{ color: "#0083b0", borderBottom: "1px solid #e2e8f0" }}>Key Competencies</h6>
                        <div className="d-flex flex-wrap gap-2 pt-1">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="badge rounded-pill text-dark border px-2 py-1 small" style={{ background: "#f8f9fa", borderColor: "#cbd5e1" }}>
                                    ● {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
