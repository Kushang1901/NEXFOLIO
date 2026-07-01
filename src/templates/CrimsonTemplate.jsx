import React from "react";

export default function CrimsonTemplate({ data }) {
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

    const red = "#be123c";
    const redLight = "#fff1f2";

    return (
        <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: "#1c1917", background: "#fff", minHeight: "100%" }}>
            {/* Full-width top header */}
            <div style={{ background: "#1c1917", padding: "2.5rem 3rem", display: "flex", alignItems: "center", gap: "28px" }}>
                {data.basics.photo ? (
                    <img src={data.basics.photo} alt="Profile" style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "4px", flexShrink: 0, border: `3px solid ${red}` }} />
                ) : (
                    <div style={{ width: "80px", height: "80px", background: red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", fontWeight: "700", color: "#fff", flexShrink: 0, borderRadius: "4px" }}>
                        {data.basics.name?.[0] || "?"}
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: "0 0 4px", fontSize: "2.5rem", fontWeight: "700", color: "#fff", fontFamily: "'Georgia', serif", letterSpacing: "-0.01em" }}>{data.basics.name}</h1>
                    {data.basics.role && <p style={{ margin: "0 0 14px", fontSize: "0.9rem", color: red, fontWeight: "400", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "sans-serif" }}>{data.basics.role}</p>}
                    <div style={{ height: "1px", background: `${red}66`, marginBottom: "12px" }}></div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.82rem", color: "#a8a29e", fontFamily: "sans-serif" }}>
                        <span>{data.basics.email}</span>
                        <span>|</span>
                        <span>{data.basics.phone}</span>
                        {links.linkedin && <><span>|</span><a href={links.linkedin} target="_blank" rel="noreferrer" style={{ color: "#d4d0c8", textDecoration: "none" }}>{getUsername(links.linkedin, "linkedin")}</a></>}
                        {links.github && <><span>|</span><a href={links.github} target="_blank" rel="noreferrer" style={{ color: "#d4d0c8", textDecoration: "none" }}>{getUsername(links.github, "github")}</a></>}
                        {links.portfolio && <><span>|</span><a href={links.portfolio} target="_blank" rel="noreferrer" style={{ color: "#d4d0c8", textDecoration: "none" }}>{getUsername(links.portfolio, "portfolio")}</a></>}
                    </div>
                </div>
            </div>

            <div style={{ padding: "2.5rem 3rem" }}>
                {data.summary && (
                    <section style={{ marginBottom: "2.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                            <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.2rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Professional Summary</h2>
                            <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                            <div style={{ width: "8px", height: "8px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                        </div>
                        <p style={{ lineHeight: "1.8", color: "#44403c", margin: 0, fontSize: "0.95rem", fontStyle: "italic" }}>{data.summary}</p>
                    </section>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2.5rem" }}>
                    <div>
                        {data.experience && (
                            <section style={{ marginBottom: "2rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                    <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Experience</h2>
                                    <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                                </div>
                                {typeof data.experience === "string" ? (
                                    <p style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#44403c", fontSize: "0.92rem" }}>{data.experience}</p>
                                ) : (
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                                            <strong style={{ fontSize: "1rem", fontFamily: "'Georgia', serif" }}>{data.experience.role}</strong>
                                            <span style={{ fontSize: "0.8rem", color: "#78716c", fontFamily: "sans-serif" }}>{data.experience.start} – {data.experience.end}</span>
                                        </div>
                                        <p style={{ margin: "0 0 10px", fontSize: "0.875rem", color: red, fontStyle: "italic", fontFamily: "'Georgia', serif" }}>{data.experience.company}{data.experience.location && ` · ${data.experience.location}`}</p>
                                        {data.experience.description && <p style={{ margin: 0, lineHeight: "1.7", fontSize: "0.9rem", color: "#44403c", whiteSpace: "pre-line" }}>{data.experience.description}</p>}
                                    </div>
                                )}
                            </section>
                        )}

                        {data.internship && (
                            <section style={{ marginBottom: "2rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                    <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Internship</h2>
                                    <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <strong style={{ fontSize: "1rem", fontFamily: "'Georgia', serif" }}>{data.internship.field}</strong>
                                    <span style={{ fontSize: "0.8rem", color: "#78716c", fontFamily: "sans-serif" }}>{data.internship.start} – {data.internship.end}</span>
                                </div>
                                <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: red, fontStyle: "italic" }}>{data.internship.company}</p>
                            </section>
                        )}

                        {data.projects && (
                            <section>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                    <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Projects</h2>
                                    <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                                </div>
                                <p style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#44403c", fontSize: "0.92rem", margin: 0 }}>{data.projects}</p>
                            </section>
                        )}
                    </div>

                    <div>
                        {data.education && data.education.length > 0 && (
                            <section style={{ marginBottom: "2rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                    <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Education</h2>
                                    <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                                </div>
                                {data.education.map((edu, i) => (
                                    <div key={i} style={{ marginBottom: "14px", paddingLeft: "10px", borderLeft: `2px solid ${red}` }}>
                                        <strong style={{ fontSize: "0.9rem", display: "block", lineHeight: "1.3", fontFamily: "'Georgia', serif" }}>{edu.course}</strong>
                                        <span style={{ fontSize: "0.78rem", color: "#78716c", fontFamily: "sans-serif" }}>{edu.start} – {edu.end}</span>
                                    </div>
                                ))}
                            </section>
                        )}

                        {data.skills && data.skills.length > 0 && (
                            <section style={{ marginBottom: "2rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                    <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Skills</h2>
                                    <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {data.skills.map((s, i) => (
                                        <span key={i} style={{ background: redLight, color: red, padding: "3px 10px", fontSize: "0.8rem", fontFamily: "sans-serif", border: `1px solid ${red}44` }}>{s}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.achievements && (
                            <section>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                                    <h2 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.1rem", color: "#1c1917", fontWeight: "700", fontStyle: "italic" }}>Achievements</h2>
                                    <div style={{ flex: 1, height: "1px", background: "#e7e5e4" }}></div>
                                    <div style={{ width: "6px", height: "6px", background: red, borderRadius: "50%", flexShrink: 0 }}></div>
                                </div>
                                <p style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#44403c", fontSize: "0.88rem", margin: 0 }}>{data.achievements}</p>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
