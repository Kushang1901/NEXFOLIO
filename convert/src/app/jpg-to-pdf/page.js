import ImageToPdfClient from "../image-to-pdf/image-to-pdf-client";
import { generateToolSchema } from "../../lib/schemaMarkup";

export const metadata = {
  title: "JPG to PDF Converter - Convert Multiple JPG Images to PDF Online Free",
  description:
    "Convert JPG to PDF online for free. Combine multiple JPG photos into one organized PDF document in seconds. 100% private, no file size limits, zero server uploads.",
  keywords: [
    "jpg to pdf",
    "convert jpg to pdf",
    "jpg to pdf online",
    "multiple jpg to pdf",
    "free jpg to pdf converter",
    "combine jpg into pdf",
    "photos to pdf",
    "batch jpg to pdf",
    "image to pdf free",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/jpg-to-pdf",
  },
  openGraph: {
    title: "JPG to PDF Converter - Convert Multiple JPG Images to PDF Free",
    description:
      "Combine and convert multiple JPG photos into one clean PDF file. Reorder pages, adjust paper sizes (A4/Letter), 100% private.",
    url: "https://convert.cvgrid.in/jpg-to-pdf",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid JPG to PDF Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "JPG to PDF Converter - Convert Multiple JPG Images to PDF Free",
    description:
      "Combine and convert multiple JPG images into one clean PDF document instantly. 100% private with no watermarks.",
    images: ["/logo512.png"],
  },
};

export default function JpgToPdfPage() {
  const structuredData = generateToolSchema({
    name: "JPG to PDF Converter",
    slug: "jpg-to-pdf",
    description:
      "Free online JPG to PDF converter. Combine multiple JPG and JPEG photos into a clean, formatted PDF document directly in your browser.",
    featureList: [
      "Combine unlimited JPG photos into one PDF",
      "Interactive page reordering with drag-and-drop",
      "Standard paper formats: A4, US Letter, Fit Image",
      "Custom margin controls (None, Thin, Standard)",
      "100% private local client-side WebAssembly processing",
    ],
    howToSteps: [
      { title: "Upload JPG Images", text: "Drag and drop your JPG photos into the conversion area." },
      { title: "Arrange Order & Layout", text: "Reorder images and set page orientation or margins." },
      { title: "Export PDF", text: "Click 'Convert to PDF' and download your combined document instantly." },
    ],
    faqs: [
      {
        q: "How many JPG photos can I combine into one PDF?",
        a: "There are no arbitrary limits! You can combine dozens of JPG photos into a single PDF document without any server throttling or subscriptions.",
      },
      {
        q: "Can I set the page size to standard A4?",
        a: "Yes! In the layout settings, simply select 'A4' or 'US Letter' to format your JPG images for printing and official applications.",
      },
      {
        q: "Are my photos kept private?",
        a: "Yes, 100% private. Files are processed directly in your browser's local memory using WebAssembly. They are never sent to external servers.",
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
        titleOverride="JPG to PDF Converter"
        subtitleOverride="Convert multiple JPG photos into a clean, unified PDF document. Reorder pages, select standard A4/Letter formats, and export with zero watermarks."
      />
    </>
  );
}
