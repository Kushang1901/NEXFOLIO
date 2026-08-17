import SplitPdfClient from "./split-client";

export const metadata = {
  title: "Split PDF Pages Online - Extract PDF Pages Free",
  description:
    "Extract specific pages or split PDF documents into multiple files instantly in your browser. 100% private, secure, and free.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "pdf splitting",
    "cut pdf pages",
    "pdf splitter online",
    "extract page from pdf",
    "free pdf page extractor",
    "split pdf document",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/split",
  },
  openGraph: {
    title: "Split PDF Pages Online - Extract PDF Pages Free | CVGrid Convert",
    description:
      "Extract specific pages or split PDF documents into multiple files instantly in your browser. 100% private, secure, and free.",
    url: "https://convert.cvgrid.in/split",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Pages Online - Extract PDF Pages Free | CVGrid Convert",
    description:
      "Extract specific pages or split PDF documents into multiple files instantly in your browser. 100% private, secure, and free.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Split PDF Pages",
    "url": "https://convert.cvgrid.in/split",
    "description": "Split PDF files or extract specific pages and page ranges from your documents. Processed locally in your browser for absolute privacy.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 support",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Select and extract individual PDF pages",
      "Specify custom page ranges (e.g., 1-3, 5)",
      "High-speed rendering of page previews",
      "Download split pages as a new PDF document",
      "100% private client-side processing",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitPdfClient />
      
      {/* Educational SEO content section */}
      <section className="border-t border-white/5 bg-[#09090f]/50 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Split and Extract Pages from PDF
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to extract a single-page CV from a multi-page portfolio, or separate pages from a large report? Our local PDF splitter lets you cut documents and extract pages instantly. Here is how:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-amber-400 font-bold text-lg mb-3">01. Import Document</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop your PDF file or click to select. Our browser engine parses the PDF and renders thumbnails for each page.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-amber-400 font-bold text-lg mb-3">02. Choose Pages</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click on specific page thumbnails to select them, or type a custom page range (e.g., "1-2, 5") in the text box.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-amber-400 font-bold text-lg mb-3">03. Download Split PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click 'Extract Selected Pages' to create a new PDF containing only your chosen pages. The download starts instantly.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Can I extract specific pages from a PDF file?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes. You can select exactly which pages you want to keep. Our tool will compile only those specific pages into a brand new PDF file, leaving the original file unchanged.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Are my PDFs uploaded to a server?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No. All page extraction and splitting operations happen locally on your computer inside your web browser. We do not upload or store your documents on any servers. Your files remain completely secure.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">How do I split a PDF by page ranges?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Simply enter the pages you want in the page range input field. You can use ranges like "1-3" or individual pages separated by commas like "1,3,5" to quickly select your pages for extraction.
              </p>
            </div>
            <div className="pb-4">
              <h3 className="text-base font-bold text-white mb-2">Is the page extraction free of cost?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes! CVGrid Convert is completely free. You can split as many files as you need, with no page limit, no size limits, and no watermark on the downloaded PDFs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
