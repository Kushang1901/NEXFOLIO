import React from "react";

export default function CreativeTemplate({ data }) {

    const links = data?.basics?.links || {};
    const getUsername = (url, type) => {
        if (!url) return "";

        try {
            const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

            if (type === "github") {
                return cleanUrl.replace("github.com/", "");
            }

            if (type === "linkedin") {
                return cleanUrl.replace("linkedin.com/in/", "");
            }

            if (type === "portfolio") {
                return cleanUrl;
            }

            return cleanUrl;
        } catch {
            return url;
        }
    };

    return (
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* HEADER */}
            <div className="text-center mb-4">
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "130px",
                            height: "130px",
                            objectFit: "cover",
                            borderRadius: "20px",
                            marginBottom: "15px",
                            border: "3px solid #333"
                        }}
                    />
                )}

                <h1 className="fw-bold">{data.basics.name}</h1>
                <p className="text-muted">
                    {data.basics.email} • {data.basics.phone}
                </p>
                {data.basics.role && (
                    <p className="fw-semibold mt-2">
                        {data.basics.role}
                    </p>
                )}

                <div className="d-flex align-items-center gap-4 mt-3 flex-wrap">
                    {links.github && (
                        <a
                            href={links.github}
                            target="_blank"
                            rel="noreferrer"
                            className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                        >
                            <i className="fab fa-github fa-lg text-dark"></i>
                            <span>{getUsername(links.github, "github")}</span>
                        </a>
                    )}

                    {links.linkedin && (
                        <a
                            href={links.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                        >
                            <i className="fab fa-linkedin fa-lg text-primary"></i>
                            <span>{getUsername(links.linkedin, "linkedin")}</span>
                        </a>
                    )}

                    {links.portfolio && (
                        <a
                            href={links.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                        >
                            <i className="fa-solid fa-globe fa-lg text-success"></i>
                            <span>{getUsername(links.portfolio, "portfolio")}</span>
                        </a>
                    )}
                </div>



            </div>

            {/* SUMMARY */}
            <div className="card p-4 mb-3">
                <h5 className="fw-bold">About Me</h5>
                <p>{data.summary}</p>
            </div>

            {/* EDUCATION */}
            <div className="card p-4 mb-3">
                <h5 className="fw-bold">Education</h5>
                {data.education.map((edu, i) => (
                    <p key={i}>
                        <strong>{edu.course}</strong><br />
                        {edu.start} – {edu.end}
                    </p>
                ))}
            </div>

            {/* EXPERIENCE */}
            {data.experience && (
                <div className="card p-4 mb-3">
                    <h5 className="fw-bold">Job Experience</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ whiteSpace: "pre-line" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold">{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small italic">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                            </div>
                            {data.experience.description && (
                                <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* INTERNSHIP */}
            {data.internship && (
                <div className="card p-4 mb-3">
                    <h5 className="fw-bold">Internship</h5>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span className="fw-bold">{data.internship.field}</span>
                            <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="text-muted small italic">
                            {data.internship.company}
                        </div>
                    </div>
                </div>
            )}

            {/* PROJECTS */}
            {data.projects && (() => {
                const lines = data.projects.split("\n");
                const projects = [];
                let current = null;
                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return;
                    if (trimmed.startsWith("-")) {
                        if (current) current.bullets.push(trimmed.replace(/^-\s*/, ""));
                    } else {
                        if (current) projects.push(current);
                        current = { name: trimmed, bullets: [] };
                    }
                });
                if (current) projects.push(current);
                if (!projects.length) return <div className="card p-4 mb-3"><h5 className="fw-bold">Projects</h5><p style={{ whiteSpace: "pre-line" }}>{data.projects}</p></div>;
                return (
                    <div className="card p-4 mb-3">
                        <h5 className="fw-bold">Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {projects.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #333", paddingLeft: "12px", paddingTop: "4px", paddingBottom: "4px", background: "#f8f8f8", borderRadius: "0 6px 6px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#222", marginBottom: "4px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "disc" }}>
                                            {proj.bullets.map((b, j) => (
                                                <li key={j} style={{ fontSize: "0.83rem", color: "#555", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* SKILLS */}
            {data.skills.length > 0 && (
                <div className="card p-4">
                    <h5 className="fw-bold">Skills</h5>
                    <p>{data.skills.join(", ")}</p>
                </div>
            )}

            {/* ACHIEVEMENTS / CERTIFICATIONS */}
            {data.achievements && (
                <div className="card p-4 mb-3">
                    <h5 className="fw-bold">Achievements & Certifications</h5>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {data.achievements}
                    </p>
                </div>
            )}

        </div>
    );
}
