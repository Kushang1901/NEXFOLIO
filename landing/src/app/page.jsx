"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import Script from "next/script";
import ScrollReveal from "../components/ScrollReveal";
import { Brain, CheckSquare, Share2, Percent, Globe, MessagesSquare, Star, ChevronDown, Lock, ArrowRight } from "lucide-react";

export default function HomePage() {
    const [tailwindLoaded, setTailwindLoaded] = useState(true);

    // Hardcoded static testimonials for high speed and zero network dependency
    const testimonials = [
        {
            userName: "Anish Sharma",
            role: "Software Engineer",
            rating: 5,
            feedback: "CVGrid is incredible. The AI bullet point rephraser helped me highlight my achievements. Landed 3 interviews in a week!"
        },
        {
            userName: "Priya Patel",
            role: "Product Manager",
            rating: 5,
            feedback: "I loved the classic template. The ATS optimization feature is a lifesaver. Extremely clean and professional UI."
        },
        {
            userName: "Rahul Verma",
            role: "College Graduate",
            rating: 5,
            feedback: "The PDF export was super fast and clean. No hidden charges or watermarks on the premium version. Highly recommend!"
        }
    ];

    // Typewriter effect state
    const phrases = ["Career", "ATS Resume", "AI Portfolio", "Interview Prep", "Job Search", "Professional CV"];
    const [typewriterIndex, setTypewriterIndex] = useState(0);
    const [typewriterText, setTypewriterText] = useState("Career");
    const [isTypewriterDeleting, setIsTypewriterDeleting] = useState(false);

    useEffect(() => {
        let timer;
        const currentPhrase = phrases[typewriterIndex];
        const speed = isTypewriterDeleting ? 40 : 80;

        if (isTypewriterDeleting) {
            timer = setTimeout(() => {
                setTypewriterText(prev => prev.slice(0, -1));
            }, speed);
        } else {
            timer = setTimeout(() => {
                setTypewriterText(currentPhrase.slice(0, typewriterText.length + 1));
            }, speed);
        }

        if (!isTypewriterDeleting && typewriterText === currentPhrase) {
            timer = setTimeout(() => setIsTypewriterDeleting(true), 2200);
        } else if (isTypewriterDeleting && typewriterText === "") {
            setIsTypewriterDeleting(false);
            setTypewriterIndex(prev => (prev + 1) % phrases.length);
        }

        return () => clearTimeout(timer);
    }, [typewriterText, isTypewriterDeleting, typewriterIndex]);

    useEffect(() => {
        const canvas = document.getElementById("crystal-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener("resize", handleResize);

        // Particle nodes for faint neural network connection and micro glows
        let particles = [];
        const maxParticles = 35;
        const colors = [
            "rgba(139, 92, 246, 0.25)", // Purple
            "rgba(99, 102, 241, 0.25)", // Indigo
            "rgba(59, 130, 246, 0.25)"  // Blue
        ];

        for (let i = 0; i < maxParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 1.5 + 0.8,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        // Draw hexagon helper for subtle hexagonal grid
        const drawHexagon = (ctx, x, y, size) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const hx = x + Math.cos(angle) * size;
                const hy = y + Math.sin(angle) * size;
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.strokeStyle = "rgba(99, 102, 241, 0.02)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
        };

        const drawWave = (ctx, startX, startY, endX, endY, numStrands, amplitude, freq, speed, time, baseAlpha) => {
            const dx = endX - startX;
            const dy = endY - startY;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            const px = -dy / len;
            const py = dx / len;

            for (let s = 0; s < numStrands; s++) {
                ctx.beginPath();
                const strandAmp = amplitude + s * 8;
                const strandFreq = freq + s * 0.08;
                const strandPhase = time * speed + s * 0.16;
                
                let color;
                if (s % 3 === 0) {
                    color = `rgba(139, 92, 246, ${(baseAlpha - s * 0.015).toFixed(3)})`; // Purple
                } else if (s % 3 === 1) {
                    color = `rgba(99, 102, 241, ${(baseAlpha * 1.2 - s * 0.015).toFixed(3)})`; // Indigo
                } else {
                    color = `rgba(59, 130, 246, ${(baseAlpha - s * 0.015).toFixed(3)})`; // Electric Blue
                }

                for (let t = 0; t <= 1; t += 0.005) {
                    const bx = startX + t * dx;
                    const by = startY + t * dy;

                    // Fade waves at start and end
                    const taper = Math.sin(t * Math.PI); 

                    // Double frequency wave for high fidelity fluid motion
                    const waveOffset = Math.sin(t * strandFreq * Math.PI - strandPhase) * strandAmp * taper
                                     + Math.cos(t * (strandFreq * 1.6) * Math.PI + strandPhase * 0.6) * (strandAmp * 0.22) * taper;

                    const x = bx + px * waveOffset;
                    const y = by + py * waveOffset;

                    if (t === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.strokeStyle = color;
                ctx.lineWidth = s === 0 ? 1.4 : 0.8;
                ctx.stroke();
            }
        };

        let lastTime = 0;

        const animate = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw extremely subtle background Hexagonal Grid (static placement)
            drawHexagon(ctx, width * 0.2, height * 0.3, 100);
            drawHexagon(ctx, width * 0.2 + 150, height * 0.3 + 86, 100);
            drawHexagon(ctx, width * 0.8, height * 0.7, 120);
            drawHexagon(ctx, width * 0.85, height * 0.3, 80);
            drawHexagon(ctx, width * 0.5, height * 0.8, 140);

            // 2. Draw flowing wave ribbons (diagonally sweeping top-right to bottom-left)
            drawWave(
                ctx, 
                width * 1.15, -height * 0.15, 
                -width * 0.15, height * 1.15, 
                6, // strands
                75, // amplitude
                3.8, // frequency
                0.0006, // speed
                timestamp, 
                0.06 // alpha
            );

            drawWave(
                ctx, 
                width * 1.25, -height * 0.05, 
                -width * 0.05, height * 1.25, 
                5, // strands
                50, // amplitude
                5.2, // frequency
                -0.0008, // speed
                timestamp, 
                0.045 // alpha
            );

            // 3. Update and draw nodes
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            // 4. Draw node connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const pi = particles[i];
                    const pj = particles[j];

                    const dx = pi.x - pj.x;
                    const dy = pi.y - pj.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * 0.05;
                        ctx.beginPath();
                        ctx.moveTo(pi.x, pi.y);
                        ctx.lineTo(pj.x, pj.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [tailwindLoaded]);

    const handleStartResume = (e) => {
        e.preventDefault();
        window.location.href = "https://app.cvgrid.in/login";
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />

            <style>{`
                body {
                    background-color: #000000 !important;
                    color: #e4e0f1 !important;
                    overflow-x: hidden;
                }
                .hero-gradient-bg {
                    background: radial-gradient(circle at 75% 25%, #111126 0%, #07070d 65%, #000000 100%);
                }
                .ai-gradient-text {
                    background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .ai-gradient-bg {
                    background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
                }
                .cta-gradient-bg {
                    background: radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(6, 8, 19, 0.95) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                }
                .glass-card {
                    background: rgba(10, 11, 22, 0.55);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .glass-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(99, 102, 241, 0.35);
                    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.02);
                }
                .glow-hover:hover {
                    box-shadow: 0 0 25px rgba(99, 102, 241, 0.3);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                }
                .float-ui {
                    animation: float 6s infinite ease-in-out;
                }
                .gradient-blur {
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
                    filter: blur(40px);
                }
                .typewriter-cursor {
                    animation: cursorBlink 0.8s infinite;
                }
                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                details[open] summary svg {
                    transform: rotate(180deg);
                }
                details summary svg {
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                details[open] {
                    border-color: rgba(99, 102, 241, 0.25) !important;
                    background: rgba(10, 11, 22, 0.75) !important;
                }
                .grid-bg {
                    background-image: 
                    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
                    background-size: 50px 50px;
                    background-position: center center;
                }
                .cta-text-align {
                    text-align: center;
                }
                @media (min-width: 768px) {
                    .cta-text-align {
                        text-align: left !important;
                    }
                }
            `}</style>

            <div className="bg-[#000000] text-[#e4e0f1] min-h-screen" style={{ opacity: tailwindLoaded ? 1 : 0, transition: "opacity 0.25s ease-in" }}>
                <Navbar />

                <main className="relative">
                    {/* Hero Section: Editorial Layout */}
                    <section className="relative min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] flex items-center px-4 md:px-8 pt-6 pb-6 lg:py-0 overflow-hidden hero-gradient-bg" id="features">
                        {/* Background Elements */}
                        <canvas id="crystal-canvas" className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ mixBlendMode: "screen" }} />
                        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] gradient-blur rounded-full opacity-50 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)" }}></div>
                        <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] gradient-blur rounded-full opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)" }}></div>

                        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                            {/* Content Left */}
                            <div className="lg:col-span-7 z-10">
                                <ScrollReveal delay={100}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex -space-x-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-[#12121d] bg-[#1f1e2a] flex items-center justify-center text-[10px] font-bold">JD</div>
                                            <div className="w-8 h-8 rounded-full border-2 border-[#12121d] bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold">MK</div>
                                            <div className="w-8 h-8 rounded-full border-2 border-[#12121d] bg-purple-500/20 flex items-center justify-center text-[10px] font-bold">AS</div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex text-yellow-400">
                                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            </div>
                                            <span className="text-[11px] font-semibold text-[#c7c4d7] uppercase tracking-widest">Trusted by 10k+ Seekers</span>
                                        </div>
                                    </div>
                                </ScrollReveal>

                                <ScrollReveal delay={200}>
                                    <h1 className="text-[40px] md:text-[60px] leading-[1.05] mb-4 font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                        The <span className="font-light italic">Future</span> of your <br />
                                        <span className="font-bold ai-gradient-text">{typewriterText}</span> starts here.
                                    </h1>
                                </ScrollReveal>

                                <ScrollReveal delay={300}>
                                    <p className="text-base md:text-lg text-[#c7c4d7] mb-6 max-w-[580px]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                        Engineered for modern recruitment. Use our neural-powered engine to generate ATS-proof resumes that recruiters actually want to read.
                                    </p>
                                </ScrollReveal>

                                <ScrollReveal delay={400}>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                                        <button
                                            onClick={handleStartResume}
                                            className="ai-gradient-bg text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 group glow-hover transition-all active:scale-95 border-0 cursor-pointer"
                                        >
                                            <span className="text-base">Build My Resume</span>
                                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">trending_flat</span>
                                        </button>
                                    </div>
                                </ScrollReveal>
                            </div>

                            {/* Visual Right */}
                            <div className="lg:col-span-5 relative h-full flex items-center justify-center lg:justify-end">
                                <ScrollReveal delay={300} animationClass="opacity-0 translate-y-12 scale-95" activeClass="opacity-100 translate-y-0 scale-100" className="w-full max-w-[480px]">
                                    <div className="relative w-full max-w-[480px]">
                                        {/* Abstract UI Mockup */}
                                        <div className="float-ui glass-card rounded-2xl p-6 border-indigo-500/30 shadow-2xl relative z-20">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold uppercase tracking-wider">AI Optimizer active</div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="h-4 w-3/4 bg-white/5 rounded-full"></div>
                                                <div className="h-32 w-full bg-white/5 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2.5 p-4 text-center">
                                                    <span className="material-symbols-outlined text-[#c0c1ff]/50 text-2xl animate-pulse">auto_awesome</span>
                                                    <p className="text-[#c0c1ff] font-semibold text-[11px] md:text-[12px] leading-relaxed max-w-[200px]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", letterSpacing: "0.02em" }}>
                                                        "You define your future. We help you build it."
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-3 w-full bg-white/5 rounded-full"></div>
                                                    <div className="h-3 w-5/6 bg-white/5 rounded-full"></div>
                                                    <div className="h-3 w-4/6 bg-white/5 rounded-full"></div>
                                                </div>
                                                <div className="pt-4 flex justify-end">
                                                    <div className="h-8 w-24 ai-gradient-bg rounded-lg opacity-80"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Secondary floating element */}
                                        <div className="absolute -bottom-8 -left-12 float-ui z-30 glass-card p-4 rounded-xl border-purple-500/20 shadow-xl hidden md:block" style={{ animationDelay: "-3s" }}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                                                </div>
                                                <div>
                                                    <div className="text-[12px] font-bold">ATS Score: 98%</div>
                                                    <div className="text-[10px] text-[#c7c4d7]">Highly compatible</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating AI Skills match badge */}
                                        <div className="absolute -top-10 -right-6 float-ui z-30 glass-card px-4 py-3 rounded-xl border-indigo-500/20 shadow-lg hidden md:block" style={{ animationDelay: "-1.5s" }}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></div>
                                                <div className="text-[11px] font-bold text-[#c0c1ff] uppercase tracking-wider">AI Skill Match: 95%</div>
                                            </div>
                                        </div>

                                        {/* Floating PDF download toast */}
                                        <div className="absolute top-1/4 -left-20 float-ui z-30 glass-card px-3 py-2 rounded-xl border-white/10 shadow-lg hidden md:block" style={{ animationDelay: "-4.5s" }}>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-red-400 text-sm">picture_as_pdf</span>
                                                <span className="text-[11px] font-semibold text-[#e4e0f1]">Format: PDF / Docx</span>
                                            </div>
                                        </div>

                                        {/* Decorative circles */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[#c0c1ff]/10 rounded-full -z-10"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-[#c0c1ff]/5 rounded-full -z-10"></div>
                                    </div>
                                </ScrollReveal>
                            </div>

                        </div>
                    </section>

                    {/* Bento Features */}
                    {/* Bento Features */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto relative">
                        {/* Background glowing spots */}
                        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none"></div>

                        <ScrollReveal delay={100}>
                            <div className="text-center mb-16 relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Precision Tools for Professionals</h2>
                                <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Our comprehensive toolkit is designed to optimize your resume, generate portfolios, and prepare you for interviews.</p>
                            </div>
                        </ScrollReveal>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

                            {/* Card 1 */}
                            <ScrollReveal delay={100} className="h-full">
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff]/30 transition-all group cursor-default h-full">
                                    <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff] transition-transform duration-300 group-hover:scale-110">
                                        <Brain className="w-8 h-8 text-[#a5b4fc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Best Free AI Resume Maker</h3>
                                    <p className="text-[#c7c4d7] leading-relaxed text-[15px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Generate impactful summaries and action-oriented bullet points with the best free AI resume maker online.
                                    </p>
                                    <button onClick={handleStartResume} className="mt-auto pt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold bg-transparent border-0 p-0 transition-all cursor-pointer hover:text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Start Writing <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </ScrollReveal>

                            {/* Card 2 */}
                            <ScrollReveal delay={200} className="h-full">
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff]/30 transition-all group cursor-default h-full">
                                    <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff] transition-transform duration-300 group-hover:scale-110">
                                        <CheckSquare className="w-8 h-8 text-[#a5b4fc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Best ATS Scorer & Match Checker</h3>
                                    <p className="text-[#c7c4d7] leading-relaxed text-[15px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Compare your resume against descriptions and identify keyword gaps with our precision best ATS scorer.
                                    </p>
                                    <a href="https://app.cvgrid.in/ats-checker" className="mt-auto pt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold transition-all no-underline hover:text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Scan My CV <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </ScrollReveal>

                            {/* Card 3 */}
                            <ScrollReveal delay={300} className="h-full">
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff]/30 transition-all group cursor-default h-full">
                                    <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff] transition-transform duration-300 group-hover:scale-110">
                                        <Share2 className="w-8 h-8 text-[#a5b4fc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Smart URL Sharing</h3>
                                    <p className="text-[#c7c4d7] leading-relaxed text-[15px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Set custom handles, password locks, and track detailed real-time visitor counts and downloads.
                                    </p>
                                    <a href="https://app.cvgrid.in/login" className="mt-auto pt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold transition-all no-underline hover:text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Share Resume <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </ScrollReveal>

                            {/* Card 4 */}
                            <ScrollReveal delay={100} className="h-full">
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff]/30 transition-all group cursor-default h-full">
                                    <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff] transition-transform duration-300 group-hover:scale-110">
                                        <Percent className="w-8 h-8 text-[#a5b4fc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>ATS Keywords Highlighter</h3>
                                    <p className="text-[#c7c4d7] leading-relaxed text-[15px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Find match percentages, highlight missing ATS keywords, and get recommendations to optimize your CV.
                                    </p>
                                    <a href="https://app.cvgrid.in/login" className="mt-auto pt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold transition-all no-underline hover:text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Get Match Score <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </ScrollReveal>

                            {/* Card 5 */}
                            <ScrollReveal delay={200} className="h-full">
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff]/30 transition-all group cursor-default h-full">
                                    <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff] transition-transform duration-300 group-hover:scale-110">
                                        <Globe className="w-8 h-8 text-[#a5b4fc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>AI Portfolio Builder</h3>
                                    <p className="text-[#c7c4d7] leading-relaxed text-[15px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Convert your resume into a website. The most affordable, less expensive portfolio builder to download source code.
                                    </p>
                                    <a href="https://app.cvgrid.in/login" className="mt-auto pt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold transition-all no-underline hover:text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Build Portfolio <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </ScrollReveal>

                            {/* Card 6 */}
                            <ScrollReveal delay={300} className="h-full">
                                <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff]/30 transition-all group cursor-default h-full">
                                    <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff] transition-transform duration-300 group-hover:scale-110">
                                        <MessagesSquare className="w-8 h-8 text-[#a5b4fc]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>AI Interview Coach</h3>
                                    <p className="text-[#c7c4d7] leading-relaxed text-[15px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Get personalized interview questions and recommended answers based on your target role.
                                    </p>
                                    <a href="https://app.cvgrid.in/login" className="mt-auto pt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold transition-all no-underline hover:text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Practice Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </ScrollReveal>

                        </div>
                    </section>

                    {/* Competitor Comparison / Less Expensive CV Maker Section */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto border-t border-white/5 relative">
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none"></div>

                        <ScrollReveal delay={100}>
                            <div className="text-center mb-16 relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    The Best & Most Less Expensive AI CV Maker
                                </h2>
                                <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Compare CVGrid with other expensive tools. We offer the best value, premium templates, and advanced features for a fraction of the cost.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <div className="glass-card p-6 md:p-10 rounded-[32px] border border-indigo-500/10 relative z-10 overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-white/10 text-white font-bold text-sm md:text-base">
                                            <th className="pb-4 pt-2">Feature / Pricing</th>
                                            <th className="pb-4 pt-2 text-[#c0c1ff]">CVGrid (Us)</th>
                                            <th className="pb-4 pt-2 text-white/60">Resume.io</th>
                                            <th className="pb-4 pt-2 text-white/60">Rezi</th>
                                            <th className="pb-4 pt-2 text-white/60">Kickresume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#c7c4d7] text-sm md:text-base">
                                        <tr className="border-b border-white/5">
                                            <td className="py-4 font-semibold text-white">Starting Price</td>
                                            <td className="py-4 text-[#c0c1ff] font-bold">100% Free Tier</td>
                                            <td className="py-4">$2.90 (7-day trial)</td>
                                            <td className="py-4">$29.00 / month</td>
                                            <td className="py-4">$19.00 / month</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="py-4 font-semibold text-white">Premium Template Export</td>
                                            <td className="py-4 text-[#c0c1ff] font-bold">₹150 ($1.80) / lifetime</td>
                                            <td className="py-4">$24.95 / month renewal</td>
                                            <td className="py-4">$29.00 / month subscription</td>
                                            <td className="py-4">$19.00 / month subscription</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="py-4 font-semibold text-white">Best ATS Scorer & Matcher</td>
                                            <td className="py-4 text-green-400 font-bold">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Included Free
                                            </td>
                                            <td className="py-4">Not available</td>
                                            <td className="py-4">Subscription only</td>
                                            <td className="py-4">Not available</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="py-4 font-semibold text-white">Best Keyword Generator</td>
                                            <td className="py-4 text-green-400 font-bold">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Included Free
                                            </td>
                                            <td className="py-4">Basic matching</td>
                                            <td className="py-4">Subscription only</td>
                                            <td className="py-4">Limited keywords</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 font-semibold text-white">Watermark-Free PDF</td>
                                            <td className="py-4 text-green-400 font-bold">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Yes (100% Free)
                                            </td>
                                            <td className="py-4">Paid only</td>
                                            <td className="py-4">Paid only</td>
                                            <td className="py-4">Paid only</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* Testimonials Section (Wall of Love) */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto border-t border-white/5 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

                        <ScrollReveal delay={100}>
                            <div className="text-center mb-16 relative z-10">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    Loved by Career Builders
                                </h2>
                                <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    See how CVGrid helps freshers and professionals optimize their resumes and land interviews.
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            {testimonials.map((item, i) => (
                                <ScrollReveal key={i} delay={i * 150} className="h-full">
                                    <div className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 border border-indigo-500/10 hover:border-[#c0c1ff]/30 transition-all group duration-300 h-full">
                                        <div>
                                            {/* Stars */}
                                            <div className="flex gap-1 mb-4">
                                                {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                                                    <Star key={idx} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>
                                            {/* Feedback */}
                                            <p className="text-[#e4e0f1] text-[15px] leading-relaxed italic" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                                "{item.feedback}"
                                            </p>
                                        </div>
                                        {/* User Details */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366f1]/20 to-[#a855f7]/20 border border-indigo-500/20 flex items-center justify-center text-[#c0c1ff] font-bold text-sm">
                                                {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-white">{item.userName || "Verified User"}</div>
                                                <div className="text-[11px] text-[#c7c4d7]">{item.role || "Job Seeker"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="px-4 md:px-8 py-16">
                        <ScrollReveal delay={100}>
                            <div className="max-w-[1280px] mx-auto cta-gradient-bg rounded-[32px] p-12 md:p-20 relative overflow-hidden cta-text-align border border-white/[0.06]">
                                <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-[#6366F1]/10 blur-[80px] pointer-events-none"></div>
                                <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full bg-[#A855F7]/10 blur-[80px] pointer-events-none"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="max-w-2xl">
                                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Ready to land your dream interview?</h2>
                                        <p className="text-[#c7c4d7]/90 text-lg md:text-xl mb-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                            Join 10,000+ job seekers who leveled up their career with CVGrid. Create your resume now.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-6">
                                        <button
                                            onClick={handleStartResume}
                                            className="bg-white text-[#12121d] font-bold text-lg px-12 py-5 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_45px_rgba(99,102,241,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all border-0 cursor-pointer"
                                        >
                                            Get Started Now
                                        </button>
                                        <div className="flex items-center gap-2 text-white/70 text-sm">
                                            <Lock className="w-4 h-4 text-white/60" />
                                            No credit card required
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* FAQ Section */}
                    <section className="px-4 md:px-8 py-16 max-w-3xl mx-auto" id="faq">
                        <ScrollReveal delay={100}>
                            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>FAQs</h2>
                        </ScrollReveal>
                        <div className="space-y-4">
                            {[
                                {
                                    q: "Is CVGrid free to use?",
                                    a: "Yes! CVGrid offers a generous free tier. You can create your resume and download it completely free and watermark-free using any of our free templates. Premium templates are available for a one-time upgrade charge of ₹150 per resume.",
                                },
                                {
                                    q: "Are the resume templates ATS-friendly?",
                                    a: "Absolutely. All resume templates on CVGrid are rigorously tested against leading Applicant Tracking Systems (ATS) to ensure your content parses perfectly and is never scrambled or ignored by recruiters.",
                                },
                                {
                                    q: "Will recruiters know I used AI?",
                                    a: "No. Our AI model is fine-tuned to write professional, impact-driven sentences that sound natural. It helps rephrase and optimize your real experience to highlight key achievements.",
                                },
                                {
                                    q: "How does the AI resume builder work?",
                                    a: "Simply input your professional details, click the 'Generate AI Content' helper, and our AI will draft descriptions, executive summaries, and action-oriented bullet points matching your industry and target job description.",
                                },
                                {
                                    q: "Can I download my resume as a PDF?",
                                    a: "Yes. Once you're done editing, you can immediately download your CV as a high-quality PDF, Word document (.docx), or high-res PNG image. Downloads are completely free and watermark-free on our free layouts; premium layouts require a one-time upgrade.",
                                },
                                {
                                    q: "Does CVGrid work for freshers and students?",
                                    a: "Yes. The builder has custom sections for internships, projects, and achievements. The AI writer is optimized to highlight transferable skills, making it perfect for students and career switchers.",
                                },
                                {
                                    q: "Why is CVGrid considered the best and less expensive CV maker?",
                                    a: "CVGrid is designed to be both the best AI resume builder and the most less expensive CV maker online. While other tools bind you to expensive subscriptions (like $20-$30/month), CVGrid offers a full-featured 100% free tier. Upgrading to our premium resume layouts costs only a tiny, one-time payment of ₹150 for lifetime access.",
                                },
                                {
                                    q: "What makes CVGrid the best ATS scorer and keyword generator?",
                                    a: "We provide the best ATS scorer and keyword generator built directly into our career tools suite. Our scanner scores your resume against any job description and lists the exact missing keywords and skills you need to add to pass recruiter screens.",
                                },
                            ].map((item, i) => (
                                <ScrollReveal key={i} delay={i * 80}>
                                    <details className="group glass-card rounded-2xl overflow-hidden transition-all duration-300">
                                        <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                            <span className="font-semibold text-white text-base md:text-lg" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item.q}</span>
                                            <ChevronDown className="w-5 h-5 text-[#c0c1ff] transition-transform duration-300 group-open:rotate-180" />
                                        </summary>
                                        <div className="p-6 pt-0 text-[#c7c4d7] border-t border-[rgba(255,255,255,0.06)] text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                            {item.a}
                                        </div>
                                    </details>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
