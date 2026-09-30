import ImageToPdfClient from "../image-to-pdf/image-to-pdf-client";
import { generateToolSchema } from "../../lib/schemaMarkup";

export const metadata = {
  title: "PNG to PDF Converter - Convert Multiple PNG Images to PDF Free",
  description:
    "Convert PNG images to PDF online for free. Combine multiple PNG graphics, transparent logos, or screenshots into one clean PDF document. 100% private and secure.",
  keywords: [
    "png to pdf",
    "convert png to pdf",
    "png to pdf online",
    "combine png to pdf",
    "multiple png to pdf",
    "free png to pdf converter",
    "transparent png to pdf",
    "batch png to pdf",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/png-to-pdf",
  },
  openGraph: {
    title: "PNG to PDF Converter - Convert Multiple PNG Images to PDF Free",
    description:
      "Combine and convert multiple PNG images into one clean PDF document. Reorder pages, adjust paper sizes (A4/Letter), 100% private.",
    url: "https://convert.cvgrid.in/png-to-pdf",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid PNG to PDF Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "PNG to PDF Converter - Convert Multiple PNG Images to PDF Free",
    description:
      "Combine and convert multiple PNG images into one clean PDF document instantly. 100% private with no watermarks.",
    images: ["/logo512.png"],
  },
};

export default function PngToPdfPage() {
  const structuredData = generateToolSchema({
    name: "PNG to PDF Converter",
    slug: "png-to-pdf",
    description:
      "Free online PNG to PDF converter. Combine multiple PNG graphics, transparent images, or digital drawings into a high-quality PDF document locally in your browser.",
    featureList: [
      "Combine multiple PNG graphics and screenshots into one PDF",
      "Handles transparency and high-DPI visuals crisply",
      "Interactive page reordering with drag-and-drop",
      "Standard paper formats: A4, US Letter, Fit Image",
      "100% private local client-side WebAssembly processing",
    ],
    howToSteps: [
      { title: "Upload PNG Images", text: "Drag and drop your PNG graphics into the conversion area." },
      { title: "Arrange Order & Layout", text: "Reorder images and set page orientation or margins." },
      { title: "Export PDF", text: "Click 'Convert to PDF' and download your combined document instantly." },
    ],
    faqs: [
      {
        q: "Does this tool preserve the quality of PNG graphics?",
        a: "Yes! High-resolution PNG graphics are rendered directly into the PDF document structure without lossy re-encoding.",
      },
      {
        q: "Can I combine both PNG and JPG files in the same PDF?",
        a: "Yes! You can upload mixed formats (PNG, JPG, WebP) and combine them into a single consolidated PDF document.",
      },
      {
        q: "Are my files uploaded to any server?",
        a: "No. The entire conversion happens right inside your browser window using WebAssembly. Your files never touch any external server.",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ImageToPdfClient
        titleOverride="PNG to PDF Converter"
        subtitleOverride="Convert multiple PNG images and graphics into a clean, unified PDF document. Reorder pages, select standard A4/Letter formats, and export with zero watermarks."
      />
    </>
  );
}
