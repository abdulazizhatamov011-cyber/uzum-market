import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Onest, Unbounded } from "next/font/google";
import "../globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import AppBanner from "@/components/AppBanner";
import { CatalogProvider } from "@/components/CatalogProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { getCatalog } from "@/lib/catalog";
import { getDict, isLang, locales } from "@/lib/i18n";

// Matn uchun Onest, sarlavha/narx/logo uchun keng va yumaloq Unbounded (bozor peshtaxtasi yozuvlari kabi)
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"] });

// Ikki til ham oldindan tayyorlanadi: /… — o'zbekcha (proxy ichkarida /uz ga yo'naltiradi), /ru/… — ruscha
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "uz").meta;
  return {
    title: t.title,
    description: t.description,
    alternates: { languages: { uz: "/", ru: "/ru" } },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  // Katalog server bazasidan (keshlangan) o'qiladi va client komponentlarga uzatiladi
  const { products, banners } = await getCatalog();
  return (
    <html lang={lang} className={`${onest.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <I18nProvider lang={lang}>
          <CatalogProvider products={products} banners={banners}>
            <StoreProvider>
              <AppBanner />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileNav />
            </StoreProvider>
          </CatalogProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
