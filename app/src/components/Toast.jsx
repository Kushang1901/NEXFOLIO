"use client";

import React, { useState, useEffect } from "react";

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleShowToast = (e) => {
            const { message, type } = e.detail;
            const id = Date.now() + Math.random().toString(36).substr(2, 9);
            
            setToasts((prevToasts) => [
                ...prevToasts,
                { id, message, type: type || "success" }
            ]);

            // Auto-dismiss after 4 seconds
            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
            }, 4000);
        };

        window.addEventListener("show-toast", handleShowToast);
        return () => window.removeEventListener("show-toast", handleShowToast);
    }, []);

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container position-fixed top-0 end-0 p-4" style={{ zIndex: 99999, display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-toast {
                    min-width: 320px;
                    max-width: 400px;
                    background: rgba(15, 19, 27, 0.75) !important;
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                    border-radius: 14px;
                    padding: 1rem 1.25rem;
                    color: #dfe2ed;
                    position: relative;
                    overflow: hidden;
                    animation: toast-slide-in-glass 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.5) !important;
                }
                
                .custom-toast-success {
                    border: 1px solid rgba(34, 197, 94, 0.25) !important;
                    box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 197, 94, 0.05) !important;
                }
                
                .custom-toast-error {
                    border: 1px solid rgba(239, 68, 68, 0.25) !important;
                    box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.05) !important;
                }
                
                .custom-toast-info {
                    border: 1px solid rgba(59, 130, 246, 0.25) !important;
                    box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.05) !important;
                }

                .toast-icon-wrapper {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .custom-toast-success .toast-icon-wrapper {
                    background: rgba(34, 197, 94, 0.15);
                    color: #4ade80;
                }
                
                .custom-toast-error .toast-icon-wrapper {
                    background: rgba(239, 68, 68, 0.15);
                    color: #f87171;
                }
                
                .custom-toast-info .toast-icon-wrapper {
                    background: rgba(59, 130, 246, 0.15);
                    color: #60a5fa;
                }

                .toast-message {
                    font-size: 0.85rem;
                    font-weight: 500;
                    flex-grow: 1;
                    line-height: 1.4;
                    font-family: 'Inter', sans-serif;
                }
                
                .toast-close-btn {
                    background: transparent;
                    border: none;
                    color: #8e90a0;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                
                .toast-close-btn:hover {
                    color: #dfe2ed;
                    background: rgba(255, 255, 255, 0.08);
                }

                /* Shrinking Progress Bar */
                .toast-progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2.5px;
                    width: 100%;
                    transform-origin: left;
                    animation: toast-progress-shrink 4s linear forwards;
                }
                
                .custom-toast-success .toast-progress-bar {
                    background: linear-gradient(90deg, #22c55e, #4ade80);
                }
                
                .custom-toast-error .toast-progress-bar {
                    background: linear-gradient(90deg, #ef4444, #f87171);
                }
                
                .custom-toast-info .toast-progress-bar {
                    background: linear-gradient(90deg, #3b82f6, #60a5fa);
                }

                @keyframes toast-slide-in-glass {
                    from {
                        transform: translateY(-20px) scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                }

                @keyframes toast-progress-shrink {
                    from {
                        transform: scaleX(1);
                    }
                    to {
                        transform: scaleX(0);
                    }
                }
            ` }} />
            
            {toasts.map((toast) => {
                let icon = (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="10" cy="10" r="9" />
                        <path d="M6 10.5l2.5 2.5 5.5-5.5" />
                    </svg>
                );
                
                if (toast.type === "error") {
                    icon = (
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="10" cy="10" r="9" />
                            <line x1="10" y1="6" x2="10" y2="11" />
                            <line x1="10" y1="14" x2="10.01" y2="14" />
                        </svg>
                    );
                } else if (toast.type === "info") {
                    icon = (
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="10" cy="10" r="9" />
                            <line x1="10" y1="14" x2="10" y2="9" />
                            <line x1="10" y1="6" x2="10.01" y2="6" />
                        </svg>
                    );
                }

                return (
                    <div 
                        key={toast.id} 
                        className={`custom-toast custom-toast-${toast.type}`}
                    >
                        <div className="toast-icon-wrapper">
                            {icon}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button 
                            onClick={() => removeToast(toast.id)} 
                            className="toast-close-btn"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <div className="toast-progress-bar" />
                    </div>
                );
            })}
        </div>
    );
}
