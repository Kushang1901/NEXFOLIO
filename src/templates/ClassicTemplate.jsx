import React from "react";

export default function ClassicTemplate({ data }) {

    const links = data?.basics?.links || {};
    const getUsername = (url, type) => {
        if (!url) return "";

        try {
            const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

            if (type === "github") {
                return cleanUrl.replace("github.com/", "");
            }

            if (type === "linkedin") {
                return cleanUrl.replace("linkedin.com/in/", "");
            }

            if (type === "portfolio") {
                return cleanUrl;
            }

            return cleanUrl;
        } catch {
            return url;
        }
    };

    return (
        <div className="p-5">
            {/* HEADER */}
            <div className="text-center mb-4">
                {data.basics.photo && (
                    <img
                        src={data.basics.photo}
                        alt="Profile"
                        style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginBottom: "12px",
                            border: "2px solid #0d6efd"
                        }}
                    />
                )}

                <h1 className="fw-bold">{data.basics.name}</h1>
                <p className="text-muted">
                    {data.basics.email} | {data.basics.phone}
                </p>
            </div>
            {/*Links and Portfolio */}
            {data.basics.role && (
                <p className="fw-semibold text-primary">{data.basics.role}</p>
            )}

            <div className="d-flex align-items-center gap-4 mt-3 flex-wrap">
                {links.github && (
                    <a
                        href={links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                    >
                        <i className="fab fa-github fa-lg text-dark"></i>
                        <span>{getUsername(links.github, "github")}</span>
                    </a>
                )}

                {links.linkedin && (
                    <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                    >
                        <i className="fab fa-linkedin fa-lg text-primary"></i>
                        <span>{getUsername(links.linkedin, "linkedin")}</span>
                    </a>
                )}

                {links.portfolio && (
                    <a
                        href={links.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                    >
                        <i className="fa-solid fa-globe fa-lg text-success"></i>
                        <span>{getUsername(links.portfolio, "portfolio")}</span>
                    </a>
                )}
            </div>



            {/* SUMMARY */}
            <section className="mb-4">
                <h5 className="fw-bold">PROFESSIONAL SUMMARY</h5>
                <p>{data.summary}</p>
            </section>

            {/* EDUCATION */}
            <section className="mb-4">
                <h5 className="fw-bold">EDUCATION</h5>
                {data.education.map((edu, i) => (
                    <p key={i}>
                        <strong>{edu.course}</strong><br />
                        {edu.start} – {edu.end}
                    </p>
                ))}
            </section>

            {/* EXPERIENCE */}
            {data.experience && (
                <section className="mb-4">
                    <h5 className="fw-bold">JOB EXPERIENCE</h5>
                    {typeof data.experience === "string" ? (
                        <p style={{ whiteSpace: "pre-line" }}>{data.experience}</p>
                    ) : (
                        <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <span className="fw-bold">{data.experience.role}</span>
                                <span className="text-muted small">{data.experience.start} – {data.experience.end}</span>
                            </div>
                            <div className="d-flex justify-content-between text-muted small italic">
                                <span>{data.experience.company} {data.experience.location && `| ${data.experience.location}`}</span>
                                {data.experience.salary && <span>Salary: {data.experience.salary}</span>}
                            </div>
                            {data.experience.description && (
                                <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                                    {data.experience.description}
                                </p>
                            )}
                        </div>
                    )}
                </section>
            )}

            {/* INTERNSHIP */}
            {data.internship && (
                <section className="mb-4">
                    <h5 className="fw-bold">INTERNSHIP</h5>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-baseline">
                            <span className="fw-bold">{data.internship.field}</span>
                            <span className="text-muted small">{data.internship.start} – {data.internship.end}</span>
                        </div>
                        <div className="text-muted small italic">
                            {data.internship.company}
                        </div>
                    </div>
                </section>
            )}

            {/* PROJECTS */}
            {data.projects && (
                <section className="mb-4">
                    <h5 className="fw-bold">PROJECTS</h5>
                    <p style={{ whiteSpace: "pre-line" }}>{data.projects}</p>
                </section>
            )}
            {/* ACHIEVEMENTS / CERTIFICATIONS */}
            {data.achievements && (
                <section className="mb-4">
                    <h5 className="fw-bold">ACHIEVEMENTS & CERTIFICATIONS</h5>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {data.achievements}
                    </p>
                </section>
            )}


            {/* SKILLS */}
            {data.skills.length > 0 && (
                <section>
                    <h5 className="fw-bold">SKILLS</h5>
                    <p>{data.skills.join(", ")}</p>
                </section>
            )}
        </div>
    );
}
