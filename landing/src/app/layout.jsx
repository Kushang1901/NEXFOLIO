import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

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

const BASE_URL = "https://cvgrid.in";
const SITE_NAME = "CVGrid";
const SITE_TITLE = "CVGrid: Best Free AI Resume Builder & CV Maker Online";
const SITE_DESC =
    "Build your career with CVGrid, the best free AI resume builder and professional CV maker online. Create an ATS-friendly resume in minutes. Choose from 18+ templates, generate AI content, and download instantly.";

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#08080c" },
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    colorScheme: "dark",
};

export const metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME} – Free AI Resume Builder`,
    },
    description: SITE_DESC,
    keywords: [
        "free resume maker", "AI resume builder", "free AI resume builder",
        "online resume maker", "resume generator free", "AI CV maker",
        "resume creator online", "create resume online free",
        "ATS friendly resume", "ATS resume builder", "ATS optimized resume",
        "CVGrid", "cvgrid.in"
    ],
    authors: [{ name: "Kushang Acharya" }],
    creator: "Kushang Acharya",
    publisher: "CVGrid",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <body className="bg-[#08080c] text-white antialiased">
                {children}
            </body>
        </html>
    );
}
