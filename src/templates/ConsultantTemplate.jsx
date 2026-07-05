import React from "react";

export default function ConsultantTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
            {/* HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-2 pb-3" style={{ borderColor: "#1e3a8a" }}>
                <div>
                    <h1 className="fw-bold mb-1 text-uppercase" style={{ fontSize: "24px", color: "#1e3a8a", letterSpacing: "1px" }}>{data.basics.name}</h1>
                    {data.basics.role && <h5 className="text-secondary mb-0" style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>{data.basics.role}</h5>}
                </div>
                <div style={{ fontSize: "11px", textAlign: "right", color: "#475569" }}>
                    <div>{data.basics.email}</div>
                    <div>{data.basics.phone}</div>
                    {links.linkedin && <div>{links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>}
                </div>
            </div>

            {/* PROFILE SECTION */}
            <section className="mb-4">
                <h6 className="fw-bold text-uppercase mb-2" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Executive Profile</h6>
                <p style={{ fontSize: "12px", lineHeight: "1.6", margin: 0, textAlign: "justify" }}>{data.summary}</p>
            </section>

            {/* CORE EXPERTISE */}
            {data.skills.length > 0 && (
                <section className="mb-4">
                    <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Core Competencies</h6>
                    <div className="row g-2">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="col-4">
                                <div style={{ fontSize: "11px", borderLeft: "2px solid #1e3a8a", paddingLeft: "8px", fontWeight: "500" }}>{skill}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* JOB EXPERIENCE */}
            {data.experience && (
                <section className="mb-4">
                    <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Professional Engagements</h6>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "11.5px", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12.5px" }}>
                                <span>{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="text-muted mb-2" style={{ fontSize: "11px", fontWeight: "500" }}>
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* PROJECTS */}
            {data.projects && (
                <section className="mb-4">
                    <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Selected Case Studies & Consulting Projects</h6>
                    <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p>
                </section>
            )}

            {/* EDUCATION */}
            <section className="mb-4">
                <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "11px", color: "#1e3a8a", letterSpacing: "1px" }}>Education</h6>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2" style={{ fontSize: "12px" }}>
                        <div className="d-flex justify-content-between">
                            <strong>{edu.course}</strong>
                            <span className="text-muted small">{edu.start} – {edu.end}</span>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
