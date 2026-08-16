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
  title: "CVGrid Convert - Free Online PDF & Document Utilities",
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
  ],
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
