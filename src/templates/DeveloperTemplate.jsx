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

    return (
        <div style={{ fontFamily: "monospace, 'Fira Code', 'Courier New'", color: "#1e293b", background: "#ffffff" }}>
            <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100%" }}>
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

                    {/* Tech Stack */}
                    {data.skills && data.skills.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-bold mb-3 small" style={{ color: "#38bdf8", letterSpacing: "1px" }}>// TECH_STACK</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="badge px-2 py-1 small" style={{ background: "#1e293b", border: "1px solid #334155", color: "#38bdf8" }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

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
                    {data.projects && (
                        <section className="mb-4">
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const projects = () =&gt; &#123;</h5>
                            <p className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.projects}</p>
                            <h5 className="fw-bold mt-2">&#125;</h5>
                        </section>
                    )}

                    {/* Achievements */}
                    {data.achievements && (
                        <section>
                            <h5 className="fw-bold mb-3" style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>const achievements = () =&gt; &#123;</h5>
                            <p className="small text-muted" style={{ paddingLeft: "16px", borderLeft: "2px dashed #cbd5e1", whiteSpace: "pre-line", lineHeight: "1.6" }}>{data.achievements}</p>
                            <h5 className="fw-bold mt-2">&#125;</h5>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
