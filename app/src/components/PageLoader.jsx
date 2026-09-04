"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef(null);
    const safetyTimerRef = useRef(null);
    const progressRef = useRef(null);
    const prevPathname = useRef(pathname);

    const startLoading = () => {
        // Clear any existing timers
        clearTimeout(timerRef.current);
        clearTimeout(safetyTimerRef.current);
        clearInterval(progressRef.current);

        setProgress(0);
        setVisible(true);
        setLoading(true);

        // Safety timeout: auto dismiss if navigation hangs or is cancelled
        safetyTimerRef.current = setTimeout(() => {
            finishLoading();
        }, 3500);

        // Animate progress bar from 0 → ~85% over ~600ms
        let current = 0;
        progressRef.current = setInterval(() => {
            current += Math.random() * 15 + 5;
            if (current >= 85) {
                current = 85;
                clearInterval(progressRef.current);
            }
            setProgress(current);
        }, 80);
    };

    const finishLoading = () => {
        clearTimeout(safetyTimerRef.current);
        clearInterval(progressRef.current);

        // Shoot to 100%
        setProgress(100);

        // After bar completes, fade out
        timerRef.current = setTimeout(() => {
            setLoading(false);
            // Keep visible briefly for fade-out CSS transition
            timerRef.current = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 400);
        }, 300);
    };

    useEffect(() => {
        if (prevPathname.current !== pathname) {
            prevPathname.current = pathname;
            // Route changed — finish loading
            finishLoading();
        }
    }, [pathname]);

    // Intercept Next.js link clicks to start loader immediately
    useEffect(() => {
        const handleClick = (e) => {
            const anchor = e.target.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            // Only trigger for internal navigation links (not external, not hash links)
            const isInternal = href.startsWith("/") && !href.startsWith("//");
            const isSamePage = href === pathname || href === window.location.pathname;
            const hasTarget = anchor.target && anchor.target !== "_self";
            const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

            if (isInternal && !isSamePage && !hasTarget && !isModifiedClick) {
                startLoading();
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [pathname]);

    // Safety cleanup
    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
            clearTimeout(safetyTimerRef.current);
            clearInterval(progressRef.current);
        };
    }, []);

    if (!visible) return null;

    return (
        <>
            {/* Top progress bar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    zIndex: 99999,
                    background: "transparent",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #c084fc)",
                        transition: progress === 100
                            ? "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            : "width 0.08s linear",
                        borderRadius: "0 4px 4px 0",
                        boxShadow: "0 0 12px rgba(139, 92, 246, 0.8), 0 0 24px rgba(139, 92, 246, 0.4)",
                        opacity: loading ? 1 : 0,
                        transitionProperty: "width, opacity",
                    }}
                />
                {/* Glowing orb at the tip */}
                {loading && progress > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: `${progress}%`,
                            transform: "translate(-50%, -50%)",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#a855f7",
                            boxShadow: "0 0 8px 3px rgba(168, 85, 247, 0.9), 0 0 20px 6px rgba(168, 85, 247, 0.4)",
                            transition: progress === 100
                                ? "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                : "left 0.08s linear",
                        }}
                    />
                )}
            </div>

            {/* Subtle overlay — adds depth without blocking UI */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 99990,
                    background: "rgba(0, 0, 0, 0.08)",
                    backdropFilter: "blur(1px)",
                    WebkitBackdropFilter: "blur(1px)",
                    pointerEvents: "none",
                    opacity: loading ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Center spinner — shows when loading takes > 300ms */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 99995,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    opacity: loading ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
            >
                <div style={{ position: "relative", width: "48px", height: "48px" }}>
                    {/* Outer ring */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "3px solid rgba(139, 92, 246, 0.15)",
                            borderTopColor: "#8b5cf6",
                            animation: "cvgrid-spin 0.8s linear infinite",
                        }}
                    />
                    {/* Inner ring */}
                    <div
                        style={{
                            position: "absolute",
                            inset: "8px",
                            borderRadius: "50%",
                            border: "2px solid rgba(168, 85, 247, 0.1)",
                            borderTopColor: "#c084fc",
                            animation: "cvgrid-spin-reverse 1.2s linear infinite",
                        }}
                    />
                    {/* Center dot */}
                    <div
                        style={{
                            position: "absolute",
                            inset: "18px",
                            borderRadius: "50%",
                            background: "#a855f7",
                            boxShadow: "0 0 8px rgba(168, 85, 247, 0.8)",
                            animation: "cvgrid-pulse 1s ease-in-out infinite",
                        }}
                    />
                </div>
            </div>

            {/* Keyframe animations injected inline */}
            <style>{`
                @keyframes cvgrid-spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes cvgrid-spin-reverse {
                    to { transform: rotate(-360deg); }
                }
                @keyframes cvgrid-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.7; }
                }
            `}</style>
        </>
    );
}
