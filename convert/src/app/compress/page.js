import CompressPdfClient from "./compress-client";

export const metadata = {
  title: "Compress PDF Size Online - Reduce PDF File Size",
  description:
    "Reduce the file size of your PDF documents online while maintaining text and image quality. 100% private client-side PDF compressor under 2MB.",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "shrink pdf online",
    "pdf compressor free",
    "reduce pdf size below 2mb",
    "online pdf size reducer",
    "compress resume pdf",
    "free pdf compressor",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/compress",
  },
  openGraph: {
    title: "Compress PDF Size Online - Reduce PDF File Size | CVGrid Convert",
    description:
      "Reduce the file size of your PDF documents online while maintaining text and image quality. 100% private client-side PDF compressor under 2MB.",
    url: "https://convert.cvgrid.in/compress",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Size Online - Reduce PDF File Size | CVGrid Convert",
    description:
      "Reduce the file size of your PDF documents online while maintaining text and image quality. 100% private client-side PDF compressor under 2MB.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compress PDF Size",
    "url": "https://convert.cvgrid.in/compress",
    "description": "Reduce PDF file size online while maintaining high text and image quality. Beat job portal upload limits (e.g. under 2MB) easily and privately.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 support",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Speedy compression (stream/metadata optimization)",
      "Max compression (canvas re-encoding for image heavy PDFs)",
      "Interactive file size comparison showing percentage reduction",
      "100% private client-side processing",
      "Perfect for ATS resumes under 2MB limit",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressPdfClient />
      
      {/* Educational SEO content section */}
      <section className="border-t border-white/5 bg-[#09090f]/50 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Reduce PDF File Size Client-Side
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Struggling to upload your resume because of job portal file size limits (like 2MB or 500KB)? Our local PDF compressor optimizes your files inside your browser, ensuring no loss in text readability. Here is how:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-rose-400 font-bold text-lg mb-3">01. Choose Your File</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop your large PDF file or select it from your local system. The tool will calculate its current size immediately.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-rose-400 font-bold text-lg mb-3">02. Select Compression</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Select 'Speedy' compression for text-heavy documents or 'Max' compression for scanned, image-heavy PDF files.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-rose-400 font-bold text-lg mb-3">03. Compress & Save</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click 'Compress PDF'. Our engine reduces size within seconds, displays the size reduction details, and downloads the optimized file.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">How can I compress a PDF under 2MB for free?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Simply upload your PDF to CVGrid Convert, select the compression level, and click compress. The tool optimizes your document size immediately without charging any fee, adding watermarks, or altering your text structure.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Are my PDFs secure and private?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes, 100%. Our tool executes the compression entirely within your local browser sandbox. We do not upload your documents to any cloud server, ensuring absolute privacy for sensitive documents like CVs, identity proofs, and transcripts.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">What is the difference between Speedy and Max compression?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                <strong>Speedy:</strong> Compresses the document's internal metadata, text streams, and structure without altering image pixels. Ideal for text-based resumes. <br />
                <strong>Max:</strong> Renders PDF pages to high-quality images and re-compresses them using custom canvas encoding. Best for large scanned documents.
              </p>
            </div>
            <div className="pb-4">
              <h3 className="text-base font-bold text-white mb-2">Will the layout or quality of my resume degrade?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                For text-based resumes (Speedy mode), there is absolutely zero degradation. For image-based PDFs (Max mode), we use high-fidelity scaling to minimize any visual loss, keeping the document fully professional and readable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
