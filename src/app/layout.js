import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const siteName = "ArtHub";
const siteDescription =
  "ArtHub is a digital art marketplace where independent artists showcase and sell original artworks, and collectors discover and purchase curated pieces directly from creators.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ArtHub | Discover, Collect & Empower Creativity",
    template: "%s | ArtHub",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "ArtHub | Discover, Collect & Empower Creativity",
    description: siteDescription,
    images: [{ url: "/Assets/Hero1.png", width: 1200, height: 630, alt: "ArtHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtHub | Discover, Collect & Empower Creativity",
    description: siteDescription,
    images: ["/Assets/Hero1.png"],
  },
  icons: {
    icon: [
      { url: "/Assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/Assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/Assets/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/Assets/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/Assets/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en" data-theme="light"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}