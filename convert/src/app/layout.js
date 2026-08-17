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
    default: "CVGrid Convert - Free Online PDF & Document Utilities",
    template: "%s | CVGrid Convert",
  },
  description:
    "Convert PDF to PNG, PNG/JPG to PDF, merge multiple PDFs, split pages, and compress documents instantly in your browser. 100% private and secure, files never leave your device.",
  keywords: [
    "pdf to png",
    "png to pdf",
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
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "CVGrid Convert - Free Online PDF & Document Utilities",
    description:
      "Convert, merge, split, and compress PDF documents instantly in your browser. 100% private and secure, files never leave your device.",
    url: "https://convert.cvgrid.in",
    siteName: "CVGrid Convert",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "CVGrid Convert Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvgrid",
    title: "CVGrid Convert - Free Online PDF & Document Utilities",
    description:
      "Convert, merge, split, and compress PDF documents instantly in your browser. 100% private and secure, files never leave your device.",
    images: ["/logo.png"],
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
      <body className="min-h-full flex flex-col bg-[#0f131b] text-[#dfe2ed] font-sans selection:bg-indigo-500/30 selection:text-white">
        <Navbar />
        <div className="flex-grow pt-16 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
