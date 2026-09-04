import React from "react";

export default function SunriseTemplate({ data }) {
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

    const accent = "#e85d04";
    const accentLight = "#fff3e0";

    
    if (data?.isPage2) {
        return (
            <div style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a", background: "#fff", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                            if (!projs.length) return <section><h4 style={{ margin: "0 0 12px", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2.5px", color: accent }}>Projects</h4><p style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#334155", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                            return (
                                <section>
                                    <h4 style={{ margin: "0 0 12px", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "2.5px", color: accent }}>Projects</h4>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                        {projs.map((proj, i) => (
                                            <div key={i} style={{ borderLeft: `3px solid ${accent}`, paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#fff7ed", borderRadius: "0 6px 6px 0" }}>
                                                <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#92400e", marginBottom: "4px" }}>{proj.name}</div>
                                                {proj.bullets.length > 0 && (
                                                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.82rem", color: "#374151", lineHeight: "1.5" }}>
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
        <div style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a", background: "#fff" }}>
            {/* Header with diagonal accent */}
            <div style={{ position: "relative", background: `linear-gradient(135deg, ${accent} 0%, #f48c06 100%)`, padding: "2.5rem 2.5rem 3rem", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: "200px", height: "200px", background: "rgba(255,255,255,0.08)", borderRadius: "50% 0 0 0" }}></div>
                {data.basics.photo && (
                    <img src={data.basics.photo} alt="Profile" style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "50%", border: "4px solid rgba(255,255,255,0.8)", marginBottom: "16px", display: "block" }} />
                )}
                <h1 style={{ color: "#fff", margin: 0, fontSize: "2rem", fontWeight: "700", letterSpacing: "-0.02em" }}>{data.basics.name}</h1>
                {data.basics.role && <p style={{ color: "rgba(255,255,255,0.85)", margin: "4px 0 12px", fontSize: "1rem", fontStyle: "italic" }}>{data.basics.role}</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.85rem", color: "rgba(255,255,255,0.9)", marginTop: "8px" }}>
                    <span>✉ {data.basics.email}</span>
                    <span>📞 {data.basics.phone}</span>
                    {links.linkedin && <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>🔗 {getUsername(links.linkedin, "linkedin")}</a>}
                    {links.github && <a href={links.github} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>⌥ {getUsername(links.github, "github")}</a>}
                    {links.portfolio && <a href={links.portfolio} target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>🌐 {getUsername(links.portfolio, "portfolio")}</a>}
                </div>
            </div>

            {/* Diagonal clip effect */}
            <div style={{ height: "32px", background: "#fff", marginTop: "-32px", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}></div>

            <div style={{ padding: "0.5rem 2.5rem 2.5rem" }}>
                {/* Summary */}
                {data.summary && (
                    <section style={{ marginBottom: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "28px", height: "3px", background: accent, borderRadius: "2px" }}></div>
                            <h2 style={{ margin: 0, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>About Me</h2>
                        </div>
                        <p style={{ lineHeight: "1.7", color: "#444", margin: 0, fontSize: "0.95rem" }}>{data.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && (
                    <section style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "28px", height: "3px", background: accent, borderRadius: "2px" }}></div>
                            <h2 style={{ margin: 0, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>Experience</h2>
                        </div>
                        {typeof data.experience === "string" ? (
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#444", fontSize: "0.9rem" }}>{data.experience}</p>
                        ) : (
                            <div style={{ borderLeft: `3px solid ${accentLight}`, paddingLeft: "14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <strong style={{ fontSize: "0.95rem", color: "#1a1a1a" }}>{data.experience.role}</strong>
                                    <span style={{ fontSize: "0.8rem", color: "#888" }}>{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <p style={{ margin: "2px 0 6px", fontSize: "0.85rem", color: accent, fontStyle: "italic" }}>{data.experience.company}{data.experience.location && ` · ${data.experience.location}`}</p>
                                {data.experience.description && <p style={{ margin: 0, lineHeight: "1.6", fontSize: "0.88rem", color: "#555", whiteSpace: "pre-line" }}>{data.experience.description}</p>}
                            </div>
                        )}
                    </section>
                )}

                {/* Internship */}
                {data.internship && (
                    <section style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "28px", height: "3px", background: accent, borderRadius: "2px" }}></div>
                            <h2 style={{ margin: 0, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>Internship</h2>
                        </div>
                        <div style={{ borderLeft: `3px solid ${accentLight}`, paddingLeft: "14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "0.95rem" }}>{data.internship.field}</strong>
                                <span style={{ fontSize: "0.8rem", color: "#888" }}>{data.internship.start} – {data.internship.end}</span>
                            </div>
                            <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: accent, fontStyle: "italic" }}>{data.internship.company}</p>
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "28px", height: "3px", background: accent, borderRadius: "2px" }}></div>
                            <h2 style={{ margin: 0, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>Education</h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: data.education.length > 1 ? "1fr 1fr" : "1fr", gap: "16px" }}>
                            {data.education.map((edu, i) => (
                                <div key={i} style={{ paddingLeft: "14px", borderLeft: `3px solid ${accentLight}` }}>
                                    <strong style={{ fontSize: "0.9rem", display: "block" }}>{edu.course}</strong>
                                    <span style={{ fontSize: "0.82rem", color: "#888" }}>{edu.start} – {edu.end}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "28px", height: "3px", background: accent, borderRadius: "2px" }}></div>
                            <h2 style={{ margin: 0, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>Skills</h2>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {data.skills.map((s, i) => (
                                <span key={i} style={{ background: accentLight, color: accent, padding: "4px 12px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: "600", border: `1px solid ${accent}33` }}>{s}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {data.achievements && (
                    <section style={{ marginBottom: "1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "28px", height: "3px", background: accent, borderRadius: "2px" }}></div>
                            <h2 style={{ margin: 0, fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accent }}>Achievements</h2>
                        </div>
                        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#444", fontSize: "0.9rem", margin: 0 }}>{data.achievements}</p>
                    </section>
                )}
            </div>
        </div>
    );
}
