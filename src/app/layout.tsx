import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        
        <footer className="bg-secondary text-white pt-16 pb-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand */}
              <div className="col-span-1 lg:col-span-1">
                <Link href="/" className="flex items-center mb-6">
                  <img 
                    src="https://dialysisongo.com/_next/static/media/Color_logo_png.0159e7b6.png" 
                    alt="DialysisOnGo Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <p className="text-sm opacity-70 leading-relaxed mb-6">
                  Connecting you with the best dialysis centers across the country. Your health, our priority.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 tracking-wide">Quick Links</h4>
                <ul className="space-y-3 text-sm opacity-70">
                  <li><Link href="/" className="hover:text-primary hover:opacity-100 transition-colors">Home</Link></li>
                  <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Why Choose Us</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-primary hover:opacity-100 transition-colors">How It Works</Link></li>
                  <li><Link href="#" className="hover:text-primary hover:opacity-100 transition-colors">Testimonials</Link></li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="col-span-1 lg:col-span-2">
                <h4 className="text-lg font-bold mb-6 tracking-wide">Contact Us</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm opacity-70">
                  <div>
                    <span className="block font-bold text-white opacity-100 mb-1">Email</span>
                    <a href="mailto:info@dialysisongo.com" className="hover:text-primary transition-colors">info@dialysisongo.com</a>
                  </div>
                  <div>
                    <span className="block font-bold text-white opacity-100 mb-1">Phone</span>
                    <a href="tel:+918750004177" className="hover:text-primary transition-colors">+91 87500 04177</a>
                  </div>
                  <div>
                    <span className="block font-bold text-white opacity-100 mb-1">Location</span>
                    <span>India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <span>© 2026 All rights reserved.</span>
                <span className="hidden md:inline">|</span>
                <span>DPDPA 2023 Compliant</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-white transition-colors">Data Deletion</Link>
                <Link href="#" className="hover:text-white transition-colors">Grievances</Link>
              </div>
            </div>
            
            <div className="text-center text-xs opacity-50 mt-8">
              Maintained & Developed by <a href="#" className="font-bold hover:text-white transition-colors">Sensation Software Solutions Private Limited</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
