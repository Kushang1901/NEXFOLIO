"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Images,
  FileStack,
  Scissors,
  Zap,
  Lock,
  Compass,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const TOOLS = [
  {
    title: "PDF to PNG Converter",
    description:
      "Convert your PDF pages into high-quality PNG or JPG images instantly. Ideal for sharing resume pages on LinkedIn or portfolio sites.",
    href: "/pdf-to-image",
    Icon: ImageIcon,
    badge: "100% Free",
    color: "from-blue-500 to-indigo-600",
    glowColor: "rgba(59, 130, 246, 0.15)",
  },
  {
    title: "PNG to PDF Converter",
    description:
      "Combine PNG, JPG, or WebP images into a single clean PDF. Perfect for turning scanned degree certificates or project screenshots into an attachment.",
    href: "/image-to-pdf",
    Icon: Images,
    badge: "Multi-file",
    color: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    title: "Merge PDF Documents",
    description:
      "Combine multiple PDF files into one single document. Easily merge your resume, cover letter, and references into one application package.",
    href: "/merge",
    Icon: FileStack,
    badge: "Most Used",
    color: "from-purple-500 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.15)",
  },
  {
    title: "Split PDF Pages",
    description:
      "Extract specific pages or page ranges from a PDF. Separate a single page CV from a multi-page portfolio in seconds.",
    href: "/split",
    Icon: Scissors,
    badge: "Highly Precise",
    color: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.15)",
  },
  {
    title: "Compress PDF Size",
    description:
      "Reduce the file size of your PDF while maintaining text and image quality. Beat job portal upload limits (e.g., <2MB) easily.",
    href: "/compress",
    Icon: Zap,
    badge: "ATS Ready",
    color: "from-rose-500 to-red-600",
    glowColor: "rgba(244, 63, 94, 0.15)",
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
    a: "No. Our tools use high-fidelity PDF manipulation engines (`pdf-lib` and `pdf.js`) that read and edit the existing PDF structures directly without re-rendering or changing your resume's layouts, fonts, or styling.",
  },
  {
    q: "Can I convert MS Word (.docx) or Excel (.xlsx) files?",
    a: "Currently, we only support PDF, PNG, JPG, JPEG, and WebP. Support for Word/Excel requires server-side rendering which compromises our 100% private, local-first conversion model. To convert a Word document, simply save it as a PDF in MS Word/Google Docs first, then use our tools here.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex-grow flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 tracking-wide uppercase">
          <Lock className="w-3.5 h-3.5" /> 100% Private Client-Side Conversion
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 font-space-grotesk text-white">
          Convert, Merge, &amp; Optimize <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Your Career Documents
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Lightweight, lightning-fast utilities designed for job seekers. Merge cover letters, split portfolios, reduce PDF sizes, and convert documents safely without any uploads.
        </p>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool, idx) => {
            const IconComponent = tool.Icon;
            return (
              <Link
                key={idx}
                href={tool.href}
                className="glass-card rounded-2xl p-8 flex flex-col justify-between relative group overflow-hidden decoration-none border border-white/5"
              >
                {/* Glow Overlay */}
                <div
                  className="absolute -right-16 -top-16 w-36 h-36 rounded-full blur-[40px] pointer-events-none group-hover:scale-125 transition-transform duration-300"
                  style={{ background: tool.glowColor }}
                ></div>

                <div>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr ${tool.color} text-white shadow-md`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold mb-3 font-space-grotesk text-white group-hover:text-indigo-300 transition-colors duration-200">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  Launch Tool <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Pitch Section */}
      <section className="bg-white/[0.01] border-y border-white/5 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-2 font-space-grotesk text-white">Guaranteed Privacy</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              We never see your files. Since processing is strictly browser-based, your data is completely secure and hacker-proof.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-2 font-space-grotesk text-white">Instant Conversions</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Skip the queue. Browser rendering means conversions happen in milliseconds without any network latency.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold mb-2 font-space-grotesk text-white">100% Free Forever</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              No subscription popups, daily limits, or hidden fees. Use our suite as much as you need, watermark-free.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 w-full">
        <h2 className="text-3xl font-bold text-center mb-12 font-space-grotesk text-white">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02]"
                >
                  <span className="font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-white/5 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="px-6 py-5 text-sm text-gray-400 leading-relaxed bg-[#0b0c10]/40">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
