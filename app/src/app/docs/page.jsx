"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BookOpen, FileText, Sparkles, Shield, CreditCard, ChevronRight, Menu, X, ArrowUpRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import "./docs.css";

const CATEGORIES = [
    { id: "getting-started", name: "Getting Started", icon: BookOpen },
    { id: "resume-builder", name: "Resume Builder", icon: FileText },
    { id: "ai-career-tools", name: "AI Career Tools", icon: Sparkles },
    { id: "privacy-sharing", name: "Privacy & Sharing", icon: Shield },
    { id: "subscription-billing", name: "Subscription & Billing", icon: CreditCard }
];

const DOCS_DATA = {
    "getting-started": {
        title: "Getting Started",
        description: "Learn the fundamentals of CVGrid, from setting up your account to building your first resume.",
        sections: [
            {
                id: "introduction",
                title: "Introduction to CVGrid",
                content: (
                    <>
                        <p>Welcome to <strong>CVGrid</strong>! CVGrid is an AI-powered resume and portfolio builder designed to help job seekers design premium, ATS-optimized, and professional resumes in minutes.</p>
                        <div className="docs-alert docs-alert-note">
                            <span className="docs-alert-icon">💡</span>
                            <div className="docs-alert-content">
                                <strong>Why Choose CVGrid?</strong>
                                Unlike traditional text processors, CVGrid enforces standard A4 grid dimensions. This ensures that whatever template you choose will print beautifully without any formatting overflows.
                            </div>
                        </div>
                        <p>Key highlights of CVGrid:</p>
                        <ul>
                            <li><strong>Standard A4 Templates</strong>: Architected to guarantee perfect page margins and exact printing heights.</li>
                            <li><strong>AI Career Assistant</strong>: Wording optimization, cover letter generation, and key phrase recommendations powered by Google Gemini.</li>
                            <li><strong>Resume Privacy & Control</strong>: Secure sharing links with optional password protection and custom URL slugs.</li>
                            <li><strong>ATS Optimization</strong>: Clean semantic markup built to pass automated recruiter screens.</li>
                        </ul>
                    </>
                )
            },
            {
                id: "quickstart",
                title: "Quick Start Guide",
                content: (
                    <>
                        <p>Follow these simple steps to build and share your resume:</p>
                        <ol>
                            <li><strong>Create your Account</strong>: Sign up using your email. We offer a free tier with standard templates.</li>
                            <li><strong>Enter your Profile Details</strong>: Populate your personal information, work history, skills, and projects in the builder dashboard.</li>
                            <li><strong>Select a Template</strong>: Choose from our collection of modern, minimalist, or creative designs. You can switch templates at any time.</li>
                            <li><strong>Optimize & Check ATS</strong>: Run the ATS checker to get a compatibility score and keywords check against your target job description.</li>
                            <li><strong>Publish and Export</strong>: Download your resume as a PDF or enable public sharing to generate a custom link.</li>
                        </ol>
                    </>
                )
            }
        ]
    },
    "resume-builder": {
        title: "Resume Builder",
        description: "Deep dive into template structures, text styling, and page alignment tools.",
        sections: [
            {
                id: "templates",
                title: "Template Architecture",
                content: (
                    <>
                        <p>CVGrid features a variety of template categories tailored to different industries:</p>
                        <ul>
                            <li><strong>Classic & Minimalist</strong>: Recommended for engineering, finance, and traditional roles. Highlights readability and structure.</li>
                            <li><strong>Modern & Bento</strong>: Tailored for tech, product management, and creative roles. Features multi-column and layout grid structures.</li>
                            <li><strong>Academic & Ivy League</strong>: Focused on publications, research work, and publications.</li>
                        </ul>
                        <div className="docs-alert docs-alert-tip">
                            <span className="docs-alert-icon">⚡</span>
                            <div className="docs-alert-content">
                                <strong>Switching Layouts</strong>
                                You can switch templates dynamically from the builder preview toolbar without losing any typed data.
                            </div>
                        </div>
                    </>
                )
            },
            {
                id: "editing",
                title: "Editing Content & Profiles",
                content: (
                    <>
                        <p>The builder has separate sections for entering information. We support rich features such as formatting tooltips and AI auto-suggest.</p>
                        <p>To add a custom section, scroll to the bottom of the builder sidebar and click <strong>Add Custom Section</strong>. You can name it freely (e.g. Publications, Languages, Core Competencies).</p>
                    </>
                )
            },
            {
                id: "pagebreaks",
                title: "Page Breaks & Printing",
                content: (
                    <>
                        <p>All templates are bound to the standard A4 print dimension (210mm × 297mm). To guarantee your resume looks perfect:</p>
                        <ul>
                            <li><strong>Avoid Overlap</strong>: If your content exceeds one page, the template automatically formats it to spill into a second page cleanly.</li>
                            <li><strong>Print Helper Badge</strong>: Use the preview page's print indicator to see exactly where pages break.</li>
                            <li><strong>PDF Scaling</strong>: When downloading, ensure the page size is set to A4 with 0 margins in your print options.</li>
                        </ul>
                    </>
                )
            }
        ]
    },
    "ai-career-tools": {
        title: "AI Career Tools",
        description: "Utilize advanced Google Gemini-powered features to optimize your job applications.",
        sections: [
            {
                id: "ats-match",
                title: "ATS Match Score & Analyzer",
                content: (
                    <>
                        <p>The ATS Match Score tool compares your resume against a target job description. It yields a percentage match and lists missing skills.</p>
                        <p>To use it:</p>
                        <ol>
                            <li>Navigate to the <strong>ATS Checker</strong> from the sidebar.</li>
                            <li>Paste the target job description in the text area.</li>
                            <li>Click <strong>Analyze Resume</strong>. You will receive detailed recommendations on skills to add and formatting changes.</li>
                        </ol>
                    </>
                )
            },
            {
                id: "keyword-optimizer",
                title: "Resume Keyword Optimizer",
                content: (
                    <>
                        <p>Automated applicant tracking systems parse your resume looking for specific keywords. The Keyword Optimizer scans your experience bullet points and automatically suggests contextual keywords to integrate.</p>
                        <div className="docs-alert docs-alert-warning">
                            <span className="docs-alert-icon">⚠️</span>
                            <div className="docs-alert-content">
                                <strong>Keep it Natural</strong>
                                Avoid "keyword stuffing". Always integrate keywords naturally into your achievement bullet points.
                            </div>
                        </div>
                    </>
                )
            },
            {
                id: "cover-letter",
                title: "AI Cover Letter Generator",
                content: (
                    <>
                        <p>Tailor a professional cover letter to any job description. The AI Cover Letter Helper extracts elements from your resume and matches them with the target role to generate a professional, persuasive pitch letter.</p>
                    </>
                )
            }
        ]
    },
    "privacy-sharing": {
        title: "Privacy & Sharing Settings",
        description: "Control access to your shared resume link, secure it with passwords, and track views.",
        sections: [
            {
                id: "custom-slugs",
                title: "Custom URL Slugs",
                content: (
                    <>
                        <p>Make your resume link professional by setting a Custom URL Slug. Instead of a generic link, you can create a link like:</p>
                        <div className="docs-code-block">
                            <pre>docs.cvgrid.in/resume/kushang-acharya</pre>
                        </div>
                        <p>To customize it, open the **Resume Sharing** dashboard, enter your preferred name slug under "Custom URL Slug", and click Save settings.</p>
                    </>
                )
            },
            {
                id: "password-protection",
                title: "Password Security",
                content: (
                    <>
                        <p>If you only want specific recruiters to view your resume, you can enable Password Protection:</p>
                        <ol>
                            <li>Set the privacy option to <strong>Password Protected</strong>.</li>
                            <li>Type a secure password in the input field. Use the eye toggle button to see or hide your password.</li>
                            <li>Click <strong>Save Configurations</strong>.</li>
                        </ol>
                        <p>Viewers accessing your link will be prompted to enter the password to view your resume details.</p>
                    </>
                )
            },
            {
                id: "tracking-analytics",
                title: "Views & Downloads Analytics",
                content: (
                    <>
                        <p>CVGrid tracks real-time visitor logs on your public links:</p>
                        <ul>
                            <li><strong>View Count</strong>: Total times your public web link has been loaded.</li>
                            <li><strong>Download Count</strong>: How many times viewers have clicked "Download PDF" on your public page.</li>
                            <li><strong>Last Active Timestamp</strong>: The exact time the last visitor viewed your resume.</li>
                        </ul>
                    </>
                )
            }
        ]
    },
    "subscription-billing": {
        title: "Subscription & Billing",
        description: "Manage plans, invoices, and unlock premium resume layouts.",
        sections: [
            {
                id: "premium-tier",
                title: "Free vs. Premium Tiers",
                content: (
                    <>
                        <p>CVGrid offers a simple structure to unlock premium templates and advanced AI tools:</p>
                        <ul>
                            <li><strong>Free Plan</strong>: Access to classic templates, standard AI suggestions, and PDF downloads.</li>
                            <li><strong>Premium Tier</strong>: Unlimited premium bento/portfolio designs, removal of the CVGrid watermark, and deep ATS analysis.</li>
                        </ul>
                    </>
                )
            },
            {
                id: "payment-security",
                title: "Payment Security & Upgrades",
                content: (
                    <>
                        <p>Upgrades are handled securely through Razorpay. We do not store your credit card or billing details on our servers. Transactions are fully encrypted end-to-end.</p>
                        <p>For support regarding payments, invoices, or refund inquiries, please submit a query via our <Link href="/contact" className="text-cyan text-decoration-none fw-semibold">Contact Page</Link>.</p>
                    </>
                )
            }
        ]
    }
};

export default function DocsPage() {
    const [activeCategory, setActiveCategory] = useState("getting-started");
    const [activeSection, setActiveSection] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const categoryData = DOCS_DATA[activeCategory];

    // Scrollspy Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -70% 0px" }
        );

        const sections = document.querySelectorAll(".docs-section");
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, [activeCategory]);

    // Handle smooth scroll on right sidebar click
    const handleOutlineClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(id);
        }
    };

    return (
        <div className="docs-container d-flex flex-column">
            <Navbar />

            {/* Mobile Navigation bar */}
            <div className="docs-mobile-nav">
                <div className="d-flex justify-content-between align-items-center">
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="btn btn-outline-secondary d-flex align-items-center gap-2 text-white border-secondary"
                        style={{ padding: "8px 14px", borderRadius: "10px" }}
                    >
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        <span>Topics Menu</span>
                    </button>
                    <span className="text-white-50 small fw-bold">
                        {CATEGORIES.find(c => c.id === activeCategory)?.name}
                    </span>
                </div>

                {/* Collapsible Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mt-3 p-3 rounded bg-dark border border-secondary" style={{ animation: "fadeIn 0.2s ease" }}>
                        <h6 className="text-white-50 fw-bold uppercase small mb-3">Documentation Categories</h6>
                        <div className="d-flex flex-column gap-2">
                            {CATEGORIES.map((cat) => {
                                const IconComponent = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveCategory(cat.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`btn text-start d-flex align-items-center gap-3 py-2.5 px-3 rounded-lg border-0 ${
                                            activeCategory === cat.id ? "bg-info text-dark fw-bold" : "text-white-50"
                                        }`}
                                        style={{ borderRadius: "8px" }}
                                    >
                                        <IconComponent size={18} />
                                        <span>{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Layout Container */}
            <div className="flex-grow-1">
                <div className="docs-layout">
                    {/* Left Sidebar */}
                    <aside className="docs-sidebar-left">
                        <div className="docs-category">
                            <div className="docs-category-title">Platform Docs</div>
                            <ul className="docs-menu-list">
                                {CATEGORIES.map((cat) => {
                                    const IconComponent = cat.icon;
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <li key={cat.id} className="docs-menu-item">
                                            <a 
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`docs-menu-link d-flex align-items-center gap-2.5 ${isActive ? "active" : ""}`}
                                            >
                                                <IconComponent size={16} />
                                                <span>{cat.name}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="docs-category mt-5">
                            <div className="docs-category-title">Resources</div>
                            <ul className="docs-menu-list">
                                <li className="docs-menu-item">
                                    <Link href="/" className="docs-menu-link d-flex align-items-center justify-content-between">
                                        <span>Back to Home</span>
                                        <ArrowUpRight size={14} className="text-white-50" />
                                    </Link>
                                </li>
                                <li className="docs-menu-item">
                                    <Link href="/my-resumes" className="docs-menu-link d-flex align-items-center justify-content-between">
                                        <span>Resume Dashboard</span>
                                        <ArrowUpRight size={14} className="text-white-50" />
                                    </Link>
                                </li>
                                <li className="docs-menu-item">
                                    <Link href="/contact" className="docs-menu-link d-flex align-items-center justify-content-between">
                                        <span>Contact Support</span>
                                        <ArrowUpRight size={14} className="text-white-50" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Middle Reading Pane */}
                    <main className="docs-content-main">
                        <article className="docs-article" key={activeCategory}>
                            <header className="docs-header">
                                <h1 className="docs-title">{categoryData.title}</h1>
                                <p className="docs-description">{categoryData.description}</p>
                            </header>

                            {categoryData.sections.map((sec) => (
                                <section key={sec.id} id={sec.id} className="docs-section">
                                    <h2>{sec.title}</h2>
                                    <div className="docs-section-body">
                                        {sec.content}
                                    </div>
                                </section>
                            ))}
                        </article>
                        <Footer />
                    </main>

                    {/* Right Sidebar - "On this page" outline */}
                    <aside className="docs-sidebar-right">
                        <div className="docs-outline-title">On this page</div>
                        <ul className="docs-outline-list">
                            {categoryData.sections.map((sec) => (
                                <li key={sec.id} className="docs-outline-item">
                                    <a
                                        href={`#${sec.id}`}
                                        onClick={(e) => handleOutlineClick(e, sec.id)}
                                        className={`docs-outline-link ${activeSection === sec.id ? "active" : ""}`}
                                    >
                                        {sec.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>
            </div>
        </div>
    );
}
