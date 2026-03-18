import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { LanguageProvider } from '@/lib/LanguageContext';
import "./globals.css";
import '@/styles/RichText.css';
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalScene from "@/components/Scene";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "St. Mary's Malankara Orthodox Syrian Church",
  description: "St. Mary's Malankara Orthodox Syrian Church, Muthupilakkadu, Kollam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <GlobalScene />
              <SmoothScroll>
                <Navigation />
                <main className="main-content">
                  {children}
                </main>
                <Footer />
              </SmoothScroll>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
