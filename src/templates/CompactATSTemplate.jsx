import React from "react";

export default function CompactATSTemplate({ data }) {
    const links = data?.basics?.links || {};
    
    return (
        <div className="p-4" style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%", fontFamily: "Arial, Helvetica, sans-serif", fontSize: "11px", color: "#111" }}>
            {/* HEADER */}
            <div className="border-bottom pb-2 mb-3">
                <h1 className="fw-bold mb-1 text-uppercase" style={{ fontSize: "20px", letterSpacing: "0.5px" }}>{data.basics.name}</h1>
                {data.basics.role && <h5 className="fw-semibold text-muted mb-2" style={{ fontSize: "12px" }}>{data.basics.role}</h5>}
                <div className="d-flex flex-wrap gap-2 text-muted">
                    <span>{data.basics.email}</span>
                    <span>•</span>
                    <span>{data.basics.phone}</span>
                    {links.linkedin && (
                        <>
                            <span>•</span>
                            <span>LinkedIn: {links.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        </>
                    )}
                    {links.github && (
                        <>
                            <span>•</span>
                            <span>GitHub: {links.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                        </>
                    )}
                </div>
            </div>

            {/* SUMMARY */}
            <div className="mb-3">
                <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Professional Summary</h6>
                <p style={{ lineHeight: "1.4", margin: 0 }}>{data.summary}</p>
            </div>

            {/* EXPERIENCE */}
            {data.experience && (
                <div className="mb-3">
                    <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Work Experience</h6>
                    {typeof data.experience === "string" ? (
                        <p style={{ whiteSpace: "pre-line", margin: 0 }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2">
                            <div className="d-flex justify-content-between fw-bold">
                                <span>{data.experience.role}</span>
                                <span>{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted mb-1">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
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

            {/* INTERNSHIP */}
            {data.internship && (
                <div className="mb-3">
                    <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Internships</h6>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between fw-bold">
                            <span>{data.internship.field}</span>
                            <span>{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="text-muted">
                            {data.internship.company}
                        </div>
                    </div>
                </div>
            )}

            {/* PROJECTS */}
            {data.projects && (
                <div className="mb-3">
                    <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Projects</h6>
                    <p style={{ whiteSpace: "pre-line", lineHeight: "1.4", margin: 0 }}>{data.projects}</p>
                </div>
            )}

            {/* EDUCATION */}
            <div className="mb-3">
                <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Education</h6>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2">
                        <div className="d-flex justify-content-between fw-bold">
                            <span>{edu.course}</span>
                            <span>{edu.start} – {edu.end}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ACHIEVEMENTS */}
            {data.achievements && (
                <div className="mb-3">
                    <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Achievements & Certifications</h6>
                    <p style={{ whiteSpace: "pre-line", lineHeight: "1.4", margin: 0 }}>{data.achievements}</p>
                </div>
            )}

            {/* SKILLS */}
            {data.skills.length > 0 && (
                <div>
                    <h6 className="fw-bold text-uppercase border-bottom pb-1" style={{ fontSize: "12px", borderBottomWidth: "2px" }}>Skills</h6>
                    <p style={{ margin: 0 }}>{data.skills.join(", ")}</p>
                </div>
            )}
        </div>
    );
}
