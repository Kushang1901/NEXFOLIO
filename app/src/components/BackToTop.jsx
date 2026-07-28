"use client";

import React, { useState, useEffect } from "react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <>
            <button
                onClick={scrollToTop}
                className={`back-to-top-btn no-print ${isVisible ? "visible" : ""}`}
                aria-label="Back to top"
            >
                <i className="fas fa-arrow-up"></i>
            </button>

            <style>{`
                .back-to-top-btn {
                    position: fixed;
                    bottom: 30px;
                    left: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: rgba(15, 18, 32, 0.7) !important;
                    border: 1.5px solid rgba(99, 102, 241, 0.3) !important;
                    color: #818cf8 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(15px) scale(0.9);
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(12px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(99, 102, 241, 0.05);
                    z-index: 9999;
                    outline: none;
                }

                .back-to-top-btn:hover {
                    background: rgba(99, 102, 241, 0.15) !important;
                    border-color: rgba(99, 102, 241, 0.65) !important;
                    color: #fff !important;
                    transform: translateY(-3px) scale(1.06) !important;
                    box-shadow: 0 12px 36px rgba(99, 102, 241, 0.25), 0 0 20px rgba(99, 102, 241, 0.15);
                }

                .back-to-top-btn:active {
                    transform: translateY(0) scale(0.95) !important;
                }

                .back-to-top-btn.visible {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                }
            `}</style>
        </>
    );
}
