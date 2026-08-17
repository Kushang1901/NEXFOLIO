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
} from "lucide-react";

const TOOLS = [
  {
    title: "PDF to PNG",
    subtitle: "PDF Converter",
    description:
      "Convert any PDF page into a crisp PNG or JPG. Share resume pages on LinkedIn, embed them in portfolios, or extract diagrams for presentations.",
    href: "/pdf-to-image",
    Icon: ImageIcon,
    badge: "100% Free",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.12)",
    accentBorder: "rgba(59,130,246,0.25)",
    tag: "Most Popular",
  },
  {
    title: "Images to PDF",
    subtitle: "Image Combiner",
    description:
      "Stack PNG, JPG, or WebP images into one clean PDF — turn scanned certificates, offer letters, or project screenshots into a single shareable file.",
    href: "/image-to-pdf",
    Icon: Images,
    badge: "Multi-file",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.25)",
    tag: null,
  },
  {
    title: "Merge PDFs",
    subtitle: "PDF Combiner",
    description:
      "Stitch multiple PDF files into one document. Bundle your resume, cover letter, and references into a single polished application package.",
    href: "/merge",
    Icon: FileStack,
    badge: "Most Used",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.12)",
    accentBorder: "rgba(168,85,247,0.25)",
    tag: null,
  },
  {
    title: "Split PDF",
    subtitle: "Page Extractor",
    description:
      "Pick and pull specific pages or ranges from any PDF. Instantly separate a one-page CV from a multi-page portfolio in seconds.",
    href: "/split",
    Icon: Scissors,
    badge: "Precise",
    accent: "#f59e0b",
    accentDim: "rgba(245,158,11,0.12)",
    accentBorder: "rgba(245,158,11,0.25)",
    tag: null,
  },
  {
    title: "Compress PDF",
    subtitle: "File Optimizer",
    description:
      "Shrink PDF file size without visible quality loss. Beat job portal limits like the common 2MB cap — ATS-friendly output guaranteed.",
    href: "/compress",
    Icon: Zap,
    badge: "ATS Ready",
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.12)",
    accentBorder: "rgba(239,68,68,0.25)",
    tag: null,
  },
];

const FAQS = [
  {
    q: "Is it safe to upload my resume or certificates here?",
    a: "Absolutely. All document processing is done 100% client-side inside your browser. Your files never leave your device and are never uploaded to any server. Your personal information remains completely private and secure.",
  },
  {
    q: "Are there any file size limits or usage restrictions?",
    a: "No! Since the conversions happen directly on your own computer, there are no file size limits, upload throttles, or daily conversion caps. You can convert files as large as your browser memory can handle, completely free.",
  },
  {
    q: "Will the formatting of my resume change during PDF merging or splitting?",
    a: "No. Our tools use high-fidelity PDF manipulation engines (pdf-lib and pdf.js) that read and edit the existing PDF structures directly without re-rendering or changing your resume's layouts, fonts, or styling.",
  },
  {
    q: "Can I convert MS Word (.docx) or Excel (.xlsx) files?",
    a: "Currently, we only support PDF, PNG, JPG, JPEG, and WebP. Support for Word/Excel requires server-side rendering which compromises our 100% private, local-first conversion model. To convert a Word document, simply save it as a PDF in MS Word/Google Docs first, then use our tools here.",
  },
];

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

export default function Home() {
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
              Browser-native · Zero uploads
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}
            className="font-space-grotesk"
          >
            PDF tools that{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              respect
            </span>
            <br />
            your privacy.
          </h1>

          {/* Sub-copy */}
          <p
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              lineHeight: 1.7,
              marginBottom: "36px",
              maxWidth: "440px",
            }}
          >
            Convert, merge, split and compress PDFs — entirely inside your
            browser. No account, no server, no data leaving your machine.
          </p>

          {/* CTA Row */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/merge"
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
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Merge PDFs <ArrowRight size={15} />
            </Link>
            <Link
              href="/pdf-to-image"
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              PDF to Image
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
              { icon: Lock, label: "No uploads, ever" },
              { icon: Wifi, label: "Works offline" },
              { icon: ShieldCheck, label: "GDPR safe" },
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
              top: "30px",
              right: "0",
              width: "260px",
              background: "rgba(28,32,45,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              padding: "20px",
              transform: "rotate(3deg)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={16} color="#ef4444" />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>Resume_Final_v3.pdf</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>4.2 MB</div>
              </div>
            </div>
            <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #6366f1, #c084fc)", borderRadius: "2px" }} />
            </div>
            <div style={{ fontSize: "11px", color: "#6366f1", marginTop: "8px", fontWeight: 500 }}>Compressed → 890 KB</div>
          </div>

          {/* Middle card — merge */}
          <div
            style={{
              position: "absolute",
              top: "110px",
              left: "0",
              width: "280px",
              background: "rgba(20,24,36,0.9)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "16px",
              padding: "20px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Merging files</div>
            {["Resume.pdf", "Cover_Letter.pdf", "References.pdf"].map((name, i) => (
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
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 0 ? "#6366f1" : "#374151", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: i === 0 ? "#e5e7eb" : "#6b7280" }}>{name}</span>
                {i === 0 && (
                  <span style={{ marginLeft: "auto", fontSize: "10px", color: "#6366f1", background: "rgba(99,102,241,0.15)", padding: "2px 8px", borderRadius: "99px", fontWeight: 600 }}>Active</span>
                )}
              </div>
            ))}
            <div style={{ marginTop: "14px", padding: "10px 14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              → Application_Bundle.pdf
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
            <span style={{ fontSize: "13px", color: "#6ee7b7", fontWeight: 600 }}>100% private · 0 uploads</span>
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
            { value: 50000, suffix: "+", label: "Files Converted" },
            { value: 5, suffix: " tools", label: "Free PDF Utilities" },
            { value: 100, suffix: "%", label: "Client-Side Processing" },
            { value: 0, suffix: " bytes", label: "Data Sent to Servers" },
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
            All tools
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              maxWidth: "480px",
              lineHeight: 1.2,
            }}
            className="font-space-grotesk"
          >
            Everything you need for job applications.
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = tool.accentDim;
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 16px 48px ${tool.accentDim}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top row */}
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

                {/* Title */}
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

                {/* Description */}
                <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.65, marginBottom: "24px", flexGrow: 1 }}>
                  {tool.description}
                </p>

                {/* CTA */}
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
                  Open tool <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST SECTION
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
              title: "Files never leave your browser",
              body: "Every conversion runs 100% locally. We don't have servers that receive your documents — because we never built any.",
            },
            {
              icon: Clock,
              color: "#10b981",
              bg: "rgba(16,185,129,0.08)",
              title: "Conversion in under 3 seconds",
              body: "Browser-native processing means there's no network round-trip. Your file is done before you even blink.",
            },
            {
              icon: CheckCircle,
              color: "#c084fc",
              bg: "rgba(192,132,252,0.08)",
              title: "Free. No sign-up. No limits.",
              body: "No subscription, no daily cap, no watermarks. Open a tool and get to work — it's that simple.",
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
          FAQ
      ══════════════════════════════════════ */}
      <section style={{ maxWidth: "740px", margin: "0 auto", padding: "72px 24px", width: "100%" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6366f1", marginBottom: "10px" }}>
            Got questions?
          </p>
          <h2
            style={{ fontSize: "28px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}
            className="font-space-grotesk"
          >
            Things people usually ask
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FAQS.map((faq, idx) => {
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
