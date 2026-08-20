import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  metadataBase: new URL("https://convert.cvgrid.in"),
  title: {
    default: "CVGrid Convert – Free Online PDF & Document Utilities",
    template: "%s | CVGrid Convert",
  },
  description:
    "Free, 100% private browser-native PDF converter & document suite. Convert multiple PDFs to PNG/JPG, multiple images to PDF, merge, split, and compress files locally. Zero server uploads.",
  applicationName: "CVGrid Convert",
  authors: [{ name: "CVGrid", url: "https://cvgrid.in" }],
  creator: "CVGrid",
  publisher: "CVGrid",
  category: "utilities",
  keywords: [
    "pdf to png",
    "multiple pdf to image",
    "batch pdf to png",
    "png to pdf",
    "multiple images to pdf",
    "batch images to pdf",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "file converter",
    "resume tools",
    "online document converter",
    "free pdf converter",
    "pdf to jpg",
    "jpg to pdf",
    "pdf splitter",
    "pdf merger",
    "compress pdf size",
    "private pdf tools",
  ],
  alternates: {
    canonical: "https://convert.cvgrid.in",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/logo192.png", type: "image/png", sizes: "192x192" },
      { url: "/logo512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "CVGrid Convert – Free Online PDF & Document Utilities",
    description:
      "Convert multiple PDFs to images, multiple images to PDF, merge, split, and compress files directly in your browser. 100% private, free, and secure.",
    url: "https://convert.cvgrid.in",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "CVGrid Convert Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    creator: "@cvgrid",
    title: "CVGrid Convert – Free Online PDF & Document Utilities",
    description:
      "Convert multiple PDFs to images, images to PDF, merge, split, and compress documents instantly in your browser. 100% private and secure.",
    images: ["/logo512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/logo192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0f131b] text-[#dfe2ed] font-sans selection:bg-indigo-500/30 selection:text-white">
        <Navbar />
        <main className="flex-grow pt-16 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
