import React from "react";

export default function IvyLeagueTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    
    if (data?.isPage2) {
        return (
            <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "Georgia, 'Times New Roman', Times, serif", color: "#111", lineHeight: "1.5" }}>
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
                if (!projs.length) return <section className="mb-4"><h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>RESEARCH &amp; PUBLICATIONS</h5><p style={{ fontSize: "12px", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></section>;
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>RESEARCH &amp; PUBLICATIONS</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #555", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px" }}>
                                    <div style={{ fontWeight: "700", fontStyle: "italic", fontSize: "12px", color: "#111", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#333", lineHeight: "1.5" }}>
                                            {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
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
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "Georgia, 'Times New Roman', Times, serif", color: "#111", lineHeight: "1.5" }}>
            {/* HEADER */}
            <div className={`d-flex align-items-center justify-content-center gap-4 mb-4 ${data.basics.photo ? "flex-row text-start" : "flex-column text-center"}`}>
                {data.basics.photo && (
                    <img src={data.basics.photo} alt="Profile" style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "50%", border: "1px solid #777", flexShrink: 0 }} />
                )}
                <div className={data.basics.photo ? "text-start" : "text-center"}>
                    <h1 className="fw-normal mb-1" style={{ fontSize: "28px" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="text-uppercase text-secondary mb-2" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>{data.basics.role}</h5>}
                    <div style={{ fontSize: "11.5px", color: "#555" }}>
                        <span>{data.basics.email}</span>
                        <span className="mx-2">•</span>
                        <span>{data.basics.phone}</span>
                    </div>
                    <div className="mt-1" style={{ fontSize: "11.5px", color: "#555" }}>
                        {links.linkedin && (
                            <span className="me-3">LinkedIn: {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                        {links.portfolio && (
                            <span>Portfolio: {links.portfolio.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* ABSTRACT / SUMMARY */}
            <section className="mb-4">
                <h5 className="fw-bold text-center mb-2" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>RESEARCH PROFILE</h5>
                <p style={{ fontSize: "12px", textAlign: "justify", margin: 0 }}>{data.summary}</p>
            </section>

            {/* EDUCATION */}
            <section className="mb-4">
                <h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>EDUCATION</h5>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2" style={{ fontSize: "12.5px" }}>
                        <div className="d-flex justify-content-between">
                            <strong>{edu.course}</strong>
                            <span>{edu.start} – {edu.end}</span>
                        </div>
                        {edu.college && <div className="text-muted fst-italic" style={{ fontSize: "11.5px" }}>{edu.college}</div>}
                    </div>
                ))}
            </section>

            {/* EXPERIENCE / RESEARCH APPOINTMENTS */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>PROFESSIONAL APPOINTMENTS</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "12px", whiteSpace: "pre-line", margin: 0, lineHeight: "1.6" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3" style={{ fontSize: "12.5px" }}>
                            <div className="d-flex justify-content-between">
                                <strong>{data.experience.role}</strong>
                                <span>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="text-muted fst-italic mb-1" style={{ fontSize: "11.5px" }}>
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "12px", color: "#333", whiteSpace: "pre-line", margin: 0, lineHeight: "1.6" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* FELLOWSHIPS & INTERNSHIPS */}
            {data.internship && (() => {
                const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                    ? data.internship.bullets
                    : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>FELLOWSHIPS &amp; INTERNSHIPS</h5>
                        <div style={{ fontSize: "12.5px" }}>
                            <div className="d-flex justify-content-between">
                                <strong>{data.internship.field}</strong>
                                <span>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="text-muted fst-italic" style={{ fontSize: "11.5px", marginTop: "2px" }}>
                                {data.internship.company}
                            </div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "6px 0 0", paddingLeft: "18px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ fontSize: "11.5px", color: "#222", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                );
            })()}

            {/* AWARDS & HONORS */}
            {data.achievements && (
                <section className="mb-4">
                    <h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>HONORS, GRANTS &amp; FELLOWSHIPS</h5>
                    <p style={{ fontSize: "12px", whiteSpace: "pre-line", margin: 0, lineHeight: "1.6" }}>{data.achievements}</p>
                </section>
            )}

            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-3">
                    <h5 className="fw-bold text-center mb-2" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>SKILLS &amp; FIELD EXPERTISE</h5>
                    <p style={{ fontSize: "12px", textAlign: "center", margin: 0, lineHeight: "1.6" }}>{data.skills.join(" • ")}</p>
                </section>
            )}

            {/* Fallback projects for single-page PNG export */}
            {data.projects && !data.isPage2 && (() => {
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
                if (!projs.length) return null;
                return (
                    <section className="mb-4">
                        <h5 className="fw-bold text-center mb-3" style={{ fontSize: "12px", letterSpacing: "1px", borderBottom: "1px solid #777", paddingBottom: "2px" }}>RESEARCH &amp; PUBLICATIONS</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #555", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px" }}>
                                    <div style={{ fontWeight: "700", fontStyle: "italic", fontSize: "12px", color: "#111", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#333", lineHeight: "1.5" }}>
                                            {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
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
