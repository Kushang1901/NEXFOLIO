import CompressPdfClient from "./compress-client";

export const metadata = {
  title: "Compress PDF Size Online - Reduce PDF File Size Free Under 2MB",
  description:
    "Reduce PDF file size online while maintaining text and image clarity. ATS-friendly PDF compressor for job applications under 2MB. 100% private.",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "shrink pdf online",
    "pdf compressor free",
    "reduce pdf size under 2mb",
    "compress resume pdf",
    "ats friendly pdf compression",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/compress",
  },
  openGraph: {
    title: "Compress PDF Size Online - Reduce PDF File Size Free Under 2MB",
    description:
      "Reduce the file size of your PDF documents online while maintaining text and image quality. 100% private client-side PDF compressor under 2MB.",
    url: "https://convert.cvgrid.in/compress",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Compress PDF Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "Compress PDF Size Online - Reduce PDF File Size Free Under 2MB",
    description:
      "Reduce PDF file size online while maintaining high text and image quality. 100% private client-side PDF compression.",
    images: ["/logo512.png"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://convert.cvgrid.in/compress/#app",
        "name": "Compress PDF Size",
        "url": "https://convert.cvgrid.in/compress",
        "description": "Reduce PDF file size online while maintaining high text and image quality. Beat job portal upload limits (e.g. under 2MB) easily and privately.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern browsers",
        "browserRequirements": "Requires HTML5 support",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Speedy compression (stream/metadata optimization)",
          "Max compression (canvas re-encoding for image heavy PDFs)",
          "Interactive file size comparison showing percentage reduction",
          "100% private client-side processing",
          "Perfect for ATS resumes under 2MB limit"
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
            "name": "Compress PDF",
            "item": "https://convert.cvgrid.in/compress"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://convert.cvgrid.in/compress/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I compress my resume PDF to be under 2MB for job portals?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Upload your resume PDF to our compressor. Choose 'Speedy Compression' or 'Max Compression' to strip redundant metadata and optimize high-res images to beat portal file size caps."
            }
          },
          {
            "@type": "Question",
            "name": "Will compressing my PDF cause ATS (Applicant Tracking Systems) to reject it?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No! Our compression optimizes data streams and embedded graphics while keeping your text layer and fonts intact for 100% ATS compatibility."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Compress PDF File Size Online",
        "description": "Step-by-step instructions to reduce PDF size without losing quality.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Upload PDF",
            "text": "Select the PDF you want to shrink."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Select Compression Level",
            "text": "Choose standard optimization or max compression."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Download Compressed PDF",
            "text": "Save your optimized lightweight PDF file."
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
      <CompressPdfClient />

      {/* Educational SEO & AEO Content Section */}
      <section className="border-t border-white/5 bg-[#09090f]/60 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Compress PDF Size for Job Applications
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Most job portals (Workday, Taleo, Greenhouse, Lever) enforce strict 2MB or 5MB file upload limits. Our browser-based optimizer reduces file size quickly while preserving readability and ATS formatting.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-red-400 font-bold text-lg mb-3">01. Drop Document</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Add your heavy resume, portfolio, or presentation PDF.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-red-400 font-bold text-lg mb-3">02. Instant Shrink</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Stream compression and smart image re-encoding reduce file size by up to 80%.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-red-400 font-bold text-lg mb-3">03. Job-Ready PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Download your ATS-compatible, lightweight PDF file immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
