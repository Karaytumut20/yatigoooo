import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { StickyMobileCTA } from "../components/ui/StickyMobileCTA";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bosphorus Yacht Charter",
  description: "Lüks Özel Yat Kiralama Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-[#021C24] text-[#F4FBFA] min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
