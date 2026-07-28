"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscribeToAuthChanges } from "../authState";

export default function AppIndexPage() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            if (user) {
                router.replace("/my-resumes");
            } else {
                router.replace("/login");
            }
        });
        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, [router]);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#0d0e12",
            color: "#a0aed0",
            fontFamily: "system-ui, sans-serif"
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid #8b5cf6",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 16px"
                }}></div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <p>Loading CVGrid App...</p>
            </div>
        </div>
    );
}
