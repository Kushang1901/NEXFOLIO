import React from "react";

export const templateList = [
    {
        id: "classic",
        name: "Classic",
        category: "professional",
        tags: ["ATS Friendly", "Simple"],
        desc: "Traditional single-column layout preferred by financial and corporate firms.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div>
                    <h6 className="fw-bold text-center mb-0" style={{ fontSize: "11px" }}>John Doe</h6>
                    <p className="text-center text-muted mb-2" style={{ fontSize: "8px" }}>john@email.com | 9999999999</p>
                    <hr className="my-1" />
                    <p className="small mb-1 fw-bold" style={{ fontSize: "9px" }}>Summary</p>
                    <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>Clean single-column resume layout.</p>
                </div>
                <div>
                    <p className="small mb-1 fw-bold" style={{ fontSize: "9px" }}>Skills</p>
                    <p className="text-muted mb-0" style={{ fontSize: "8px" }}>JavaScript, React, Node</p>
                </div>
            </div>
        )
    },
    {
        id: "modern",
        name: "Modern",
        category: "professional",
        tags: ["Professional", "Sidebar"],
        desc: "A sleek sidebar format displaying credentials, contact, and skills dynamically.",
        preview: (
            <div className="bg-white text-dark d-flex h-100" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div className="bg-primary text-white p-2" style={{ width: "32%" }}>
                    <p className="fw-bold mb-1" style={{ fontSize: "10px" }}>John</p>
                    <p className="mb-1" style={{ fontSize: "8px" }}>Skills</p>
                    <ul className="ps-2 text-white-50" style={{ fontSize: "7px", listStyleType: "none" }}>
                        <li>• React</li>
                        <li>• Node</li>
                    </ul>
                </div>
                <div className="p-2" style={{ width: "68%" }}>
                    <p className="fw-bold mb-1" style={{ fontSize: "9.5px" }}>Profile</p>
                    <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>Modern sidebar-based layout.</p>
                    <p className="fw-bold mb-1" style={{ fontSize: "9.5px" }}>Experience</p>
                    <p className="text-muted" style={{ fontSize: "8px" }}>Company Name</p>
                </div>
            </div>
        )
    },
    {
        id: "creative",
        name: "Creative",
        category: "creative",
        tags: ["Stylish", "Visual"],
        desc: "Card-style blocks built for designers, artists, and marketers.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div className="border rounded p-2 mb-1 bg-light">
                    <p className="fw-bold mb-0" style={{ fontSize: "9.5px" }}>About Me</p>
                    <p className="text-muted mb-0" style={{ fontSize: "8px" }}>Creative card-based design.</p>
                </div>
                <div className="border rounded p-2 mb-1 bg-light">
                    <p className="fw-bold mb-0" style={{ fontSize: "9.5px" }}>Projects</p>
                    <p className="text-muted mb-0" style={{ fontSize: "8px" }}>E-commerce App</p>
                </div>
                <div className="border rounded p-2 bg-light">
                    <p className="fw-bold mb-0" style={{ fontSize: "9.5px" }}>Skills</p>
                    <p className="text-muted mb-0" style={{ fontSize: "8px" }}>UI / UX</p>
                </div>
            </div>
        )
    },
    {
        id: "minimalist",
        name: "Minimalist",
        category: "minimalist",
        tags: ["Clean", "Elegant"],
        desc: "Spacious typography with generous borders for a professional showcase.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px", fontFamily: "sans-serif" }}>
                <div>
                    <h6 className="fw-light text-center text-uppercase mb-1" style={{ letterSpacing: "1px", fontSize: "11px" }}>JOHN DOE</h6>
                    <p className="text-center text-muted mb-2" style={{ fontSize: "8px" }}>john@email.com • 9999999999</p>
                    <div style={{ borderBottom: "1px solid #e2e8f0", marginBottom: "8px" }}></div>
                    <p className="fw-semibold text-uppercase text-secondary mb-1" style={{ fontSize: "9px", letterSpacing: "0.5px" }}>Profile</p>
                    <p className="text-muted" style={{ fontSize: "8px", lineHeight: "1.2" }}>Clean typography and ample breathing room.</p>
                </div>
                <div className="d-flex flex-wrap gap-1 mt-1">
                    <span className="bg-light text-secondary border px-2 py-0.5 rounded-pill" style={{ fontSize: "7px" }}>React</span>
                    <span className="bg-light text-secondary border px-2 py-0.5 rounded-pill" style={{ fontSize: "7px" }}>Node</span>
                </div>
            </div>
        )
    },
    {
        id: "executive",
        name: "Executive",
        category: "professional",
        tags: ["Corporate", "Leadership"],
        desc: "Structured split banner tailored for senior corporate roles.",
        preview: (
            <div className="bg-white text-dark h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div className="p-2 text-white text-center" style={{ background: "#1b2a4a" }}>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "11px" }}>John Doe</h6>
                    <p className="mb-0" style={{ fontSize: "7px", color: "#a5b4fc" }}>EXECUTIVE DIRECTOR</p>
                </div>
                <div className="d-flex flex-grow-1">
                    <div className="p-2" style={{ width: "35%", background: "#f1f5f9", height: "100%" }}>
                        <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>Skills</p>
                        <p className="text-muted mb-0" style={{ fontSize: "7px" }}>Management</p>
                        <p className="text-muted mb-0" style={{ fontSize: "7px" }}>Strategy</p>
                    </div>
                    <div className="p-2" style={{ width: "65%" }}>
                        <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>Summary</p>
                        <p className="text-muted" style={{ fontSize: "7px", lineHeight: "1.2" }}>Senior level structured layout.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "developer",
        name: "Developer",
        category: "tech",
        tags: ["Monospace", "Terminal Style"],
        desc: "Markdown/IDE inspired terminal layout built for technical engineers.",
        preview: (
            <div className="bg-white text-dark d-flex h-100" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden", fontFamily: "monospace" }}>
                <div className="p-2 text-white" style={{ width: "38%", background: "#0f172a" }}>
                    <p className="fw-bold mb-1 text-info" style={{ fontSize: "9px" }}>John</p>
                    <p className="mb-0 text-muted" style={{ fontSize: "6.5px" }}>// stack</p>
                    <span className="text-info" style={{ fontSize: "6px" }}>React, Node</span>
                </div>
                <div className="p-2" style={{ width: "62%" }}>
                    <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>const profile = () =&gt;</p>
                    <p className="text-muted" style={{ fontSize: "7px", borderLeft: "1px dashed #cbd5e1", paddingLeft: "4px" }}>Web Dev & Engineer.</p>
                </div>
            </div>
        )
    },
    {
        id: "elegant",
        name: "Elegant",
        category: "minimalist",
        tags: ["Serif", "Editorial"],
        desc: "Double ruled borders and serif font for classic editorial styles.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 text-center d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px", fontFamily: "Georgia, serif" }}>
                <div>
                    <h6 className="fw-normal mb-0" style={{ fontStyle: "italic", fontSize: "13px" }}>John Doe</h6>
                    <p className="text-muted" style={{ fontSize: "7px", letterSpacing: "1px" }}>WRITER & EDITORIAL</p>
                    <div style={{ borderBottom: "1px solid #4a5568", margin: "4px 0" }}></div>
                    <p className="fw-semibold text-uppercase text-secondary mb-1" style={{ fontSize: "8px" }}>Academic Summary</p>
                    <p className="text-muted mb-2" style={{ fontSize: "7px", fontStyle: "italic", lineHeight: "1.2" }}>A formal, beautiful serif template.</p>
                </div>
                <div>
                    <div style={{ borderBottom: "1px solid #e2e8f0", margin: "4px 0" }}></div>
                    <p className="text-muted mb-0" style={{ fontSize: "7px" }}>Publications • Research</p>
                </div>
            </div>
        )
    },
    {
        id: "accent",
        name: "Accent Line",
        category: "minimalist",
        tags: ["Gradient", "Clean Accent"],
        desc: "Features a dynamic gradient line header for corporate professionals.",
        preview: (
            <div className="bg-white text-dark h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ height: "4px", background: "linear-gradient(to right, #00b4db, #0083b0)" }}></div>
                <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                        <h6 className="fw-bold mb-0" style={{ color: "#0083b0", fontSize: "11px" }}>John Doe</h6>
                        <p className="text-muted mb-2" style={{ fontSize: "7px" }}>Full Stack Developer</p>
                        <hr className="my-1" />
                        <p className="fw-semibold text-uppercase mb-1" style={{ color: "#0083b0", fontSize: "8px" }}>Profile Summary</p>
                        <p className="text-muted mb-0" style={{ fontSize: "8px", lineHeight: "1.2" }}>Modern layout with top gradient border.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "navy_elegance",
        name: "Navy Elegance",
        category: "professional",
        tags: ["Blue Banner", "Corporate"],
        desc: "Dark blue header layout designed for professional presentation.",
        preview: (
            <div className="bg-white text-dark h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div className="p-2 text-white text-center" style={{ background: "#0f172a", borderBottom: "3px solid #3b82f6" }}>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "11px" }}>John Doe</h6>
                    <p className="mb-0 text-white-50" style={{ fontSize: "7px" }}>Navy Corporate</p>
                </div>
                <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                        <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Summary</p>
                        <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>Professional header banner layout.</p>
                    </div>
                    <div>
                        <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Education</p>
                        <p className="text-muted mb-0" style={{ fontSize: "8px" }}>B.S. Computer Science</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "minimalist_bw",
        name: "Modern Minimalist",
        category: "minimalist",
        tags: ["Black & White", "Clean"],
        desc: "High-contrast geometric styling focusing heavily on bold font structures.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div>
                    <div className="border-bottom border-2 border-dark pb-1 mb-2">
                        <h6 className="fw-bold text-center mb-0" style={{ fontSize: "11px" }}>JOHN DOE</h6>
                        <p className="text-center text-muted mb-0" style={{ fontSize: "7px" }}>SOFTWARE ENGINEER</p>
                    </div>
                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>PROFILE</p>
                    <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>High-contrast clean typography.</p>
                </div>
                <div className="d-flex flex-wrap gap-1">
                    <span className="border border-dark px-1 text-center" style={{ fontSize: "7px" }}>React</span>
                    <span className="border border-dark px-1 text-center" style={{ fontSize: "7px" }}>Node</span>
                </div>
            </div>
        )
    },
    {
        id: "emerald",
        name: "Emerald Professional",
        category: "professional",
        tags: ["Teal Accent", "Fresh"],
        desc: "Modern and fresh look featuring elegant emerald colored accents.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div>
                    <div className="d-flex align-items-center gap-2 border-bottom pb-1 mb-2" style={{ borderColor: "#0f766e" }}>
                        <div className="bg-teal text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "18px", height: "18px", background: "#0f766e", fontSize: "9px" }}>JD</div>
                        <div>
                            <h6 className="fw-bold mb-0" style={{ fontSize: "10px", color: "#0f766e" }}>John Doe</h6>
                            <p className="text-muted mb-0" style={{ fontSize: "7.5px" }}>Developer</p>
                        </div>
                    </div>
                    <p className="fw-bold mb-1" style={{ fontSize: "9px", color: "#0f766e" }}>Summary</p>
                    <p className="text-muted mb-2" style={{ fontSize: "8px", lineHeight: "1.2" }}>Modern layout with teal highlights.</p>
                </div>
                <div>
                    <span className="px-2 py-0.5 rounded-pill border" style={{ fontSize: "7px", color: "#0f766e", borderColor: "#0f766e", backgroundColor: "#f0fdfa" }}>React</span>
                </div>
            </div>
        )
    },
    {
        id: "slate_two_column",
        name: "Slate Two-Column",
        category: "professional",
        tags: ["Two-Column", "Clean Design"],
        desc: "Split-grid format allocating ample sidebar space for rapid reading.",
        preview: (
            <div className="bg-white text-dark d-flex h-100" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div className="p-2" style={{ width: "35%", background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>
                    <h6 className="fw-bold mb-1" style={{ fontSize: "9px" }}>John Doe</h6>
                    <p className="text-muted mb-2" style={{ fontSize: "7px" }}>Web Developer</p>
                    <hr className="my-1" />
                    <span className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded" style={{ fontSize: "6px" }}>React</span>
                </div>
                <div className="p-2" style={{ width: "65%" }}>
                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Profile</p>
                    <p className="text-muted mb-2" style={{ fontSize: "7px", lineHeight: "1.2" }}>Two-column split layouts.</p>
                    <p className="fw-bold mb-1" style={{ fontSize: "9px" }}>Experience</p>
                    <p className="text-muted" style={{ fontSize: "7px" }}>Engineer</p>
                </div>
            </div>
        )
    },
    {
        id: "sunrise",
        name: "Sunrise",
        category: "creative",
        tags: ["Warm Gradient", "Modern Diagonal"],
        desc: "Features a warm orange header gradient and sharp modern clip cuts.",
        preview: (
            <div className="text-dark h-100 d-flex flex-column bg-white" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #e85d04, #f48c06)", padding: "12px", position: "relative" }}>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "11px", color: "#fff" }}>John Doe</h6>
                    <p className="mb-0" style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>Full Stack Developer</p>
                </div>
                <div style={{ height: "6px", background: "#fff", marginTop: "-6px", clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}></div>
                <div style={{ padding: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }} className="flex-grow-1">
                    <div>
                        <p className="fw-bold mb-1" style={{ fontSize: "8px", color: "#e85d04" }}>About Me</p>
                        <p className="text-muted mb-0" style={{ fontSize: "7px", lineHeight: "1.2" }}>Warm orange gradient with diagonal clip.</p>
                    </div>
                    <div>
                        <p className="fw-bold mb-1" style={{ fontSize: "8px", color: "#e85d04" }}>Skills</p>
                        <span style={{ background: "#fff3e0", color: "#e85d04", fontSize: "6px", padding: "2px 5px", borderRadius: "10px" }}>React</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "midnight",
        name: "Midnight",
        category: "tech",
        tags: ["Dark Purple", "Futuristic"],
        desc: "Stunning dark-mode layout with violet glow accents and dark code structure.",
        preview: (
            <div className="h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden", background: "#0f0a1e" }}>
                <div style={{ padding: "10px", background: "linear-gradient(135deg, #0f0a1e, #1e3a5f22)", borderBottom: "1px solid #2d1f5e" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#fff", marginBottom: "4px" }}>J</div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "10px", color: "#e2d9f3" }}>John Doe</h6>
                    <p className="mb-0" style={{ fontSize: "7px", color: "#a78bfa" }}>Software Engineer</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr" }} className="flex-grow-1">
                    <div style={{ background: "#1a1033", padding: "6px", borderRight: "1px solid #2d1f5e" }}>
                        <p style={{ fontSize: "7px", fontWeight: "700", color: "#7c3aed", textTransform: "uppercase", marginBottom: "4px" }}>Skills</p>
                        <div style={{ background: "#7c3aed22", border: "1px solid #2d1f5e", borderRadius: "4px", padding: "1px 3px", fontSize: "6px", color: "#d8b4fe" }}>React</div>
                    </div>
                    <div style={{ padding: "6px" }}>
                        <p style={{ fontSize: "7px", color: "#c4b5fd", lineHeight: "1.3", margin: 0 }}>Dark purple theme for tech professionals.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "nordic",
        name: "Nordic",
        category: "professional",
        tags: ["Scandinavian", "Clean"],
        desc: "Crisp blue accent borders paired with clean minimal spacing.",
        preview: (
            <div className="bg-white text-dark h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ height: "4px", background: "#2563eb" }}></div>
                <div style={{ padding: "8px 10px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h6 className="fw-bold mb-0" style={{ fontSize: "11px" }}>John Doe</h6>
                        <p className="mb-0" style={{ fontSize: "6px", color: "#2563eb", textTransform: "uppercase", fontWeight: "600" }}>Engineer</p>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "6px", color: "#6b7280" }}>john@email.com</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr" }} className="flex-grow-1">
                    <div style={{ padding: "6px", borderRight: "1px solid #e5e7eb" }}>
                        <p className="fw-bold mb-1" style={{ fontSize: "7px", color: "#2563eb" }}>Profile</p>
                        <p className="text-muted mb-0" style={{ fontSize: "6.5px", lineHeight: "1.2" }}>Scandinavian clean design.</p>
                    </div>
                    <div style={{ padding: "6px", background: "#f9fafb" }}>
                        <p className="fw-bold mb-1" style={{ fontSize: "7px", color: "#2563eb" }}>Skills</p>
                        <span style={{ fontSize: "6px" }}>• React</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "crimson",
        name: "Crimson",
        category: "professional",
        tags: ["Serif", "Red Accent"],
        desc: "Classic serif typography with a red crimson logo banner.",
        preview: (
            <div className="bg-white text-dark h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ background: "#1c1917", padding: "8px 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "22px", height: "22px", background: "#be123c", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#fff" }}>J</div>
                    <div>
                        <h6 className="fw-bold mb-0" style={{ fontSize: "10px", color: "#fff", fontFamily: "Georgia, serif" }}>John Doe</h6>
                        <p className="mb-0" style={{ fontSize: "6.5px", color: "#be123c", textTransform: "uppercase" }}>Director</p>
                    </div>
                </div>
                <div className="p-2 flex-grow-1">
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "6px" }}>
                        <div>
                            <p className="fw-bold mb-0" style={{ fontSize: "7.5px", fontFamily: "Georgia, serif", fontStyle: "italic" }}>Experience</p>
                            <p className="text-muted mb-0" style={{ fontSize: "6.5px", lineHeight: "1.2", fontFamily: "Georgia, serif" }}>Elegant serif layout.</p>
                        </div>
                        <div>
                            <p className="fw-bold mb-0" style={{ fontSize: "7.5px", fontFamily: "Georgia, serif", fontStyle: "italic" }}>Skills</p>
                            <span style={{ background: "#fff1f2", color: "#be123c", fontSize: "6px", padding: "1px 3px" }}>Strategy</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "aurora",
        name: "Aurora",
        category: "creative",
        tags: ["Glowing", "Teal Aurora"],
        desc: "A futuristic glow style layout with smooth teal-aurora gradients.",
        preview: (
            <div className="h-100 d-flex flex-column bg-white" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f, #0d4f3c)", padding: "10px", position: "relative" }}>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "10px", color: "#fff" }}>John Doe</h6>
                    <p className="mb-0" style={{ fontSize: "7px", color: "#22d3ee" }}>Developer</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr" }} className="flex-grow-1">
                    <div style={{ padding: "6px", background: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>
                        <p style={{ fontSize: "7px", fontWeight: "700", color: "#0369a1", marginBottom: "4px" }}>Skills</p>
                        <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "1px 4px", borderRadius: "10px", fontSize: "6px" }}>React</span>
                    </div>
                    <div style={{ padding: "6px" }}>
                        <p style={{ fontSize: "7px", color: "#334155", lineHeight: "1.2" }}>Teal aurora gradient glow header.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "timeline",
        name: "Timeline",
        category: "creative",
        tags: ["Teal Accent", "Visual Timeline"],
        desc: "Infuses a clean timeline path connecting roles on the left border.",
        preview: (
            <div className="h-100 d-flex bg-white" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ background: "#0f172a", padding: "10px 6px", width: "30%" }}>
                    <h6 className="fw-bold mb-1" style={{ fontSize: "7.5px", color: "#fff" }}>John</h6>
                    <span style={{ background: "#0d948822", color: "#5eead4", padding: "1px 3px", fontSize: "6px" }}>React</span>
                </div>
                <div className="p-2" style={{ width: "70%" }}>
                    <p className="fw-bold mb-1" style={{ fontSize: "7.5px", color: "#0d9488" }}>Timeline</p>
                    <div style={{ position: "relative", paddingLeft: "8px", borderLeft: "1px solid #0d9488" }}>
                        <div style={{ position: "relative", marginBottom: "4px" }}>
                            <p className="fw-bold mb-0" style={{ fontSize: "6.5px" }}>Senior Dev</p>
                            <p className="text-muted mb-0" style={{ fontSize: "5.5px" }}>TechCorp · 2022</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "compact_ats",
        name: "Precision ATS",
        category: "professional",
        tags: ["ATS Friendly", "Modern Corporate", "Precision Layout"],
        desc: "Engineered for 100% ATS readability with sophisticated corporate typography, crisp accenting, and optimal space economy.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px", fontFamily: "Arial, sans-serif" }}>
                <div>
                    <h6 className="fw-bold text-uppercase mb-1" style={{ fontSize: "10px", borderBottom: "1px solid #111" }}>John Doe</h6>
                    <p className="text-muted mb-2" style={{ fontSize: "7px" }}>john@email.com | 9999999999 | LinkedIn</p>
                    <p className="fw-bold text-uppercase mb-0 text-dark" style={{ fontSize: "8px" }}>Experience</p>
                    <p className="text-muted mb-0" style={{ fontSize: "7px", lineHeight: "1.1" }}>Software Engineer - TechCorp</p>
                </div>
                <div>
                    <p className="fw-bold text-uppercase mb-0 text-dark" style={{ fontSize: "8px" }}>Education</p>
                    <p className="text-muted mb-0" style={{ fontSize: "7px" }}>B.S. in CS - 2024</p>
                </div>
            </div>
        )
    },
    {
        id: "graduate",
        name: "Graduate",
        category: "minimalist",
        tags: ["Entry Level", "Internships", "Student"],
        desc: "Highlights education, coursework, and projects first. Structured for career starters.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div>
                    <h6 className="fw-bold mb-1" style={{ fontSize: "11px", color: "#1e3a8a" }}>John Doe</h6>
                    <p className="text-muted mb-2" style={{ fontSize: "7.5px" }}>john@email.com | portfolio.com</p>
                    <p className="fw-bold text-uppercase text-secondary mb-1" style={{ fontSize: "8px" }}>Education</p>
                    <p className="text-muted mb-2" style={{ fontSize: "7px" }}>M.S. Computer Science • GPA 3.9</p>
                    <p className="fw-bold text-uppercase text-secondary mb-1" style={{ fontSize: "8px" }}>Projects</p>
                    <p className="text-muted mb-0" style={{ fontSize: "7px" }}>AI Chatbot Application</p>
                </div>
            </div>
        )
    },
    {
        id: "swiss_grid",
        name: "Swiss Grid",
        category: "minimalist",
        tags: ["Swiss Grid", "High Alignment", "Bold Layout"],
        desc: "Asymmetrical modern grid inspired by Swiss print design. Uncompromisingly professional.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", fontFamily: "Helvetica, sans-serif" }}>
                <div className="d-flex justify-content-between border-bottom border-2 border-dark pb-2 mb-2">
                    <h6 className="fw-bold mb-0 text-uppercase" style={{ fontSize: "11px" }}>J. DOE</h6>
                    <span style={{ fontSize: "7px" }}>SWITZERLAND</span>
                </div>
                <div className="d-flex flex-grow-1" style={{ fontSize: "7px" }}>
                    <div style={{ width: "30%", fontWeight: "bold", textTransform: "uppercase" }}>Profile</div>
                    <div style={{ width: "70%", color: "#333" }} className="ps-2">Asymmetrical structured alignment.</div>
                </div>
            </div>
        )
    },
    {
        id: "product_manager",
        name: "Product Manager",
        category: "professional",
        tags: ["Impact-focused", "Metrics", "Business"],
        desc: "Bold headers and clear highlight zones optimized for key metrics and product launches.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "11px", color: "#0f172a" }}>John Doe</h6>
                    <p className="fw-bold mb-2" style={{ fontSize: "7px", color: "#4f46e5" }}>PRODUCT LEADER</p>
                    <p className="fw-bold text-uppercase mb-1 text-dark" style={{ fontSize: "8px" }}>Impact Summary</p>
                    <p className="text-muted mb-0" style={{ fontSize: "7px", lineHeight: "1.2" }}>Scaled user engagement by 40% QoQ.</p>
                </div>
            </div>
        )
    },
    {
        id: "data_analyst",
        name: "Data Analyst",
        category: "tech",
        tags: ["Data Science", "Toolbox", "Sidebar"],
        desc: "Tailored for analytical professionals. Showcases technical tools, Python/SQL projects, and databases.",
        preview: (
            <div className="bg-white text-dark d-flex h-100" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div className="bg-light p-2" style={{ width: "35%", borderRight: "1px solid #e2e8f0" }}>
                    <h6 className="fw-bold mb-1" style={{ fontSize: "8px", color: "#0891b2" }}>John Doe</h6>
                    <span className="bg-white border px-1 py-0.5 rounded text-dark d-block text-center mt-2" style={{ fontSize: "5.5px", fontWeight: "bold" }}>SQL / R</span>
                </div>
                <div className="p-2" style={{ width: "65%" }}>
                    <p className="fw-bold mb-1" style={{ fontSize: "8px" }}>Analytics Profile</p>
                    <p className="text-muted mb-0" style={{ fontSize: "7px", lineHeight: "1.2" }}>Built predictive models using python.</p>
                </div>
            </div>
        )
    },
    {
        id: "bento",
        name: "Bento Resume",
        category: "creative",
        tags: ["Bento Grid", "Dashboard", "Modern UI"],
        desc: "Inspired by modern dashboard Bento UI grids. Segmented card structure that stands out.",
        preview: (
            <div className="bg-light p-2 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div className="bg-white border rounded p-1 mb-1 d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: "8px" }}>John Doe</span>
                    <span style={{ fontSize: "6px" }}>Dev</span>
                </div>
                <div className="d-flex gap-1 mb-1">
                    <div className="bg-white border rounded p-1 flex-grow-1" style={{ fontSize: "6px" }}>Connect</div>
                    <div className="bg-white border rounded p-1 flex-grow-1" style={{ fontSize: "6px" }}>Skills</div>
                </div>
                <div className="bg-white border rounded p-1 flex-grow-1" style={{ fontSize: "6px" }}>About Me profile snippet</div>
            </div>
        )
    },
    {
        id: "ivy_league",
        name: "Ivy League CV",
        category: "minimalist",
        tags: ["Academic", "Research CV", "Serif"],
        desc: "Formal, double-ruled classic layout featuring serif typography suited for fellowships and research.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 text-center d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px", fontFamily: "Georgia, serif" }}>
                <div>
                    <h6 className="fw-normal mb-1" style={{ fontSize: "12px" }}>John Doe</h6>
                    <hr className="my-1" />
                    <p className="text-uppercase text-secondary mb-1" style={{ fontSize: "6px", letterSpacing: "1px" }}>Research Appointments</p>
                    <p className="text-muted mb-0" style={{ fontSize: "7px", fontStyle: "italic" }}>Graduate Research Fellow</p>
                </div>
            </div>
        )
    },
    {
        id: "blueprint",
        name: "Blueprint",
        category: "tech",
        tags: ["Engineering", "Monospace", "Schematic"],
        desc: "IDE-inspired layout with clean drafting gridlines. Tailored for software and hardware engineers.",
        preview: (
            <div className="p-3 h-100 d-flex flex-column justify-content-between text-dark" style={{ 
                fontSize: "10px", 
                borderRadius: "6px", 
                fontFamily: "monospace",
                background: "#fafbfd",
                backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
                backgroundSize: "8px 8px"
            }}>
                <div className="border border-primary p-2">
                    <h6 className="fw-bold mb-0 text-primary" style={{ fontSize: "8px" }}>SYS.INFO // JOHN</h6>
                    <span className="text-muted" style={{ fontSize: "6px" }}>ROLE: DEVOPS</span>
                </div>
                <div className="text-muted" style={{ fontSize: "6.5px" }}>// Implementation history</div>
            </div>
        )
    },
    {
        id: "consultant",
        name: "Consultant",
        category: "professional",
        tags: ["Corporate", "Case Studies", "Navy"],
        desc: "Refined corporate layout with dark navy accents, structured competencies, and strategic milestones.",
        preview: (
            <div className="bg-white text-dark h-100 d-flex flex-column" style={{ fontSize: "10px", borderRadius: "6px", overflow: "hidden" }}>
                <div className="p-2 border-bottom border-2 border-primary" style={{ borderColor: "#1e3a8a" }}>
                    <h6 className="fw-bold mb-0 text-uppercase" style={{ fontSize: "10px", color: "#1e3a8a" }}>John Doe</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "6px" }}>STRATEGY CONSULTING</p>
                </div>
                <div className="p-2 flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                        <p className="fw-bold text-uppercase mb-1" style={{ fontSize: "7px", color: "#1e3a8a" }}>milestones</p>
                        <p className="text-muted mb-0" style={{ fontSize: "7px" }}>Delivered $5M cost efficiency.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: "portfolio_resume",
        name: "Portfolio Resume",
        category: "creative",
        tags: ["Portfolio First", "GitHub Stats", "Creative Grid"],
        desc: "Prominent link bars and card project spaces designed for full stack developers and web designers.",
        preview: (
            <div className="bg-white text-dark p-3 h-100 d-flex flex-column justify-content-between" style={{ fontSize: "10px", borderRadius: "6px" }}>
                <div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: "10px" }}>John Doe</h6>
                    <span className="badge text-white px-2 py-0.5 mt-1" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", fontSize: "6px" }}>Developer</span>
                    <div className="bg-dark text-white rounded p-1 mt-2 text-center" style={{ fontSize: "5.5px" }}>
                        Portfolio | GitHub
                    </div>
                </div>
            </div>
        )
    }
];
