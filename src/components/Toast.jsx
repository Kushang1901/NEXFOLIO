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

            // Auto-dismiss after 3.5 seconds
            setTimeout(() => {
                setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
            }, 3500);
        };

        window.addEventListener("show-toast", handleShowToast);
        return () => window.removeEventListener("show-toast", handleShowToast);
    }, []);

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container position-fixed top-0 end-0 p-4" style={{ zIndex: 99999 }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-toast {
                    min-width: 320px;
                    max-width: 400px;
                    background: rgba(28, 32, 39, 0.85) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(142, 144, 160, 0.25) !important;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    color: #dfe2ed;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35) !important;
                    animation: toast-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 12px;
                    position: relative;
                    overflow: hidden;
                }
                .custom-toast::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 5px;
                }
                .custom-toast-success::before {
                    background-color: #10b981;
                }
                .custom-toast-error::before {
                    background-color: #ef4444;
                }
                .custom-toast-info::before {
                    background-color: #3b82f6;
                }
                .custom-toast-success .toast-icon {
                    color: #10b981;
                }
                .custom-toast-error .toast-icon {
                    color: #ef4444;
                }
                .custom-toast-info .toast-icon {
                    color: #3b82f6;
                }
                .toast-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }
                .toast-message {
                    font-size: 0.95rem;
                    font-weight: 500;
                    flex-grow: 1;
                    line-height: 1.4;
                }
                .toast-close-btn {
                    background: transparent;
                    border: none;
                    color: #8e90a0;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.15s;
                    flex-shrink: 0;
                }
                .toast-close-btn:hover {
                    color: #dfe2ed;
                }
                @keyframes toast-slide-in {
                    from {
                        transform: translateX(120%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            ` }} />
            
            {toasts.map((toast) => {
                let iconClass = "fas fa-check-circle";
                if (toast.type === "error") iconClass = "fas fa-exclamation-circle";
                if (toast.type === "info") iconClass = "fas fa-info-circle";

                return (
                    <div 
                        key={toast.id} 
                        className={`custom-toast custom-toast-${toast.type} shadow`}
                    >
                        <i className={`${iconClass} toast-icon`} style={{ verticalAlign: "middle" }}></i>
                        <div className="toast-message">{toast.message}</div>
                        <button 
                            onClick={() => removeToast(toast.id)} 
                            className="toast-close-btn"
                        >
                            <i className="fas fa-times" style={{ fontSize: "1.1rem" }}></i>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
