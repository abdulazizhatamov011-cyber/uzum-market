import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import AppBanner from "@/components/AppBanner";

// Matn uchun Onest, sarlavha/narx/logo uchun keng va yumaloq Unbounded (bozor peshtaxtasi yozuvlari kabi)
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"] });

export const metadata: Metadata = {
  title: "Bozorcha — onlayn bozor",
  description: "Eksklyuziv tovarlar va aksiyalar. 1 kunda bepul yetkazib berish.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${onest.variable} ${unbounded.variable} h-full antialiased`}>
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
