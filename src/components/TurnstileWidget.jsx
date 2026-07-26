"use client";

import React, { useEffect, useRef } from "react";

export default function TurnstileWidget({ onVerify, action, theme = "dark" }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        let active = true;

        const renderWidget = () => {
            if (!active) return;
            if (window.turnstile) {
                try {
                    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAD-KuxPcfMlpitGe";
                    
                    // If a widget was already rendered in this container, remove it first
                    if (widgetIdRef.current) {
                        window.turnstile.remove(widgetIdRef.current);
                        widgetIdRef.current = null;
                    }

                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        theme: theme,
                        action: action,
                        callback: (token) => {
                            if (active) onVerify(token);
                        },
                        "expired-callback": () => {
                            if (active) onVerify(null);
                        },
                        "error-callback": () => {
                            if (active) onVerify(null);
                        }
                    });
                } catch (err) {
                    console.error("Error rendering Turnstile widget:", err);
                }
            }
        };

        if (window.turnstile) {
            renderWidget();
        } else {
            // Check if script is loaded every 100ms
            const interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    renderWidget();
                }
            }, 100);
            return () => {
                active = false;
                clearInterval(interval);
                if (widgetIdRef.current && window.turnstile) {
                    window.turnstile.remove(widgetIdRef.current);
                }
            };
        }

        return () => {
            active = false;
            if (widgetIdRef.current && window.turnstile) {
                // Wrap in a try-catch in case the element has already been destroyed or cleaned up
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (e) {
                    // Ignore
                }
            }
        };
    }, [action, theme, onVerify]);

    return (
        <div className="flex justify-center my-4">
            <div ref={containerRef} className="cf-turnstile" />
        </div>
    );
}
