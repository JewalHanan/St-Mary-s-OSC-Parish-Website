import type { Metadata } from "next";
import { Roboto, Roboto_Slab } from "next/font/google";
import "./globals.css";
import '@/styles/RichText.css';
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GlobalScene from "@/components/Scene";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700", "800"],
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
      <body className={`${roboto.variable} ${robotoSlab.variable}`}>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
