import PdfToImageClient from "./pdf-to-image-client";

export const metadata = {
  title: "PDF to PNG & JPG Converter - 100% Free & Private",
  description:
    "Convert PDF pages to high-resolution PNG or JPG images instantly in your browser. 100% private and secure client-side PDF to image conversion.",
  keywords: [
    "pdf to png",
    "pdf to jpg",
    "convert pdf to image",
    "pdf pages to png",
    "pdf to jpeg converter",
    "pdf to image converter online",
    "free pdf to png",
    "client-side pdf converter",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/pdf-to-image",
  },
  openGraph: {
    title: "PDF to PNG & JPG Converter - 100% Free & Private | CVGrid Convert",
    description:
      "Convert PDF pages to high-resolution PNG or JPG images instantly in your browser. 100% private and secure client-side PDF to image conversion.",
    url: "https://convert.cvgrid.in/pdf-to-image",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to PNG & JPG Converter - 100% Free & Private | CVGrid Convert",
    description:
      "Convert PDF pages to high-resolution PNG or JPG images instantly in your browser. 100% private and secure client-side PDF to image conversion.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF to PNG & JPG Converter",
    "url": "https://convert.cvgrid.in/pdf-to-image",
    "description": "Convert PDF pages to high-resolution PNG or JPG images instantly in your browser. 100% private, free, and secure client-side PDF to image conversion.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 support",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
    "featureList": [
      "100% private client-side processing",
      "Convert PDF pages to high-quality PNG or JPG",
      "No file size limits",
      "Download individual page images or all pages as a ZIP archive",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToImageClient />
      
      {/* Educational SEO content section */}
      <section className="border-t border-white/5 bg-[#09090f]/50 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Convert PDF to PNG or JPG Online
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to convert a PDF document into high-resolution images? Our free, local-first converter processes everything directly in your browser. Follow these simple steps:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-indigo-400 font-bold text-lg mb-3">01. Upload PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop your PDF file or click to browse. There are no file size restrictions since the file stays on your computer.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-indigo-400 font-bold text-lg mb-3">02. Auto-Process</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our client-side engine renders each page of your PDF into high-fidelity image representations instantly using high-resolution scaling.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-indigo-400 font-bold text-lg mb-3">03. Download Images</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Preview your rendered pages and download individual PNGs or click 'Download All' to package them all into a single ZIP file.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">How can I convert a PDF to an image for free?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                CVGrid Convert is a 100% free tool that requires no sign-up or credit card. Simply upload your PDF file, and our tool will generate high-quality PNG or JPG files immediately for free.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Are my documents secure when converting PDF to PNG?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes, completely. Unlike other online converters that upload your PDFs to their cloud servers (exposing sensitive resumes or documents), CVGrid Convert processes all files locally inside your browser. Your files never leave your device.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Can I convert multiple pages?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes! Our converter parses every single page of your PDF and renders them all. You can download individual pages or package them all into a single ZIP file with one click.
              </p>
            </div>
            <div className="pb-4">
              <h3 className="text-base font-bold text-white mb-2">What is the resolution of the output images?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We render the PDF pages at a high scale (2.0x zoom) to ensure the text remains extremely sharp and readable when converted to PNG. It's ideal for sharing resume pages on LinkedIn or portfolio platforms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
