import React from "react";

export default function DataAnalystTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    
    if (data?.isPage2) {
        return (
            <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', -apple-system, sans-serif", color: "#1e293b" }}>
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
                    if (!projs.length) return <section className="mb-4"><h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Data Projects</h5><p style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4">
                            <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "12px", color: "#0f172a", letterSpacing: "1px" }}>Data Projects</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #0891b2", paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px", background: "#f0f9ff", borderRadius: "0 4px 4px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "12px", color: "#0891b2", marginBottom: "4px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#334155", lineHeight: "1.5" }}>
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
        <div style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b", background: "#fff", padding: "2.5rem 3rem" }}>
            {/* TOP ACCENT LINE */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #0891b2, #06b6d4, #67e8f9)", marginBottom: "20px" }}></div>

            {/* HEADER WITH CONTACTS BELOW ROLE */}
            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "24px" }}>
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "3px solid #0891b2",
                            flexShrink: 0
                        }}
                    />
                )}
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>{data.basics.name}</h1>
                    {data.basics.role && (
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0891b2", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>
                            {data.basics.role}
                        </div>
                    )}
                    {/* CONTACT ROW DIRECTLY BELOW ROLE NAME */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "11.5px", color: "#64748b" }}>
                        <span>✉ {data.basics.email}</span>
                        <span>•</span>
                        <span>📞 {data.basics.phone}</span>
                        {links.linkedin && (
                            <>
                                <span>•</span>
                                <span style={{ color: "#0891b2" }}>LinkedIn: {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            </>
                        )}
                        {links.github && (
                            <>
                                <span>•</span>
                                <span style={{ color: "#0891b2" }}>GitHub: {links.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            {data.summary && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                        Professional Profile
                    </h5>
                    <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", margin: 0 }}>{data.summary}</p>
                </section>
            )}

            {/* WORK EXPERIENCE */}
            {data.experience && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                        Work Experience
                    </h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-line", margin: 0, color: "#334155" }}>{data.experience}</p>
                    ) : (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "13px", color: "#0f172a" }}>{data.experience.role}</strong>
                                <span style={{ fontSize: "11px", color: "#64748b", background: "#f0f9ff", padding: "2px 8px", borderRadius: "4px" }}>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div style={{ color: "#0891b2", fontSize: "12px", fontWeight: "500", margin: "2px 0 6px" }}>
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#475569", whiteSpace: "pre-line", margin: 0 }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* INTERNSHIP */}
            {data.internship && (() => {
                const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                    ? data.internship.bullets
                    : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                return (
                    <section style={{ marginBottom: "20px" }}>
                        <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                            Internships & Training
                        </h5>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "13px", color: "#0f172a" }}>{data.internship.field}</strong>
                                <span style={{ fontSize: "11px", color: "#64748b", background: "#f0f9ff", padding: "2px 8px", borderRadius: "4px" }}>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div style={{ color: "#0891b2", fontSize: "12px", fontWeight: "500", margin: "2px 0 4px" }}>
                                {data.internship.company}
                            </div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "6px 0 0", paddingLeft: "16px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                );
            })()}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                        Education
                    </h5>
                    <div style={{ display: "grid", gridTemplateColumns: data.education.length > 1 ? "1fr 1fr" : "1fr", gap: "12px" }}>
                        {data.education.map((edu, i) => (
                            <div key={i} style={{ borderLeft: "2px solid #a5f3fc", paddingLeft: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "0 6px 6px 0" }}>
                                <div style={{ fontWeight: "700", fontSize: "12px", color: "#0f172a" }}>{edu.course}</div>
                                {edu.college && <div style={{ fontSize: "11px", color: "#0891b2", marginTop: "2px" }}>{edu.college}</div>}
                                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* DATA TOOLBOX & TECHNICAL SKILLS */}
            {data.skills && data.skills.length > 0 && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                        Data Toolbox &amp; Technical Skills
                    </h5>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "11px", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "4px 10px", borderRadius: "6px", color: "#0369a1", fontWeight: "600" }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* INTERNSHIPS BELOW SKILLS */}
            {data.internship && (
                <section style={{ marginBottom: "20px" }}>
                    <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                        Internships
                    </h5>
                    <div style={{ borderLeft: "3px solid #0891b2", paddingLeft: "12px", background: "#f8fafc", padding: "10px 14px", borderRadius: "0 6px 6px 0", border: "1px solid #e2e8f0", borderLeftWidth: "3px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{data.internship.field}</strong>
                            <span style={{ fontSize: "11px", color: "#64748b", background: "#f0f9ff", padding: "2px 8px", borderRadius: "4px" }}>{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div style={{ color: "#0891b2", fontSize: "12px", fontStyle: "italic", marginTop: "2px" }}>
                            {data.internship.company}
                        </div>
                    </div>
                </section>
            )}

            {/* ACHIEVEMENTS BELOW INTERNSHIPS */}
            {data.achievements && (
                <section style={{ marginBottom: "16px" }}>
                    <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>
                        Achievements &amp; Certifications
                    </h5>
                    <div style={{ borderLeft: "3px solid #0891b2", paddingLeft: "12px", background: "#f8fafc", padding: "10px 14px", borderRadius: "0 6px 6px 0", border: "1px solid #e2e8f0", borderLeftWidth: "3px" }}>
                        <p style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.6", margin: 0, whiteSpace: "pre-line" }}>
                            {data.achievements}
                        </p>
                    </div>
                </section>
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
                    <section style={{ marginTop: "20px" }}>
                        <h5 style={{ margin: "0 0 10px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#0f172a", borderLeft: "3px solid #0891b2", paddingLeft: "8px" }}>Data Projects</h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "3px solid #0891b2", paddingLeft: "10px", paddingTop: "4px", paddingBottom: "4px", background: "#f0f9ff", borderRadius: "0 4px 4px 0" }}>
                                    <div style={{ fontWeight: "700", fontSize: "12px", color: "#0891b2", marginBottom: "3px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#334155", lineHeight: "1.5" }}>
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
