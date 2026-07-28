"use client";

import React, { useState, useEffect } from "react";
import { Star, X, Check, Loader2 } from "lucide-react";

export default function ReviewModal({ isOpen, onClose, userEmail, initialUserName }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState("");
    const [feedback, setFeedback] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1 = form, 2 = success

    // Pre-fill name when prop is available
    useEffect(() => {
        if (initialUserName) {
            setName(initialUserName);
        }
    }, [initialUserName]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || rating === 0) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email: userEmail || "",
                    rating,
                    feedback,
                    isPublic: rating >= 4 ? isPublic : false
                })
            });

            if (response.ok) {
                // Set localStorage so they aren't asked again
                localStorage.setItem("cvgrid_has_reviewed", "true");
                setStep(2);
            } else {
                alert("Failed to submit feedback. Please try again.");
            }
        } catch (err) {
            console.error("Error submitting feedback:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDismiss = () => {
        // Set localStorage on dismiss too, so they aren't nagged constantly
        localStorage.setItem("cvgrid_has_reviewed", "true");
        onClose();
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                {/* Close Button */}
                <button onClick={handleDismiss} style={closeBtnStyle} aria-label="Close">
                    <X size={20} />
                </button>

                {step === 1 ? (
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={headerStyle}>
                            <h2 style={titleStyle}>Enjoying CVGrid?</h2>
                            <p style={subtitleStyle}>
                                {rating > 0 && rating <= 3 
                                    ? "We value your input. How can we make it better?" 
                                    : "We'd love to hear your feedback! Help us improve."}
                            </p>
                        </div>

                        {/* Interactive Stars */}
                        <div style={starsContainerStyle}>
                            {[1, 2, 3, 4, 5].map((starIdx) => {
                                const active = hoverRating ? starIdx <= hoverRating : starIdx <= rating;
                                return (
                                    <button
                                        key={starIdx}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(starIdx)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(starIdx)}
                                        style={starBtnStyle}
                                    >
                                        <Star
                                            size={36}
                                            fill={active ? "#ffb400" : "none"}
                                            stroke={active ? "#ffb400" : "rgba(255,255,255,0.3)"}
                                            style={{
                                                transition: "all 0.2s ease-in-out",
                                                filter: active ? "drop-shadow(0 0 6px rgba(255, 180, 0, 0.6))" : "none"
                                            }}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Input Fields (Only display once rating is selected) */}
                        {rating > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", animation: "fadeIn 0.3s ease-in-out" }}>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Your Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Jane Doe"
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Your Feedback</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Write your review here... What did you like or what can we improve?"
                                        rows={3}
                                        style={textareaStyle}
                                    />
                                </div>

                                {/* Consent Checkbox - Only for 4 and 5 stars */}
                                {rating >= 4 && (
                                    <label style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                            style={checkboxStyle}
                                        />
                                        <span>Show my review publicly on CVGrid's Wall of Love</span>
                                    </label>
                                )}

                                <button type="submit" disabled={isSubmitting || !name} style={submitBtnStyle}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" style={{ marginRight: "8px" }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                ) : (
                    <div style={successContainerStyle}>
                        <div style={successIconWrapperStyle}>
                            <Check size={36} color="#4ade80" />
                        </div>
                        <h2 style={successTitleStyle}>Thank You!</h2>
                        <p style={successSubtitleStyle}>
                            {rating >= 4 
                                ? "Your review has been saved. We appreciate your support in making CVGrid better!" 
                                : "Thank you for your valuable feedback. We'll work hard to improve your experience."}
                        </p>
                        <button onClick={onClose} style={closeSuccessBtnStyle}>
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Inline Styles ──
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    fontFamily: "var(--font-inter), sans-serif",
};

const modalStyle = {
    position: "relative",
    width: "480px",
    maxWidth: "calc(100vw - 32px)",
    backgroundColor: "#11111e",
    border: "1px solid rgba(192, 193, 255, 0.15)",
    borderRadius: "20px",
    padding: "36px 30px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 2px rgba(192, 193, 255, 0.2) inset",
    color: "#ffffff",
    overflow: "hidden",
};

const closeBtnStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "transparent",
    border: "none",
    color: "rgba(255, 255, 255, 0.5)",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    width: "100%",
};

const headerStyle = {
    textAlign: "center",
};

const titleStyle = {
    fontSize: "1.6rem",
    fontWeight: "700",
    margin: "0 0 8px 0",
    color: "#ffffff",
    fontFamily: "var(--font-space-grotesk), sans-serif",
};

const subtitleStyle = {
    fontSize: "0.95rem",
    color: "#c7c4d7",
    margin: 0,
    lineHeight: "1.4",
};

const starsContainerStyle = {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    margin: "8px 0",
};

const starBtnStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    outline: "none",
};

const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
};

const labelStyle = {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#c0c1ff",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
};

const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(192, 193, 255, 0.15)",
    color: "#ffffff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
};

const textareaStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(192, 193, 255, 0.15)",
    color: "#ffffff",
    fontSize: "0.95rem",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    transition: "all 0.2s",
};

const checkboxLabelStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "0.85rem",
    color: "#c7c4d7",
    cursor: "pointer",
    userSelect: "none",
    lineHeight: "1.4",
};

const checkboxStyle = {
    marginTop: "3px",
    cursor: "pointer",
};

const submitBtnStyle = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "0.95rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const successContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px 0 10px 0",
};

const successIconWrapperStyle = {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    border: "2px solid rgba(74, 222, 128, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
};

const successTitleStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    margin: "0 0 12px 0",
    color: "#ffffff",
    fontFamily: "var(--font-space-grotesk), sans-serif",
};

const successSubtitleStyle = {
    fontSize: "0.95rem",
    color: "#c7c4d7",
    margin: "0 0 28px 0",
    lineHeight: "1.5",
};

const closeSuccessBtnStyle = {
    width: "150px",
    padding: "12px 20px",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s",
};
