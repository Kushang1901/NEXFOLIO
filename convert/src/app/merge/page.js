import MergePdfClient from "./merge-client";

export const metadata = {
  title: "Merge PDF Files Online - Combine PDF Documents",
  description:
    "Combine multiple PDF files into a single document instantly in your browser. 100% private, secure, and free. Files never leave your device.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "join pdf files",
    "merge pdfs online",
    "free pdf merger",
    "combine resume cover letter",
    "pdf joiner free",
    "merge pdf document",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/merge",
  },
  openGraph: {
    title: "Merge PDF Files Online - Combine PDF Documents | CVGrid Convert",
    description:
      "Combine multiple PDF files into a single document instantly in your browser. 100% private, secure, and free. Files never leave your device.",
    url: "https://convert.cvgrid.in/merge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files Online - Combine PDF Documents | CVGrid Convert",
    description:
      "Combine multiple PDF files into a single document instantly in your browser. 100% private, secure, and free. Files never leave your device.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Merge PDF Documents",
    "url": "https://convert.cvgrid.in/merge",
    "description": "Combine multiple PDF files into one single document. Perfect for merging cover letters, resumes, and portfolios. 100% secure client-side processing.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 support",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Combine multiple PDF documents into one",
      "Reorder documents before merging",
      "Fast, client-side merging using pdf-lib",
      "No file size limits",
      "100% private, files never upload",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergePdfClient />
      
      {/* Educational SEO content section */}
      <section className="border-t border-white/5 bg-[#09090f]/50 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Merge Multiple PDF Files
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to combine your resume, cover letter, and transcripts into a single PDF document for a job application? Our local PDF merger compiles your files in seconds. Here is how:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-purple-400 font-bold text-lg mb-3">01. Upload PDF Files</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop your PDF files into the upload area or click to select them. Upload two or more PDFs to merge.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-purple-400 font-bold text-lg mb-3">02. Arrange File Order</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Use the up and down arrow keys next to each file to set the final page sequence. You can also remove any file from the list.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-purple-400 font-bold text-lg mb-3">03. Click Combine</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click 'Merge &amp; Download'. The tool compiles the documents in real time and triggers an instant browser download.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">How can I combine multiple PDF files?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                With CVGrid Convert, merging PDFs is easy and free. Upload your documents, set the desired layout order, and download your combined PDF. No installation, signup, or watermarks.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Is it safe to merge sensitive resumes and portfolios here?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes. CVGrid Convert operates 100% locally. We do not upload your PDF files to any servers. The merging code executes within your browser window, keeping your personal contact details and records completely private.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Will the formatting of my resume change?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No. Our tool uses high-fidelity PDF manipulation engines that read and append the native PDF structures directly without re-rendering or modifying text, layouts, fonts, or styling.
              </p>
            </div>
            <div className="pb-4">
              <h3 className="text-base font-bold text-white mb-2">Is there a limit on file size?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No. Since all operations run locally on your own CPU and RAM, there are no upload throttles or size limitations. You can merge very large portfolios or files smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
