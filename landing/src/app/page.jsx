"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import Script from "next/script";

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
                    background-color: #08080c !important;
                    color: #e4e0f1 !important;
                    overflow-x: hidden;
                }
                .hero-gradient-bg {
                    background: radial-gradient(circle at 75% 25%, #14162e 0%, #08080c 65%, #030409 100%);
                }
                .ai-gradient-text {
                    background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .ai-gradient-bg {
                    background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
                }
                .glass-card {
                    background: rgba(17, 17, 30, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
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
                details[open] summary .faq-icon-toggle {
                    transform: rotate(45deg);
                }
                .faq-icon-toggle {
                    transition: transform 0.2s ease;
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

            <div className="bg-[#12121d] text-[#e4e0f1] min-h-screen" style={{ opacity: tailwindLoaded ? 1 : 0, transition: "opacity 0.25s ease-in" }}>
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

                                <h1 className="text-[40px] md:text-[60px] leading-[1.05] mb-4 font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                    The <span className="font-light italic">Future</span> of your <br />
                                    <span className="font-bold ai-gradient-text">{typewriterText}</span> starts here.
                                </h1>

                                <p className="text-base md:text-lg text-[#c7c4d7] mb-6 max-w-[580px]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Engineered for modern recruitment. Use our neural-powered engine to generate ATS-proof resumes that recruiters actually want to read.
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                                    <button
                                        onClick={handleStartResume}
                                        className="ai-gradient-bg text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 group glow-hover transition-all active:scale-95 border-0 cursor-pointer"
                                    >
                                        <span className="text-base">Build My Resume</span>
                                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">trending_flat</span>
                                    </button>
                                </div>
                            </div>

                            {/* Visual Right */}
                            <div className="lg:col-span-5 relative h-full flex items-center justify-center lg:justify-end">
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
                            </div>

                        </div>
                    </section>

                    {/* Bento Features */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Precision Tools for Professionals</h2>
                            <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Our comprehensive toolkit is designed to optimize your resume, generate portfolios, and prepare you for interviews.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Card 1 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">psychology</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Best Free AI Resume Maker</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Generate impactful summaries and action-oriented bullet points with the best free AI resume maker online.
                                </p>
                                <button onClick={handleStartResume} className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold bg-transparent border-0 p-0 group-hover:gap-4 transition-all cursor-pointer" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Start Writing <span className="material-symbols-outlined text-[18px]">east</span>
                                </button>
                            </div>

                            {/* Card 2 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 border-indigo-500/20 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">fact_check</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Best ATS Scorer & Match Checker</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Compare your resume against descriptions and identify keyword gaps with our precision best ATS scorer.
                                </p>
                                <a href="https://app.cvgrid.in/ats-checker" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all no-underline" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Scan My CV <span className="material-symbols-outlined text-[18px]">east</span>
                                </a>
                            </div>

                            {/* Card 3 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">share</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Smart URL Sharing</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Set custom handles, password locks, and track detailed real-time visitor counts and downloads.
                                </p>
                                <a href="https://app.cvgrid.in/login" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all no-underline" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Share Resume <span className="material-symbols-outlined text-[18px]">east</span>
                                </a>
                            </div>

                            {/* Card 4 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">percent</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>ATS Keywords Highlighter & Score</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Find match percentages, highlight missing ATS keywords, and get recommendations to optimize your CV.
                                </p>
                                <a href="https://app.cvgrid.in/login" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all no-underline" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Get Match Score <span className="material-symbols-outlined text-[18px]">east</span>
                                </a>
                            </div>

                            {/* Card 5 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">language</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Affordable AI Portfolio Builder</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Convert your resume into a website. The most affordable, less expensive portfolio builder to download source code.
                                </p>
                                <a href="https://app.cvgrid.in/login" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all no-underline" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Build Portfolio <span className="material-symbols-outlined text-[18px]">east</span>
                                </a>
                            </div>

                            {/* Card 6 */}
                            <div className="glass-card p-8 rounded-2xl flex flex-col items-start gap-4 hover:border-[#c0c1ff] transition-all group cursor-default">
                                <div className="p-4 rounded-xl bg-[#c0c1ff]/10 text-[#c0c1ff]">
                                    <span className="material-symbols-outlined text-[32px]">forum</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>AI Interview Coach</h3>
                                <p className="text-[#c7c4d7] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Get personalized interview questions and recommended answers based on your target role.
                                </p>
                                <a href="https://app.cvgrid.in/login" className="mt-4 flex items-center gap-2 text-[#c0c1ff] font-semibold group-hover:gap-4 transition-all no-underline" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                    Practice Now <span className="material-symbols-outlined text-[18px]">east</span>
                                </a>
                            </div>

                        </div>
                    </section>

                    {/* Testimonials Section (Wall of Love) */}
                    <section className="px-4 md:px-8 py-24 max-w-[1280px] mx-auto border-t border-white/5">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                                Loved by Career Builders
                            </h2>
                            <p className="text-base md:text-lg text-[#c7c4d7] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                See how CVGrid helps freshers and professionals optimize their resumes and land interviews.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((item, i) => (
                                <div key={i} className="glass-card p-8 rounded-2xl flex flex-col justify-between gap-6 border border-indigo-500/10 hover:border-[#c0c1ff] transition-all group duration-300">
                                    <div>
                                        {/* Stars */}
                                        <div className="flex gap-1 mb-4 text-[#ffb400]">
                                            {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                                                <span key={idx} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            ))}
                                        </div>
                                        {/* Feedback */}
                                        <p className="text-[#e4e0f1] text-[15px] leading-relaxed italic" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                            "{item.feedback}"
                                        </p>
                                    </div>
                                    {/* User Details */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                        <div className="w-9 h-9 rounded-full bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff] font-bold text-sm">
                                            {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                                        </div>
                                        <div>
                                            <div className="text-[14px] font-bold text-white">{item.userName || "Verified User"}</div>
                                            <div className="text-[11px] text-[#c7c4d7]">{item.role || "Job Seeker"}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="px-4 md:px-8 py-16">
                        <div className="max-w-[1280px] mx-auto ai-gradient-bg rounded-[32px] p-12 md:p-20 relative overflow-hidden cta-text-align">
                            <div className="absolute right-0 top-0 w-full h-full bg-black/20 backdrop-blur-[2px] -z-0"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="max-w-2xl">
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>Ready to land your dream interview?</h2>
                                    <p className="text-white/80 text-lg md:text-xl mb-0" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        Join 10,000+ job seekers who leveled up their career with CVGrid. Create your resume now.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-6">
                                    <button
                                        onClick={handleStartResume}
                                        className="bg-white text-[#12121d] font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95 border-0 cursor-pointer"
                                    >
                                        Get Started Now
                                    </button>
                                    <div className="flex items-center gap-2 text-white/70 text-sm">
                                        <span className="material-symbols-outlined text-[18px]">lock</span>
                                        No credit card required
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="px-4 md:px-8 py-16 max-w-3xl mx-auto" id="faq">
                        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>FAQs</h2>
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
                             ].map((item, i) => (
                                <details key={i} className="group glass-card rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.1)] transition-all">
                                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                        <span className="font-semibold text-white text-base md:text-lg" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{item.q}</span>
                                        <span className="material-symbols-outlined faq-icon-toggle text-[#c0c1ff]">expand_more</span>
                                    </summary>
                                    <div className="p-6 pt-0 text-[#c7c4d7] border-t border-[rgba(255,255,255,0.1)]/30 text-sm md:text-base leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
