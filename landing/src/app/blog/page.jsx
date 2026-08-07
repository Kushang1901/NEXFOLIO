"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { BLOG_POSTS } from "../../data/blogPosts";
import { BookOpen, Calendar, Clock, User, ArrowRight, ArrowLeft } from "lucide-react";

export default function BlogIndex() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Resume Tips", "Career Advice", "AI Tools"];

    const filteredPosts = selectedCategory === "All"
        ? BLOG_POSTS
        : BLOG_POSTS.filter(post => post.category === selectedCategory);

    return (
        <>
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
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .glass-card:hover {
                    transform: translateY(-4px);
                    border-color: rgba(99, 102, 241, 0.3) !important;
                    background: rgba(18, 18, 30, 0.8) !important;
                    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.08);
                }
                .glow-circle {
                    position: absolute !important;
                    width: 600px !important;
                    height: 600px !important;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(5, 5, 8, 0) 70%) !important;
                    z-index: -1 !important;
                    filter: blur(50px) !important;
                    pointer-events: none !important;
                }
                .category-tab {
                    padding: 8px 18px;
                    border-radius: 9999px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    cursor: pointer;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    background: rgba(255, 255, 255, 0.02);
                    color: rgba(255, 255, 255, 0.6);
                    transition: all 0.2s ease;
                }
                .category-tab:hover {
                    color: #ffffff;
                    border-color: rgba(255, 255, 255, 0.15);
                }
                .category-tab.active {
                    background: #6366f1;
                    color: #ffffff;
                    border-color: #6366f1;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
                }
            ` }} />

            <div className="min-h-screen flex flex-col">
                <Navbar />

                <main className="max-w-[1280px] mx-auto px-6 pt-32 pb-24 relative flex-grow w-full">
                    <div className="glow-circle top-10 left-1/4"></div>
                    <div className="glow-circle bottom-10 right-1/4"></div>

                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 hover:underline mb-8 font-semibold text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Header Hero */}
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">CVGrid Career Hub</span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                            Career Resources &amp; Guides
                        </h1>
                        <p className="text-slate-400 mt-4 leading-relaxed text-base md:text-lg">
                            Expert resume writing guidelines, CV templates walkthroughs, job interview hacks, and AI optimization strategies to help you land your dream job.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <Link href={`/blog/${post.slug}`} key={post.slug} className="glass-card p-6 flex flex-col justify-between no-underline group cursor-pointer">
                                <div>
                                    {/* Category Tag */}
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo-350 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded-full mb-4">
                                        {post.category}
                                    </span>
                                    
                                    {/* Title */}
                                    <h3 
                                        className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2"
                                        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                                    >
                                        {post.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.description}
                                    </p>
                                </div>

                                {/* Meta Footer */}
                                <div className="border-t border-white/5 pt-4 mt-auto">
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={12} /> {post.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} /> {post.readTime}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-indigo-400 font-bold text-xs">
                                        <span className="flex items-center gap-1 text-slate-400 font-normal">
                                            <User size={12} className="text-indigo-400/60" /> By {post.author}
                                        </span>
                                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Read Guide <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-16 glass-card max-w-md mx-auto">
                            <BookOpen className="text-slate-500 mx-auto mb-4" size={40} />
                            <h3 className="font-bold text-white mb-2">No Articles Found</h3>
                            <p className="text-slate-400 text-sm">We are busy writing fresh guides. Check back soon!</p>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
