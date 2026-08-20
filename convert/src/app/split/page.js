import SplitPdfClient from "./split-client";

export const metadata = {
  title: "Split PDF Pages Online - Extract PDF Pages Free",
  description:
    "Extract specific pages or split PDF documents into multiple files instantly in your browser. 100% private, secure, and free.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "pdf splitting online",
    "cut pdf pages",
    "pdf splitter online free",
    "extract page from pdf",
    "free pdf page extractor",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/split",
  },
  openGraph: {
    title: "Split PDF Pages Online - Extract PDF Pages Free | CVGrid Convert",
    description:
      "Extract specific pages or split PDF documents into multiple files instantly in your browser. 100% private, secure, and free.",
    url: "https://convert.cvgrid.in/split",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Split PDF Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "Split PDF Pages Online - Extract PDF Pages Free",
    description:
      "Extract specific pages or split PDF documents into multiple files instantly in your browser. 100% private and secure.",
    images: ["/logo512.png"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://convert.cvgrid.in/split/#app",
        "name": "Split PDF Pages",
        "url": "https://convert.cvgrid.in/split",
        "description": "Split PDF files or extract specific pages and page ranges from your documents. Processed locally in your browser for absolute privacy.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern browsers",
        "browserRequirements": "Requires HTML5 support",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Select and extract individual PDF pages",
          "Specify custom page ranges (e.g., 1-3, 5)",
          "High-speed rendering of page previews",
          "Download split pages as a new PDF document",
          "100% private client-side processing"
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
            "name": "Split PDF",
            "item": "https://convert.cvgrid.in/split"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://convert.cvgrid.in/split/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I extract only one page from a multi-page PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Upload your PDF, click on the specific page thumbnail you want to extract, or type the single page number, and click 'Extract Selected Pages'."
            }
          },
          {
            "@type": "Question",
            "name": "Are the extracted PDF pages identical in quality to the original?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Our engine uses lossless PDF tree copying, preserving all vector fonts, styling, hyperlinks, and resolution perfectly."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Split and Extract Pages from PDF",
        "description": "Step-by-step guide to extract specific pages from any PDF document.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Upload PDF",
            "text": "Select your document to load all page previews."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Select Pages",
            "text": "Click individual page cards or enter a page range."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Extract & Download",
            "text": "Click Extract to generate your new custom PDF document."
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
      <SplitPdfClient />

      {/* Educational SEO & AEO Content Section */}
      <section className="border-t border-white/5 bg-[#09090f]/60 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Extract and Split PDF Pages Free
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to extract a single CV page from a 10-page portfolio or split a multi-page contract? Our interactive client-side tool lets you visually select pages with 100% privacy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-amber-400 font-bold text-lg mb-3">01. Open PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop your PDF to instantly generate visual page previews.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-amber-400 font-bold text-lg mb-3">02. Pick Pages</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Select specific pages or input ranges (e.g. 1-3, 5).
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-amber-400 font-bold text-lg mb-3">03. Save Extracted PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Download your new lightweight PDF file instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
