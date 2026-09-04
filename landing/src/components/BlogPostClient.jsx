"use client";

import React, { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";

export default function BlogPostClient({ title }) {
    const [copied, setCopied] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll > 0) {
                const currentScroll = window.scrollY;
                setScrollProgress((currentScroll / totalScroll) * 100);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const copyToClipboard = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            {/* Reading progress bar */}
            <div 
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #6366f1, #a855f7)",
                    width: `${scrollProgress}%`,
                    zIndex: 9999,
                    transition: "width 0.1s ease-out"
                }}
            />

            {/* Share action button */}
            <button 
                onClick={copyToClipboard}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-200"
            >
                {copied ? (
                    <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Link Copied to Clipboard!</span>
                    </>
                ) : (
                    <>
                        <Share2 size={14} className="text-indigo-400" />
                        <span>Share This Article</span>
                    </>
                )}
            </button>
        </>
    );
}
