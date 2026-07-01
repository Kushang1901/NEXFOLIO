import React from "react";

export default function NavyEleganceTemplate({ data }) {
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
        <div style={{ fontFamily: "Georgia, serif", color: "#2d3748", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* Header Banner */}
            <div className="p-5 text-white" style={{ background: "#0f172a", borderBottom: "5px solid #3b82f6" }}>
                <div className="d-flex flex-row align-items-center justify-content-between gap-4">
                    <div className="d-flex align-items-center gap-4">
                        {data.basics.photo && (
                            <img
                                src={data.basics.photo}
                                alt="Profile"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "3px solid #3b82f6"
                                }}
                            />
                        )}
                        <div>
                            <h1 className="fw-bold mb-1" style={{ fontSize: "2.25rem", letterSpacing: "0.5px" }}>{data.basics.name}</h1>
                            {data.basics.role && (
                                <p className="text-info fw-semibold text-uppercase mb-0" style={{ letterSpacing: "1px", color: "#60a5fa" }}>
                                    {data.basics.role}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-md-end small" style={{ opacity: 0.9, lineHeight: "1.6" }}>
                        <div><i className="fas fa-envelope me-2"></i>{data.basics.email}</div>
                        <div><i className="fas fa-phone me-2"></i>{data.basics.phone}</div>
                        <div className="d-flex flex-wrap gap-3 mt-2 justify-content-md-end">
                            {links.linkedin && (
                                <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-white text-decoration-none hover:underline">
                                    <i className="fab fa-linkedin me-1"></i>{getUsername(links.linkedin, "linkedin")}
                                </a>
                            )}
                            {links.github && (
                                <a href={links.github} target="_blank" rel="noreferrer" className="text-white text-decoration-none hover:underline">
                                    <i className="fab fa-github me-1"></i>{getUsername(links.github, "github")}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {/* Summary */}
                {data.summary && (
                    <section className="mb-4">
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Professional Summary
                        </h4>
                        <p style={{ lineHeight: "1.6", fontSize: "0.95rem" }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && (
                    <section className="mb-4">
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Professional Experience
                        </h4>
                        {typeof data.experience === "string" ? (
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.experience}</p>
                        ) : (
                            <div className="mb-2 text-dark" style={{ fontSize: "0.95rem" }}>
                                <div className="d-flex justify-content-between align-items-baseline fw-bold">
                                    <span>{data.experience.role}</span>
                                    <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="d-flex justify-content-between text-muted small italic">
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
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Internship
                        </h4>
                        <div className="mb-2 text-dark" style={{ fontSize: "0.95rem" }}>
                            <div className="d-flex justify-content-between align-items-baseline fw-bold">
                                <span>{data.internship.field}</span>
                                <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="italic text-muted small">
                                {data.internship.company}
                            </div>
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects && (
                    <section className="mb-4">
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Key Projects
                        </h4>
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.projects}</p>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section className="mb-4">
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Education
                        </h4>
                        <div className="row g-3">
                            {data.education.map((edu, i) => (
                                <div key={i} className="col-6" style={{ fontSize: "0.95rem" }}>
                                    <div className="fw-bold text-dark">{edu.course}</div>
                                    <div className="text-muted">{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {data.achievements && (
                    <section className="mb-4">
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Achievements & Certifications
                        </h4>
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "0.95rem" }}>{data.achievements}</p>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h4 className="fw-bold text-uppercase border-bottom pb-2 mb-3" style={{ color: "#0f172a", letterSpacing: "1px", fontSize: "1.25rem" }}>
                            Skills
                        </h4>
                        <div className="d-flex flex-wrap gap-2 pt-1">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="badge bg-secondary text-white px-3 py-2 rounded-1" style={{ fontSize: "0.85rem", background: "#334155 !important" }}>
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
