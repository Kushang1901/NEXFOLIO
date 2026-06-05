"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { subscribeToAuthChanges } from "../../authState";

export default function TemplateSelection() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            if (!user) {
                router.push("/?triggerAuth=true");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const selectTemplate = (id) => {
        sessionStorage.setItem("selectedTemplate", id);
        router.push("/builder");
    };

    return (
        <div className="bg-dark text-white min-vh-100">
            <Navbar />

            <div className="container py-5">
                <h1 className="text-center mb-5">Choose Your Resume Template</h1>

                <style dangerouslySetInnerHTML={{ __html: `
                    .template-card {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        border-color: #495057 !important;
                    }
                    .template-card:hover {
                        transform: translateY(-8px);
                        border-color: #0d6efd !important;
                        box-shadow: 0 12px 30px rgba(13, 110, 253, 0.25) !important;
                    }
                ` }} />

                <div className="row justify-content-center g-4">

                    {/* CLASSIC TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("classic")}
                        >
                            <div className="bg-white text-dark p-3 mb-3" style={{ minHeight: "220px", borderRadius: "6px" }}>
                                <h6 className="fw-bold text-center">John Doe</h6>
                                <p className="text-center small mb-2 text-muted" style={{ fontSize: "10px" }}>john@email.com | 9999999999</p>
                                <hr className="my-2" />
                                <p className="small mb-1 fw-bold" style={{ fontSize: "11px" }}>Summary</p>
                                <p className="text-muted" style={{ fontSize: "10px", lineHeight: "1.2" }}>Clean single-column resume layout.</p>
                                <p className="small mb-1 fw-bold" style={{ fontSize: "11px" }}>Skills</p>
                                <p className="text-muted" style={{ fontSize: "10px" }}>JavaScript, React, Node</p>
                            </div>
                            <h5 className="text-center mb-1">Classic</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Simple • ATS Friendly
                            </p>
                        </div>
                    </div>

                    {/* MODERN TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("modern")}
                        >
                            <div className="bg-white text-dark d-flex mb-3" style={{ minHeight: "220px", borderRadius: "6px", overflow: "hidden" }}>
                                <div className="bg-primary text-white p-2" style={{ width: "30%" }}>
                                    <p className="fw-bold mb-1" style={{ fontSize: "10px" }}>John</p>
                                    <p className="mb-1" style={{ fontSize: "9px" }}>Skills</p>
                                    <ul className="ps-2 text-white-50" style={{ fontSize: "8px", listStyleType: "none" }}>
                                        <li>• React</li>
                                        <li>• Node</li>
                                    </ul>
                                </div>
                                <div className="p-2" style={{ width: "70%" }}>
                                    <p className="fw-bold mb-1" style={{ fontSize: "10px" }}>Profile</p>
                                    <p className="text-muted mb-2" style={{ fontSize: "9px", lineHeight: "1.2" }}>Modern sidebar-based layout.</p>
                                    <p className="fw-bold mb-1" style={{ fontSize: "10px" }}>Experience</p>
                                    <p className="text-muted" style={{ fontSize: "9px" }}>Company Name</p>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Modern</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Professional • Corporate
                            </p>
                        </div>
                    </div>

                    {/* CREATIVE TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("creative")}
                        >
                            <div className="bg-white text-dark p-3 mb-3" style={{ minHeight: "220px", borderRadius: "6px" }}>
                                <div className="border rounded p-2 mb-2 bg-light">
                                    <p className="fw-bold mb-0" style={{ fontSize: "10px" }}>About Me</p>
                                    <p className="text-muted mb-0" style={{ fontSize: "9px" }}>Creative card-based design.</p>
                                </div>
                                <div className="border rounded p-2 mb-2 bg-light">
                                    <p className="fw-bold mb-0" style={{ fontSize: "10px" }}>Projects</p>
                                    <p className="text-muted mb-0" style={{ fontSize: "9px" }}>E-commerce App</p>
                                </div>
                                <div className="border rounded p-2 bg-light">
                                    <p className="fw-bold mb-0" style={{ fontSize: "10px" }}>Skills</p>
                                    <p className="text-muted mb-0" style={{ fontSize: "9px" }}>UI / UX</p>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Creative</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Stylish • Visual
                            </p>
                        </div>
                    </div>

                    {/* MINIMALIST TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("minimalist")}
                        >
                            <div className="bg-white text-dark p-3 mb-3" style={{ minHeight: "220px", borderRadius: "6px", fontFamily: "sans-serif" }}>
                                <h6 className="fw-light text-center text-uppercase mb-1" style={{ letterSpacing: "1px", fontSize: "12px" }}>JOHN DOE</h6>
                                <p className="text-center text-muted mb-2" style={{ fontSize: "8px" }}>john@email.com • 9999999999</p>
                                <div style={{ borderBottom: "1px solid #e2e8f0", marginBottom: "8px" }}></div>
                                <p className="fw-semibold text-uppercase text-secondary mb-1" style={{ fontSize: "9px", letterSpacing: "0.5px" }}>Profile</p>
                                <p className="text-muted" style={{ fontSize: "9px", lineHeight: "1.2" }}>Clean typography and ample breathing room.</p>
                                <div className="d-flex flex-wrap gap-1 mt-2">
                                    <span className="bg-light text-secondary border px-2 py-0.5 rounded-pill" style={{ fontSize: "7px" }}>React</span>
                                    <span className="bg-light text-secondary border px-2 py-0.5 rounded-pill" style={{ fontSize: "7px" }}>Node</span>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Minimalist</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Clean • Elegant
                            </p>
                        </div>
                    </div>

                    {/* EXECUTIVE TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("executive")}
                        >
                            <div className="bg-white text-dark mb-3" style={{ minHeight: "220px", borderRadius: "6px", overflow: "hidden" }}>
                                <div className="p-2 text-white text-center" style={{ background: "#1b2a4a" }}>
                                    <h6 className="fw-bold mb-0" style={{ fontSize: "12px" }}>John Doe</h6>
                                    <p className="mb-0" style={{ fontSize: "7px", color: "#a5b4fc" }}>EXECUTIVE DIRECTOR</p>
                                </div>
                                <div className="d-flex" style={{ height: "160px" }}>
                                    <div className="p-2" style={{ width: "35%", background: "#f1f5f9", height: "100%" }}>
                                        <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>Skills</p>
                                        <p className="text-muted mb-0" style={{ fontSize: "7px" }}>Management</p>
                                        <p className="text-muted mb-0" style={{ fontSize: "7px" }}>Strategy</p>
                                    </div>
                                    <div className="p-2" style={{ width: "65%", height: "100%" }}>
                                        <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>Summary</p>
                                        <p className="text-muted" style={{ fontSize: "7px", lineHeight: "1.2" }}>Senior level structured layout.</p>
                                    </div>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Executive</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Prestigious • Leadership
                            </p>
                        </div>
                    </div>

                    {/* DEVELOPER TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("developer")}
                        >
                            <div className="bg-white text-dark d-flex mb-3" style={{ minHeight: "220px", borderRadius: "6px", overflow: "hidden", fontFamily: "monospace" }}>
                                <div className="p-2 text-white" style={{ width: "35%", background: "#0f172a", height: "100%" }}>
                                    <p className="fw-bold mb-1 text-info" style={{ fontSize: "9px" }}>John</p>
                                    <p className="mb-0 text-muted" style={{ fontSize: "7px" }}>// links</p>
                                    <p className="mb-1 text-white-50" style={{ fontSize: "6px" }}>github.com</p>
                                    <p className="mb-0 text-muted" style={{ fontSize: "7px" }}>// stack</p>
                                    <span className="text-info" style={{ fontSize: "6px" }}>React, Node</span>
                                </div>
                                <div className="p-2" style={{ width: "65%", height: "100%" }}>
                                    <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>const profile = () =&gt;</p>
                                    <p className="text-muted" style={{ fontSize: "7px", borderLeft: "1px dashed #cbd5e1", paddingLeft: "4px" }}>Web Dev & Engineer.</p>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Developer</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Tech • Code-Inspired
                            </p>
                        </div>
                    </div>

                    {/* ELEGANT TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("elegant")}
                        >
                            <div className="bg-white text-dark p-3 mb-3 text-center" style={{ minHeight: "220px", borderRadius: "6px", fontFamily: "Georgia, serif" }}>
                                <h6 className="fw-normal mb-0" style={{ fontStyle: "italic", fontSize: "14px" }}>John Doe</h6>
                                <p className="text-muted" style={{ fontSize: "7px", letterSpacing: "1px" }}>WRITER & EDITORIAL</p>
                                <div style={{ borderBottom: "1px double #4a5568", margin: "4px 0" }}></div>
                                <p className="fw-semibold text-uppercase text-secondary mb-1" style={{ fontSize: "8px" }}>Academic Summary</p>
                                <p className="text-muted mb-2" style={{ fontSize: "8px", fontStyle: "italic", lineHeight: "1.2" }}>A formal, beautiful serif template.</p>
                                <div style={{ borderBottom: "1px solid #e2e8f0", margin: "4px 0" }}></div>
                                <p className="text-muted" style={{ fontSize: "7px" }}>Publications • Research</p>
                            </div>
                            <h5 className="text-center mb-1">Elegant</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Formal • Editorial
                            </p>
                        </div>
                    </div>

                    {/* ACCENT LINE TEMPLATE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("accent")}
                        >
                            <div className="bg-white text-dark mb-3" style={{ minHeight: "220px", borderRadius: "6px", overflow: "hidden" }}>
                                <div style={{ height: "4px", background: "linear-gradient(to right, #00b4db, #0083b0)" }}></div>
                                <div className="p-3">
                                    <h6 className="fw-bold mb-0" style={{ color: "#0083b0", fontSize: "12px" }}>John Doe</h6>
                                    <p className="text-muted mb-2" style={{ fontSize: "7px" }}>Full Stack Developer</p>
                                    <hr className="my-1" />
                                    <p className="fw-semibold text-uppercase mb-1" style={{ color: "#0083b0", fontSize: "8px" }}>Profile Summary</p>
                                    <p className="text-muted" style={{ fontSize: "8px", lineHeight: "1.2" }}>Modern layout with top gradient border.</p>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Accent Line</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Modern • Clean Accent
                            </p>
                        </div>
                    </div>

                    {/* NAVY ELEGANCE */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("navy_elegance")}
                        >
                            <div className="bg-white text-dark mb-3" style={{ minHeight: "220px", borderRadius: "6px", overflow: "hidden" }}>
                                <div className="p-3 text-white text-center" style={{ background: "#0f172a", borderBottom: "3px solid #3b82f6" }}>
                                    <h6 className="fw-bold mb-0" style={{ fontSize: "11px" }}>John Doe</h6>
                                    <p className="mb-0 text-white-50" style={{ fontSize: "8px" }}>Navy Corporate</p>
                                </div>
                                <div className="p-2">
                                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Summary</p>
                                    <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>Professional header banner layout.</p>
                                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Education</p>
                                    <p className="text-muted mb-0" style={{ fontSize: "8px" }}>B.S. Computer Science</p>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Navy Elegance</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Corporate • Blue Banner
                            </p>
                        </div>
                    </div>

                    {/* MODERN MINIMALIST B&W */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("minimalist_bw")}
                        >
                            <div className="bg-white text-dark p-3 mb-3" style={{ minHeight: "220px", borderRadius: "6px" }}>
                                <div className="border-bottom border-2 border-dark pb-2 mb-2">
                                    <h6 className="fw-bold text-center mb-0" style={{ fontSize: "12px" }}>JOHN DOE</h6>
                                    <p className="text-center text-muted mb-0" style={{ fontSize: "8px" }}>SOFTWARE ENGINEER</p>
                                </div>
                                <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>PROFILE</p>
                                <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>High-contrast clean typography.</p>
                                <div className="d-flex flex-wrap gap-1">
                                    <span className="border border-dark px-1 text-center" style={{ fontSize: "7px" }}>React</span>
                                    <span className="border border-dark px-1 text-center" style={{ fontSize: "7px" }}>Node</span>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Modern Minimalist</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Black & White • Clean
                            </p>
                        </div>
                    </div>

                    {/* EMERALD PROFESSIONAL */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("emerald")}
                        >
                            <div className="bg-white text-dark p-3 mb-3" style={{ minHeight: "220px", borderRadius: "6px" }}>
                                <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-2" style={{ borderColor: "#0f766e" }}>
                                    <div className="bg-teal text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "20px", height: "20px", background: "#0f766e", fontSize: "10px" }}>JD</div>
                                    <div>
                                        <h6 className="fw-bold mb-0" style={{ fontSize: "11px", color: "#0f766e" }}>John Doe</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: "8px" }}>Developer</p>
                                    </div>
                                </div>
                                <p className="fw-bold mb-1" style={{ fontSize: "9px", color: "#0f766e" }}>Summary</p>
                                <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>Modern layout with teal highlights.</p>
                                <span className="px-2 py-0.5 rounded-pill border" style={{ fontSize: "7px", color: "#0f766e", borderColor: "#0f766e", backgroundColor: "#f0fdfa" }}>React</span>
                            </div>
                            <h5 className="text-center mb-1">Emerald Professional</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Fresh • Teal Accent
                            </p>
                        </div>
                    </div>

                    {/* SLATE TWO-COLUMN */}
                    <div className="col-md-6 col-lg-3">
                        <div
                            className="bg-black border p-3 h-100 template-card"
                            style={{ borderRadius: "12px", cursor: "pointer" }}
                            onClick={() => selectTemplate("slate_two_column")}
                        >
                            <div className="bg-white text-dark d-flex mb-3" style={{ minHeight: "220px", borderRadius: "6px", overflow: "hidden" }}>
                                <div className="p-2" style={{ width: "35%", background: "#f8fafc", borderRight: "1px solid #e2e8f0", height: "100%" }}>
                                    <h6 className="fw-bold mb-1" style={{ fontSize: "9px" }}>John Doe</h6>
                                    <p className="text-muted mb-2" style={{ fontSize: "7px" }}>Web Developer</p>
                                    <hr className="my-1" />
                                    <span className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded" style={{ fontSize: "6px" }}>React</span>
                                </div>
                                <div className="p-2" style={{ width: "65%", height: "100%" }}>
                                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Profile</p>
                                    <p className="text-muted mb-2" style={{ fontSize: "7px", lineHeight: "1.2" }}>Two-column split layouts.</p>
                                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Experience</p>
                                    <p className="text-muted" style={{ fontSize: "7px" }}>Engineer</p>
                                </div>
                            </div>
                            <h5 className="text-center mb-1">Slate Two-Column</h5>
                            <p className="text-center text-white-50 small mb-0">
                                Two-Column • Elegant
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
