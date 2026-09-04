import React from "react";

export default function TimelineTemplate({ data }) {
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

    const teal = "#0d9488";
    const tealLight = "#f0fdfa";
    const gray = "#f8fafc";

    
    if (data?.isPage2) {
        return (
            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#0f172a", background: "#fff", minHeight: "297mm", boxSizing: "border-box", width: "100%", padding: "48px" }}>
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
                        if (!projs.length) return <section><h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Projects</h2><div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "12px" }}></div><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#334155", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                        return (
                            <section>
                                <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Projects</h2>
                                <div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "12px" }}></div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: `3px solid ${teal}`, paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: tealLight, borderRadius: "0 6px 6px 0" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0d6060", marginBottom: "4px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.83rem", color: "#334155", lineHeight: "1.5" }}>
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
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#0f172a", background: "#fff", minHeight: "100%" }}>
            {/* Split header - left dark, right white */}
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr" }}>
                {/* Left dark panel */}
                <div style={{ background: "#0f172a", padding: "2.5rem 1.75rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    {data.basics.photo && (
                        <img src={data.basics.photo} alt="Profile" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", border: `3px solid ${teal}`, marginBottom: "20px" }} />
                    )}
                    <h1 style={{ margin: "0 0 4px", fontSize: "1.6rem", fontWeight: "800", color: "#fff", lineHeight: "1.2", letterSpacing: "-0.02em" }}>{data.basics.name}</h1>
                    {data.basics.role && <p style={{ margin: "0 0 20px", fontSize: "0.8rem", color: teal, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "600" }}>{data.basics.role}</p>}

                    <div style={{ borderTop: `1px solid ${teal}44`, paddingTop: "20px", width: "100%" }}>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: "1.9" }}>
                            <div style={{ color: "#e2e8f0", marginBottom: "4px" }}>✉ {data.basics.email}</div>
                            <div style={{ color: "#e2e8f0", marginBottom: "4px" }}>📞 {data.basics.phone}</div>
                            {links.linkedin && <div><a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: teal, textDecoration: "none" }}>in/{getUsername(links.linkedin, "linkedin")}</a></div>}
                            {links.github && <div><a href={links.github} target="_blank" rel="noreferrer" style={{ color: teal, textDecoration: "none" }}>⌥ {getUsername(links.github, "github")}</a></div>}
                            {links.portfolio && <div><a href={links.portfolio} target="_blank" rel="noreferrer" style={{ color: teal, textDecoration: "none" }}>🌐 {getUsername(links.portfolio, "portfolio")}</a></div>}
                        </div>
                    </div>

                    {data.achievements && (
                        <div style={{ marginTop: "24px", borderTop: `1px solid ${teal}44`, paddingTop: "20px", width: "100%" }}>
                            <h3 style={{ margin: "0 0 12px", fontSize: "0.62rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Achievements</h3>
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#94a3b8", fontSize: "0.78rem", margin: 0 }}>{data.achievements}</p>
                        </div>
                    )}
                </div>

                {/* Right main content */}
                <div style={{ padding: "2.5rem 2.5rem" }}>
                    {data.summary && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Profile</h2>
                            <div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "12px" }}></div>
                            <p style={{ lineHeight: "1.7", color: "#334155", margin: 0, fontSize: "0.95rem" }}>{data.summary}</p>
                        </section>
                    )}

                    {/* Timeline section */}
                    {(data.experience || data.internship) && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Career Timeline</h2>
                            <div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "20px" }}></div>

                            {/* Vertical timeline */}
                            <div style={{ position: "relative", paddingLeft: "28px" }}>
                                {/* Vertical line */}
                                <div style={{ position: "absolute", left: "8px", top: 0, bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${teal}, ${teal}22)` }}></div>

                                {data.experience && (
                                    <div style={{ position: "relative", marginBottom: "20px" }}>
                                        <div style={{ position: "absolute", left: "-24px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: teal, border: "2px solid #fff", boxShadow: `0 0 0 2px ${teal}` }}></div>
                                        {typeof data.experience === "string" ? (
                                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#334155", fontSize: "0.9rem" }}>{data.experience}</p>
                                        ) : (
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                                    <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{data.experience.role}</strong>
                                                    <span style={{ fontSize: "0.78rem", color: "#94a3b8", background: tealLight, padding: "2px 8px", borderRadius: "4px" }}>{data.experience.start} – {data.experience.end}</span>
                                                </div>
                                                <p style={{ margin: "0 0 8px", fontSize: "0.875rem", color: teal, fontWeight: "500" }}>{data.experience.company}{data.experience.location && ` · ${data.experience.location}`}</p>
                                                {data.experience.description && <p style={{ margin: 0, lineHeight: "1.6", fontSize: "0.9rem", color: "#475569", whiteSpace: "pre-line" }}>{data.experience.description}</p>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {data.internship && (() => {
                                    const bullets = (data.internship.bullets && data.internship.bullets.length > 0)
                                        ? data.internship.bullets
                                        : (data.internship.description ? data.internship.description.split("\n").map(l => l.trim().replace(/^[-*•–]\s*/, "")).filter(Boolean) : []);
                                    return (
                                        <div style={{ position: "relative" }}>
                                            <div style={{ position: "absolute", left: "-24px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: "#fff", border: `2px solid ${teal}`, boxShadow: `0 0 0 2px ${teal}44` }}></div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                                <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{data.internship.field}</strong>
                                                <span style={{ fontSize: "0.78rem", color: "#94a3b8", background: tealLight, padding: "2px 8px", borderRadius: "4px" }}>{data.internship.start} – {data.internship.end}</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: "0.875rem", color: teal, fontWeight: "500" }}>{data.internship.company}</p>
                                            {bullets.length > 0 && (
                                                <ul style={{ margin: "6px 0 0", paddingLeft: "18px", fontSize: "0.88rem", color: "#475569", lineHeight: "1.5" }}>
                                                    {bullets.map((b, i) => (
                                                        <li key={i}>{b}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Education</h2>
                            <div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "14px" }}></div>
                            {data.education.map((edu, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px", padding: "10px 14px", background: gray, borderRadius: "8px", borderLeft: `3px solid ${teal}` }}>
                                    <strong style={{ fontSize: "0.9rem" }}>{edu.course}</strong>
                                    <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{edu.start} – {edu.end}</span>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Skills section moved below Education */}
                    {data.skills && data.skills.length > 0 && (
                        <section style={{ marginBottom: "1.5rem" }}>
                            <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Skills & Expertise</h2>
                            <div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "14px" }}></div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {data.skills.map((s, i) => (
                                    <span key={i} style={{ background: tealLight, color: "#0f766e", border: "1px solid #99f6e4", padding: "5px 12px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: "600" }}>{s}</span>
                                ))}
                            </div>
                        </section>
                    )}

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
                        if (!projs.length) return <section><h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Projects</h2><div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "12px" }}></div><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#334155", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                        return (
                            <section>
                                <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2.5px", color: teal }}>Projects</h2>
                                <div style={{ height: "2px", background: `linear-gradient(to right, ${teal}, transparent)`, marginBottom: "12px" }}></div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                                    {projs.map((proj, i) => (
                                        <div key={i} style={{ borderLeft: `3px solid ${teal}`, paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: tealLight, borderRadius: "0 6px 6px 0" }}>
                                            <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "#0d6060", marginBottom: "4px" }}>{proj.name}</div>
                                            {proj.bullets.length > 0 && (
                                                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.83rem", color: "#334155", lineHeight: "1.5" }}>
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
        </div>
    );
}
