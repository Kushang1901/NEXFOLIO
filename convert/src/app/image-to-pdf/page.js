import ImageToPdfClient from "./image-to-pdf-client";

export const metadata = {
  title: "Multiple Images to PDF Converter - Combine JPG, PNG, WebP to PDF Free",
  description:
    "Combine multiple JPG, PNG, WebP, or GIF images into a clean, formatted PDF document. Custom page sizes (Fit, A4, Letter), margins, and reordering. 100% private.",
  keywords: [
    "multiple images to pdf",
    "png to pdf",
    "jpg to pdf",
    "batch images to pdf",
    "combine multiple images to pdf",
    "image to pdf converter",
    "convert png to pdf free",
    "merge photos to pdf",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in/image-to-pdf",
  },
  openGraph: {
    title: "Multiple Images to PDF Converter - Combine JPG, PNG, WebP to PDF Free",
    description:
      "Combine multiple JPG, PNG, WebP, or GIF images into a clean, high-quality PDF document. 100% private, free, and secure browser-based conversion.",
    url: "https://convert.cvgrid.in/image-to-pdf",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Multiple Images to PDF Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "Multiple Images to PDF Converter - Combine JPG, PNG, WebP to PDF Free",
    description:
      "Combine multiple JPG, PNG, WebP, or GIF images into a single clean, high-quality PDF document.",
    images: ["/logo512.png"],
  },
};

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://convert.cvgrid.in/image-to-pdf/#app",
        "name": "Multiple Images to PDF Converter",
        "url": "https://convert.cvgrid.in/image-to-pdf",
        "description": "Combine multiple JPG, PNG, WebP, or GIF images into a single clean, high-quality PDF document. 100% client-side privacy.",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All modern browsers",
        "browserRequirements": "Requires HTML5 & Canvas support",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Combine multiple images (JPG, PNG, WebP, GIF) into one PDF",
          "Custom page format support (Fit Image, A4, US Letter)",
          "Orientation and margin controls",
          "Visual reordering of image sequence",
          "100% private local processing"
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
            "name": "Multiple Images to PDF",
            "item": "https://convert.cvgrid.in/image-to-pdf"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://convert.cvgrid.in/image-to-pdf/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I combine different image formats like PNG and JPG in one PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! You can mix PNG, JPG, JPEG, WebP, and GIF images in the same batch. They will all be cleanly rendered and assembled into your unified PDF document."
            }
          },
          {
            "@type": "Question",
            "name": "Can I reorder the images before generating the PDF?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Each image card provides Move Up and Move Down controls so you can set the exact order of pages before saving."
            }
          },
          {
            "@type": "Question",
            "name": "Does this tool support standard paper sizes like A4 or Letter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. You can choose Fit Image, A4, or US Letter, with customizable Portrait or Landscape orientation and optional page margins."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Convert Multiple Images to a Single PDF",
        "description": "Step-by-step instructions for converting multiple images into a PDF document.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Upload Images",
            "text": "Drag and drop or select multiple JPG, PNG, or WebP images."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Arrange & Configure",
            "text": "Reorder the images and select your desired page size (Fit, A4, Letter) and margins."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Convert & Download",
            "text": "Click Convert to PDF to immediately generate and download your compiled PDF."
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
      <ImageToPdfClient />

      {/* Educational SEO & AEO Content Section */}
      <section className="border-t border-white/5 bg-[#09090f]/60 py-16 mt-auto">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white mb-6">
            How to Combine Multiple Images to PDF Online
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Need to turn multiple certificates, receipts, portfolio snapshots, or photos into a clean PDF document? Our free client-side image to PDF converter processes everything instantly in your browser.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-emerald-400 font-bold text-lg mb-3">01. Select Images</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Add multiple PNG, JPG, WebP, or GIF files. There are no file size limits since your files remain on your computer.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-emerald-400 font-bold text-lg mb-3">02. Reorder & Style</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Reorder pages easily and choose standard paper formats (Fit Image, A4, or Letter) with custom page margins.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <div className="text-emerald-400 font-bold text-lg mb-3">03. Instant Export</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Click Convert to PDF to assemble all images into a unified, high-quality document ready for sharing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
