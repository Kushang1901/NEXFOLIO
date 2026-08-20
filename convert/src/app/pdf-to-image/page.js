import PdfToImageClient from "./pdf-to-image-client";

export const metadata = {
  title: "Multiple PDF to Image Converter - Batch Convert PDF to PNG & JPG Free",
  description:
    "Convert multiple PDF documents or single PDF pages into high-resolution PNG & JPG images in your browser. 100% private, free, batch processing with zero server uploads.",
  keywords: [
    "multiple pdf to image",
    "batch pdf to png",
    "pdf to png converter",
    "convert multiple pdf to images",
    "pdf to jpg batch",
    "free multiple pdf to png",
    "client-side batch pdf converter",
    "high resolution pdf to png",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/pdf-to-image",
  },
  openGraph: {
    title: "Multiple PDF to Image Converter - Batch Convert PDF to PNG & JPG Free",
    description:
      "Convert multiple PDF files or single PDF pages to high-resolution PNG or JPG images instantly in your browser. 100% private, free, and secure.",
    url: "https://convert.cvgrid.in/pdf-to-image",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Multiple PDF to Image Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "Multiple PDF to Image Converter - Batch Convert PDF to PNG & JPG Free",
    description:
      "Convert multiple PDF files to high-resolution PNG or JPG images instantly in your browser. 100% private and secure.",
    images: ["/logo512.png"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://convert.cvgrid.in/pdf-to-image/#app",
        "name": "Multiple PDF to Image Converter",
        "url": "https://convert.cvgrid.in/pdf-to-image",
        "description": "Convert single or multiple PDF documents into high-resolution PNG or JPG images directly in your browser. 100% private, batch processing, zero server uploads.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern browsers",
        "browserRequirements": "Requires HTML5 & Canvas support",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Batch multi-PDF file upload and parallel page rendering",
          "Double-density high-resolution rendering (2.0x scale)",
          "Download individual page PNGs or full document ZIP archives",
          "Bulk consolidated ZIP download for all uploaded PDFs",
          "100% private client-side processing with zero server storage"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "CVGrid Convert",
            "item": "https://convert.cvgrid.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Multiple PDF to Image",
            "item": "https://convert.cvgrid.in/pdf-to-image"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://convert.cvgrid.in/pdf-to-image/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I convert multiple PDF files at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! You can select or drag and drop multiple PDF documents simultaneously. Our client-side engine renders each PDF's pages and allows you to download individual pages or a single ZIP package containing all images."
            }
          },
          {
            "@type": "Question",
            "name": "What image formats and resolutions are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We export high-resolution PNG and JPG images at double density (2.0x scale) to ensure crystal-clear text, diagrams, and formatting."
            }
          },
          {
            "@type": "Question",
            "name": "Is my PDF data kept secure and confidential?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, 100%. All processing is executed locally in your browser via WebAssembly and JavaScript. No files or images are ever transmitted to any server."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Convert Multiple PDFs to Images Online",
        "description": "Step-by-step instructions for converting multiple PDF documents to PNG or JPG images.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select or Drop PDF Files",
            "text": "Choose one or multiple PDF documents from your computer or drag and drop them into the upload box."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Instant Local Rendering",
            "text": "The browser-native engine renders all pages in high-resolution directly in your browser."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Download Images or ZIP",
            "text": "Download individual page images or click Download All to save a consolidated ZIP file."
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
      <PdfToImageClient />

      {/* Educational SEO & AEO Content Section */}
      <section className="border-t border-white/5 bg-[#09090f]/60 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Convert Multiple PDF Files to Images Online
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to convert multiple PDF documents or specific resume pages into high-resolution images? Our free, local-first converter processes everything directly in your browser without uploading your sensitive files.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-blue-400 font-bold text-lg mb-3">01. Upload PDFs</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop single or multiple PDF documents. Batch processing is supported with zero upload limits.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-blue-400 font-bold text-lg mb-3">02. Auto-Process</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our client-side engine renders each page of your PDFs into high-fidelity image representations at 2.0x resolution.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-blue-400 font-bold text-lg mb-3">03. Download Images</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Preview your rendered pages and download individual PNGs or click 'Download All' to save all documents in a ZIP file.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
