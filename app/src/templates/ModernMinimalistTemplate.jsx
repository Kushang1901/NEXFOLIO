import React from "react";

export default function ModernMinimalistTemplate({ data }) {
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
            <div className="p-5" style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#111111", lineHeight: "1.5", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
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
                if (!projs.length) return <section className="mb-4"><h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>Projects</h5><p className="text-dark" style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #111", paddingLeft: "12px", paddingTop: "4px", paddingBottom: "4px" }}>
                                    <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "#111", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul className="text-muted" style={{ margin: 0, paddingLeft: "14px", fontSize: "0.84rem", lineHeight: "1.5" }}>
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
        <div className="p-5" style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: "#111111", lineHeight: "1.5", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* Header Section */}
            <div className="pb-4 mb-4" style={{ borderBottom: "2px solid #111111" }}>
                <div className="d-flex flex-row justify-content-between align-items-start gap-4">
                    <div className="d-flex align-items-center gap-3">
                        {data.basics.photo && (
                            <img src={data.basics.photo} alt="Profile" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", border: "2px solid #111", flexShrink: 0 }} />
                        )}
                        <div>
                            <h1 className="fw-extrabold mb-1" style={{ fontSize: "2.5rem", letterSpacing: "-0.5px", fontWeight: "800" }}>
                                {data.basics.name}
                            </h1>
                            {data.basics.role && (
                                <p className="text-uppercase fw-bold text-muted mb-0" style={{ letterSpacing: "1.5px", fontSize: "0.9rem" }}>
                                    {data.basics.role}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="small text-md-end" style={{ fontWeight: "500" }}>
                        <div>{data.basics.email}</div>
                        <div>{data.basics.phone}</div>
                        <div className="mt-1">
                            {links.linkedin && (
                                <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-dark text-decoration-none hover:underline me-3">
                                    LinkedIn: {getUsername(links.linkedin, "linkedin")}
                                </a>
                            )}
                            {links.github && (
                                <a href={links.github} target="_blank" rel="noreferrer" className="text-dark text-decoration-none hover:underline">
                                    GitHub: {getUsername(links.github, "github")}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <section className="mb-4">
                    <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>
                        Profile
                    </h5>
                    <p className="text-dark" style={{ fontSize: "0.95rem" }}>{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>
                        Experience
                    </h5>
                    {typeof data.experience === "string" ? (
                        <p className="text-dark" style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2 text-dark" style={{ fontSize: "0.95rem" }}>
                            <div className="d-flex justify-content-between align-items-baseline fw-bold">
                                <span>{data.experience.role}</span>
                                <span>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                            </div>
                            {data.experience.description && (
                                <p className="mt-2 text-dark" style={{ whiteSpace: "pre-line" }}>
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
                    <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>
                        Internship
                    </h5>
                    <div className="mb-2 text-dark" style={{ fontSize: "0.95rem" }}>
                        <div className="d-flex justify-content-between align-items-baseline fw-bold">
                            <span>{data.internship.field}</span>
                            <span>{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="text-muted small">
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
                if (!projs.length) return <section className="mb-4"><h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>Projects</h5><p className="text-dark" style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #111", paddingLeft: "12px", paddingTop: "4px", paddingBottom: "4px" }}>
                                    <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "#111", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul className="text-muted" style={{ margin: 0, paddingLeft: "14px", fontSize: "0.84rem", lineHeight: "1.5" }}>
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
                    <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>
                        Education
                    </h5>
                    <div className="row g-3">
                        {data.education.map((edu, i) => (
                            <div key={i} className="col-6" style={{ fontSize: "0.95rem" }}>
                                <div className="fw-bold">{edu.course}</div>
                                <div className="text-muted">{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements */}
            {data.achievements && (
                <section className="mb-4">
                    <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>
                        Achievements & Certifications
                    </h5>
                    <p className="text-dark" style={{ whiteSpace: "pre-line", fontSize: "0.95rem" }}>{data.achievements}</p>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <h5 className="text-uppercase fw-bold mb-2" style={{ letterSpacing: "1px", fontWeight: "700" }}>
                        Skills
                    </h5>
                    <div className="d-flex flex-wrap gap-2 pt-1">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="border border-dark text-dark px-3 py-1 text-center" style={{ fontSize: "0.85rem", fontWeight: "500" }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
