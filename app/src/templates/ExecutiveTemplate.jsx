import React from "react";

export default function ExecutiveTemplate({ data }) {
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
            <div style={{ fontFamily: "Georgia, serif", color: "#1a1a1a", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                        if (!projs.length) return <section className="mb-4"><h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Key Projects</h5><p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p></section>;
                        return (
                            <section className="mb-4">
                                <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Key Projects</h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: "3px solid #1b2a4a", paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#f8fafc", borderRadius: "0 6px 6px 0" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1b2a4a", marginBottom: "4px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul className="text-muted" style={{ margin: 0, paddingLeft: "16px", fontSize: "0.83rem", lineHeight: "1.5" }}>
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
        <div style={{ fontFamily: "Georgia, serif", color: "#1a1a1a", minHeight: "297mm", boxSizing: "border-box", display: "flex", flexDirection: "column", width: "100%" }}>
            {/* Top Corporate Navy Header */}
            <div className="p-5 text-white d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ background: "#1b2a4a" }}>
                <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "36px", letterSpacing: "1px" }}>{data.basics.name}</h1>
                    {data.basics.role && (
                        <p className="text-uppercase tracking-wider fw-semibold mb-0" style={{ color: "#a5b4fc", fontSize: "14px" }}>
                            {data.basics.role}
                        </p>
                    )}
                </div>
                <div className="text-end small lh-base" style={{ minWidth: "200px" }}>
                    <div><i className="fa-solid fa-envelope me-2"></i>{data.basics.email}</div>
                    <div><i className="fa-solid fa-phone me-2"></i>{data.basics.phone}</div>
                    {links.linkedin && (
                        <div>
                            <i className="fa-brands fa-linkedin me-2"></i>
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-white text-decoration-none hover:underline">
                                {getUsername(links.linkedin, "linkedin")}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex flex-row flex-grow-1" style={{ flexGrow: 1 }}>
                {/* Left Gray Sidebar Column */}
                <div className="p-4" style={{ width: "35%", background: "#f1f5f9", borderRight: "1px solid #e2e8f0" }}>
                    {data.basics.photo && (
                        <div className="text-center mb-4">
                            <img src={data.basics.photo} alt="Profile" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%", border: "4px solid #1b2a4a" }} />
                        </div>
                    )}
                    {/* Links */}
                    {Object.keys(links).length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold border-bottom pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottomColor: "#cbd5e1" }}>Links & Socials</h6>
                            <div className="d-flex flex-column gap-2 small">
                                {links.github && (
                                    <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-dark hover:underline d-flex align-items-center gap-2">
                                        <i className="fab fa-github"></i>
                                        <span>{getUsername(links.github, "github")}</span>
                                    </a>
                                )}
                                {links.portfolio && (
                                    <a href={links.portfolio} target="_blank" rel="noreferrer" className="text-decoration-none text-dark hover:underline d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-globe"></i>
                                        <span>{getUsername(links.portfolio, "portfolio")}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div>
                            <h6 className="fw-bold border-bottom pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottomColor: "#cbd5e1" }}>Education</h6>
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-3 small">
                                    <div className="fw-bold text-dark">{edu.course}</div>
                                    <div className="text-muted">{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Content Column */}
                <div className="p-5" style={{ width: "65%" }}>
                    {/* Summary */}
                    {data.summary && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Executive Summary</h5>
                            <p className="small text-muted" style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}>{data.summary}</p>
                        </section>
                    )}

                    {/* Professional Experience */}
                    {data.experience && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Professional Experience</h5>
                            {typeof data.experience === "string" ? (
                                <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.experience}</p>
                            ) : (
                                <div className="mb-2 small text-muted">
                                    <div className="d-flex justify-content-between align-items-baseline text-dark fw-bold" style={{ color: "#1b2a4a" }}>
                                        <span>{data.experience.role}</span>
                                        <span>{data.experience.start} – {data.experience.end}</span>
                                    </div>
                                    <div className="d-flex justify-content-between italic">
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
                    {data.internship && (() => {
                        const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                            ? data.internship.bullets
                            : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                        return (
                            <section className="mb-4">
                                <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Internship</h5>
                                <div className="mb-2 small text-muted">
                                    <div className="d-flex justify-content-between align-items-baseline text-dark fw-bold" style={{ color: "#1b2a4a" }}>
                                        <span>{data.internship.field}</span>
                                        <span>{data.internship.start} – {data.internship.end}</span>
                                    </div>
                                    <div className="italic">
                                        {data.internship.company}
                                    </div>
                                    {bullets.length > 0 && (
                                        <ul style={{ margin: "6px 0 0", paddingLeft: "16px", listStyleType: "disc" }}>
                                            {bullets.map((b, i) => (
                                                <li key={i} style={{ color: "#475569", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        );
                    })()}

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
                        if (!projs.length) return <section className="mb-4"><h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Key Projects</h5><p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p></section>;
                        return (
                            <section className="mb-4">
                                <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Key Projects</h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: "3px solid #1b2a4a", paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#f8fafc", borderRadius: "0 6px 6px 0" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1b2a4a", marginBottom: "4px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul className="text-muted" style={{ margin: 0, paddingLeft: "16px", fontSize: "0.83rem", lineHeight: "1.5" }}>
                                                    {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })()}

                    {/* Achievements */}
                    {data.achievements && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Achievements & Leadership</h5>
                            <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.achievements}</p>
                        </section>
                    )}

                    {/* Skills & Expertise */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-4">
                            <h5 className="fw-bold pb-2 text-uppercase mb-3" style={{ color: "#1b2a4a", borderBottom: "2px solid #1b2a4a" }}>Skills &amp; Expertise</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: "0.78rem",
                                            fontWeight: "600",
                                            color: "#1b2a4a",
                                            backgroundColor: "#f1f5f9",
                                            border: "1px solid #cbd5e1",
                                            borderRadius: "6px",
                                            padding: "4px 10px",
                                            display: "inline-block"
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
