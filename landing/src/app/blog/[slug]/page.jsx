import React from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BlogPostClient from "../../../components/BlogPostClient";
import { BLOG_POSTS } from "../../../data/blogPosts";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export async function generateStaticParams() {
    return BLOG_POSTS.map(post => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const post = BLOG_POSTS.find(p => p.slug === resolvedParams?.slug);

    if (!post) {
        return {
            title: "Career Guide Not Found | CVGrid",
            description: "The requested career guide could not be found.",
        };
    }

    return {
        title: `${post.title} | CVGrid Career Hub`,
        description: post.description,
        alternates: {
            canonical: `https://cvgrid.in/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            url: `https://cvgrid.in/blog/${post.slug}`,
            publishedTime: post.date,
            authors: [post.author],
            siteName: "CVGrid",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
        },
    };
}

export default async function BlogPostDetail({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col bg-[#050508] text-white">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-6 pt-32">
                    <div className="text-center max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <BookOpen size={48} className="text-indigo-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Guide Not Found</h2>
                        <p className="text-slate-400 text-sm mb-6">The career guide you are looking for does not exist or has been moved.</p>
                        <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold text-sm underline">
                            <ArrowLeft size={16} /> Back to Blog
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Extract headings for Table of Contents
    const headings = post.sections
        .filter(sec => sec.type === "heading")
        .map(sec => sec.text);

    // Pick top related articles
    const relatedPosts = BLOG_POSTS
        .filter(p => p.slug !== post.slug)
        .sort((a, b) => (a.category === post.category ? -1 : 1))
        .slice(0, 3);

    let isoDate = "2026-08-01";
    try {
        if (post.date) {
            const parsed = new Date(post.date);
            if (!isNaN(parsed.getTime())) {
                isoDate = parsed.toISOString().split("T")[0];
            }
        }
    } catch {}

    // JSON-LD Structured Data for Google AdSense & Search
    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `https://cvgrid.in/blog/${post.slug}#article`,
                "headline": post.title,
                "description": post.description,
                "image": "https://cvgrid.in/og-image.png",
                "inLanguage": "en-US",
                "author": {
                    "@type": "Person",
                    "name": post.author,
                    "url": "https://kushangacharya.vercel.app"
                },
                "datePublished": isoDate,
                "dateModified": isoDate,
                "publisher": {
                    "@type": "Organization",
                    "name": "CVGrid",
                    "url": "https://cvgrid.in",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://cvgrid.in/logo.png"
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://cvgrid.in/blog/${post.slug}`
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `https://cvgrid.in/blog/${post.slug}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://cvgrid.in"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://cvgrid.in/blog"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": post.title,
                        "item": `https://cvgrid.in/blog/${post.slug}`
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
            />

            <style dangerouslySetInnerHTML={{ __html: `
                body {
                    background-color: #050508 !important;
                    color: #dfe2ed !important;
                    font-family: var(--font-inter), sans-serif !important;
                }
                .glass-card {
                    background: rgba(13, 13, 22, 0.7) !important;
                    backdrop-filter: blur(16px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 16px;
                }
                .glow-circle {
                    position: absolute !important;
                    width: 600px !important;
                    height: 600px !important;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, rgba(5, 5, 8, 0) 70%) !important;
                    z-index: -1 !important;
                    filter: blur(50px) !important;
                    pointer-events: none !important;
                }
                .article-body p {
                    margin-bottom: 1.5rem;
                    line-height: 1.8;
                    color: #cbd5e1;
                }
                .article-body h2 {
                    color: #ffffff;
                    font-weight: 700;
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    font-family: var(--font-space-grotesk), sans-serif;
                }
            ` }} />

            <BlogPostClient title={post.title} />

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 relative flex-grow w-full">
                    <div className="glow-circle top-10 left-10"></div>
                    <div className="glow-circle bottom-10 right-10"></div>

                    {/* Back Button */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Blog
                    </Link>

                    {/* Main Layout Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* LEFT COLUMN: Main Article Content */}
                        <article className="lg:col-span-8 glass-card p-6 md:p-10 shadow-2xl relative overflow-hidden">
                            <header className="border-b border-white/10 pb-6 mb-8">
                                <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1 rounded-full mb-4">
                                    {post.category}
                                </span>
                                
                                <h1 
                                    className="text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight" 
                                    style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                >
                                    {post.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <User size={14} className="text-indigo-400" /> By {post.author}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-indigo-400" /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-indigo-400" /> {post.readTime}
                                    </span>
                                </div>
                            </header>

                            {/* Rendered Sections */}
                            <div className="article-body text-slate-300 text-sm md:text-base">
                                {post.sections.map((section, idx) => {
                                    if (section.type === "paragraph") {
                                        return (
                                            <p key={idx} className="whitespace-pre-line">
                                                {section.text}
                                            </p>
                                        );
                                    }
                                    if (section.type === "heading") {
                                        const headingId = section.text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                        return (
                                            <h2 key={idx} id={headingId} className="text-xl md:text-2xl font-bold">
                                                {section.text}
                                            </h2>
                                        );
                                    }
                                    if (section.type === "list") {
                                        return (
                                            <ul key={idx} className="list-disc pl-6 space-y-3 mb-6 text-slate-300">
                                                {section.items.map((item, i) => (
                                                    <li key={i} className="leading-relaxed">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Editorial Fact Check & Review Box */}
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <BookOpen size={16} />
                                    </div>
                                    <div className="text-xs leading-relaxed text-slate-300">
                                        <span className="font-semibold text-emerald-400 block mb-0.5">Editorial Standards &amp; ATS Research Note</span>
                                        This guide has been reviewed against current ATS parsing frameworks (including Greenhouse, Taleo, and Workday) and recruiting industry benchmarks. Our editorial mission is to provide actionable, verifiable resume blueprints that give job candidates an authentic advantage.
                                    </div>
                                </div>
                            </div>

                            {/* Author Bio Box */}
                            <div className="mt-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                    KA
                                </div>
                                <div className="space-y-1.5 flex-grow">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <h4 className="text-white font-bold text-base" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                            {post.author}
                                        </h4>
                                        <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                                            Creator &amp; Lead Engineer
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Kushang is the engineer and creator behind CVGrid. He writes extensively on applicant tracking systems, algorithmic resume parsing, technical career advancement, and modern frontend architecture.
                                    </p>
                                </div>
                            </div>

                            {/* Related Guides Section */}
                            {relatedPosts.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                        Related Career Guides &amp; Blueprints
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {relatedPosts.map((rel) => (
                                            <Link 
                                                key={rel.slug} 
                                                href={`/blog/${rel.slug}`}
                                                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all flex flex-col justify-between group no-underline"
                                            >
                                                <div>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 mb-1.5 block">
                                                        {rel.category}
                                                    </span>
                                                    <h5 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                                                        {rel.title}
                                                    </h5>
                                                </div>
                                                <span className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
                                                    <Clock size={12} /> {rel.readTime}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* RIGHT COLUMN: Sidebar (TOC, Share, CTA) */}
                        <aside className="lg:col-span-4 flex flex-col gap-8 sticky top-24">
                            
                            {/* Table of Contents */}
                            {headings.length > 0 && (
                                <div className="glass-card p-6">
                                    <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                        Table of Contents
                                    </h4>
                                    <ul className="space-y-3 text-xs md:text-sm">
                                        {headings.map((heading, i) => {
                                            const headingId = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                            return (
                                                <li key={i}>
                                                    <a 
                                                        href={`#${headingId}`} 
                                                        className="text-slate-400 hover:text-indigo-300 transition-colors no-underline block hover:translate-x-1 duration-200"
                                                    >
                                                        {heading}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {/* Share Widget */}
                            <div className="glass-card p-6">
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-white/5 pb-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    Share this Guide
                                </h4>
                                <p className="text-slate-400 text-xs mb-4">Help colleagues and students optimize their applications.</p>
                                <BlogPostClient title={post.title} />
                            </div>

                            {/* Builder Call to Action */}
                            <div className="glass-card p-6 bg-gradient-to-br from-indigo-950/30 to-slate-900 border-indigo-500/20 text-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">Free AI CV Maker</span>
                                <h4 className="font-extrabold text-white text-lg mt-3 mb-2" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    Build an ATS-Friendly CV
                                </h4>
                                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                                    Put these tips into action. Choose from our expert templates, write descriptions with AI, and download instantly.
                                </p>
                                <a 
                                    href="https://app.cvgrid.in/signup"
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                                >
                                    Try AI Builder Free <ArrowRight size={14} />
                                </a>
                            </div>

                        </aside>

                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
