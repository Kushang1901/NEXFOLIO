import {
  Image as ImageIcon,
  Images,
  FileStack,
  Scissors,
  Zap,
} from "lucide-react";

export const TOOLS = [
  {
    title: "Multiple PDF to Image",
    subtitle: "Batch PDF Converter",
    description:
      "Convert single or multiple PDF documents into high-resolution PNG or JPG images at once. Download page by page, per PDF, or batch export all as a ZIP.",
    href: "/pdf-to-image",
    Icon: ImageIcon,
    badge: "Batch & Free",
    accent: "#3b82f6",
    accentDim: "rgba(59,130,246,0.12)",
    accentBorder: "rgba(59,130,246,0.25)",
    tag: "Updated",
  },
  {
    title: "Multiple Images to PDF",
    subtitle: "Batch Image Combiner",
    description:
      "Stack and organize multiple PNG, JPG, WebP, or GIF images into one unified, high-quality PDF. Reorder pages, adjust page formats (Fit, A4, Letter), and set custom margins.",
    href: "/image-to-pdf",
    Icon: Images,
    badge: "Multi-Image",
    accent: "#10b981",
    accentDim: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(16,185,129,0.25)",
    tag: "Popular",
  },
  {
    title: "Merge PDFs",
    subtitle: "PDF Combiner",
    description:
      "Stitch multiple PDF files into one polished document. Bundle your resume, cover letter, and certificates into a single application package in seconds.",
    href: "/merge",
    Icon: FileStack,
    badge: "Unlimited",
    accent: "#a855f7",
    accentDim: "rgba(168,85,247,0.12)",
    accentBorder: "rgba(168,85,247,0.25)",
    tag: null,
  },
  {
    title: "Split PDF",
    subtitle: "Page Extractor",
    description:
      "Pick and extract specific pages or custom ranges from any PDF document. Separate single pages or split large portfolios with instant visual page selection.",
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
      "Shrink PDF file size without visible text or graphic loss. Guaranteed ATS-friendly optimization to easily pass job portal 2MB file limits.",
    href: "/compress",
    Icon: Zap,
    badge: "ATS Ready",
    accent: "#ef4444",
    accentDim: "rgba(239,68,68,0.12)",
    accentBorder: "rgba(239,68,68,0.25)",
    tag: null,
  },
];

export const HOME_FAQS = [
  {
    q: "Can I convert multiple PDF files to images at the same time?",
    a: "Yes! Our Multiple PDF to Image tool allows you to upload and process multiple PDF documents in a single batch. You can preview all rendered pages grouped by PDF and download them individually, per file, or package everything into a consolidated ZIP archive.",
  },
  {
    q: "Can I combine multiple images of different formats into a single PDF?",
    a: "Yes! You can upload multiple JPG, PNG, WebP, and GIF images simultaneously. You can easily drag and reorder images, select page sizes (Fit Image, A4, US Letter), choose orientation, and export a clean, consolidated PDF document.",
  },
  {
    q: "Is it safe to upload confidential resumes, contracts, or certificates here?",
    a: "100% safe. All document operations and image conversions execute entirely on your own device inside the browser using WebAssembly (pdf-lib and pdf.js). Your files are never uploaded to any server or third party, ensuring complete privacy and GDPR compliance.",
  },
  {
    q: "Are there any file size limits, daily quotas, or watermarks?",
    a: "No restrictions whatsoever. There are zero upload throttles, no subscriptions, no file size caps, and absolutely no watermarks added to your documents. Convert as many files as you need for free.",
  },
  {
    q: "Will my resume formatting or text quality degrade during PDF conversion?",
    a: "No. Our tools use high-fidelity PDF engines with double-density rendering (2.0x scale) for razor-sharp image exports and precise PDF document tree manipulation so your fonts, vector paths, and formatting stay 100% crisp.",
  },
];
