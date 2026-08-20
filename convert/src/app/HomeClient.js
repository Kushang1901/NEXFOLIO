"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Images,
  FileStack,
  Scissors,
  Zap,
  Lock,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
  FileText,
  Wifi,
  Clock,
  Star,
  Layers,
  Sparkles,
} from "lucide-react";

import { TOOLS, HOME_FAQS } from "../data/toolsData";

function AnimatedNumber({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomeClient() {
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="flex-grow flex flex-col relative overflow-hidden">
      {/* ── Ambient Background ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "55%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ══════════════════════════════════════
          HERO — Split Layout
      ══════════════════════════════════════ */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px 64px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Left — Copy */}
        <div>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "999px",
              padding: "6px 14px",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#6366f1",
                display: "inline-block",
                boxShadow: "0 0 8px rgba(99,102,241,0.8)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#a5b4fc",
                textTransform: "uppercase",
              }}
            >
              Batch Enabled · 100% Private · Zero Uploads
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "#fff",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
            className="font-space-grotesk"
          >
            Fast, private PDF & image tools that{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              never upload your files.
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              lineHeight: 1.7,
              marginBottom: "36px",
              maxWidth: "480px",
            }}
          >
            Convert multiple PDFs to crisp PNGs, combine multiple images into formatted PDFs, merge documents, split pages, and compress files directly in your browser.
          </p>

          {/* CTA Row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/pdf-to-image"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 26px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
                boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
              }}
            >
              Multiple PDF to Image <ArrowRight size={15} />
            </Link>
            <Link
              href="/image-to-pdf"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 26px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e5e7eb",
                fontWeight: 500,
                fontSize: "14px",
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              Images to PDF
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: Lock, label: "Client-side private" },
              { icon: Layers, label: "Batch multi-file" },
              { icon: ShieldCheck, label: "Zero server storage" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                <Icon size={14} color="#6366f1" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual Card Stack */}
        <div style={{ position: "relative", height: "380px" }}>
          {/* Background file card */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "0",
              width: "270px",
              background: "rgba(28,32,45,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px",
              transform: "rotate(3deg)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ImageIcon size={18} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>3 PDFs Selected</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>Batch converting → PNG</div>
              </div>
            </div>
            <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #3b82f6, #6366f1)", borderRadius: "2px" }} />
            </div>
            <div style={{ fontSize: "11px", color: "#60a5fa", marginTop: "8px", fontWeight: 500 }}>All pages ready (ZIP export)</div>
          </div>

          {/* Middle card — merge & convert */}
          <div
            style={{
              position: "absolute",
              top: "100px",
              left: "0",
              width: "290px",
              background: "rgba(20,24,36,0.92)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "16px",
              padding: "20px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Batch Document Queue</div>
            {["Resume_2026.pdf", "Cover_Letter.pdf", "Certificate_Scans.pdf"].map((name, i) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: i === 0 ? "rgba(99,102,241,0.08)" : "transparent",
                  marginBottom: "4px",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 0 ? "#6366f1" : "#10b981", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: i === 0 ? "#e5e7eb" : "#9ca3af" }}>{name}</span>
                {i === 0 && (
                  <span style={{ marginLeft: "auto", fontSize: "10px", color: "#6366f1", background: "rgba(99,102,241,0.15)", padding: "2px 8px", borderRadius: "99px", fontWeight: 600 }}>Ready</span>
                )}
              </div>
            ))}
            <div style={{ marginTop: "14px", padding: "10px 14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              Instant Client-Side Export
            </div>
          </div>

          {/* Bottom right stat pill */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "10px",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "999px",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Star size={13} color="#10b981" fill="#10b981" />
            <span style={{ fontSize: "13px", color: "#6ee7b7", fontWeight: 600 }}>100% private · 0 bytes upload</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "32px 24px",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            textAlign: "center",
          }}
          className="stats-grid"
        >
          {[
            { value: 120000, suffix: "+", label: "Files Processed" },
            { value: 5, suffix: " tools", label: "Batch PDF Utilities" },
            { value: 100, suffix: "%", label: "Private Browser Native" },
            { value: 0, suffix: " bytes", label: "Server Storage" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
                className="font-space-grotesk"
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TOOLS GRID
      ══════════════════════════════════════ */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "72px 24px",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6366f1",
              marginBottom: "12px",
            }}
          >
            All Free Tools
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              maxWidth: "520px",
              lineHeight: 1.2,
            }}
            className="font-space-grotesk"
          >
            Everything you need for documents and job applications.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {TOOLS.map((tool) => {
            const IconComponent = tool.Icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${tool.accentBorder}`,
                  textDecoration: "none",
                  transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: tool.accentDim,
                      border: `1px solid ${tool.accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconComponent size={20} color={tool.accent} />
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {tool.tag && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          padding: "3px 9px",
                          borderRadius: "99px",
                          background: `${tool.accentDim}`,
                          color: tool.accent,
                          border: `1px solid ${tool.accentBorder}`,
                          textTransform: "uppercase",
                        }}
                      >
                        {tool.tag}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: "99px",
                        background: "rgba(255,255,255,0.04)",
                        color: "#9ca3af",
                        border: "1px solid rgba(255,255,255,0.08)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {tool.subtitle}
                  </div>
                  <h3
                    style={{ fontSize: "20px", fontWeight: 700, color: "#f9fafb", lineHeight: 1.2 }}
                    className="font-space-grotesk"
                  >
                    {tool.title}
                  </h3>
                </div>

                <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.65, marginBottom: "24px", flexGrow: 1 }}>
                  {tool.description}
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: tool.accent,
                  }}
                >
                  Launch Tool <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST & PRIVACY SECTION
      ══════════════════════════════════════ */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "72px 24px",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
          }}
          className="trust-grid"
        >
          {[
            {
              icon: ShieldCheck,
              color: "#6366f1",
              bg: "rgba(99,102,241,0.08)",
              title: "100% Client-Side Privacy",
              body: "Every conversion runs locally inside your browser via WebAssembly. Your documents and data are never sent to external servers.",
            },
            {
              icon: Layers,
              color: "#10b981",
              bg: "rgba(16,185,129,0.08)",
              title: "Batch Multiple File Handling",
              body: "Select multiple PDFs to convert pages in bulk or stack multiple images in one go with instant drag-and-drop ordering.",
            },
            {
              icon: CheckCircle,
              color: "#c084fc",
              bg: "rgba(192,132,252,0.08)",
              title: "Free, Fast & Unlimited",
              body: "No sign-up, no credit card, no usage limits, and no watermarks. Open any tool and process files in milliseconds.",
            },
          ].map(({ icon: Icon, color, bg, title, body }) => (
            <div key={title} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={22} color={color} />
              </div>
              <div>
                <h4
                  style={{ fontSize: "16px", fontWeight: 700, color: "#f9fafb", marginBottom: "8px" }}
                  className="font-space-grotesk"
                >
                  {title}
                </h4>
                <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.65 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ ACCORDION
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "72px 24px", width: "100%" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366f1", marginBottom: "10px" }}>
            Frequently Asked Questions
          </p>
          <h2
            style={{ fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}
            className="font-space-grotesk"
          >
            Common questions about CVGrid PDF tools
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: isOpen ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.25s",
                  background: isOpen ? "rgba(99,102,241,0.04)" : "rgba(255,255,255,0.02)",
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#e5e7eb", fontSize: "15px", paddingRight: "16px" }}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color={isOpen ? "#6366f1" : "#6b7280"}
                    style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
                  />
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? "300px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <p
                    style={{
                      padding: "0 24px 20px",
                      fontSize: "14px",
                      color: "#9ca3af",
                      lineHeight: 1.7,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: "16px",
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding-top: 48px !important;
          }
          .hero-grid > div:last-child {
            display: none;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .trust-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
