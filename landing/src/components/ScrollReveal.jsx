"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
    children,
    className = "",
    animationClass = "opacity-0 translate-y-8",
    activeClass = "opacity-100 translate-y-0",
    transitionClass = "transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)",
    threshold = 0.1,
    rootMargin = "0px",
    delay = 0
}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Stop observing once visible to keep animation persistent
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold, rootMargin]);

    return (
        <div
            ref={ref}
            className={`${transitionClass} ${isVisible ? activeClass : animationClass} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
