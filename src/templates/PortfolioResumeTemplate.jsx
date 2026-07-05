import React from "react";

export default function PortfolioResumeTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="p-5" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "'Inter', sans-serif", color: "#0f172a" }}>
            {/* HERO PROFILE HEADER */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-4 border-bottom">
                <div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: "30px", letterSpacing: "-0.75px" }}>{data.basics.name}</h1>
                    {data.basics.role && (
                        <span className="badge text-white py-2 px-3 fs-6 fw-bold mb-2" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
                            {data.basics.role}
                        </span>
                    )}
                    <div className="d-flex flex-wrap gap-3 mt-2 text-muted" style={{ fontSize: "12px" }}>
                        <span><i className="fa-solid fa-envelope me-1"></i> {data.basics.email}</span>
                        <span>|</span>
                        <span><i className="fa-solid fa-phone me-1"></i> {data.basics.phone}</span>
                    </div>
                </div>
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "3px solid #6366f1"
                        }}
                    />
                )}
            </div>

            {/* PORTFOLIO LINKS BAR */}
            {(links.portfolio || links.github || links.linkedin) && (
                <div className="d-flex gap-3 p-3 mb-4 rounded-3 text-white" style={{ background: "#0f172a", fontSize: "12px" }}>
                    <span className="fw-bold text-uppercase text-secondary me-2" style={{ letterSpacing: "1px", color: "#a5b4fc" }}>Links:</span>
                    {links.portfolio && (
                        <a href={links.portfolio} target="_blank" rel="noreferrer" className="text-decoration-none text-white fw-bold">
                            <i className="fa-solid fa-globe text-info me-1"></i> Portfolio
                        </a>
                    )}
                    {links.github && (
                        <a href={links.github} target="_blank" rel="noreferrer" className="text-decoration-none text-white fw-bold">
                            <i className="fab fa-github text-white-50 me-1"></i> GitHub
                        </a>
                    )}
                    {links.linkedin && (
                        <a href={links.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none text-white fw-bold">
                            <i className="fab fa-linkedin text-primary me-1"></i> LinkedIn
                        </a>
                    )}
                </div>
            )}

            {/* SUMMARY */}
            <section className="mb-4">
                <h5 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px", color: "#4f46e5" }}>Profile Summary</h5>
                <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155", margin: 0 }}>{data.summary}</p>
            </section>

            {/* TECH STACK */}
            {data.skills.length > 0 && (
                <section className="mb-4">
                    <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px", color: "#4f46e5" }}>Tech Stack & Skills</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                            <span key={idx} style={{ fontSize: "11px", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.15)", borderRadius: "8px", padding: "4px 10px", color: "#4f46e5", fontWeight: "600" }}>{skill}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* PROJECTS */}
            {data.projects && (
                <section className="mb-4">
                    <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px", color: "#4f46e5" }}>Featured Projects</h5>
                    <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#334155", whiteSpace: "pre-line", margin: 0 }}>{data.projects}</p>
                </section>
            )}

            {/* EXPERIENCE */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px", color: "#4f46e5" }}>Experience</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ fontSize: "11.5px", whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                    ) : (
                        <div className="mb-3">
                            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: "12px" }}>
                                <span>{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="text-muted mb-1" style={{ fontSize: "11px" }}>
                                {data.experience.company} {data.experience.location && `| ${data.experience.location}`}
                            </div>
                            {data.experience.description && (
                                <p style={{ fontSize: "11.5px", lineHeight: "1.5", color: "#475569", whiteSpace: "pre-line", margin: 0 }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* EDUCATION */}
            <section className="mb-4">
                <h5 className="fw-bold mb-3 text-uppercase" style={{ fontSize: "11px", letterSpacing: "1px", color: "#4f46e5" }}>Education</h5>
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
