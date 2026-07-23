import React from "react";

export default function NordicTemplate({ data }) {
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

    const blue = "#2563eb";
    const blueLight = "#eff6ff";

    return (
        <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", color: "#111827", background: "#fff", minHeight: "100%" }}>
            {/* Top bar */}
            <div style={{ background: blue, height: "6px" }}></div>

            {/* Header */}
            <div style={{ padding: "2.5rem 2rem 2.5rem", borderBottom: "1px solid #e5e7eb", textAlign: "center" }}>
                {data.basics.photo && (
                    <img 
                        src={data.basics.photo} 
                        alt="Profile" 
                        style={{ 
                            width: "90px", 
                            height: "90px", 
                            objectFit: "cover", 
                            borderRadius: "50%", 
                            border: "2px solid #e5e7eb", 
                            marginBottom: "16px",
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }} 
                    />
                )}
                <h1 style={{ margin: "0 0 6px", fontSize: "2.25rem", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em" }}>{data.basics.name}</h1>
                {data.basics.role && (
                    <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: blue, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                        {data.basics.role}
                    </p>
                )}
                
                {/* Horizontal Centered Contacts */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "0.82rem", color: "#6b7280" }}>
                    <span>✉ {data.basics.email}</span>
                    <span>•</span>
                    <span>📞 {data.basics.phone}</span>
                    {links.linkedin && (
                        <>
                            <span>•</span>
                            <a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: blue, textDecoration: "none" }}>
                                linkedin/{getUsername(links.linkedin, "linkedin")}
                            </a>
                        </>
                    )}
                    {links.github && (
                        <>
                            <span>•</span>
                            <a href={links.github} target="_blank" rel="noreferrer" style={{ color: blue, textDecoration: "none" }}>
                                github/{getUsername(links.github, "github")}
                            </a>
                        </>
                    )}
                    {links.portfolio && (
                        <>
                            <span>•</span>
                            <a href={links.portfolio} target="_blank" rel="noreferrer" style={{ color: blue, textDecoration: "none" }}>
                                {getUsername(links.portfolio, "portfolio")}
                            </a>
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", minHeight: "calc(100% - 130px)" }}>
                {/* Main column */}
                <div style={{ padding: "2rem 2.5rem 2rem 3rem", borderRight: "1px solid #e5e7eb" }}>

                    {data.summary && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 10px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Profile</h2>
                            <p style={{ lineHeight: "1.7", color: "#374151", margin: 0, fontSize: "0.95rem", borderLeft: "3px solid #bfdbfe", paddingLeft: "14px" }}>{data.summary}</p>
                        </section>
                    )}

                    {data.experience && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 14px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Work Experience</h2>
                            {typeof data.experience === "string" ? (
                                <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#374151", fontSize: "0.9rem" }}>{data.experience}</p>
                            ) : (
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                                        <div>
                                            <div style={{ fontWeight: "700", fontSize: "1rem", color: "#111827" }}>{data.experience.role}</div>
                                            <div style={{ fontSize: "0.875rem", color: blue, fontWeight: "500" }}>{data.experience.company}{data.experience.location && ` · ${data.experience.location}`}</div>
                                        </div>
                                        <span style={{ fontSize: "0.8rem", color: "#9ca3af", background: blueLight, padding: "2px 10px", borderRadius: "20px", whiteSpace: "nowrap", marginLeft: "12px" }}>{data.experience.start} – {data.experience.end}</span>
                                    </div>
                                    {data.experience.description && <p style={{ marginTop: "10px", marginBottom: 0, lineHeight: "1.6", fontSize: "0.9rem", color: "#4b5563", whiteSpace: "pre-line" }}>{data.experience.description}</p>}
                                </div>
                            )}
                        </section>
                    )}

                    {data.internship && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 14px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Internship</h2>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ fontWeight: "700", fontSize: "1rem", color: "#111827" }}>{data.internship.field}</div>
                                    <div style={{ fontSize: "0.875rem", color: blue, fontWeight: "500" }}>{data.internship.company}</div>
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "#9ca3af", background: blueLight, padding: "2px 10px", borderRadius: "20px", whiteSpace: "nowrap", marginLeft: "12px" }}>{data.internship.start} – {data.internship.end}</span>
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
                    if (!projs.length) return <section style={{ marginBottom: "2rem" }}><h2 style={{ margin: "0 0 14px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Projects</h2><p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#374151", fontSize: "0.9rem", margin: 0 }}>{data.projects}</p></section>;
                    return (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 14px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Projects</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: "3px solid #2563eb", paddingLeft: "12px", paddingTop: "5px", paddingBottom: "5px", background: "#f8fafc", borderRadius: "0 6px 6px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "0.92rem", color: "#1e3a5f", marginBottom: "4px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.85rem", color: "#475569", lineHeight: "1.5" }}>
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

                {/* Right column */}
                <div style={{ padding: "2rem 2rem 2rem 1.5rem", background: "#f9fafb" }}>
                    {data.skills && data.skills.length > 0 && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 12px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Skills</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                                {data.skills.map((s, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ width: "6px", height: "6px", background: blue, borderRadius: "50%", flexShrink: 0 }}></span>
                                        <span style={{ fontSize: "0.875rem", color: "#374151" }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ margin: "0 0 12px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Education</h2>
                            {data.education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: "14px" }}>
                                    <div style={{ fontWeight: "600", fontSize: "0.875rem", color: "#111827", lineHeight: "1.3" }}>{edu.course}</div>
                                    <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>{edu.start} – {edu.end}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {data.achievements && (
                        <section>
                            <h2 style={{ margin: "0 0 12px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "3px", color: blue }}>Awards</h2>
                            <p style={{ whiteSpace: "pre-line", lineHeight: "1.6", color: "#374151", fontSize: "0.82rem", margin: 0 }}>{data.achievements}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
