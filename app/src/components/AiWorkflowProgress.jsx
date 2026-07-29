import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function AiWorkflowProgress({ currentStep }) {
    const steps = [
        { name: "Build Resume", href: "/builder", stepNum: 1 },
        { name: "ATS Check", href: "/ats-checker", stepNum: 2 },
        { name: "Match Score", href: "/ai-tools/match-score", stepNum: 3 },
        { name: "Optimize Keywords", href: "/ai-tools/keyword-optimizer", stepNum: 4 },
        { name: "Cover Letter", href: "/cover-letter", stepNum: 5 },
        { name: "Interview Prep", href: "/ai-tools/interview-generator", stepNum: 6 }
    ];

    return (
        <div className="container py-4" style={{ zIndex: 10, position: "relative" }}>
            <div 
                className="d-flex justify-content-between align-items-center flex-wrap px-4 py-3 rounded-2xl" 
                style={{ 
                    background: "rgba(15, 18, 32, 0.4)", 
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(8px)"
                }}
            >
                <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7", boxShadow: "0 0 10px #a855f7" }}></div>
                    <span className="small fw-bold text-white-50 uppercase tracking-wider" style={{ fontSize: "0.72rem" }}>CVGrid AI Workflow Suite</span>
                </div>
                
                <div className="d-flex align-items-center flex-wrap gap-2 gap-md-3" style={{ fontSize: "0.8rem" }}>
                    {steps.map((st, i) => {
                        const isActive = currentStep === st.stepNum;
                        const isCompleted = currentStep > st.stepNum;
                        
                        return (
                            <React.Fragment key={st.stepNum}>
                                <Link 
                                    href={st.href}
                                    className="no-underline d-inline-flex align-items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all"
                                    style={{
                                        color: isActive ? "#fff" : isCompleted ? "#34d399" : "rgba(255,255,255,0.4)",
                                        background: isActive ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)" : "transparent",
                                        border: isActive ? "1px solid rgba(168, 85, 247, 0.2)" : "1px solid transparent",
                                        fontWeight: isActive ? "700" : "500"
                                    }}
                                >
                                    {isCompleted ? (
                                        <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: "rgba(52, 211, 153, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", fontSize: "0.6rem" }}>
                                            <Check size={8} strokeWidth={3} />
                                        </div>
                                    ) : (
                                        <span className="small opacity-50">{st.stepNum}.</span>
                                    )}
                                    <span>{st.name}</span>
                                </Link>
                                {i < steps.length - 1 && (
                                    <span className="text-white-30 d-none d-sm-inline" style={{ opacity: 0.35 }}>→</span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
