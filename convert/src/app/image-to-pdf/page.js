import ImageToPdfClient from "./image-to-pdf-client";

export const metadata = {
  title: "PNG & JPG to PDF Converter - Combine Images to PDF",
  description:
    "Combine multiple JPG, PNG, WebP, or GIF images into a single clean, high-quality PDF document. 100% private, free, and secure browser-based conversion.",
  keywords: [
    "png to pdf",
    "jpg to pdf",
    "multiple jpg to pdf",
    "combine images to pdf",
    "image to pdf converter",
    "convert png to pdf free",
    "convert jpeg to pdf",
    "merge images to pdf",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/image-to-pdf",
  },
  openGraph: {
    title: "PNG & JPG to PDF Converter - Combine Images to PDF | CVGrid Convert",
    description:
      "Combine multiple JPG, PNG, WebP, or GIF images into a single clean, high-quality PDF document. 100% private, free, and secure browser-based conversion.",
    url: "https://convert.cvgrid.in/image-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNG & JPG to PDF Converter - Combine Images to PDF | CVGrid Convert",
    description:
      "Combine multiple JPG, PNG, WebP, or GIF images into a single clean, high-quality PDF document. 100% private, free, and secure browser-based conversion.",
  },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PNG & JPG to PDF Converter",
    "url": "https://convert.cvgrid.in/image-to-pdf",
    "description": "Combine multiple JPG, PNG, WebP, or GIF images into a single clean, high-quality PDF document. Safe, local, and free conversion.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 support",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
    },
    "featureList": [
      "Combine multiple images into a single PDF",
      "Support for PNG, JPG, JPEG, WebP, and GIF",
      "Custom page sizes (Fit Image, A4, Letter)",
      "Custom page margins and orientations (Portrait, Landscape)",
      "100% private client-side processing",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageToPdfClient />
      
      {/* Educational SEO content section */}
      <section className="border-t border-white/5 bg-[#09090f]/50 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Combine Images into a Single PDF Document
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to turn photos, screenshots, or scanned documents into a clean PDF file? Our local image-to-PDF tool lets you merge multiple images into one document safely. Here is how:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-emerald-400 font-bold text-lg mb-3">01. Upload Images</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Drag and drop your images (PNG, JPG, WebP, GIF) or browse files. You can upload multiple files at once.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-emerald-400 font-bold text-lg mb-3">02. Arrange & Customize</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Reorder your images easily using the up/down arrows. Adjust parameters like page size (Fit to image, A4, or Letter), margin, and orientation.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-emerald-400 font-bold text-lg mb-3">03. Save as PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click the 'Convert & Download PDF' button. Your PDF is generated instantly in your browser and downloaded automatically.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Can I convert multiple JPG files to one PDF?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes! You can upload as many JPG, PNG, or WebP images as you want. Our tool will automatically merge them into a single PDF, following the exact order you set.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">Are my photos uploaded to a server?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                No. All image-to-PDF compilation happens locally on your computer inside your web browser. We do not transmit or save your files on any external servers. Your personal documents are 100% private.
              </p>
            </div>
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white mb-2">What image formats are supported?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                We support PNG, JPG, JPEG, WebP, and GIF formats. All pages are merged in real time into standard high-fidelity PDF documents.
              </p>
            </div>
            <div className="pb-4">
              <h3 className="text-base font-bold text-white mb-2">Can I adjust page margins and page size?</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Yes, our tool provides advanced options to fit each page size exactly to its image dimensions (zero margins/perfect fit) or set standard A4 or Letter sizes with custom margins and orientation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
