import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import AppBanner from "@/components/AppBanner";
import SiteChrome from "@/components/SiteChrome";
import { CatalogProvider } from "@/components/CatalogProvider";
import { getCatalog } from "@/lib/catalog";

// Matn uchun Onest, sarlavha/narx/logo uchun keng va yumaloq Unbounded (bozor peshtaxtasi yozuvlari kabi)
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"] });

export const metadata: Metadata = {
  title: "Bozorcha — onlayn bozor",
  description: "Eksklyuziv tovarlar va aksiyalar. 1 kunda bepul yetkazib berish.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Katalog server bazasidan (keshlangan) o'qiladi va client komponentlarga uzatiladi
  const { products, banners } = await getCatalog();
  return (
    <html lang="uz" className={`${onest.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CatalogProvider products={products} banners={banners}>
          <StoreProvider>
            <SiteChrome
              top={
                <>
                  <AppBanner />
                  <Header />
                </>
              }
              bottom={
                <>
                  <Footer />
                  <MobileNav />
                </>
              }
            >
              {children}
            </SiteChrome>
          </StoreProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
