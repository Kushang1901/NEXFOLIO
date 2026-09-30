import PdfToImageClient from "../pdf-to-image/pdf-to-image-client";
import { generateToolSchema } from "../../lib/schemaMarkup";

export const metadata = {
  title: "PDF to PNG Converter - Convert PDF to PNG Online Free (Lossless Quality)",
  description:
    "Convert PDF to PNG images with lossless vector clarity and transparent backgrounds. Free, fast batch conversion with zero server uploads and 100% privacy.",
  keywords: [
    "pdf to png",
    "convert pdf to png",
    "pdf to png online",
    "free pdf to png converter",
    "batch pdf to png",
    "lossless pdf to png",
    "pdf to png high res",
    "extract png from pdf",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/pdf-to-png",
  },
  openGraph: {
    title: "PDF to PNG Converter - Convert PDF to PNG Online Free",
    description:
      "Convert PDF to lossless PNG images directly in your browser. Batch processing, 100% private, zero uploads.",
    url: "https://convert.cvgrid.in/pdf-to-png",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid PDF to PNG Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "PDF to PNG Converter - Convert PDF to PNG Online Free",
    description:
      "Convert PDF to lossless PNG online instantly in your browser. 100% private with no watermarks.",
    images: ["/logo512.png"],
  },
};

export default function PdfToPngPage() {
  const structuredData = generateToolSchema({
    name: "PDF to PNG Converter",
    slug: "pdf-to-png",
    description:
      "Free online PDF to PNG converter. Extract lossless PNG graphics and pages from PDF documents locally in your browser.",
    featureList: [
      "Lossless PNG graphic rendering",
      "Batch PDF upload & multi-page conversion",
      "Double-density 2.0x vector scale",
      "100% client-side WebAssembly privacy",
      "No watermarks and no file size limits",
    ],
    howToSteps: [
      { title: "Upload PDF", text: "Drag and drop or select your PDF file(s)." },
      { title: "Verify PNG Format", text: "PNG format is selected for lossless crispness." },
      { title: "Download", text: "Download individual PNG pages or the full ZIP archive." },
    ],
    faqs: [
      {
        q: "Why should I convert PDF to PNG instead of JPG?",
        a: "PNG uses lossless compression, making it superior for documents containing text, diagrams, signatures, and line art where you need razor-sharp edges without compression artifacts.",
      },
      {
        q: "Can I convert multiple PDFs to PNG in one batch?",
        a: "Yes! Upload as many PDF files as you like. Our client-side batch engine converts all pages in parallel and lets you export everything in a single ZIP file.",
      },
      {
        q: "Are my files uploaded to a remote server?",
        a: "Never. All processing happens entirely inside your browser sandbox via WebAssembly. Your files remain 100% on your device.",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PdfToImageClient
        defaultFormat="image/png"
        titleOverride="PDF to PNG Converter"
        subtitleOverride="Convert PDF documents into lossless, crisp PNG images. Ideal for graphics, signatures, diagrams, and high-DPI viewing."
      />
    </>
  );
}
