import HomeClient from "./HomeClient";
import { TOOLS, HOME_FAQS } from "../data/toolsData";

export const metadata = {
  title: "CVGrid Convert – Free Online PDF & Document Utilities (100% Private)",
  description:
    "Convert multiple PDFs to PNG/JPG, multiple images to PDF, merge, split, and compress PDF documents instantly in your browser. 100% private with zero server uploads.",
  keywords: [
    "pdf to png",
    "multiple pdf to image",
    "batch pdf to png",
    "png to pdf",
    "multiple images to pdf",
    "merge pdf files",
    "split pdf pages",
    "compress pdf size",
    "online pdf converter free",
    "private pdf utilities",
    "client-side pdf tools",
    "cvgrid convert",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in",
  },
  openGraph: {
    title: "CVGrid Convert – Free Online PDF & Document Utilities",
    description:
      "Convert multiple PDFs to images, merge, split, and compress PDF documents instantly in your browser. 100% private and secure.",
    url: "https://convert.cvgrid.in",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Convert Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "CVGrid Convert – Free Online PDF & Document Utilities",
    description:
      "Convert multiple PDFs to images, multiple images to PDF, merge, split, and compress documents instantly in your browser.",
    images: ["/logo512.png"],
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://convert.cvgrid.in/#website",
        "url": "https://convert.cvgrid.in",
        "name": "CVGrid Convert",
        "alternateName": [
          "CVGrid PDF Converter",
          "CVGrid Document Utilities",
          "Convert CVGrid",
          "CVGrid Free PDF Tools"
        ],
        "description": "Free, browser-native PDF converter and document utilities. Convert multiple PDFs to PNG/JPG, multiple images to PDF, merge, split, and compress PDFs locally.",
        "publisher": {
          "@type": "Organization",
          "@id": "https://cvgrid.in/#organization",
          "name": "CVGrid",
          "url": "https://cvgrid.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://convert.cvgrid.in/logo512.png",
            "width": 512,
            "height": 512
          },
          "sameAs": [
            "https://twitter.com/cvgrid",
            "https://cvgrid.in"
          ]
        }
      },
      {
        "@type": "WebApplication",
        "@id": "https://convert.cvgrid.in/#app",
        "name": "CVGrid Convert",
        "url": "https://convert.cvgrid.in",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern browsers (Chrome, Firefox, Safari, Edge)",
        "browserRequirements": "Requires HTML5 & WebAssembly support",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "description": "Free client-side document processing suite for converting multiple PDFs to images, combining images to PDF, merging, splitting, and compressing PDFs without server uploads.",
        "featureList": [
          "Batch multiple PDF to image conversion (PNG/JPG)",
          "Multiple images to PDF compilation with custom page sizes",
          "Client-side PDF merging and page reordering",
          "PDF page splitting and custom range extraction",
          "ATS-friendly PDF compression below 2MB",
          "100% private local processing"
        ]
      },
      {
        "@type": "ItemList",
        "itemListElement": TOOLS.map((tool, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": tool.title,
          "description": tool.description,
          "url": `https://convert.cvgrid.in${tool.href}`
        }))
      },
      {
        "@type": "FAQPage",
        "@id": "https://convert.cvgrid.in/#faq",
        "mainEntity": HOME_FAQS.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "HowTo",
        "name": "How to Convert and Manage PDF Documents with CVGrid Convert",
        "description": "Step-by-step guide to convert, merge, split, or compress PDF documents directly inside your browser.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Your Tool",
            "text": "Choose from Multiple PDF to Image, Images to PDF, Merge PDFs, Split PDF, or Compress PDF."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Add Your Files",
            "text": "Drag and drop single or multiple PDF or image files. All files are read locally with zero server upload."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Process and Download",
            "text": "Adjust options if needed and immediately download your converted pages, merged PDF, or compressed files."
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient />

      {/* SEO & AEO Semantic Content Section for Crawlers & LLMs */}
      <section className="border-t border-white/5 bg-[#09090f]/70 py-16 text-gray-400">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-space-grotesk text-white mb-4">
                Why Choose CVGrid Convert?
              </h2>
              <p className="text-sm leading-relaxed mb-4">
                Unlike traditional online converters that upload your confidential resumes, contracts, or tax files to unknown remote servers, CVGrid Convert processes 100% of your documents right inside your browser using modern WebAssembly and JavaScript engines.
              </p>
              <p className="text-sm leading-relaxed">
                Whether you need to convert a 50-page PDF into high-res PNG images, combine multiple job application screenshots into a single A4 PDF, or compress a portfolio under 2MB for an ATS submission, our tools are fast, unlimited, and free forever.
              </p>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold font-space-grotesk text-white mb-4">
                Core Capabilities & Privacy Standards
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span><strong>Multiple PDF to Images:</strong> Batch render multiple PDF documents to PNG/JPG at 2x resolution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span><strong>Multiple Images to PDF:</strong> Combine JPG, PNG, WebP, GIF into organized PDFs with custom page sizes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span><strong>Merge & Split:</strong> Fast document reordering, page extraction, and consolidation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span><strong>GDPR & Enterprise Privacy:</strong> Zero cloud storage, zero telemetry on document contents.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
