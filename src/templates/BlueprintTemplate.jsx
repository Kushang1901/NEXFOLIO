import React from "react";

export default function BlueprintTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="p-5" style={{ 
            minHeight: "297mm", 
            boxSizing: "border-box", 
            width: "100%", 
            fontFamily: "'Courier New', Courier, monospace", 
            color: "#1e293b",
            background: "#fafbfd",
            backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
        }}>
            {/* SCHEMATIC HEADER */}
            <div style={{ border: "2px solid #2563eb", padding: "20px", marginBottom: "24px", position: "relative" }}>
                <span style={{ position: "absolute", top: "-10px", left: "12px", background: "#fafbfd", padding: "0 8px", fontSize: "10px", color: "#2563eb", fontWeight: "bold" }}>[SYS.INFO]</span>
                <h1 className="fw-bold mb-1" style={{ fontSize: "24px", color: "#2563eb" }}>{data.basics.name}</h1>
                {data.basics.role && <h5 className="fw-bold mb-2" style={{ fontSize: "12px" }}>ROLE // {data.basics.role.toUpperCase()}</h5>}
                <div style={{ fontSize: "11px", color: "#475569" }}>
                    <div>EMAIL: {data.basics.email}</div>
                    <div>PHONE: {data.basics.phone}</div>
                    {links.linkedin && <div>LINKEDIN: {links.linkedin}</div>}
                    {links.github && <div>GITHUB: {links.github}</div>}
                </div>
            </div>

            {/* SUMMARY */}
            <div className="mb-4">
                <div style={{ borderLeft: "4px solid #2563eb", paddingLeft: "12px" }}>
                    <h6 className="fw-bold text-uppercase" style={{ fontSize: "12px", color: "#2563eb" }}>// Objective & Scope</h6>
                    <p style={{ fontSize: "11.5px", lineHeight: "1.5", margin: 0 }}>{data.summary}</p>
                </div>
            </div>

            {/* TECHNICAL SKILLS */}
            {data.skills.length > 0 && (
                <div className="mb-4">
                    <h6 className="fw-bold text-uppercase" style={{ fontSize: "12px", color: "#2563eb", borderBottom: "1.5px solid #2563eb", paddingBottom: "2px" }}>// System Capabilities (Skills)</h6>
                    <p style={{ fontSize: "11.5px", margin: 0 }}>{data.skills.join(" // ")}</p>
                </div>
            )}

            {/* EXPERIENCE */}
            {data.experience && (
                <div className="mb-4">
                    <h6 className="fw-bold text-uppercase" style={{ fontSize: "12px", color: "#2563eb", borderBottom: "1.5px solid #2563eb", paddingBottom: "2px" }}>// Project Implementation History</h6>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "11.5px", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3" style={{ fontSize: "11.5px" }}>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>{data.experience.role}</span>
                                <span>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="text-muted mb-1">
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ whiteSpace: "pre-line", lineHeight: "1.4", margin: 0 }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* PROJECTS */}
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
                    if (!projs.length) return <section className="mb-4"><h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: blue, letterSpacing: "1px", borderBottom: `2px solid ${blue}`, paddingBottom: "4px" }}>Key Projects</h5><p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#475569", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p></section>;
                    return (
                        <section className="mb-4">
                            <h5 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: blue, letterSpacing: "1px", borderBottom: `2px solid ${blue}`, paddingBottom: "4px" }}>Key Projects</h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {projs.map((proj, i) => (
                                    <div key={i} style={{ borderLeft: `3px solid ${blue}`, paddingLeft: "10px", paddingTop: "5px", paddingBottom: "5px", background: "#f0f9ff", borderRadius: "0 4px 4px 0" }}>
                                        <div style={{ fontWeight: "700", fontSize: "12px", color: blue, marginBottom: "4px" }}>{proj.name}</div>
                                        {proj.bullets.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: "14px", fontSize: "11px", color: "#475569", lineHeight: "1.5" }}>
                                                {proj.bullets.map((b, j) => <li key={j} style={{ marginBottom: "2px" }}>{b}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })()}

            {/* EDUCATION */}
            <div className="mb-4">
                <h6 className="fw-bold text-uppercase" style={{ fontSize: "12px", color: "#2563eb", borderBottom: "1.5px solid #2563eb", paddingBottom: "2px" }}>// Academic Credentials</h6>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2" style={{ fontSize: "11.5px" }}>
                        <div className="d-flex justify-content-between fw-bold">
                            <span>{edu.course}</span>
                            <span>{edu.start} – {edu.end}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
