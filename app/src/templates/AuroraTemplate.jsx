import React from "react";

export default function AuroraTemplate({ data }) {
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

    
    if (data?.isPage2) {
        return (
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b", background: "#fff", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                        if (!projs.length) return <section><div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}><div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div><h3 style={{ margin: 0, fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Projects</h3></div><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#334155", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                        return (
                            <section>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                                    <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                                    <h3 style={{ margin: 0, fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Projects</h3>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: "3px solid #22d3ee", paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#f0fdfe", borderRadius: "0 6px 6px 0" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "#0369a1", marginBottom: "4px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "disc" }}>
                                                    {proj.bullets.map((b, j) => (
                                                        <li key={j} style={{ fontSize: "0.82rem", color: "#475569", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                                    ))}
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
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b", background: "#fff", minHeight: "100%" }}>
            {/* Aurora gradient header */}
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 35%, #0d4f3c 70%, #1a1a2e 100%)", padding: "2.5rem 2.5rem 2rem", position: "relative", overflow: "hidden" }}>
                {/* Decorative blur orbs */}
                <div style={{ position: "absolute", top: "-40px", left: "20%", width: "200px", height: "200px", background: "radial-gradient(circle, #22d3ee44 0%, transparent 70%)", pointerEvents: "none" }}></div>
                <div style={{ position: "absolute", bottom: "-60px", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, #4ade8044 0%, transparent 70%)", pointerEvents: "none" }}></div>

                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "24px" }}>
                    {data.basics.photo && (
                        <img src={data.basics.photo} alt="Profile" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", flexShrink: 0 }} />
                    )}
                    <div>
                        <h1 style={{ margin: "0 0 6px", fontSize: "2.25rem", fontWeight: "800", color: "#fff", letterSpacing: "-0.03em" }}>{data.basics.name}</h1>
                        {data.basics.role && <p style={{ margin: "0 0 14px", fontSize: "0.9rem", background: "linear-gradient(90deg, #22d3ee, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1.5px" }}>{data.basics.role}</p>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}>
                            <span>✉ {data.basics.email}</span>
                            <span>📞 {data.basics.phone}</span>
                            {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: "#22d3ee", textDecoration: "none" }}>in/{getUsername(links.linkedin, "linkedin")}</a>}
                            {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: "#4ade80", textDecoration: "none" }}>⌥ {getUsername(links.github, "github")}</a>}
                            {links.portfolio && <a href={links.portfolio} target="_blank" rel="noreferrer" style={{ color: "#22d3ee", textDecoration: "none" }}>🌐 {getUsername(links.portfolio, "portfolio")}</a>}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: "2rem 2.5rem" }}>
                {data.summary && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                            <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                            <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>About</h3>
                        </div>
                        <p style={{ lineHeight: "1.7", color: "#334155", margin: 0, fontSize: "0.95rem" }}>{data.summary}</p>
                    </section>
                )}

                {data.experience && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                            <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                            <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Experience</h3>
                        </div>
                        {typeof data.experience === "string" ? (
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#334155", fontSize: "0.9rem" }}>{data.experience}</p>
                        ) : (
                            <div style={{ borderLeft: "3px solid #0369a1", paddingLeft: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                    <strong style={{ fontSize: "1rem", color: "#1e293b" }}>{data.experience.role}</strong>
                                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <p style={{ margin: "0 0 8px", fontSize: "0.875rem", color: "#0369a1", fontWeight: "500" }}>{data.experience.company}{data.experience.location && ` · ${data.experience.location}`}</p>
                                {data.experience.description && <p style={{ margin: 0, lineHeight: "1.6", fontSize: "0.9rem", color: "#475569", whiteSpace: "pre-line" }}>{data.experience.description}</p>}
                            </div>
                        )}
                    </section>
                )}

                {data.internship && (() => {
                    const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                        ? data.internship.bullets
                        : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                    return (
                        <section style={{ marginBottom: "1.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                                <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                                <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Internship</h3>
                            </div>
                            <div style={{ borderLeft: "3px solid #16a34a", paddingLeft: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                    <strong style={{ fontSize: "1rem", color: "#1e293b" }}>{data.internship.field}</strong>
                                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>{data.internship.start} – {data.internship.end}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: "0.875rem", color: "#16a34a", fontWeight: "500" }}>{data.internship.company}</p>
                                {bullets.length > 0 && (
                                    <ul style={{ margin: "8px 0 0", paddingLeft: "18px", listStyleType: "disc" }}>
                                        {bullets.map((b, i) => (
                                            <li key={i} style={{ fontSize: "0.875rem", color: "#334155", lineHeight: "1.5", marginBottom: "3px" }}>{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </section>
                    );
                })()}

                {/* Education below Internship */}
                {data.education && data.education.length > 0 && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                            <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                            <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Education</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: data.education.length > 1 ? "1fr 1fr" : "1fr", gap: "14px" }}>
                            {data.education.map((edu, i) => (
                                <div key={i} style={{ borderLeft: "2px solid #22d3ee", paddingLeft: "12px", background: "#f8fafc", padding: "10px 14px", borderRadius: "0 6px 6px 0" }}>
                                    <div style={{ fontWeight: "600", fontSize: "0.88rem", color: "#1e293b", lineHeight: "1.3" }}>{edu.course}</div>
                                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px" }}>{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements below Education */}
                {data.achievements && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                            <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                            <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Achievements</h3>
                        </div>
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#64748b", fontSize: "0.85rem", margin: 0 }}>{data.achievements}</p>
                    </section>
                )}

                {/* Skills below Achievements */}
                {data.skills && data.skills.length > 0 && (
                    <section style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                            <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                            <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Skills</h3>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {data.skills.map((s, i) => (
                                <span key={i} style={{ background: "#e0f2fe", color: "#0369a1", padding: "5px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600" }}>{s}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects (fallback if single page preview) */}
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
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                                <div style={{ width: "20px", height: "3px", background: "linear-gradient(90deg, #22d3ee, #4ade80)", borderRadius: "2px" }}></div>
                                <h3 style={{ margin: 0, fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: "#475569" }}>Projects</h3>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #22d3ee", paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#f0fdfe", borderRadius: "0 6px 6px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "#0369a1", marginBottom: "4px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "disc" }}>
                                                {proj.bullets.map((b, j) => (
                                                    <li key={j} style={{ fontSize: "0.82rem", color: "#475569", lineHeight: "1.5", marginBottom: "2px" }}>{b}</li>
                                                ))}
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
