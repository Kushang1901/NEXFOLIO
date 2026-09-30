import PdfToImageClient from "../pdf-to-image/pdf-to-image-client";
import { generateToolSchema } from "../../lib/schemaMarkup";

export const metadata = {
  title: "PDF to JPG Converter - Convert PDF to JPG Online Free (High Quality)",
  description:
    "Convert PDF to JPG images online in seconds. Free, batch conversion with crystal clear image quality and zero server uploads. 100% private, no file size limits.",
  keywords: [
    "pdf to jpg",
    "convert pdf to jpg",
    "pdf to jpg online",
    "free pdf to jpg converter",
    "batch pdf to jpg",
    "pdf to jpg high quality",
    "pdf to jpeg",
    "extract images from pdf",
    "best pdf to jpg converter",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/pdf-to-jpg",
  },
  openGraph: {
    title: "PDF to JPG Converter - Convert PDF to JPG Online Free",
    description:
      "Convert PDF to high-resolution JPG images directly in your browser. Batch processing, 100% private, zero uploads.",
    url: "https://convert.cvgrid.in/pdf-to-jpg",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid PDF to JPG Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "PDF to JPG Converter - Convert PDF to JPG Online Free",
    description:
      "Convert PDF to JPG online instantly in your browser. 100% private with no watermarks.",
    images: ["/logo512.png"],
  },
};

export default function PdfToJpgPage() {
  const structuredData = generateToolSchema({
    name: "PDF to JPG Converter",
    slug: "pdf-to-jpg",
    description:
      "Free online PDF to JPG converter. Extract high-quality JPG photos from single or multi-page PDF documents locally in your browser.",
    featureList: [
      "High-resolution double-density rendering",
      "Batch PDF upload & multi-page conversion",
      "Download single pages or ZIP package",
      "100% client-side WebAssembly privacy",
      "No watermarks and no file size limits",
    ],
    howToSteps: [
      { title: "Upload PDF", text: "Drag and drop or select your PDF file(s)." },
      { title: "Set JPG Quality", text: "Select JPG format with 0.95 high quality." },
      { title: "Download", text: "Click Download Page, Download PDF Images, or Download All as ZIP." },
    ],
    faqs: [
      {
        q: "How do I convert a multi-page PDF to JPG images?",
        a: "Simply drag and drop your PDF into the converter above. Our client-side engine renders every page into a crisp JPG file that you can download individually or as a single ZIP folder.",
      },
      {
        q: "Is converting PDF to JPG free with CVGrid Convert?",
        a: "Yes, it is 100% free with no hidden paywalls, daily conversion limits, or watermarks.",
      },
      {
        q: "Are my confidential PDF documents safe?",
        a: "Completely safe. Unlike cloud-based converters, CVGrid Convert processes your PDF files locally on your own machine using WebAssembly. Your files are never sent over the internet.",
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
        defaultFormat="image/jpeg"
        titleOverride="PDF to JPG Converter"
        subtitleOverride="Convert PDF documents into high-resolution JPG images. Fast, batch export with crystal clear quality and 100% client-side privacy."
      />
    </>
  );
}
