import React from "react";

export default function MidnightTemplate({ data }) {
    const links = data?.basics?.links || {};
    const getUsername = (url, type) => {
        if (!url) return "";
        try {
            const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
            if (type === "github") return cleanUrl.replace("github.com/", "");
            if (type === "linkedin") return cleanUrl.replace("linkedin.com/in/", "");
            return cleanUrl;
        } catch { return url; }
    };

    const purple = "#7c3aed";
    const purpleMid = "#6d28d9";
    const bg = "#0f0a1e";
    const card = "#1a1033";
    const border = "#2d1f5e";

    const SectionTitle = ({ children }) => (
        <h3 style={{ margin: "0 0 14px", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "3px", color: purple, display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "18px", height: "2px", background: purple }}></span>
            {children}
            <span style={{ flex: 1, height: "1px", background: border }}></span>
        </h3>
    );

    
    if (data?.isPage2) {
        return (
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: bg, color: "#e2d9f3", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                        if (!projs.length) return <section><SectionTitle>Projects</SectionTitle><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#c4b5fd", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                        return (
                            <section>
                                <SectionTitle>Projects</SectionTitle>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ background: `${purple}11`, border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#d8b4fe", marginBottom: "5px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", color: "#9ca3af", lineHeight: "1.5" }}>
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
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: bg, color: "#e2d9f3", minHeight: "100%", padding: "0" }}>
            {/* Hero Header */}
            <div style={{ background: `linear-gradient(135deg, ${bg} 0%, ${card} 40%, ${purple}22 100%)`, padding: "2.5rem", borderBottom: `1px solid ${border}`, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: `radial-gradient(circle, ${purple}33 0%, transparent 70%)`, pointerEvents: "none" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px", position: "relative" }}>
                    {data.basics.photo && (
                        <img src={data.basics.photo} alt="Profile" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: `3px solid ${purple}`, flexShrink: 0 }} />
                    )}
                    <div>
                        <h1 style={{ margin: "0 0 4px", fontSize: "2.25rem", fontWeight: "800", background: `linear-gradient(135deg, #e2d9f3, ${purple}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.03em" }}>{data.basics.name}</h1>
                        {data.basics.role && <p style={{ margin: "0 0 12px", fontSize: "1rem", color: `${purple}cc`, fontWeight: "500" }}>{data.basics.role}</p>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.8rem", color: "#9ca3af" }}>
                            <span style={{ color: "#a78bfa" }}>✉ {data.basics.email}</span>
                            <span>📞 {data.basics.phone}</span>
                            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", textDecoration: "none" }}>in/{getUsername(links.linkedin, "linkedin")}</a>}
                            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", textDecoration: "none" }}>⌥ {getUsername(links.github, "github")}</a>}
                            {links.portfolio && <a href={links.portfolio} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", textDecoration: "none" }}>🌐 {getUsername(links.portfolio, "portfolio")}</a>}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: "2rem 2.5rem" }}>
                {/* Summary */}
                {data.summary && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <SectionTitle>About</SectionTitle>
                        <p style={{ lineHeight: "1.7", color: "#c4b5fd", margin: 0, fontSize: "0.95rem" }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <SectionTitle>Experience</SectionTitle>
                        {typeof data.experience === "string" ? (
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#c4b5fd", fontSize: "0.9rem" }}>{data.experience}</p>
                        ) : (
                            <div style={{ background: `${purple}11`, border: `1px solid ${border}`, borderRadius: "10px", padding: "14px 16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                    <strong style={{ fontSize: "1rem", color: "#e2d9f3" }}>{data.experience.role}</strong>
                                    <span style={{ fontSize: "0.78rem", color: purple }}>{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: "#a78bfa", fontStyle: "italic" }}>{data.experience.company}{data.experience.location && ` · ${data.experience.location}`}</p>
                                {data.experience.description && <p style={{ margin: 0, lineHeight: "1.6", fontSize: "0.88rem", color: "#9ca3af", whiteSpace: "pre-line" }}>{data.experience.description}</p>}
                            </div>
                        )}
                    </section>
                )}

                {/* Internship */}
                {data.internship && (() => {
                    const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                        ? data.internship.bullets
                        : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                    return (
                        <section style={{ marginBottom: "1.75rem" }}>
                            <SectionTitle>Internship</SectionTitle>
                            <div style={{ background: `${purple}11`, border: `1px solid ${border}`, borderRadius: "10px", padding: "14px 16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                    <strong style={{ fontSize: "1rem", color: "#e2d9f3" }}>{data.internship.field}</strong>
                                    <span style={{ fontSize: "0.78rem", color: purple }}>{data.internship.start} – {data.internship.end}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#a78bfa", fontStyle: "italic" }}>{data.internship.company}</p>
                                {bullets.length > 0 && (
                                    <ul style={{ margin: "8px 0 0", paddingLeft: "18px", listStyleType: "disc" }}>
                                        {bullets.map((b, i) => (
                                            <li key={i} style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </section>
                    );
                })()}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <SectionTitle>Education</SectionTitle>
                        <div style={{ display: "grid", gridTemplateColumns: data.education.length > 1 ? "1fr 1fr" : "1fr", gap: "12px" }}>
                            {data.education.map((edu, i) => (
                                <div key={i} style={{ background: `${purple}11`, border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", borderLeft: `3px solid ${purple}` }}>
                                    <strong style={{ fontSize: "0.88rem", color: "#e2d9f3", display: "block", lineHeight: "1.3" }}>{edu.course}</strong>
                                    <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{edu.start} – {edu.end}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {data.achievements && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <SectionTitle>Achievements</SectionTitle>
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>{data.achievements}</p>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section style={{ marginBottom: "1rem" }}>
                        <SectionTitle>Skills</SectionTitle>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {data.skills.map((s, i) => (
                                <div key={i} style={{ background: `${purple}22`, border: `1px solid ${border}`, borderRadius: "6px", padding: "6px 12px", fontSize: "0.82rem", color: "#d8b4fe", fontWeight: "500" }}>{s}</div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects (fallback if on single page preview) */}
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
                        <section>
                            <SectionTitle>Projects</SectionTitle>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ background: `${purple}11`, border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#d8b4fe", marginBottom: "5px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", color: "#9ca3af", lineHeight: "1.5" }}>
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
        </div>
    );
}
