import React from "react";

export default function BentoTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="p-4 bg-light" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif" }}>
            {/* GRID LAYOUT CONTAINER */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                
                {/* 1. HEADER CARD (Full Width span) */}
                <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }} className="d-flex align-items-center justify-content-between">
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: "28px", color: "#0f172a" }}>{data.basics.name}</h1>
                        {data.basics.role && <h5 className="fw-bold text-muted mb-0" style={{ fontSize: "14px" }}>{data.basics.role}</h5>}
                    </div>
                    {data.basics.photo && (
                        <img
                            src={data.basics.photo}
                            alt="Profile"
                            style={{
                                width: "64px",
                                height: "64px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "2px solid #e2e8f0"
                            }}
                        />
                    )}
                </div>

                {/* 2. CONTACT BOX */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
                    <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Connect</h6>
                    <div style={{ fontSize: "11.5px", color: "#334155" }}>
                        <div className="mb-1"><strong>Email:</strong> {data.basics.email}</div>
                        <div className="mb-1"><strong>Phone:</strong> {data.basics.phone}</div>
                        {links.linkedin && <div className="mb-1"><strong>LinkedIn:</strong> {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                        {links.github && <div><strong>GitHub:</strong> {links.github.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                    </div>
                </div>

                {/* 3. SKILLS WIDGET */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
                    <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Toolbox</h6>
                    <div className="d-flex flex-wrap gap-1.5" style={{ gap: "4px" }}>
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "10.5px", background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", fontWeight: "600", color: "#475569" }}>{skill}</span>
                        ))}
                    </div>
                </div>

                {/* 4. BIO PROFILE (Full Width span) */}
                <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                    <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Profile Statement</h6>
                    <p style={{ fontSize: "12px", lineHeight: "1.5", color: "#334155", margin: 0 }}>{data.summary}</p>
                </div>

                {/* 5. JOB EXPERIENCE (Full Width span) */}
                {data.experience && (
                    <div style={{ gridColumn: "span 2", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                        <h6 className="fw-bold text-uppercase text-secondary mb-3" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Experience</h6>
                        {typeof data.experience === "string" ? (
                            <p style={{ fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                        ) : (
                            <div>
                                <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                    <span>{data.experience.role}</span>
                                    <span>{data.experience.start} – {data.experience.end}</span>
                                </div>
                                <div className="text-muted mb-2" style={{ fontSize: "11px" }}>
                                    {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                                </div>
                                {data.experience.description && (
                                    <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                                        {data.experience.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 6. PROJECTS BLOCK */}
                {data.projects && (
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
                        <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Projects</h6>
                        <p style={{ fontSize: "11.5px", lineHeight: "1.4", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p>
                    </div>
                )}

                {/* 7. EDUCATION BLOCK */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px" }}>
                    <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.5px" }}>Education</h6>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="fw-bold" style={{ fontSize: "12px" }}>{edu.course}</div>
                            <div className="text-muted small">{edu.start} – {edu.end}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
