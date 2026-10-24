import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import AppBanner from "@/components/AppBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Uzum Market — O'zbekistondagi milliy marketpleys",
  description: "Eksklyuziv tovarlar va aksiyalar. 1 kunda bepul yetkazib berish.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <AppBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </StoreProvider>
      </body>
    </html>
  );
}
