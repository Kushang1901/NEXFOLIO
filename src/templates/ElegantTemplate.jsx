import React from "react";

export default function ElegantTemplate({ data }) {
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
        <div className="p-5" style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", color: "#2d3748", minHeight: "297mm", boxSizing: "border-box", width: "100%" }}>
            {/* Header */}
            <div className="text-center mb-5">
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginBottom: "16px",
                            border: "1px double #4a5568",
                            padding: "4px"
                        }}
                    />
                )}
                <h1 className="fw-normal mb-2" style={{ fontStyle: "italic", fontSize: "38px" }}>{data.basics.name}</h1>
                {data.basics.role && (
                    <p className="text-uppercase tracking-widest text-muted small fw-semibold mb-3" style={{ fontSize: "12px", letterSpacing: "2px" }}>
                        {data.basics.role}
                    </p>
                )}
                <div className="d-flex justify-content-center align-items-center gap-3 text-muted small flex-wrap" style={{ fontFamily: "Georgia, serif" }}>
                    <span>{data.basics.email}</span>
                    <span>|</span>
                    <span>{data.basics.phone}</span>
                    {links.github && (
                        <>
                            <span>|</span>
                            <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-muted">
                                GitHub: {getUsername(links.github, "github")}
                            </a>
                        </>
                    )}
                    {links.linkedin && (
                        <>
                            <span>|</span>
                            <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none text-muted">
                                LinkedIn: {getUsername(links.linkedin, "linkedin")}
                            </a>
                        </>
                    )}
                </div>
                <div className="border-bottom mt-4" style={{ borderBottom: "1px double #cbd5e1" }}></div>
            </div>

            {/* Profile Summary */}
            {data.summary && (
                <div className="mb-4">
                    <h5 className="fw-semibold text-center text-uppercase mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Summary</h5>
                    <p className="small text-center text-muted mx-auto" style={{ maxWidth: "680px", lineHeight: "1.7", fontStyle: "italic" }}>{data.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience && (
                <div className="mb-4">
                    <h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Professional Experience</h5>
                    {typeof data.experience === "string" ? (
                        <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.7", paddingLeft: "12px" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3 small text-muted" style={{ paddingLeft: "12px" }}>
                            <div className="d-flex justify-content-between align-items-baseline text-dark fw-semibold" style={{ fontStyle: "italic" }}>
                                <span>{data.experience.role}</span>
                                <span style={{ fontStyle: "normal" }}>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between italic small">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                            </div>
                            {data.experience.description && (
                                <p className="mt-2 text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.7", fontStyle: "normal" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Internship */}
            {data.internship && (
                <div className="mb-4">
                    <h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Internship</h5>
                    <div className="mb-2 small text-muted" style={{ paddingLeft: "12px" }}>
                        <div className="d-flex justify-content-between align-items-baseline text-dark fw-semibold" style={{ fontStyle: "italic" }}>
                            <span>{data.internship.field}</span>
                            <span style={{ fontStyle: "normal" }}>{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="italic">
                            {data.internship.company}
                        </div>
                    </div>
                </div>
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
                if (!projs.length) return <div className="mb-4"><h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Selected Projects</h5><p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.7", paddingLeft: "12px" }}>{data.projects}</p></div>;
                return (
                    <div className="mb-4">
                        <h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Selected Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "12px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #4a5568", paddingLeft: "12px" }}>
                                    <div className="fw-semibold text-dark" style={{ fontStyle: "italic", fontSize: "0.92rem", marginBottom: "4px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul className="text-muted" style={{ margin: 0, paddingLeft: "16px", fontSize: "0.85rem", lineHeight: "1.6" }}>
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
                    <h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Academic History</h5>
                    <div className="row g-3 px-2">
                        {data.education.map((edu, i) => (
                            <div key={i} className="col-6 small text-muted">
                                <div className="fw-semibold text-dark" style={{ fontStyle: "italic" }}>{edu.course}</div>
                                <div>Years: {edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements */}
            {data.achievements && (
                <div className="mb-4">
                    <h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Achievements & Leadership</h5>
                    <p className="small text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.7", paddingLeft: "12px" }}>{data.achievements}</p>
                </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <div>
                    <h5 className="fw-semibold text-uppercase border-bottom pb-2 mb-3" style={{ fontSize: "16px", letterSpacing: "1.5px" }}>Skills</h5>
                    <p className="small text-muted px-2" style={{ wordSpacing: "2px" }}>
                        {data.skills.join("  •  ")}
                    </p>
                </div>
            )}
        </div>
    );
}
