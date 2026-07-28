"use client";

import React, { useEffect, useRef } from "react";

export default function TurnstileWidget({ onVerify, action, theme = "dark" }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onVerifyRef = useRef(onVerify);

    // Keep the callback ref updated on every render
    useEffect(() => {
        onVerifyRef.current = onVerify;
    }, [onVerify]);

    useEffect(() => {
        let active = true;
        let interval = null;

        const renderWidget = () => {
            if (!active) return;
            if (window.turnstile) {
                try {
                    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAD-KuxPcfMlpitGe";
                    
                    // If a widget was already rendered in this container, remove it first
                    if (widgetIdRef.current) {
                        try {
                            window.turnstile.remove(widgetIdRef.current);
                        } catch (e) {}
                        widgetIdRef.current = null;
                    }

                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        theme: theme,
                        action: action,
                        callback: (token) => {
                            if (active && onVerifyRef.current) onVerifyRef.current(token);
                        },
                        "expired-callback": () => {
                            if (active && onVerifyRef.current) onVerifyRef.current(null);
                        },
                        "error-callback": () => {
                            if (active && onVerifyRef.current) onVerifyRef.current(null);
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
            interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    renderWidget();
                }
            }, 100);
        }

        return () => {
            active = false;
            if (interval) clearInterval(interval);
            if (widgetIdRef.current && window.turnstile) {
                // Wrap in a try-catch in case the element has already been destroyed or cleaned up
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (e) {
                    // Ignore
                }
                widgetIdRef.current = null;
            }
        };
    }, [action, theme]); // Dependency onVerify removed to avoid widget recreation

    return (
        <div className="flex justify-center my-4">
            <div ref={containerRef} className="cf-turnstile" />
        </div>
    );
}
