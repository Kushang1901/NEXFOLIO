"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── SVG ICONS ─────────────────────────────────────────────────────────────
const GrivoIcon = ({ size = 24, style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={style}>
        <defs>
            <linearGradient id="grivo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <rect width="36" height="36" rx="10" fill="url(#grivo-grad)" />
        <rect x="8" y="10" width="4" height="4" rx="1" fill="white" />
        <rect x="24" y="10" width="4" height="4" rx="1" fill="white" />
        <rect x="6" y="18" width="24" height="10" rx="5" fill="white" opacity="0.9" />
        <circle cx="12" cy="23" r="2" fill="#6366f1" />
        <circle cx="18" cy="23" r="2" fill="#8b5cf6" />
        <circle cx="24" cy="23" r="2" fill="#6366f1" />
        <path d="M13 10 L18 6 L23 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
);

const SendIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PaperclipIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21.44 11.05L12.25 20.24C10.06 22.43 6.48 22.43 4.29 20.24C2.1 18.05 2.1 14.47 4.29 12.28L13.48 3.09C14.92 1.65 17.25 1.65 18.69 3.09C20.13 4.53 20.13 6.86 18.69 8.3L9.5 17.49C8.78 18.21 7.62 18.21 6.9 17.49C6.18 16.77 6.18 15.61 6.9 14.89L15.07 6.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MinimizeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const UploadIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.09 8.26L20.5 9.27L16 13.72L17.09 20.13L12 17.27L6.91 20.13L8 13.72L3.5 9.27L9.91 8.26L12 2Z" fill="currentColor" />
    </svg>
);

// ─── TYPING INDICATOR ───────────────────────────────────────────────────────
const TypingIndicator = () => (
    <div style={styles.typingBubble}>
        <GrivoIcon size={20} />
        <div style={styles.typingDots}>
            <span style={{ ...styles.dot, animationDelay: "0ms" }} />
            <span style={{ ...styles.dot, animationDelay: "200ms" }} />
            <span style={{ ...styles.dot, animationDelay: "400ms" }} />
        </div>
    </div>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function GrivoChat() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipHidden, setTooltipHidden] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(null); // { name, size, status }
    const [isDragging, setIsDragging] = useState(false);
    const [userName, setUserName] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [panelVisible, setPanelVisible] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const hasAddedWelcome = useRef(false);

    // Get user name from session storage
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem("userInfo");
            if (stored) {
                const info = JSON.parse(stored);
                if (info?.name || info?.firstName) {
                    setUserName(info.name || info.firstName);
                }
            }
        } catch { /* ignore */ }

        // Show tooltip after 1.5s
        const timer1 = setTimeout(() => {
            if (!tooltipHidden) setShowTooltip(true);
        }, 1500);
        const timer2 = setTimeout(() => {
            setShowTooltip(false);
            setTooltipHidden(true);
        }, 8000);

        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // Add welcome message when opened for first time
    useEffect(() => {
        if (isOpen && !hasAddedWelcome.current) {
            hasAddedWelcome.current = true;
            const greeting = userName
                ? `Hi ${userName}! 👋 I'm **GRIVO**, your CVGrid AI assistant. I can help you build a stellar resume, check your ATS score, find missing keywords, and much more. You can also share your resume and I'll give you personalized feedback!\n\nWhat can I help you with today?`
                : `Hi there! 👋 I'm **GRIVO**, your CVGrid AI assistant. I can help you build a stellar resume, check your ATS score, find missing keywords, generate cover letters, and much more.\n\nYou can also share your resume file (PDF/DOCX) and I'll give you detailed feedback!\n\nWhat would you like to do today?`;

            setMessages([{
                id: Date.now(),
                role: "assistant",
                content: greeting,
                action: null,
                timestamp: new Date(),
            }]);
        }
    }, [isOpen, userName]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    // Panel open animation
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setPanelVisible(true), 10);
        } else {
            setPanelVisible(false);
        }
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setShowTooltip(false);
        setTooltipHidden(true);
        setUnreadCount(0);
    };

    const handleClose = () => {
        setPanelVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    };

    const sendMessage = useCallback(async (content, mode = "chat", extraData = {}) => {
        if (!content && mode === "chat") return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: content || "I've shared my resume for analysis.",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const allMessages = [...messages, userMsg];
            const payload = mode === "resume"
                ? { mode: "resume", messages: allMessages, ...extraData, userInfo: { name: userName } }
                : { mode: "chat", messages: allMessages, userInfo: { name: userName } };

            const res = await fetch("/api/grivo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "GRIVO is unavailable");

            const botMsg = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.message || "I'm not sure I understood that. Could you rephrase?",
                action: data.action || null,
                issues: data.issues || [],
                strengths: data.strengths || [],
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
            if (!isOpen) setUnreadCount((c) => c + 1);

        } catch (err) {
            setMessages((prev) => [...prev, {
                id: Date.now() + 2,
                role: "assistant",
                content: "Oops! I hit a snag. Please try again in a moment. 🔧",
                action: null,
                timestamp: new Date(),
            }]);
        } finally {
            setIsTyping(false);
            setUploadingFile(null);
        }
    }, [messages, isOpen, userName]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed || isTyping) return;
        sendMessage(trimmed);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ── FILE HANDLING ───────────────────────────────────────────────────────
    const processFile = async (file) => {
        if (!file) return;

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ];

        if (file.size > MAX_SIZE) {
            setMessages((prev) => [...prev, {
                id: Date.now(),
                role: "user",
                content: `📎 Shared: ${file.name}`,
                timestamp: new Date(),
            }, {
                id: Date.now() + 1,
                role: "assistant",
                content: `Oops! Your file **${file.name}** is ${(file.size / (1024 * 1024)).toFixed(1)}MB, which exceeds the **10MB limit**. Please compress it using an online PDF compressor (like [Smallpdf](https://smallpdf.com)) and share it again! 📦`,
                action: null,
                timestamp: new Date(),
            }]);
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setMessages((prev) => [...prev, {
                id: Date.now(),
                role: "assistant",
                content: "I can only read **PDF** or **Word (.docx)** files. Please convert your resume and try again! 📄",
                action: null,
                timestamp: new Date(),
            }]);
            return;
        }

        setUploadingFile({ name: file.name, size: file.size, status: "reading" });
        setMessages((prev) => [...prev, {
            id: Date.now(),
            role: "user",
            content: `📎 Shared resume: **${file.name}** (${(file.size / 1024).toFixed(0)}KB)`,
            timestamp: new Date(),
        }]);
        setIsTyping(true);

        try {
            const base64 = await fileToBase64(file);
            setUploadingFile((f) => f ? { ...f, status: "analyzing" } : null);
            await sendMessage(null, "resume", {
                resumeData: base64,
                resumeMimeType: file.type,
            });
        } catch {
            setMessages((prev) => [...prev, {
                id: Date.now(),
                role: "assistant",
                content: "I had trouble reading that file. Please try a different format or compress it first.",
                action: null,
                timestamp: new Date(),
            }]);
            setIsTyping(false);
            setUploadingFile(null);
        }
    };

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    // ── TEXT FORMATTING ─────────────────────────────────────────────────────
    const formatText = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            // Handle links
            if (part.includes("[") && part.includes("](")) {
                return part.split(/(\[[^\]]+\]\([^)]+\))/g).map((seg, j) => {
                    const linkMatch = seg.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (linkMatch) {
                        return <a key={j} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={styles.inlineLink}>{linkMatch[1]}</a>;
                    }
                    return seg;
                });
            }
            return part;
        });
    };

    const formatMessage = (content) => {
        if (!content) return null;
        return content.split("\n").map((line, i) => (
            <span key={i}>
                {formatText(line)}
                {i < content.split("\n").length - 1 && <br />}
            </span>
        ));
    };

    const formatTime = (date) => {
        try {
            return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch { return ""; }
    };

    // ── RENDER ──────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── GLOBAL STYLES ─────────────────── */}
            <style>{`
                @keyframes grivo-dot-pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes grivo-bubble-in {
                    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes grivo-panel-in {
                    0% { opacity: 0; transform: translateY(20px) scale(0.97); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes grivo-btn-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.6); }
                    50% { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
                }
                @keyframes grivo-msg-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes grivo-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .grivo-fab:hover {
                    transform: scale(1.08) !important;
                    box-shadow: 0 8px 30px rgba(99,102,241,0.6) !important;
                }
                .grivo-send-btn:hover {
                    background: linear-gradient(135deg, #7c3aed, #6366f1) !important;
                    transform: scale(1.05);
                }
                .grivo-attach-btn:hover { color: #6366f1 !important; }
                .grivo-action-btn:hover {
                    background: rgba(99,102,241,0.2) !important;
                    border-color: #6366f1 !important;
                    transform: translateY(-1px);
                }
                .grivo-close-btn:hover { background: rgba(255,255,255,0.1) !important; }
                .grivo-msgs::-webkit-scrollbar { width: 4px; }
                .grivo-msgs::-webkit-scrollbar-track { background: transparent; }
                .grivo-msgs::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
                .grivo-input::-webkit-scrollbar { display: none; }
                .grivo-textarea { 
                    resize: none; 
                    outline: none; 
                    background: transparent; 
                    color: #e2e8f0; 
                    width: 100%; 
                    border: none; 
                    font-family: inherit; 
                    font-size: 0.875rem;
                    line-height: 1.5;
                    scrollbar-width: none;
                }
                .grivo-textarea::placeholder { color: rgba(148,163,184,0.6); }
                .grivo-unread {
                    animation: grivo-bubble-in 0.3s ease;
                }
            `}</style>

            {/* ── TOOLTIP / INTRO BUBBLE ───────────── */}
            {showTooltip && !isOpen && (
                <div style={styles.tooltip} className="grivo-unread">
                    <div style={styles.tooltipHeader}>
                        <GrivoIcon size={22} />
                        <span style={styles.tooltipTitle}>GRIVO AI</span>
                        <button
                            onClick={() => { setShowTooltip(false); setTooltipHidden(true); }}
                            style={styles.tooltipClose}
                            aria-label="Close"
                        >
                            <CloseIcon size={14} />
                        </button>
                    </div>
                    <p style={styles.tooltipText}>
                        Hi{userName ? ` ${userName}` : ""}! I'm <strong>GRIVO</strong> — your CVGrid AI assistant. Ask me about resumes, ATS scores, keywords, and more!
                    </p>
                    <div style={styles.tooltipArrow} />
                </div>
            )}

            {/* ── FAB BUTTON ───────────────────────── */}
            <button
                className="grivo-fab"
                onClick={handleOpen}
                style={styles.fab}
                aria-label="Open GRIVO AI Chat"
            >
                <GrivoIcon size={26} />
                {unreadCount > 0 && (
                    <span style={styles.badge}>{unreadCount}</span>
                )}
            </button>

            {/* ── CHAT PANEL ───────────────────────── */}
            {isOpen && (
                <div
                    style={{
                        ...styles.panel,
                        opacity: panelVisible ? 1 : 0,
                        transform: panelVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
                        ...(isMinimized ? styles.panelMinimized : {}),
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {/* Drag overlay */}
                    {isDragging && (
                        <div style={styles.dragOverlay}>
                            <UploadIcon />
                            <span style={{ color: "#6366f1", fontWeight: 600, marginTop: 8 }}>Drop your resume here</span>
                        </div>
                    )}

                    {/* HEADER */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <div style={styles.headerIconWrap}>
                                <GrivoIcon size={28} />
                            </div>
                            <div>
                                <div style={styles.headerName}>GRIVO</div>
                                <div style={styles.headerStatus}>
                                    <span style={styles.statusDot} />
                                    <span style={styles.statusText}>AI Assistant · Online</span>
                                </div>
                            </div>
                        </div>
                        <div style={styles.headerActions}>
                            <button
                                style={styles.headerBtn}
                                className="grivo-close-btn"
                                onClick={() => setIsMinimized(!isMinimized)}
                                aria-label="Minimize"
                                title="Minimize"
                            >
                                <MinimizeIcon />
                            </button>
                            <button
                                style={styles.headerBtn}
                                className="grivo-close-btn"
                                onClick={handleClose}
                                aria-label="Close"
                                title="Close"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </div>

                    {/* Powered by bar */}
                    {!isMinimized && (
                        <div style={styles.poweredBy}>
                            <SparkleIcon />
                            <span>Powered by Google Gemini AI</span>
                        </div>
                    )}

                    {/* MESSAGES */}
                    {!isMinimized && (
                        <div className="grivo-msgs" style={styles.messages}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        ...styles.msgRow,
                                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                        animation: "grivo-msg-in 0.25s ease",
                                    }}
                                >
                                    {msg.role === "assistant" && (
                                        <div style={styles.botAvatar}><GrivoIcon size={18} /></div>
                                    )}
                                    <div style={{ maxWidth: "80%" }}>
                                        <div style={msg.role === "user" ? styles.userBubble : styles.botBubble}>
                                            <p style={styles.bubbleText}>{formatMessage(msg.content)}</p>

                                            {/* Strengths / Issues for resume analysis */}
                                            {msg.strengths?.length > 0 && (
                                                <div style={styles.listBlock}>
                                                    <div style={styles.listLabel}>✅ Strengths</div>
                                                    {msg.strengths.map((s, i) => (
                                                        <div key={i} style={styles.listItem}>• {s}</div>
                                                    ))}
                                                </div>
                                            )}
                                            {msg.issues?.length > 0 && (
                                                <div style={styles.listBlock}>
                                                    <div style={{ ...styles.listLabel, color: "#f97316" }}>⚠️ Areas to Improve</div>
                                                    {msg.issues.map((s, i) => (
                                                        <div key={i} style={styles.listItem}>• {s}</div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action navigation button */}
                                            {msg.action?.type === "navigate" && (
                                                <button
                                                    className="grivo-action-btn"
                                                    style={styles.actionBtn}
                                                    onClick={() => { router.push(msg.action.route); handleClose(); }}
                                                >
                                                    <span>{msg.action.icon || "→"}</span>
                                                    <span>{msg.action.label}</span>
                                                </button>
                                            )}
                                        </div>
                                        <div style={{
                                            ...styles.timestamp,
                                            textAlign: msg.role === "user" ? "right" : "left",
                                        }}>
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
                                    <div style={styles.botAvatar}><GrivoIcon size={18} /></div>
                                    <TypingIndicator />
                                </div>
                            )}

                            {/* Upload status */}
                            {uploadingFile && (
                                <div style={styles.uploadStatus}>
                                    <div style={styles.uploadSpinner} />
                                    <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                                        {uploadingFile.status === "reading" ? "Reading file..." : "Analyzing your resume with AI..."}
                                    </span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* INPUT BAR */}
                    {!isMinimized && (
                        <div style={styles.inputArea}>
                            <div style={styles.inputRow}>
                                {/* File attachment */}
                                <button
                                    className="grivo-attach-btn"
                                    style={styles.attachBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Share your resume (PDF/DOCX, max 10MB)"
                                    disabled={isTyping}
                                >
                                    <PaperclipIcon />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />

                                {/* Text input */}
                                <textarea
                                    ref={textareaRef}
                                    className="grivo-textarea"
                                    rows={1}
                                    placeholder="Ask GRIVO anything… or share your resume 📎"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = "auto";
                                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                                    }}
                                    onKeyDown={handleKeyDown}
                                    disabled={isTyping}
                                    style={styles.inputField}
                                />

                                {/* Send button */}
                                <button
                                    className="grivo-send-btn"
                                    style={{
                                        ...styles.sendBtn,
                                        opacity: (!input.trim() || isTyping) ? 0.5 : 1,
                                        cursor: (!input.trim() || isTyping) ? "not-allowed" : "pointer",
                                    }}
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    aria-label="Send message"
                                >
                                    <SendIcon />
                                </button>
                            </div>
                            <div style={styles.inputHint}>
                                📎 Drop a PDF/DOCX resume (max 10MB) for AI feedback · Press Enter to send
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = {
    // FAB
    fab: {
        position: "fixed",
        bottom: "28px",
        right: "28px",
        width: "58px",
        height: "58px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        animation: "grivo-btn-pulse 2.5s ease-in-out infinite",
    },
    badge: {
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "#ef4444",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        fontSize: "0.7rem",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #0a0a1a",
    },

    // TOOLTIP
    tooltip: {
        position: "fixed",
        bottom: "100px",
        right: "28px",
        width: "270px",
        background: "rgba(15,15,35,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(99,102,241,0.25)",
        borderRadius: "16px",
        padding: "14px 16px",
        zIndex: 9998,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        animation: "grivo-bubble-in 0.4s ease",
    },
    tooltipHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px",
    },
    tooltipTitle: {
        color: "#6366f1",
        fontWeight: 700,
        fontSize: "0.9rem",
        letterSpacing: "0.05em",
        flex: 1,
    },
    tooltipClose: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(148,163,184,0.7)",
        padding: "2px",
        display: "flex",
        transition: "color 0.2s",
    },
    tooltipText: {
        color: "#cbd5e1",
        fontSize: "0.82rem",
        lineHeight: 1.5,
        margin: 0,
    },
    tooltipArrow: {
        position: "absolute",
        bottom: "-8px",
        right: "26px",
        width: "14px",
        height: "14px",
        background: "rgba(15,15,35,0.96)",
        border: "1px solid rgba(99,102,241,0.25)",
        borderTop: "none",
        borderLeft: "none",
        transform: "rotate(45deg)",
    },

    // PANEL
    panel: {
        position: "fixed",
        bottom: "100px",
        right: "28px",
        width: "380px",
        maxHeight: "600px",
        background: "rgba(10,10,26,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "20px",
        zIndex: 9998,
        boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1) inset",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "opacity 0.3s ease, transform 0.3s ease",
    },
    panelMinimized: {
        maxHeight: "64px",
    },

    // DRAG OVERLAY
    dragOverlay: {
        position: "absolute",
        inset: 0,
        background: "rgba(10,10,26,0.95)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #6366f1",
        borderRadius: "20px",
        color: "#6366f1",
    },

    // HEADER
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        flexShrink: 0,
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    headerIconWrap: {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(99,102,241,0.15)",
    },
    headerName: {
        color: "#ffffff",
        fontWeight: 700,
        fontSize: "1rem",
        letterSpacing: "0.1em",
        fontFamily: "var(--font-space-grotesk, sans-serif)",
    },
    headerStatus: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "1px",
    },
    statusDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#22c55e",
        boxShadow: "0 0 6px rgba(34,197,94,0.8)",
    },
    statusText: {
        color: "#64748b",
        fontSize: "0.72rem",
    },
    headerActions: {
        display: "flex",
        gap: "4px",
    },
    headerBtn: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "rgba(148,163,184,0.7)",
        width: "30px",
        height: "30px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, color 0.2s",
    },

    // POWERED BY
    poweredBy: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 16px",
        borderBottom: "1px solid rgba(99,102,241,0.08)",
        color: "rgba(99,102,241,0.7)",
        fontSize: "0.68rem",
        letterSpacing: "0.03em",
        flexShrink: 0,
    },

    // MESSAGES
    messages: {
        flex: 1,
        overflowY: "auto",
        padding: "14px 14px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minHeight: 0,
    },
    msgRow: {
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
    },
    botAvatar: {
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        background: "rgba(99,102,241,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    userBubble: {
        background: "linear-gradient(135deg, #6366f1, #7c3aed)",
        borderRadius: "14px 14px 2px 14px",
        padding: "10px 13px",
        boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
    },
    botBubble: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px 14px 14px 2px",
        padding: "10px 13px",
    },
    bubbleText: {
        color: "#e2e8f0",
        fontSize: "0.85rem",
        lineHeight: 1.55,
        margin: 0,
        wordBreak: "break-word",
    },
    timestamp: {
        color: "rgba(100,116,139,0.7)",
        fontSize: "0.65rem",
        marginTop: "3px",
        paddingLeft: "2px",
        paddingRight: "2px",
    },

    // LISTS IN MESSAGES
    listBlock: {
        marginTop: "8px",
        paddingTop: "8px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
    },
    listLabel: {
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#22c55e",
        marginBottom: "4px",
    },
    listItem: {
        fontSize: "0.78rem",
        color: "#94a3b8",
        lineHeight: 1.5,
    },

    // ACTION BUTTON
    actionBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginTop: "10px",
        padding: "7px 12px",
        background: "rgba(99,102,241,0.12)",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: "8px",
        color: "#a5b4fc",
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        width: "100%",
        justifyContent: "center",
    },

    // INLINE LINK
    inlineLink: {
        color: "#818cf8",
        textDecoration: "underline",
    },

    // TYPING
    typingBubble: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px 14px 14px 2px",
        padding: "10px 14px",
    },
    typingDots: {
        display: "flex",
        gap: "4px",
        alignItems: "center",
    },
    dot: {
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#6366f1",
        animation: "grivo-dot-pulse 1.2s ease-in-out infinite",
    },

    // UPLOAD STATUS
    uploadStatus: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
        background: "rgba(99,102,241,0.08)",
        borderRadius: "8px",
        border: "1px solid rgba(99,102,241,0.15)",
    },
    uploadSpinner: {
        width: "14px",
        height: "14px",
        border: "2px solid rgba(99,102,241,0.3)",
        borderTop: "2px solid #6366f1",
        borderRadius: "50%",
        animation: "grivo-spin 0.8s linear infinite",
        flexShrink: 0,
    },

    // INPUT
    inputArea: {
        padding: "10px 12px 8px",
        borderTop: "1px solid rgba(99,102,241,0.1)",
        background: "rgba(255,255,255,0.02)",
        flexShrink: 0,
    },
    inputRow: {
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "12px",
        padding: "8px 10px",
        transition: "border-color 0.2s",
    },
    inputField: {
        flex: 1,
        maxHeight: "100px",
        minHeight: "22px",
        overflow: "hidden",
    },
    attachBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(100,116,139,0.8)",
        padding: "2px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        transition: "color 0.2s",
        alignSelf: "flex-end",
        marginBottom: "1px",
    },
    sendBtn: {
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        border: "none",
        borderRadius: "8px",
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexShrink: 0,
        transition: "all 0.2s ease",
        alignSelf: "flex-end",
    },
    inputHint: {
        fontSize: "0.62rem",
        color: "rgba(100,116,139,0.5)",
        marginTop: "5px",
        textAlign: "center",
        letterSpacing: "0.01em",
    },
};
