import React from "react";

export default function CompactATSTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    if (data?.isPage2) {
        return (
            <div style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: "11.5px", color: "#0f172a", background: "#fff", padding: "40px 48px" }}>
                <div style={{ height: "3px", background: "linear-gradient(90deg, #1e3a8a, #2563eb, #60a5fa)", marginBottom: "24px" }}></div>
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
                    if (!projs.length) return (
                        <div style={{ marginBottom: "20px" }}>
                            <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "12px" }}>Key Projects</div>
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#475569", margin: 0, fontSize: "11.5px" }}>{data.projects}</p>
                        </div>
                    );
                    return (
                        <div style={{ marginBottom: "20px" }}>
                            <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "14px" }}>Key Projects</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "2px solid #2563eb", paddingLeft: "12px", paddingTop: "2px", paddingBottom: "2px", background: "#f8fafc", borderRadius: "0 4px 4px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "12px", color: "#1e3a8a", marginBottom: "3px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
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
        <div style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: "11.5px", color: "#0f172a", background: "#fff", padding: "36px 44px" }}>
            {/* TOP ACCENT LINE */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #1e3a8a, #2563eb, #60a5fa)", marginBottom: "20px" }}></div>

            {/* HEADER */}
            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "14px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "20px" }}>
                {data.basics.photo && (
                    <img src={data.basics.photo} alt="Profile" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%", border: "2px solid #2563eb", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: "0 0 2px", fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em" }}>{data.basics.name}</h1>
                    {data.basics.role && (
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>
                            {data.basics.role}
                        </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px", color: "#64748b" }}>
                        <span>✉ {data.basics.email}</span>
                        <span>•</span>
                        <span>📞 {data.basics.phone}</span>
                        {links.linkedin && (
                            <>
                                <span>•</span>
                                <span style={{ color: "#2563eb" }}>LinkedIn: {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            </>
                        )}
                        {links.github && (
                            <>
                                <span>•</span>
                                <span style={{ color: "#2563eb" }}>GitHub: {links.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* SUMMARY */}
            {data.summary && (
                <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "8px" }}>
                        Professional Summary
                    </div>
                    <p style={{ lineHeight: "1.6", margin: 0, color: "#334155", fontSize: "11.5px" }}>{data.summary}</p>
                </div>
            )}

            {/* EXPERIENCE */}
            {data.experience && (
                <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>
                        Work Experience
                    </div>
                    {typeof data.experience === "string" ? (
                        <p style={{ whiteSpace: "pre-line", margin: 0, lineHeight: "1.5", color: "#334155" }}>{data.experience}</p>
                    ) : (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "12.5px", color: "#0f172a" }}>{data.experience.role}</strong>
                                <span style={{ fontSize: "10.5px", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div style={{ color: "#2563eb", fontSize: "11.5px", fontStyle: "italic", margin: "2px 0 6px" }}>
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ whiteSpace: "pre-line", lineHeight: "1.5", margin: 0, color: "#475569" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* INTERNSHIP */}
            {data.internship && (() => {
                const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                    ? data.internship.bullets
                    : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                return (
                    <div style={{ marginBottom: "18px" }}>
                        <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>
                            Internships
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "12px", color: "#0f172a" }}>{data.internship.field}</strong>
                                <span style={{ fontSize: "10.5px", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <div style={{ color: "#2563eb", fontSize: "11px", fontStyle: "italic", marginTop: "2px" }}>
                                {data.internship.company}
                            </div>
                            {bullets.length > 0 && (
                                <ul style={{ margin: "6px 0 0", paddingLeft: "16px", listStyleType: "disc" }}>
                                    {bullets.map((b, i) => (
                                        <li key={i} style={{ fontSize: "11px", color: "#334155", lineHeight: "1.45", marginBottom: "2px" }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>
                        Education
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: data.education.length > 1 ? "1fr 1fr" : "1fr", gap: "10px" }}>
                        {data.education.map((edu, i) => (
                            <div key={i} style={{ borderLeft: "2px solid #bfdbfe", paddingLeft: "8px" }}>
                                <div style={{ fontWeight: "700", fontSize: "11.5px", color: "#0f172a" }}>{edu.course}</div>
                                <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "2px" }}>{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ACHIEVEMENTS */}
            {data.achievements && (
                <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "8px" }}>
                        Achievements & Certifications
                    </div>
                    <p style={{ whiteSpace: "pre-line", lineHeight: "1.5", margin: 0, color: "#475569", fontSize: "11px" }}>{data.achievements}</p>
                </div>
            )}

            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>
                        Skills & Competencies
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b", padding: "3px 9px", borderRadius: "4px", fontSize: "10.5px", fontWeight: "600" }}>
                                {skill}
                            </span>
                        ))}
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
                    <div style={{ marginTop: "18px" }}>
                        <div style={{ fontWeight: "700", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1.2px", color: "#0f172a", borderLeft: "3px solid #2563eb", paddingLeft: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "10px" }}>
                            Key Projects
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {projs.map((proj, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #2563eb", paddingLeft: "10px" }}>
                                    <div style={{ fontWeight: "700", fontSize: "11.5px", color: "#1e3a8a", marginBottom: "2px" }}>{proj.name}</div>
                                    {proj.bullets.length > 0 && (
                                        <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                                            {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "1px" }}>{b}</li>)}
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

