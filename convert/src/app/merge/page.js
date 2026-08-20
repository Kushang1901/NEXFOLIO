import MergePdfClient from "./merge-client";

export const metadata = {
  title: "Merge PDF Files Online - Combine Multiple PDF Documents Free",
  description:
    "Combine multiple PDF files into a single document instantly in your browser. Reorder documents, merge resumes and cover letters. 100% private and free.",
  keywords: [
    "merge pdf",
    "combine pdf files",
    "join pdf online",
    "merge multiple pdfs",
    "free pdf merger",
    "combine resume and cover letter",
    "pdf joiner free",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/merge",
  },
  openGraph: {
    title: "Merge PDF Files Online - Combine Multiple PDF Documents Free",
    description:
      "Combine multiple PDF files into a single document instantly in your browser. 100% private, secure, and free. Files never leave your device.",
    url: "https://convert.cvgrid.in/merge",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Merge PDF Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "Merge PDF Files Online - Combine Multiple PDF Documents Free",
    description:
      "Combine multiple PDF files into a single document instantly in your browser. 100% private, secure, and free.",
    images: ["/logo512.png"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://convert.cvgrid.in/merge/#app",
        "name": "Merge PDF Documents",
        "url": "https://convert.cvgrid.in/merge",
        "description": "Combine multiple PDF files into one single document. Perfect for merging cover letters, resumes, and portfolios. 100% secure client-side processing.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern browsers",
        "browserRequirements": "Requires HTML5 support",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Combine multiple PDF documents into one",
          "Reorder documents before merging",
          "Fast, client-side merging using pdf-lib",
          "No file size limits",
          "100% private, files never upload"
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
            "name": "Merge PDFs",
            "item": "https://convert.cvgrid.in/merge"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://convert.cvgrid.in/merge/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I merge my resume, cover letter, and certificates into one PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply drag and drop all your PDF files into the upload area. Use the up and down arrow controls to set your desired page order, then click 'Merge PDFs' to download the combined document."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a limit on how many PDF files I can merge?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. You can merge as many PDF files as your computer's memory can process. The process runs 100% locally in your browser."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Merge Multiple PDF Files",
        "description": "Quick guide on combining several PDF documents into a single file.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Upload PDFs",
            "text": "Add all the PDF files you wish to merge."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Reorder Files",
            "text": "Arrange the files in the order you want them to appear."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Merge & Download",
            "text": "Click Merge PDFs to combine all documents into one."
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
      <MergePdfClient />

      {/* Educational SEO & AEO Content Section */}
      <section className="border-t border-white/5 bg-[#09090f]/60 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Combine and Merge PDF Files Online
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to combine multiple PDF files into one continuous document? Our free browser-native merger allows you to bundle resumes, recommendation letters, certificates, and portfolios in seconds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-purple-400 font-bold text-lg mb-3">01. Add Files</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Upload two or more PDF files from your computer or phone.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-purple-400 font-bold text-lg mb-3">02. Arrange Sequence</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Use the quick reorder controls to place your resume, cover letter, and attachments in order.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-purple-400 font-bold text-lg mb-3">03. Download Combined PDF</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Download your merged PDF file immediately. 100% private and water-mark free.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
