import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Partner with DialysisOnGo",
  description: "Make your center easier to discover when patients travel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth light" data-scroll-behavior="smooth" style={{ colorScheme: 'light' }}>
      <body className={`${inter.variable} ${lora.variable} antialiased min-h-screen flex flex-col bg-white text-slate-900`}>
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img 
                src="https://dialysisongo.com/_next/static/media/Color_logo_png.0159e7b6.png" 
                alt="DialysisOnGo Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/#why-partner" className="text-text hover:text-primary transition-colors">Why Partner</Link>
              <Link href="/#network" className="text-text hover:text-primary transition-colors">Network</Link>
              <Link href="/onboarding" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                Check Eligibility →
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 pt-20">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
