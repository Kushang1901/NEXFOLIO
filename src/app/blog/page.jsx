"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { ScanSearch, GraduationCap, Bot, Zap, MessageSquare, FileStack, KeyRound, Mail, BookOpen, Search, Sparkles, Inbox } from "lucide-react";

const CATEGORIES = ["All", "Resume Tips", "Career Advice", "ATS", "Interview Prep", "AI Tools"];

const POSTS = [
    {
        id: 1, category: "ATS", readTime: "5 min read",
        date: "Jun 28, 2025",
        Icon: ScanSearch,
        title: "How ATS Systems Work — And How to Beat Them in 2025",
        excerpt: "Applicant Tracking Systems reject 75% of resumes before a human ever sees them. Here's exactly how they parse your resume and what you can do to pass every time.",
        tags: ["ATS", "Resume Tips"],
        featured: true,
        color: "#6366f1",
    },
    {
        id: 2, category: "Resume Tips", readTime: "4 min read",
        date: "Jun 22, 2025",
        Icon: GraduationCap,
        title: "The Perfect Resume Format for Freshers in 2025",
        excerpt: "No experience? No problem. Learn exactly how to structure a resume as a student or fresher that gets callbacks from top companies.",
        tags: ["Freshers", "Resume Tips"],
        featured: false,
        color: "#22c55e",
    },
    {
        id: 3, category: "AI Tools", readTime: "6 min read",
        date: "Jun 15, 2025",
        Icon: Bot,
        title: "How to Use AI to Write Your Resume (The Right Way)",
        excerpt: "AI can help you write a stronger resume faster — but only if you use it correctly. We break down the do's and don'ts of AI resume writing.",
        tags: ["AI", "Resume Tips"],
        featured: false,
        color: "#f59e0b",
    },
    {
        id: 4, category: "Career Advice", readTime: "7 min read",
        date: "Jun 9, 2025",
        Icon: Zap,
        title: "10 Power Verbs That Make Recruiters Stop and Read",
        excerpt: "The words you choose define how recruiters perceive your impact. Replace weak verbs with these 10 powerful action words to instantly improve your resume.",
        tags: ["Writing", "Career Advice"],
        featured: false,
        color: "#ec4899",
    },
    {
        id: 5, category: "Interview Prep", readTime: "8 min read",
        date: "Jun 3, 2025",
        Icon: MessageSquare,
        title: "How to Answer 'Tell Me About Yourself' — With Examples",
        excerpt: "This is the most common interview opener and most candidates blow it. Here's a proven framework to nail it every time, with 5 real example answers.",
        tags: ["Interview Prep", "Career Advice"],
        featured: false,
        color: "#14b8a6",
    },
    {
        id: 6, category: "Resume Tips", readTime: "3 min read",
        date: "May 27, 2025",
        Icon: FileStack,
        title: "Should Your Resume Be 1 Page or 2 Pages?",
        excerpt: "The age-old debate, finally settled. We analyzed 500+ resumes and recruiter feedback to give you a definitive answer based on your experience level.",
        tags: ["Resume Tips", "Formatting"],
        featured: false,
        color: "#8b5cf6",
    },
    {
        id: 7, category: "ATS", readTime: "5 min read",
        date: "May 20, 2025",
        Icon: KeyRound,
        title: "Resume Keywords: How to Find and Use Them Effectively",
        excerpt: "Keywords are what ATS systems and recruiters scan for first. Learn how to extract the right keywords from any job description in under 10 minutes.",
        tags: ["ATS", "Keywords"],
        featured: false,
        color: "#f97316",
    },
    {
        id: 8, category: "Career Advice", readTime: "6 min read",
        date: "May 14, 2025",
        Icon: Mail,
        title: "How to Write a Cold Email to a Hiring Manager That Gets Replies",
        excerpt: "Most cold emails get ignored. Here's a 5-step formula for crafting outreach emails that get real responses — with templates you can copy today.",
        tags: ["Career Advice", "Networking"],
        featured: false,
        color: "#06b6d4",
    },
];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = POSTS.filter(post => {
        const matchesCategory = activeCategory === "All" || post.category === activeCategory || post.tags.includes(activeCategory);
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = POSTS.find(p => p.featured);
    const regularPosts = filteredPosts.filter(p => !p.featured || activeCategory !== "All" || searchQuery);

    return (
        <div style={{ minHeight: "100vh", background: "#000", color: "#fff" }}>
            <Navbar />

            {/* Hero */}
            <section style={{ background: "linear-gradient(160deg, #0a0a1a 0%, #000 60%)", padding: "72px 24px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
                <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "999px", padding: "6px 18px", fontSize: "0.8rem", color: "#86efac", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "24px" }}>
                        <BookOpen size={13} color="#86efac" /> Career Resource Hub
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "800", lineHeight: "1.15", marginBottom: "18px", letterSpacing: "-0.02em" }}>
                        Resume Tips, Career Advice<br />& AI Tools
                    </h1>
                    <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", lineHeight: "1.7", marginBottom: "36px" }}>
                        Expert guides to help you land more interviews, write better resumes, and grow your career.
                    </p>

                    {/* Search */}
                    <div style={{ position: "relative", maxWidth: "460px", margin: "0 auto" }}>
                        <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                            <Search size={18} color="rgba(255,255,255,0.35)" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "#fff", padding: "13px 16px 13px 46px", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
                            onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                        />
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", overflowX: "auto" }}>
                <div style={{ maxWidth: "1040px", margin: "0 auto", display: "flex", gap: "4px", padding: "4px 0" }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                            background: "transparent", border: "none", color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.45)",
                            fontWeight: activeCategory === cat ? "700" : "500",
                            borderBottom: activeCategory === cat ? "2px solid #22c55e" : "2px solid transparent",
                            padding: "14px 16px", cursor: "pointer", fontSize: "0.88rem",
                            whiteSpace: "nowrap", transition: "all 0.15s ease",
                        }}>{cat}</button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "48px 24px" }}>

                {/* Featured Post */}
                {featuredPost && activeCategory === "All" && !searchQuery && (
                    <div style={{ marginBottom: "48px" }}>
                        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Sparkles size={14} color="#6366f1" /> Featured Article
                        </div>
                        <div style={{ background: `linear-gradient(135deg, ${featuredPost.color}12, rgba(0,0,0,0.5))`, border: `1px solid ${featuredPost.color}30`, borderRadius: "20px", padding: "clamp(24px, 4vw, 48px)", display: "grid", gridTemplateColumns: "1fr auto", gap: "32px", alignItems: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 20px 48px ${featuredPost.color}18`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                                    <span style={{ background: `${featuredPost.color}22`, color: featuredPost.color, border: `1px solid ${featuredPost.color}40`, borderRadius: "999px", padding: "4px 12px", fontSize: "0.78rem", fontWeight: "700" }}>{featuredPost.category}</span>
                                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>{featuredPost.date} · {featuredPost.readTime}</span>
                                </div>
                                <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: "800", marginBottom: "14px", lineHeight: "1.25", letterSpacing: "-0.01em" }}>{featuredPost.title}</h2>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: "1.7", marginBottom: "20px" }}>{featuredPost.excerpt}</p>
                                <span style={{ color: featuredPost.color, fontWeight: "700", fontSize: "0.9rem" }}>Read Article →</span>
                            </div>
                            <div className="d-none d-md-block" style={{ width: "100px", height: "100px", borderRadius: "24px", background: `${featuredPost.color}18`, border: `1px solid ${featuredPost.color}35`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: 0.9 }}>
                                <featuredPost.Icon size={48} color={featuredPost.color} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Grid */}
                {filteredPosts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                            <Search size={40} color="rgba(255,255,255,0.2)" />
                        </div>
                        <h3 style={{ fontWeight: "700", marginBottom: "8px" }}>No articles found</h3>
                        <p style={{ color: "rgba(255,255,255,0.45)" }}>Try a different search term or category.</p>
                    </div>
                ) : (
                    <>
                        {(activeCategory !== "All" || searchQuery) && (
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: "24px" }}>{filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} found</p>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                            {(activeCategory === "All" && !searchQuery ? regularPosts : filteredPosts).map(post => (
                                <article key={post.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.2s ease", display: "flex", flexDirection: "column" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${post.color}40`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${post.color}12`; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                                >
                                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${post.color}18`, border: `1px solid ${post.color}35`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                                        <post.Icon size={24} color={post.color} strokeWidth={1.8} />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                                        <span style={{ background: `${post.color}18`, color: post.color, border: `1px solid ${post.color}35`, borderRadius: "999px", padding: "3px 10px", fontSize: "0.75rem", fontWeight: "700" }}>{post.category}</span>
                                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>{post.readTime}</span>
                                    </div>
                                    <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "10px", lineHeight: "1.4", flex: 1 }}>{post.title}</h3>
                                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.86rem", lineHeight: "1.65", marginBottom: "18px" }}>{post.excerpt}</p>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>{post.date}</span>
                                        <span style={{ color: post.color, fontWeight: "700", fontSize: "0.85rem" }}>Read →</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Newsletter CTA */}
            <section style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "72px 24px", background: "rgba(255,255,255,0.015)" }}>
                <div style={{ maxWidth: "540px", margin: "0 auto", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                        <Inbox size={40} color="#22c55e" />
                    </div>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "12px" }}>Get Career Tips in Your Inbox</h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "28px", lineHeight: "1.7" }}>Weekly resume tips, job search strategies, and AI tool guides — no spam, unsubscribe anytime.</p>
                    <div style={{ display: "flex", gap: "10px", maxWidth: "400px", margin: "0 auto", flexWrap: "wrap" }}>
                        <input type="email" placeholder="your@email.com" style={{ flex: 1, minWidth: "200px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", padding: "12px 16px", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                            onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.45)"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                        />
                        <button style={{ padding: "12px 24px", background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", transition: "opacity 0.2s", whiteSpace: "nowrap" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
