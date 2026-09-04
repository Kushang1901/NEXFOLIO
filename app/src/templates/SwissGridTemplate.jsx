import React from "react";

export default function SwissGridTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    
    if (data?.isPage2) {
        return (
            <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#111" }}>
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
                    if (!projs.length) return <div className="row"><div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>Projects</div><div className="col-9" style={{ fontSize: "12px", lineHeight: "1.5", color: "#333", whiteSpace: "pre-line" }}>{data.projects}</div></div>;
                    return (
                        <div className="row">
                            <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>Projects</div>
                            <div className="col-9">
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: "2px solid #111", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px" }}>
                                            <div style={{ fontWeight: "800", fontSize: "12px", color: "#111", marginBottom: "3px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#333", lineHeight: "1.5" }}>
                                                    {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        );
    }

    return (
        <div style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: "#111", padding: "2.5rem 3rem" }}>
            {/* TOP HEADER */}
            <div className="row align-items-start pb-3 mb-4" style={{ borderBottom: "3px solid #111111" }}>
                {data.basics.photo && (
                    <div className="col-2">
                        <img src={data.basics.photo} alt="Profile" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "0", border: "2px solid #111", display: "block" }} />
                    </div>
                )}
                <div className={data.basics.photo ? "col-6" : "col-8"}>
                    <h1 className="fw-bold mb-0 text-uppercase" style={{ fontSize: "30px", letterSpacing: "-0.5px" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="text-secondary mb-0 mt-1" style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>{data.basics.role}</h5>}
                </div>
                <div className="col-4 text-end" style={{ fontSize: "11px", lineHeight: "1.4" }}>
                    <div>{data.basics.email}</div>
                    <div>{data.basics.phone}</div>
                    {links.linkedin && <div>{links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                    {links.github && <div>{links.github.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                </div>
            </div>

            {/* SWISS SECTION MAPPING HELPERS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* SUMMARY */}
                {data.summary && (
                    <div className="row">
                        <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#111" }}>Profile</div>
                        <div className="col-9" style={{ fontSize: "12.5px", lineHeight: "1.65", color: "#222" }}>{data.summary}</div>
                    </div>
                )}

                {/* EXPERIENCE */}
                {data.experience && (
                    <div className="row">
                        <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#111" }}>Experience</div>
                        <div className="col-9">
                            {typeof data.experience === "string" ? (
                                <p style={{ fontSize: "12.5px", lineHeight: "1.6", whiteSpace: "pre-line", margin: 0, color: "#222" }}>{data.experience}</p>
                            ) : (
                                <div className="mb-2">
                                    <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                        <span>{data.experience.role}</span>
                                        <span>{data.experience.start} – {data.experience.end}</span>
                                    </div>
                                    <div className="text-muted mb-1.5" style={{ fontSize: "11.5px", fontWeight: "600", marginTop: "2px" }}>
                                        {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                                    </div>
                                    {data.experience.description && (
                                        <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#333", whiteSpace: "pre-line", margin: 0 }}>
                                            {data.experience.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* INTERNSHIP */}
                {data.internship && (
                    <div className="row">
                        <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#111" }}>Internship</div>
                        <div className="col-9">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                <span>{data.internship.field}</span>
                                <span>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div className="text-muted" style={{ fontSize: "11.5px", fontStyle: "italic", marginTop: "3px" }}>
                                {data.internship.company}
                            </div>
                        </div>
                    </div>
                )}

                {/* EDUCATION */}
                {data.education && data.education.length > 0 && (
                    <div className="row">
                        <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#111" }}>Education</div>
                        <div className="col-9">
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-2">
                                    <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                        <span>{edu.course}</span>
                                        <span>{edu.start} – {edu.end}</span>
                                    </div>
                                    {edu.college && (
                                        <div className="text-muted" style={{ fontSize: "11.5px", marginTop: "2px" }}>
                                            {edu.college}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SKILLS */}
                {data.skills && data.skills.length > 0 && (
                    <div className="row">
                        <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#111" }}>Expertise</div>
                        <div className="col-9">
                            <div className="d-flex flex-wrap gap-2">
                                {data.skills.map((skill, idx) => (
                                    <span key={idx} style={{ fontSize: "11.5px", border: "1.5px solid #000", padding: "4px 10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ACHIEVEMENTS */}
                {data.achievements && (
                    <div className="row">
                        <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#111" }}>Honors</div>
                        <div className="col-9" style={{ fontSize: "12px", lineHeight: "1.6", color: "#333", whiteSpace: "pre-line" }}>
                            {data.achievements}
                        </div>
                    </div>
                )}

                {/* Fallback projects if single page */}
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
                        <div className="row">
                            <div className="col-3 fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px" }}>Projects</div>
                            <div className="col-9">
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: "2px solid #111", paddingLeft: "10px", paddingTop: "3px", paddingBottom: "3px" }}>
                                            <div style={{ fontWeight: "800", fontSize: "12px", color: "#111", marginBottom: "3px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11.5px", color: "#333", lineHeight: "1.5" }}>
                                                    {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
