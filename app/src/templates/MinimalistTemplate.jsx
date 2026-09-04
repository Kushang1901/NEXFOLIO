import React from "react";

export default function MinimalistTemplate({ data }) {
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
            <div className="p-5" style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#2d3748", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
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
                if (!projs.length) return <div className="mb-4"><h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Projects</h6><p className="text-muted small" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p></div>;
                return (
                    <div className="mb-4">
                        <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Projects</h6>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #6b7280", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px" }}>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "0.88rem", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul className="text-muted" style={{ margin: 0, paddingLeft: "14px", fontSize: "0.82rem", lineHeight: "1.5" }}>
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
        <div className="p-5" style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#2d3748", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* Header */}
            <div className="text-center mb-5">
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginBottom: "16px",
                            border: "1px solid #e2e8f0",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }}
                    />
                )}
                <h1 className="fw-light mb-1" style={{ letterSpacing: "1.5px" }}>{data.basics.name?.toUpperCase()}</h1>
                {data.basics.role && (
                    <p className="text-uppercase text-muted small fw-semibold tracking-wider mb-3" style={{ letterSpacing: "1px" }}>
                        {data.basics.role}
                    </p>
                )}
                <div className="d-flex justify-content-center align-items-center gap-3 text-muted small flex-wrap">
                    <span>{data.basics.email}</span>
                    <span>•</span>
                    <span>{data.basics.phone}</span>
                    {Object.keys(links).length > 0 && <span>•</span>}
                    {links.github && (
                        <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-muted">
                            GitHub: {getUsername(links.github, "github")}
                        </a>
                    )}
                    {links.linkedin && (
                        <>
                            <span>•</span>
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none text-muted">
                                LinkedIn: {getUsername(links.linkedin, "linkedin")}
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* Profile Summary */}
            {data.summary && (
                <div className="mb-4">
                    <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Profile</h6>
                    <p className="text-muted small" style={{ lineHeight: "1.6" }}>{data.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience && (
                <div className="mb-4">
                    <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Job Experience</h6>
                    {typeof data.experience === "string" ? (
                        <p className="text-muted small" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2 text-muted small">
                            <div className="d-flex justify-content-between align-items-baseline text-dark fw-semibold">
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
                </div>
            )}

            {/* Internship */}
            {data.internship && (() => {
                const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                    ? data.internship.bullets
                    : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                return (
                    <div className="mb-4">
                        <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Internship</h6>
                        <div className="mb-2 text-muted small">
                            <div className="d-flex justify-content-between align-items-baseline text-dark fw-semibold">
                                <span>{data.internship.field}</span>
                                <span>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="italic">
                                {data.internship.company}
                            </div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "6px 0 0", paddingLeft: "16px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ color: "#4b5563", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            })()}

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
                if (!projs.length) return <div className="mb-4"><h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Projects</h6><p className="text-muted small" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p></div>;
                return (
                    <div className="mb-4">
                        <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Projects</h6>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #6b7280", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px" }}>
                                    <div className="fw-semibold text-dark" style={{ fontSize: "0.88rem", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul className="text-muted" style={{ margin: 0, paddingLeft: "14px", fontSize: "0.82rem", lineHeight: "1.5" }}>
                                            {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <div className="mb-4">
                    <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Education</h6>
                    <div className="row g-3">
                        {data.education.map((edu, i) => (
                            <div key={i} className="col-6 small text-muted">
                                <div className="fw-semibold text-dark">{edu.course}</div>
                                <div>{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {data.achievements && (
                <div className="mb-4">
                    <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Achievements & Certifications</h6>
                    <p className="text-muted small" style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.achievements}</p>
                </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <div>
                    <h6 className="text-uppercase fw-semibold border-bottom pb-2 mb-3 text-secondary" style={{ letterSpacing: "1px" }}>Skills</h6>
                    <div className="d-flex flex-wrap gap-2 pt-1">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="bg-light text-secondary border px-3 py-1 rounded-pill small" style={{ fontSize: "12px" }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
