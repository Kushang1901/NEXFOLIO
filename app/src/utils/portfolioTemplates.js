/**
 * CVGrid Portfolio Templates & Engine
 * Supports 5 stunning, recruiter-optimized portfolio layouts with instant compilation:
 * 1. dark_glass: Modern Glassmorphic Dark
 * 2. bento_grid: Dribbble/Apple style Bento Grid
 * 3. dev_terminal: Cyberpunk Developer Terminal CLI
 * 4. minimalist: Sleek High-Contrast Minimalist
 * 5. classic: Elegant Editorial Serif
 */

export const SAMPLE_RESUME_DATA = {
    name: "Alex Rivera",
    title: "Senior Full-Stack & AI Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    summary: "Passionate Full-Stack Engineer with 6+ years of experience designing scalable distributed web platforms, cloud architectures, and LLM-powered applications. Enthusiastic about crisp UI/UX, low-latency microservices, and modern open-source tooling.",
    skills: {
        "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "WebGL"],
        "Backend & Cloud": ["Node.js", "Python", "Go", "PostgreSQL", "Redis", "Docker", "AWS", "FastAPI"],
        "AI & Machine Learning": ["LangChain", "OpenAI API", "Hugging Face", "Vector DBs (Pinecone)", "RAG Pipelines"],
        "DevOps & Tools": ["Git", "CI/CD (GitHub Actions)", "Terraform", "Kubernetes", "GraphQL"]
    },
    experience: [
        {
            role: "Lead Full-Stack Engineer",
            company: "Nexus AI Platforms",
            location: "San Francisco, CA",
            startDate: "2023",
            endDate: "Present",
            description: "Architected enterprise AI automation workflows serving 120,000+ MAU. Spearheaded the migration of real-time streaming interfaces to Next.js 14 and WebSockets, cutting latency by 42%."
        },
        {
            role: "Senior Software Engineer",
            company: "Veloce Cloud Solutions",
            location: "New York, NY",
            startDate: "2021",
            endDate: "2023",
            description: "Designed resilient microservices in Go and Python processing 5M+ daily transactions. Led a squad of 6 engineers and engineered an automated testing harness improving coverage from 64% to 92%."
        },
        {
            role: "Frontend Developer",
            company: "PixelCraft Labs",
            location: "Austin, TX",
            startDate: "2019",
            endDate: "2021",
            description: "Built custom client-facing dashboards and design systems used across 14 enterprise SaaS products. Collaborated with UI designers to implement fluid accessible animations."
        }
    ],
    education: [
        {
            degree: "B.S. in Computer Science",
            institution: "University of California, Berkeley",
            year: "2015 - 2019",
            honors: "Magna Cum Laude, Dean's Honors List"
        }
    ],
    projects: [
        {
            name: "NeuralDoc AI",
            description: "Intelligent document synthesis and semantic query platform using hybrid RAG, LangChain, and vector embeddings.",
            tech: ["Next.js", "FastAPI", "Pinecone", "Tailwind CSS"],
            link: "https://github.com",
            demo: "https://demo.example.com"
        },
        {
            name: "OmniGrid Design System",
            description: "An open-source, accessible component library and token manager with 10k+ weekly npm downloads.",
            tech: ["TypeScript", "React", "Radix UI", "Storybook"],
            link: "https://github.com",
            demo: "https://demo.example.com"
        },
        {
            name: "PulseStream Cache",
            description: "Lightweight in-memory cache proxy written in Go with automatic TTL eviction and Prometheus telemetry.",
            tech: ["Go", "Docker", "Prometheus", "Redis"],
            link: "https://github.com",
            demo: "https://demo.example.com"
        }
    ],
    links: {
        github: "https://github.com/alexrivera-dev",
        linkedin: "https://linkedin.com/in/alexrivera-dev",
        portfolio: "https://alexrivera.dev",
        twitter: "https://twitter.com/alexrivera_dev"
    }
};

export const PORTFOLIO_TEMPLATES = [
    {
        id: "bento_grid",
        title: "Modern Bento Grid",
        badge: "Trending 🔥",
        desc: "Dribbble & Apple style modular Bento layout with translucent cards, stat badges, and interactive tech tags.",
        preview: "/portfolio_dark_glass.png",
        tags: ["Bento Layout", "Glass UI", "Stats Counter", "High Conversion"]
    },
    {
        id: "dev_terminal",
        title: "Developer Terminal CLI",
        badge: "Popular with Tech 💻",
        desc: "Retro-futuristic command line terminal aesthetic with interactive typing, bash prompts, and neon green/cyan highlights.",
        preview: "/portfolio_dark_glass.png",
        tags: ["Hacker Vibe", "Monospace", "Interactive Bash", "Tech Stack"]
    },
    {
        id: "dark_glass",
        title: "Glassmorphic Dark",
        badge: "Premium ✨",
        desc: "Vibrant ambient spotlights, frosted glass cards (backdrop-filter), smooth scrolling, and dynamic glow highlights.",
        preview: "/portfolio_dark_glass.png",
        tags: ["Ambient Glow", "Frosted Glass", "Smooth Animations", "Dark Theme"]
    },
    {
        id: "minimalist",
        title: "Sleek Minimalist",
        badge: "Clean & Modern ⚡",
        desc: "Generous whitespace, refined sans-serif/monospace typography, high-contrast clean borders, and pure content clarity.",
        preview: "/portfolio_minimalist.png",
        tags: ["High Contrast", "Editorial Spacing", "Fast Loading", "ATS Friendly"]
    },
    {
        id: "classic",
        title: "Executive Classic",
        badge: "Corporate & Elegant 🏛️",
        desc: "Polished traditional typography, refined serif headers, structured corporate timeline, and timeless elegance.",
        preview: "/portfolio_classic.png",
        tags: ["Serif Typography", "Executive Grid", "Timeless", "Clean Print"]
    }
];

export const ACCENT_COLORS = [
    { id: "indigo", name: "Royal Indigo", primary: "#6366f1", secondary: "#818cf8", glow: "rgba(99, 102, 241, 0.25)" },
    { id: "emerald", name: "Cyber Emerald", primary: "#10b981", secondary: "#34d399", glow: "rgba(16, 185, 129, 0.25)" },
    { id: "amber", name: "Warm Amber", primary: "#f59e0b", secondary: "#fbbf24", glow: "rgba(245, 158, 11, 0.25)" },
    { id: "cyan", name: "Electric Cyan", primary: "#06b6d4", secondary: "#22d3ee", glow: "rgba(6, 182, 212, 0.25)" },
    { id: "rose", name: "Vibrant Rose", primary: "#f43f5e", secondary: "#fb7185", glow: "rgba(244, 63, 94, 0.25)" }
];

/**
 * Normalizes resume data to ensure all sections and fields are cleanly mapped.
 */
export function normalizeResumeData(raw) {
    if (!raw) return SAMPLE_RESUME_DATA;

    const name = raw.personalInfo?.fullName || raw.name || raw.fullName || "Alex Rivera";
    const title = raw.personalInfo?.title || raw.title || raw.jobTitle || raw.role || "Software Engineer";
    const email = raw.personalInfo?.email || raw.email || "";
    const phone = raw.personalInfo?.phone || raw.phone || "";
    const location = raw.personalInfo?.location || raw.location || "";
    const summary = raw.personalInfo?.summary || raw.summary || raw.profile || "Passionate software engineer building high performance web applications.";

    // Parse links
    const links = {
        github: raw.personalInfo?.github || raw.links?.github || raw.github || "",
        linkedin: raw.personalInfo?.linkedin || raw.links?.linkedin || raw.linkedin || "",
        portfolio: raw.personalInfo?.portfolio || raw.links?.portfolio || raw.portfolio || "",
        twitter: raw.personalInfo?.twitter || raw.links?.twitter || raw.twitter || ""
    };

    // Normalize experience
    let experience = [];
    const expSource = raw.experience || raw.workExperience || [];
    if (Array.isArray(expSource)) {
        experience = expSource.map(item => ({
            role: item.role || item.position || item.title || "Software Developer",
            company: item.company || item.employer || "Tech Corp",
            location: item.location || "",
            startDate: item.startDate || item.start || "2022",
            endDate: item.endDate || item.end || "Present",
            description: item.description || item.summary || (Array.isArray(item.highlights) ? item.highlights.join(" ") : "")
        }));
    }

    // Normalize education
    let education = [];
    const eduSource = raw.education || [];
    if (Array.isArray(eduSource)) {
        education = eduSource.map(item => ({
            degree: item.degree || item.field || "B.S. in Computer Science",
            institution: item.institution || item.school || item.college || "University",
            year: item.year || item.gradYear || (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "2020"),
            honors: item.honors || (item.gpa ? `GPA: ${item.gpa}` : "")
        }));
    }

    // Normalize projects
    let projects = [];
    const projSource = raw.projects || [];
    if (Array.isArray(projSource)) {
        projects = projSource.map(item => ({
            name: item.name || item.title || "Project",
            description: item.description || item.summary || "Full-stack web application with responsive UI and modern cloud backend.",
            tech: Array.isArray(item.tech) ? item.tech : (typeof item.technologies === "string" ? item.technologies.split(",").map(s => s.trim()) : ["React", "Node.js"]),
            link: item.link || item.github || item.url || "#",
            demo: item.demo || item.live || item.link || "#"
        }));
    }

    // Normalize skills
    let skills = {};
    if (raw.skills) {
        if (typeof raw.skills === "object" && !Array.isArray(raw.skills)) {
            skills = raw.skills;
        } else if (Array.isArray(raw.skills)) {
            skills = { "Core Competencies": raw.skills.map(s => typeof s === "string" ? s : s.name || "") };
        }
    } else {
        skills = SAMPLE_RESUME_DATA.skills;
    }

    return {
        name,
        title,
        email,
        phone,
        location,
        summary,
        experience: experience.length > 0 ? experience : SAMPLE_RESUME_DATA.experience,
        education: education.length > 0 ? education : SAMPLE_RESUME_DATA.education,
        projects: projects.length > 0 ? projects : SAMPLE_RESUME_DATA.projects,
        skills: Object.keys(skills).length > 0 ? skills : SAMPLE_RESUME_DATA.skills,
        links
    };
}

/**
 * Compiles a portfolio based on template type and accent colors.
 * Returns { html, css, js }
 */
export function compilePortfolioTemplate(resumeData, templateType = "dark_glass", accentId = "indigo") {
    const data = normalizeResumeData(resumeData);
    const accent = ACCENT_COLORS.find(c => c.id === accentId) || ACCENT_COLORS[0];

    switch (templateType) {
        case "bento_grid":
            return compileBentoGrid(data, accent);
        case "dev_terminal":
            return compileDevTerminal(data, accent);
        case "minimalist":
            return compileMinimalist(data, accent);
        case "classic":
            return compileClassic(data, accent);
        case "dark_glass":
        default:
            return compileDarkGlass(data, accent);
    }
}

/**
 * Template 1: Bento Grid
 */
function compileBentoGrid(data, accent) {
    const skillsList = Object.entries(data.skills)
        .flatMap(([_, list]) => Array.isArray(list) ? list : [])
        .slice(0, 16);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} | ${data.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Ambient Glow Background -->
    <div class="spotlight-top"></div>
    <div class="spotlight-bottom"></div>

    <nav class="navbar">
        <a href="#hero" class="nav-brand">${data.name}</a>
        <div class="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#contact" class="nav-cta">Let's Talk</a>
        </div>
    </nav>

    <main class="container">
        <!-- Bento Grid Layout -->
        <div class="bento-grid">
            
            <!-- Hero Card (Span 2x2) -->
            <div class="bento-card hero-card" id="about">
                <div class="status-badge">
                    <span class="pulse-dot"></span> Available for new opportunities
                </div>
                <h1 class="hero-title">Hi, I'm <span class="highlight">${data.name}</span></h1>
                <p class="hero-role">${data.title}</p>
                <p class="hero-summary">${data.summary}</p>
                
                <div class="hero-actions">
                    <a href="#projects" class="btn btn-primary">View Projects</a>
                    <a href="#contact" class="btn btn-secondary">Contact Me</a>
                </div>
            </div>

            <!-- Stats & Quick Profile Card -->
            <div class="bento-card stat-card">
                <div class="stat-number">6+</div>
                <div class="stat-label">Years of Experience</div>
                <div class="divider"></div>
                <div class="stat-number">${data.projects.length}+</div>
                <div class="stat-label">Major Projects Shipped</div>
                <div class="location-badge">📍 ${data.location || "Remote / Global"}</div>
            </div>

            <!-- Social Links Card -->
            <div class="bento-card social-card">
                <h3 class="card-heading">Connect</h3>
                <div class="social-pills">
                    ${data.links.github ? `<a href="${data.links.github}" target="_blank" rel="noreferrer" class="social-pill">🐙 GitHub</a>` : ""}
                    ${data.links.linkedin ? `<a href="${data.links.linkedin}" target="_blank" rel="noreferrer" class="social-pill">💼 LinkedIn</a>` : ""}
                    ${data.links.twitter ? `<a href="${data.links.twitter}" target="_blank" rel="noreferrer" class="social-pill">🐦 Twitter</a>` : ""}
                    ${data.email ? `<a href="mailto:${data.email}" class="social-pill">✉️ Email</a>` : ""}
                </div>
            </div>

            <!-- Tech Stack Bento Card (Span 2) -->
            <div class="bento-card skills-card" id="skills">
                <h3 class="card-heading">Tech Stack & Tools</h3>
                <div class="skills-grid">
                    ${skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join("\n                    ")}
                </div>
            </div>

            <!-- Featured Projects (Span 3) -->
            <div class="bento-card projects-card" id="projects">
                <div class="section-header">
                    <h2 class="card-heading">Featured Projects</h2>
                    <span class="text-dim">Production-ready applications & architectures</span>
                </div>
                <div class="projects-grid">
                    ${data.projects.map(proj => `
                    <div class="project-item">
                        <div class="project-header">
                            <h3 class="project-name">${proj.name}</h3>
                            <div class="project-links">
                                ${proj.demo ? `<a href="${proj.demo}" target="_blank" rel="noreferrer" class="icon-link" title="Live Demo">↗</a>` : ""}
                                ${proj.link ? `<a href="${proj.link}" target="_blank" rel="noreferrer" class="icon-link" title="Code">⌘</a>` : ""}
                            </div>
                        </div>
                        <p class="project-desc">${proj.description}</p>
                        <div class="project-tech">
                            ${(Array.isArray(proj.tech) ? proj.tech : []).map(t => `<span class="tech-pill">${t}</span>`).join("")}
                        </div>
                    </div>`).join("")}
                </div>
            </div>

            <!-- Experience Timeline Bento Card (Span 3) -->
            <div class="bento-card experience-card" id="experience">
                <h2 class="card-heading">Work Experience</h2>
                <div class="timeline">
                    ${data.experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-meta">
                            <span class="timeline-role">${exp.role}</span>
                            <span class="timeline-company">@ ${exp.company}</span>
                            <span class="timeline-date">${exp.startDate} - ${exp.endDate}</span>
                        </div>
                        <p class="timeline-desc">${exp.description}</p>
                    </div>`).join("")}
                </div>
            </div>

            <!-- Education & Contact Card -->
            <div class="bento-card education-card">
                <h3 class="card-heading">Education</h3>
                ${data.education.map(edu => `
                <div class="edu-item">
                    <div class="edu-degree">${edu.degree}</div>
                    <div class="edu-school">${edu.institution}</div>
                    <div class="edu-year">${edu.year}</div>
                </div>`).join("")}
            </div>

            <div class="bento-card contact-card" id="contact">
                <h3 class="card-heading">Get in Touch</h3>
                <p class="text-dim">Interested in working together or hiring? Reach out directly.</p>
                <a href="mailto:${data.email || 'hello@example.com'}" class="btn btn-primary w-full text-center">Send Email</a>
            </div>

        </div>
    </main>

    <footer class="footer">
        <p>© <span id="year"></span> ${data.name}. Generated with CVGrid Portfolio Suite.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    const css = `:root {
    --primary: ${accent.primary};
    --primary-light: ${accent.secondary};
    --primary-glow: ${accent.glow};
    --bg-dark: #080914;
    --card-bg: rgba(22, 25, 44, 0.55);
    --card-border: rgba(255, 255, 255, 0.08);
    --card-hover: rgba(30, 35, 60, 0.7);
    --text: #f8fafc;
    --text-dim: #94a3b8;
    --radius: 20px;
    --font-main: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-main);
    background-color: var(--bg-dark);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
}

/* Spotlights */
.spotlight-top {
    position: fixed;
    top: -150px;
    left: 20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--primary-glow) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
    z-index: 0;
}
.spotlight-bottom {
    position: fixed;
    bottom: -150px;
    right: 15%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
    z-index: 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 20px 80px;
    position: relative;
    z-index: 10;
}

/* Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 20px auto 30px;
    padding: 16px 28px;
    background: rgba(15, 18, 35, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid var(--card-border);
    border-radius: 999px;
    position: sticky;
    top: 20px;
    z-index: 100;
}
.nav-brand {
    font-weight: 800;
    font-size: 1.1rem;
    color: #fff;
    text-decoration: none;
    letter-spacing: -0.02em;
}
.nav-links {
    display: flex;
    align-items: center;
    gap: 24px;
}
.nav-links a {
    color: var(--text-dim);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
}
.nav-links a:hover {
    color: #fff;
}
.nav-cta {
    background: var(--primary);
    color: #fff !important;
    padding: 8px 18px;
    border-radius: 999px;
    font-weight: 600 !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
}
.nav-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px var(--primary-glow);
}

/* Bento Grid */
.bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.bento-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    backdrop-filter: blur(14px);
    border-radius: var(--radius);
    padding: 30px;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
}
.bento-card:hover {
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

/* Hero Card (2 columns) */
.hero-card {
    grid-column: span 2;
    justify-content: center;
    background: linear-gradient(135deg, rgba(30, 35, 65, 0.5) 0%, rgba(15, 18, 35, 0.7) 100%);
}
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #34d399;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.25);
    padding: 5px 14px;
    border-radius: 999px;
    margin-bottom: 20px;
    align-self: flex-start;
}
.pulse-dot {
    width: 8px;
    height: 8px;
    background-color: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.hero-title {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin-bottom: 6px;
}
.highlight {
    background: linear-gradient(135deg, #fff 30%, var(--primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero-role {
    font-size: 1.25rem;
    color: var(--primary-light);
    font-weight: 600;
    margin-bottom: 16px;
}
.hero-summary {
    color: var(--text-dim);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 28px;
    max-width: 620px;
}
.hero-actions {
    display: flex;
    gap: 14px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 26px;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}
.btn-primary {
    background: var(--primary);
    color: #fff;
    box-shadow: 0 4px 14px var(--primary-glow);
}
.btn-primary:hover {
    background: var(--primary-light);
    transform: translateY(-2px);
}
.btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--card-border);
    color: #fff;
}
.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
}
.w-full {
    width: 100%;
}

/* Stat Card */
.stat-card {
    text-align: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(25, 30, 55, 0.5) 0%, rgba(12, 15, 30, 0.7) 100%);
}
.stat-number {
    font-size: 2.8rem;
    font-weight: 800;
    color: var(--primary-light);
    line-height: 1;
}
.stat-label {
    font-size: 0.85rem;
    color: var(--text-dim);
    margin-top: 4px;
    font-weight: 500;
}
.divider {
    height: 1px;
    background: var(--card-border);
    margin: 18px 0;
}
.location-badge {
    margin-top: 14px;
    font-size: 0.82rem;
    color: #cbd5e1;
}

/* Social Card */
.card-heading {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: #fff;
    letter-spacing: -0.01em;
}
.social-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.social-pill {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--card-border);
    padding: 8px 16px;
    border-radius: 10px;
    color: var(--text);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 500;
    transition: all 0.2s;
}
.social-pill:hover {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
    transform: translateY(-2px);
}

/* Skills Card (Span 2) */
.skills-card {
    grid-column: span 2;
}
.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.skill-tag {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--card-border);
    padding: 7px 14px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: #cbd5e1;
    transition: all 0.2s;
}
.skill-tag:hover {
    border-color: var(--primary-light);
    color: #fff;
    background: rgba(99, 102, 241, 0.15);
}

/* Projects Card (Span 3) */
.projects-card {
    grid-column: span 3;
}
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 24px;
}
.text-dim {
    color: var(--text-dim);
    font-size: 0.9rem;
}
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}
.project-item {
    background: rgba(15, 18, 35, 0.6);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: border-color 0.2s;
}
.project-item:hover {
    border-color: var(--primary-light);
}
.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.project-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #fff;
}
.project-links {
    display: flex;
    gap: 10px;
}
.icon-link {
    color: var(--text-dim);
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.2s;
}
.icon-link:hover {
    color: var(--primary-light);
}
.project-desc {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin-bottom: 16px;
    line-height: 1.5;
}
.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.tech-pill {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--primary-light);
    background: rgba(99, 102, 241, 0.1);
    padding: 4px 10px;
    border-radius: 6px;
}

/* Experience (Span 3) */
.experience-card {
    grid-column: span 3;
}
.timeline {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.timeline-item {
    border-left: 2px solid var(--primary);
    padding-left: 20px;
    position: relative;
}
.timeline-item::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 4px;
    width: 12px;
    height: 12px;
    background: var(--bg-dark);
    border: 2px solid var(--primary);
    border-radius: 50%;
}
.timeline-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
}
.timeline-role {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
}
.timeline-company {
    font-size: 0.95rem;
    color: var(--primary-light);
    font-weight: 600;
}
.timeline-date {
    font-size: 0.8rem;
    color: var(--text-dim);
    margin-left: auto;
    font-family: var(--font-mono);
}
.timeline-desc {
    font-size: 0.92rem;
    color: var(--text-dim);
    line-height: 1.6;
}

/* Education & Contact */
.education-card {
    grid-column: span 1;
}
.edu-item {
    margin-bottom: 16px;
}
.edu-degree {
    font-weight: 700;
    font-size: 0.95rem;
    color: #fff;
}
.edu-school {
    font-size: 0.85rem;
    color: var(--text-dim);
}
.edu-year {
    font-size: 0.78rem;
    color: var(--primary-light);
    font-family: var(--font-mono);
}

.contact-card {
    grid-column: span 2;
    justify-content: center;
    gap: 12px;
}

/* Footer */
.footer {
    text-align: center;
    padding: 30px 20px;
    border-top: 1px solid var(--card-border);
    color: var(--text-dim);
    font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 900px) {
    .bento-grid {
        grid-template-columns: 1fr;
    }
    .hero-card, .skills-card, .projects-card, .experience-card, .education-card, .contact-card {
        grid-column: span 1;
    }
    .hero-title {
        font-size: 2rem;
    }
    .nav-links {
        display: none;
    }
}`;

    const js = `// Dynamic Current Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
`;

    return { html, css, js };
}

/**
 * Template 2: Developer Terminal CLI
 */
function compileDevTerminal(data, accent) {
    const skillsList = Object.entries(data.skills)
        .flatMap(([cat, list]) => Array.isArray(list) ? list.map(s => `${cat}/${s}`) : [])
        .slice(0, 16);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} — Terminal Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="terminal-window">
        <!-- Terminal Header Bar -->
        <div class="terminal-bar">
            <div class="terminal-buttons">
                <span class="btn-circle btn-close"></span>
                <span class="btn-circle btn-min"></span>
                <span class="btn-circle btn-max"></span>
            </div>
            <div class="terminal-title">guest@${data.name.toLowerCase().replace(/\\s+/g, '')}-workstation:~</div>
            <div class="terminal-status">ONLINE ⚡</div>
        </div>

        <!-- Terminal Body -->
        <div class="terminal-content">
            
            <!-- Command: whoami -->
            <div class="cli-section">
                <div class="cli-prompt">
                    <span class="prompt-user">guest@cvgrid</span>:<span class="prompt-path">~</span>$ <span class="prompt-cmd">whoami --verbose</span>
                </div>
                <div class="cli-output hero-box">
                    <pre class="ascii-art">
   _____ _    _ _____   _____ _____ _____  
  / ____| |  | |  __ \\ / ____|  __ \\_   _| 
 | |    | |  | | |__) | |  __| |__) || |   
 | |    | |  | |  _  /| | |_ |  _  / | |   
 | |____| |__| | | \\ \\| |__| | | \\ \\_| |_  
  \\_____|\\____/|_|  \\_\\\\_____|_|  \\_\\_____|
                    </pre>
                    <h1 class="dev-name">${data.name}</h1>
                    <div class="dev-role">&gt; ${data.title}</div>
                    <p class="dev-bio">${data.summary}</p>
                    <div class="dev-meta">
                        <span>📍 Location: ${data.location || "Remote"}</span>
                        <span>✉️ Email: ${data.email}</span>
                        ${data.links.github ? `<span>🐙 GitHub: <a href="${data.links.github}" target="_blank">${data.links.github}</a></span>` : ""}
                    </div>
                </div>
            </div>

            <!-- Command: cat skills.json -->
            <div class="cli-section">
                <div class="cli-prompt">
                    <span class="prompt-user">guest@cvgrid</span>:<span class="prompt-path">~</span>$ <span class="prompt-cmd">cat skills.json</span>
                </div>
                <div class="cli-output">
                    <div class="skills-terminal-grid">
                        ${skillsList.map(s => `<div class="skill-terminal-tag">[ok] ${s}</div>`).join("")}
                    </div>
                </div>
            </div>

            <!-- Command: ls -la ./projects -->
            <div class="cli-section">
                <div class="cli-prompt">
                    <span class="prompt-user">guest@cvgrid</span>:<span class="prompt-path">~</span>$ <span class="prompt-cmd">ls -la ./projects/</span>
                </div>
                <div class="cli-output">
                    <div class="projects-list">
                        ${data.projects.map(p => `
                        <div class="project-row">
                            <div class="project-main">
                                <span class="badge-repo">repo</span>
                                <span class="project-name-cli">${p.name}</span>
                                <span class="project-links-cli">
                                    ${p.demo ? `<a href="${p.demo}" target="_blank">[live demo]</a>` : ""}
                                    ${p.link ? `<a href="${p.link}" target="_blank">[source code]</a>` : ""}
                                </span>
                            </div>
                            <div class="project-desc-cli">${p.description}</div>
                            <div class="project-stack-cli">
                                Stack: ${(Array.isArray(p.tech) ? p.tech : []).join(" | ")}
                            </div>
                        </div>`).join("")}
                    </div>
                </div>
            </div>

            <!-- Command: git log --experience -->
            <div class="cli-section">
                <div class="cli-prompt">
                    <span class="prompt-user">guest@cvgrid</span>:<span class="prompt-path">~</span>$ <span class="prompt-cmd">git log --oneline --experience</span>
                </div>
                <div class="cli-output">
                    <div class="exp-log">
                        ${data.experience.map(exp => `
                        <div class="exp-row">
                            <div class="commit-hash">commit #${Math.random().toString(36).substring(2, 8)}</div>
                            <div class="exp-title-cli"><strong>${exp.role}</strong> @ <span class="cyan">${exp.company}</span> (${exp.startDate} - ${exp.endDate})</div>
                            <div class="exp-desc-cli">${exp.description}</div>
                        </div>`).join("")}
                    </div>
                </div>
            </div>

            <!-- Interactive Contact Prompt -->
            <div class="cli-section">
                <div class="cli-prompt">
                    <span class="prompt-user">guest@cvgrid</span>:<span class="prompt-path">~</span>$ <span class="prompt-cmd">./contact.sh</span>
                </div>
                <div class="cli-output contact-box">
                    <p>Ready to deploy high-impact software? Reach out:</p>
                    <a href="mailto:${data.email}" class="terminal-btn">&gt; Send Transmission (Email)</a>
                </div>
            </div>

            <!-- Blinking Cursor Terminal End -->
            <div class="cli-prompt active-cursor">
                <span class="prompt-user">guest@cvgrid</span>:<span class="prompt-path">~</span>$ <span class="blinking-cursor">█</span>
            </div>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`;

    const css = `:root {
    --bg-term: #0a0e14;
    --term-bar: #131a24;
    --green: #22c55e;
    --cyan: ${accent.primary};
    --yellow: #eab308;
    --text-term: #cbd5e1;
    --text-dim: #64748b;
    --font: 'Fira Code', monospace;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #030712;
    font-family: var(--font);
    color: var(--text-term);
    padding: 30px 16px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
}

.terminal-window {
    width: 100%;
    max-width: 960px;
    background-color: var(--bg-term);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(34, 197, 94, 0.05);
    overflow: hidden;
}

.terminal-bar {
    background-color: var(--term-bar);
    padding: 12px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-buttons {
    display: flex;
    gap: 8px;
}
.btn-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}
.btn-close { background-color: #ef4444; }
.btn-min { background-color: #f59e0b; }
.btn-max { background-color: #10b981; }

.terminal-title {
    font-size: 0.82rem;
    color: var(--text-dim);
}
.terminal-status {
    font-size: 0.75rem;
    color: var(--green);
    font-weight: 600;
}

.terminal-content {
    padding: 24px;
    line-height: 1.6;
    font-size: 0.9rem;
}

.cli-section {
    margin-bottom: 26px;
}
.cli-prompt {
    font-weight: 600;
    margin-bottom: 8px;
}
.prompt-user { color: var(--green); }
.prompt-path { color: var(--cyan); }
.prompt-cmd { color: #fff; }

.cli-output {
    padding-left: 12px;
    border-left: 1px dashed rgba(255, 255, 255, 0.1);
    margin-left: 6px;
}

.ascii-art {
    color: var(--cyan);
    font-size: 0.65rem;
    line-height: 1.1;
    overflow-x: auto;
    margin-bottom: 12px;
}

.dev-name {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 4px;
}
.dev-role {
    color: var(--cyan);
    font-weight: 600;
    margin-bottom: 12px;
}
.dev-bio {
    color: var(--text-term);
    margin-bottom: 16px;
    max-width: 720px;
}
.dev-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 0.82rem;
    color: var(--text-dim);
}
.dev-meta a {
    color: var(--cyan);
    text-decoration: none;
}
.dev-meta a:hover {
    text-decoration: underline;
}

/* Skills */
.skills-terminal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 8px;
}
.skill-terminal-tag {
    color: var(--green);
    font-size: 0.82rem;
}

/* Projects */
.project-row {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 14px;
    border-radius: 6px;
    margin-bottom: 10px;
}
.project-main {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 6px;
}
.badge-repo {
    background: rgba(34, 197, 94, 0.15);
    color: var(--green);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.72rem;
    text-transform: uppercase;
}
.project-name-cli {
    font-weight: 700;
    color: #fff;
}
.project-links-cli a {
    color: var(--cyan);
    text-decoration: none;
    font-size: 0.8rem;
    margin-right: 8px;
}
.project-desc-cli {
    color: var(--text-term);
    font-size: 0.85rem;
    margin-bottom: 6px;
}
.project-stack-cli {
    color: var(--text-dim);
    font-size: 0.78rem;
}

/* Experience */
.exp-row {
    margin-bottom: 14px;
}
.commit-hash {
    color: var(--yellow);
    font-size: 0.75rem;
}
.exp-title-cli {
    color: #fff;
    font-size: 0.95rem;
}
.cyan { color: var(--cyan); }
.exp-desc-cli {
    color: var(--text-dim);
    font-size: 0.85rem;
    margin-top: 4px;
}

/* Contact */
.contact-box {
    padding: 16px;
    background: rgba(6, 182, 212, 0.04);
    border-radius: 8px;
    border: 1px solid rgba(6, 182, 212, 0.15);
}
.terminal-btn {
    display: inline-block;
    background: var(--cyan);
    color: #000;
    padding: 8px 18px;
    border-radius: 4px;
    font-weight: 700;
    text-decoration: none;
    margin-top: 10px;
    transition: opacity 0.2s;
}
.terminal-btn:hover {
    opacity: 0.9;
}

.blinking-cursor {
    animation: blink 1s step-start infinite;
    color: var(--green);
}
@keyframes blink {
    50% { opacity: 0; }
}`;

    const js = `console.log("Welcome to ${data.name}'s CLI terminal.");`;

    return { html, css, js };
}

/**
 * Template 3: Glassmorphic Dark
 */
function compileDarkGlass(data, accent) {
    const skillsList = Object.entries(data.skills)
        .flatMap(([_, list]) => Array.isArray(list) ? list : [])
        .slice(0, 15);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} — Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="ambient-sphere-1"></div>
    <div class="ambient-sphere-2"></div>

    <header class="glass-nav">
        <div class="nav-container">
            <span class="logo">${data.name}</span>
            <nav class="links">
                <a href="#about">About</a>
                <a href="#projects">Work</a>
                <a href="#experience">Career</a>
                <a href="#skills">Skills</a>
                <a href="#contact" class="btn-glow">Contact</a>
            </nav>
        </div>
    </header>

    <main class="page-wrap">
        <!-- Hero Section -->
        <section class="hero-section" id="about">
            <div class="hero-badge">✨ Open to Engineering Roles</div>
            <h1 class="hero-heading">Crafting Exceptional <span class="glow-text">Digital Experiences</span></h1>
            <h2 class="hero-sub">${data.title}</h2>
            <p class="hero-bio">${data.summary}</p>
            
            <div class="cta-group">
                <a href="#projects" class="btn-primary">Explore Work</a>
                ${data.links.github ? `<a href="${data.links.github}" target="_blank" class="btn-glass">GitHub Profile</a>` : ""}
            </div>
        </section>

        <!-- Projects Showcase -->
        <section class="section" id="projects">
            <h2 class="section-title">Selected Projects</h2>
            <div class="grid-projects">
                ${data.projects.map(p => `
                <div class="glass-card project-card">
                    <div class="card-inner">
                        <div class="proj-top">
                            <h3 class="proj-title">${p.name}</h3>
                            <div class="proj-actions">
                                ${p.demo ? `<a href="${p.demo}" target="_blank" class="link-circle" title="Live Site">↗</a>` : ""}
                            </div>
                        </div>
                        <p class="proj-desc">${p.description}</p>
                        <div class="tech-tags">
                            ${(Array.isArray(p.tech) ? p.tech : []).map(t => `<span class="tag">${t}</span>`).join("")}
                        </div>
                    </div>
                </div>`).join("")}
            </div>
        </section>

        <!-- Experience -->
        <section class="section" id="experience">
            <h2 class="section-title">Career Timeline</h2>
            <div class="timeline-wrap">
                ${data.experience.map(exp => `
                <div class="glass-card exp-card">
                    <div class="exp-header">
                        <span class="exp-role">${exp.role}</span>
                        <span class="exp-company">${exp.company}</span>
                        <span class="exp-time">${exp.startDate} - ${exp.endDate}</span>
                    </div>
                    <p class="exp-body">${exp.description}</p>
                </div>`).join("")}
            </div>
        </section>

        <!-- Skills -->
        <section class="section" id="skills">
            <h2 class="section-title">Skills & Technologies</h2>
            <div class="glass-card skills-card">
                <div class="skills-cloud">
                    ${skillsList.map(s => `<span class="skill-bubble">${s}</span>`).join("")}
                </div>
            </div>
        </section>

        <!-- Contact CTA -->
        <section class="section contact-section" id="contact">
            <div class="glass-card contact-card">
                <h2>Let's build something extraordinary.</h2>
                <p>Have a project in mind, or an open position? Get in touch today.</p>
                <a href="mailto:${data.email}" class="btn-glow-large">Say Hello ✉️</a>
            </div>
        </section>
    </main>

    <footer class="glass-footer">
        <p>© ${new Date().getFullYear()} ${data.name}. Created with CVGrid.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    const css = `:root {
    --accent: ${accent.primary};
    --accent-light: ${accent.secondary};
    --glow: ${accent.glow};
    --bg: #070913;
    --card-bg: rgba(255, 255, 255, 0.03);
    --card-border: rgba(255, 255, 255, 0.08);
    --text: #f1f5f9;
    --text-muted: #94a3b8;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
}

/* Ambient glow */
.ambient-sphere-1 {
    position: fixed;
    top: -200px;
    left: 20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--glow) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}
.ambient-sphere-2 {
    position: fixed;
    bottom: -200px;
    right: 15%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
}

.glass-nav {
    position: sticky;
    top: 20px;
    z-index: 100;
    max-width: 1050px;
    margin: 20px auto;
    padding: 0 16px;
}
.nav-container {
    background: rgba(15, 20, 35, 0.7);
    backdrop-filter: blur(16px);
    border: 1px solid var(--card-border);
    border-radius: 999px;
    padding: 14px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo {
    font-weight: 800;
    font-size: 1.1rem;
    color: #fff;
}
.links {
    display: flex;
    align-items: center;
    gap: 20px;
}
.links a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
}
.links a:hover {
    color: #fff;
}
.btn-glow {
    background: var(--accent);
    color: #fff !important;
    padding: 7px 18px;
    border-radius: 999px;
    font-weight: 600 !important;
}

.page-wrap {
    max-width: 1050px;
    margin: 0 auto;
    padding: 40px 20px 80px;
    position: relative;
    z-index: 10;
}

.hero-section {
    text-align: center;
    padding: 60px 0 80px;
}
.hero-badge {
    display: inline-block;
    padding: 6px 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--card-border);
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--accent-light);
    margin-bottom: 24px;
}
.hero-heading {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
}
.glow-text {
    background: linear-gradient(135deg, #fff 0%, var(--accent-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero-sub {
    font-size: 1.3rem;
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 20px;
}
.hero-bio {
    max-width: 680px;
    margin: 0 auto 36px;
    color: var(--text-muted);
    font-size: 1.05rem;
}
.cta-group {
    display: flex;
    justify-content: center;
    gap: 14px;
}
.btn-primary {
    background: var(--accent);
    color: #fff;
    padding: 12px 28px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
}
.btn-glass {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--card-border);
    color: #fff;
    padding: 12px 28px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
}

.section {
    margin-bottom: 70px;
}
.section-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 24px;
}

.glass-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 24px;
    transition: transform 0.2s, border-color 0.2s;
}
.glass-card:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.grid-projects {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
.proj-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}
.proj-title {
    font-size: 1.2rem;
    font-weight: 700;
}
.link-circle {
    color: var(--accent-light);
    text-decoration: none;
    font-size: 1.2rem;
}
.proj-desc {
    color: var(--text-muted);
    font-size: 0.92rem;
    margin-bottom: 16px;
}
.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.tag {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--card-border);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    color: var(--accent-light);
}

.timeline-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.exp-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
}
.exp-role {
    font-weight: 700;
    font-size: 1.05rem;
}
.exp-company {
    color: var(--accent-light);
    font-weight: 600;
}
.exp-time {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-left: auto;
}
.exp-body {
    color: var(--text-muted);
    font-size: 0.92rem;
}

.skills-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.skill-bubble {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--card-border);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
}

.contact-card {
    text-align: center;
    padding: 50px 20px;
}
.contact-card h2 {
    font-size: 2rem;
    margin-bottom: 10px;
}
.contact-card p {
    color: var(--text-muted);
    margin-bottom: 24px;
}
.btn-glow-large {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    padding: 14px 36px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
}

.glass-footer {
    text-align: center;
    padding: 30px;
    color: var(--text-muted);
    font-size: 0.85rem;
    border-top: 1px solid var(--card-border);
}

@media (max-width: 768px) {
    .links { display: none; }
}`;

    const js = `// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});`;

    return { html, css, js };
}

/**
 * Template 4: Minimalist Clean
 */
function compileMinimalist(data, accent) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} — Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="content">
        <header class="header">
            <h1 class="name">${data.name}</h1>
            <p class="role">${data.title} — ${data.location || "Remote"}</p>
            <div class="contact-links">
                <a href="mailto:${data.email}">${data.email}</a>
                ${data.links.github ? `<span>/</span><a href="${data.links.github}" target="_blank">GitHub</a>` : ""}
                ${data.links.linkedin ? `<span>/</span><a href="${data.links.linkedin}" target="_blank">LinkedIn</a>` : ""}
            </div>
        </header>

        <section class="block">
            <h2 class="label">ABOUT</h2>
            <p class="desc">${data.summary}</p>
        </section>

        <section class="block">
            <h2 class="label">EXPERIENCE</h2>
            <div class="list">
                ${data.experience.map(exp => `
                <div class="item">
                    <div class="item-header">
                        <span class="item-title">${exp.role} — ${exp.company}</span>
                        <span class="item-date">${exp.startDate} – ${exp.endDate}</span>
                    </div>
                    <p class="item-desc">${exp.description}</p>
                </div>`).join("")}
            </div>
        </section>

        <section class="block">
            <h2 class="label">SELECTED WORK</h2>
            <div class="list">
                ${data.projects.map(p => `
                <div class="item">
                    <div class="item-header">
                        <span class="item-title">${p.name}</span>
                        <span class="item-links">
                            ${p.demo ? `<a href="${p.demo}" target="_blank">Live ↗</a>` : ""}
                        </span>
                    </div>
                    <p class="item-desc">${p.description}</p>
                    <p class="item-tech">${(Array.isArray(p.tech) ? p.tech : []).join(", ")}</p>
                </div>`).join("")}
            </div>
        </section>

        <section class="block">
            <h2 class="label">SKILLS</h2>
            <div class="skills-wrap">
                ${Object.entries(data.skills).map(([cat, list]) => `
                <div class="skill-group">
                    <span class="skill-cat">${cat}:</span>
                    <span class="skill-vals">${Array.isArray(list) ? list.join(", ") : ""}</span>
                </div>`).join("")}
            </div>
        </section>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

    const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #f8fafc;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.6;
    padding: 60px 20px;
}

.content {
    max-width: 680px;
    margin: 0 auto;
}

.header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 30px;
    margin-bottom: 40px;
}
.name {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0f172a;
}
.role {
    font-size: 1rem;
    color: #64748b;
    margin: 6px 0 16px;
}
.contact-links {
    display: flex;
    gap: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
}
.contact-links a {
    color: #0f172a;
    text-decoration: underline;
}

.block {
    margin-bottom: 40px;
}
.label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: #94a3b8;
    letter-spacing: 0.08em;
    margin-bottom: 14px;
}
.desc {
    font-size: 0.98rem;
    color: #334155;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.item-header {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 0.98rem;
}
.item-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    color: #64748b;
}
.item-desc {
    color: #475569;
    font-size: 0.92rem;
    margin-top: 4px;
}
.item-tech {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 6px;
}

.skills-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 0.92rem;
}
.skill-cat {
    font-weight: 600;
    color: #0f172a;
    margin-right: 6px;
}
.skill-vals {
    color: #475569;
}`;

    const js = `console.log("Portfolio loaded.");`;

    return { html, css, js };
}

/**
 * Template 5: Executive Classic
 */
function compileClassic(data, accent) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} | Executive Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="wrapper">
        <header class="header">
            <h1 class="title">${data.name}</h1>
            <p class="subtitle">${data.title}</p>
            <div class="meta-bar">
                <span>${data.location}</span>
                <span>•</span>
                <a href="mailto:${data.email}">${data.email}</a>
                ${data.links.linkedin ? `<span>•</span><a href="${data.links.linkedin}" target="_blank">LinkedIn Profile</a>` : ""}
            </div>
        </header>

        <section class="section">
            <h2 class="sec-heading">Executive Profile</h2>
            <p class="body-text">${data.summary}</p>
        </section>

        <section class="section">
            <h2 class="sec-heading">Professional Experience</h2>
            ${data.experience.map(exp => `
            <div class="entry">
                <div class="entry-row">
                    <h3 class="entry-title">${exp.role}</h3>
                    <span class="entry-date">${exp.startDate} – ${exp.endDate}</span>
                </div>
                <div class="entry-sub">${exp.company} — ${exp.location || "Executive Team"}</div>
                <p class="body-text">${exp.description}</p>
            </div>`).join("")}
        </section>

        <section class="section">
            <h2 class="sec-heading">Key Initiatives & Projects</h2>
            <div class="projects-grid">
                ${data.projects.map(p => `
                <div class="proj-box">
                    <h3 class="proj-title">${p.name}</h3>
                    <p class="body-text">${p.description}</p>
                    <div class="proj-meta">${(Array.isArray(p.tech) ? p.tech : []).join(" • ")}</div>
                </div>`).join("")}
            </div>
        </section>

        <section class="section">
            <h2 class="sec-heading">Education</h2>
            ${data.education.map(e => `
            <div class="entry">
                <div class="entry-row">
                    <h3 class="entry-title">${e.institution}</h3>
                    <span class="entry-date">${e.year}</span>
                </div>
                <div class="entry-sub">${e.degree} ${e.honors ? `(${e.honors})` : ""}</div>
            </div>`).join("")}
        </section>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

    const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #fdfbf7;
    color: #2b2b2b;
    font-family: 'Inter', sans-serif;
    line-height: 1.7;
    padding: 60px 20px;
}

.wrapper {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    padding: 50px 60px;
    border: 1px solid #e7e5e0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

.header {
    text-align: center;
    border-bottom: 2px solid #2b2b2b;
    padding-bottom: 30px;
    margin-bottom: 40px;
}
.title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.01em;
}
.subtitle {
    font-size: 1.15rem;
    color: #666;
    margin: 8px 0 16px;
    font-style: italic;
    font-family: 'Playfair Display', serif;
}
.meta-bar {
    display: flex;
    justify-content: center;
    gap: 12px;
    font-size: 0.88rem;
    color: #777;
}
.meta-bar a {
    color: #2b2b2b;
    text-decoration: none;
}
.meta-bar a:hover {
    text-decoration: underline;
}

.section {
    margin-bottom: 40px;
}
.sec-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    font-weight: 700;
    border-bottom: 1px solid #e7e5e0;
    padding-bottom: 8px;
    margin-bottom: 20px;
    color: #1a1a1a;
}
.body-text {
    color: #444;
    font-size: 0.95rem;
}

.entry {
    margin-bottom: 24px;
}
.entry-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
.entry-title {
    font-size: 1.05rem;
    font-weight: 600;
}
.entry-date {
    font-size: 0.85rem;
    color: #777;
}
.entry-sub {
    color: #555;
    font-style: italic;
    font-size: 0.92rem;
    margin-bottom: 6px;
}

.projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}
.proj-box {
    border: 1px solid #e7e5e0;
    padding: 18px;
    background: #faf9f6;
}
.proj-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 6px;
}
.proj-meta {
    font-size: 0.8rem;
    color: #777;
    margin-top: 8px;
}

@media (max-width: 650px) {
    .wrapper { padding: 30px 20px; }
    .projects-grid { grid-template-columns: 1fr; }
}`;

    const js = `console.log("Classic executive portfolio ready.");`;

    return { html, css, js };
}

/**
 * Generates an informative, polished README.md for the downloaded ZIP
 * detailing 1-click free hosting on Vercel, Netlify, and GitHub Pages.
 */
export function generateDeploymentReadme(data) {
    return `# 🌐 ${data.name}'s Developer Portfolio Website
> Exported from [CVGrid.in](https://cvgrid.in) — The AI Resume & Portfolio Builder.

Thank you for generating your recruiter-ready portfolio website using **CVGrid**!
This package includes everything you need to showcase your work online.

---

## 📁 Package Contents
- \`index.html\`: The main semantic HTML structure with responsive metadata and SEO tags.
- \`style.css\`: Complete modern stylesheet with CSS variables, animations, and mobile media queries.
- \`script.js\`: Smooth scrolling, mobile navigation, and interactive handlers.
- \`vercel.json\`: Ready-to-deploy configuration for zero-config Vercel hosting.
- \`README.md\`: This guide.

---

## 🚀 How to Host Your Portfolio for Free in 2 Minutes

### Option 1: Vercel (Recommended — 60 Seconds)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Drag and drop this unzipped folder into the Vercel dashboard.
3. Your portfolio is instantly live on a fast global CDN with a free \`*.vercel.app\` domain and HTTPS!

### Option 2: Netlify (Drag & Drop)
1. Go to [netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this folder onto the page.
3. Your portfolio will deploy immediately!

### Option 3: GitHub Pages (Free \`username.github.io\`)
1. Create a new GitHub repository named \`username.github.io\` (replace \`username\` with your GitHub handle).
2. Upload the files from this folder into the repository.
3. Go to **Settings > Pages > Branch**, select **main**, and click **Save**.
4. Within 1 minute, your portfolio is live at \`https://username.github.io\`!

---

## 🎨 Quick Customizations
- **Change Colors**: Open \`style.css\` and modify the CSS variables under \`:root\`.
- **Edit Text**: Open \`index.html\` in VS Code or any text editor and edit any sections.
- **Add Images**: Place images into an \`assets/\` folder and update image \`src\` tags.

Built with ❤️ by [CVGrid](https://cvgrid.in) — Elevating your career journey.
`;
}

/**
 * Returns a vercel.json deployment configuration.
 */
export function generateVercelConfig() {
    return JSON.stringify({
        "cleanUrls": true,
        "trailingSlash": false
    }, null, 2);
}

/**
 * Creates a standalone single-file HTML document by inlining CSS & JS.
 */
export function generateStandaloneHtml(htmlCode, cssCode, jsCode) {
    let combined = htmlCode;
    // Replace link to style.css with inlined style block
    combined = combined.replace(/<link[^>]*href=["']style\.css["'][^>]*>/i, `<style>\n${cssCode}\n</style>`);
    if (!combined.includes("<style>")) {
        combined = combined.replace("</head>", `<style>\n${cssCode}\n</style></head>`);
    }
    // Replace script.js tag with inlined script block
    combined = combined.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/i, `<script>\n${jsCode}\n</script>`);
    if (!combined.includes("<script>")) {
        combined = combined.replace("</body>", `<script>\n${jsCode}\n</script></body>`);
    }
    return combined;
}
