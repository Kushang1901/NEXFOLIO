import React from "react";

export default function DeveloperTemplate({ data }) {
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
            <div style={{ fontFamily: "monospace, 'Fira Code', 'Courier New'", color: "#1e293b", background: "#ffffff", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                        if (!projs.length) return <section className="mb-4"><h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const projects = () =&gt; &#123;</h5><p className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p><h5 className="fw-bold mt-2">&#125;</h5></section>;
                        return (
                            <section className="mb-4">
                                <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const projects = () =&gt; &#123;</h5>
                                <div style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "8px 12px" }}>
                                            <div className="fw-bold text-dark" style={{ fontSize: "0.9rem", marginBottom: "4px" }}>// {proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul className="text-muted" style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", lineHeight: "1.5" }}>
                                                    {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <h5 className="fw-bold mt-2">&#125;</h5>
                            </section>
                        );
                    })()}
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "monospace, 'Fira Code', 'Courier New'", color: "#1e293b", background: "#ffffff", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            <div className="d-flex flex-row" style={{ minHeight: "297mm", height: "100%" }}>
                {/* Left Side Console Column */}
                <div className="p-4 text-white" style={{ width: "35%", background: "#0f172a" }}>
                    {data.basics.photo && (
                        <div className="text-center mb-4">
                            <img
                                src={data.basics.photo}
                                alt="Profile"
                                style={{
                                    width: "110px",
                                    height: "110px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "2px solid #38bdf8",
                                    padding: "3px"
                                }}
                            />
                        </div>
                    )}

                    <h4 className="fw-bold mb-1" style={{ color: "#38bdf8" }}>{data.basics.name}</h4>
                    {data.basics.role && (
                        <p className="small text-muted mb-4" style={{ color: "#94a3b8 !important" }}>
                            &lt; {data.basics.role} /&gt;
                        </p>
                    )}

                    <div className="mb-4 small">
                        <div className="text-truncate"><i className="fa-solid fa-envelope me-2 text-info"></i>{data.basics.email}</div>
                        <div><i className="fa-solid fa-phone me-2 text-info"></i>{data.basics.phone}</div>
                    </div>

                    {/* Developer Links */}
                    <div className="mb-4">
                        <h6 className="fw-bold mb-3 small" style={{ color: "#38bdf8", letterSpacing: "1px" }}>// LINKS</h6>
                        <div className="d-flex flex-column gap-2 small">
                            {links.github && (
                                <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-white hover:text-info d-flex align-items-center gap-2">
                                    <i className="fab fa-github text-info"></i>
                                    <span>github/{getUsername(links.github, "github")}</span>
                                </a>
                            )}
                            {links.linkedin && (
                                <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none text-white hover:text-info d-flex align-items-center gap-2">
                                    <i className="fab fa-linkedin text-info"></i>
                                    <span>linkedin/{getUsername(links.linkedin, "linkedin")}</span>
                                </a>
                            )}
                            {links.portfolio && (
                                <a href={links.portfolio} target="_blank" rel="noreferrer" className="text-decoration-none text-white hover:text-info d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-globe text-info"></i>
                                    <span>web/{getUsername(links.portfolio, "portfolio")}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <div>
                            <h6 className="fw-bold mb-3 small" style={{ color: "#38bdf8", letterSpacing: "1px" }}>// EDUCATION</h6>
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-3 small">
                                    <div className="fw-bold text-white">{edu.course}</div>
                                    <div className="text-muted">{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Workspace Column */}
                <div className="p-5" style={{ width: "65%" }}>
                    {/* Summary */}
                    {data.summary && (
                        <section className="mb-4">
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const profile = () =&gt; &#123;</h5>
                            <p className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", lineHeight: "1.6" }}>{data.summary}</p>
                            <h5 className="fw-bold mt-2">&#125;</h5>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && (
                        <section className="mb-4">
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const jobExperience = () =&gt; &#123;</h5>
                            <div className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", lineHeight: "1.6" }}>
                                {typeof data.experience === "string" ? (
                                    <p style={{ whiteSpace: "pre-line" }}>{data.experience}</p>
                                ) : (
                                    <div className="mb-2">
                                        <div className="d-flex justify-content-between align-items-baseline text-dark fw-bold">
                                            <span>role: "{data.experience.role}"</span>
                                            <span>duration: "{data.experience.start} - {data.experience.end}"</span>
                                        </div>
                                        <div>
                                            company: "{data.experience.company}"{data.experience.location && `, location: "${data.experience.location}"`}
                                            {data.experience.salary && `, salary: "${data.experience.salary}"`}
                                        </div>
                                        {data.experience.description && (
                                            <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                                                // details:<br />
                                                {data.experience.description}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <h5 className="fw-bold mt-2">&#125;</h5>
                        </section>
                    )}

                    {/* Internship */}
                    {data.internship && (
                        <section className="mb-4">
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const internship = () =&gt; &#123;</h5>
                            <div className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", lineHeight: "1.6" }}>
                                <div className="d-flex justify-content-between align-items-baseline text-dark fw-bold">
                                    <span>field: "{data.internship.field}"</span>
                                    <span>duration: "{data.internship.start} - {data.internship.end}"</span>
                                </div>
                                <div>company: "{data.internship.company}"</div>
                            </div>
                            <h5 className="fw-bold mt-2">&#125;</h5>
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
                        if (!projs.length) return <section className="mb-4"><h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const projects = () =&gt; &#123;</h5><p className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p><h5 className="fw-bold mt-2">&#125;</h5></section>;
                        return (
                            <section className="mb-4">
                                <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const projects = () =&gt; &#123;</h5>
                                <div style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", padding: "8px 12px" }}>
                                            <div className="fw-bold text-dark" style={{ fontSize: "0.9rem", marginBottom: "4px" }}>// {proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul className="text-muted" style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", lineHeight: "1.5" }}>
                                                    {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <h5 className="fw-bold mt-2">&#125;</h5>
                            </section>
                        );
                    })()}

                    {/* Achievements */}
                    {data.achievements && (
                        <section className="mb-4">
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const achievements = () =&gt; &#123;</h5>
                            <p className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.achievements}</p>
                            <h5 className="fw-bold mt-2">&#125;</h5>
                        </section>
                    )}

                    {/* Tech Stack */}
                    {data.skills && data.skills.length > 0 && (
                        <section className="mb-4">
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const techStack = () =&gt; &#123;</h5>
                            <div className="d-flex flex-wrap gap-2" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1" }}>
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="badge px-2.5 py-1.5 small" style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#0284c7", fontWeight: "600" }}>
                                        "{skill}"
                                    </span>
                                ))}
                            </div>
                            <h5 className="fw-bold mt-2">&#125;</h5>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
