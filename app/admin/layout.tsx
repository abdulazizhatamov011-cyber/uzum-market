import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import "../globals.css";

// Admin panelning o'z root layout'i: do'kon sarlavhasi/footersiz, faqat o'zbekcha
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "cyrillic"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"] });

export const metadata: Metadata = { title: "Admin — Bozorcha", robots: { index: false } };

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="uz" className={`${onest.variable} ${unbounded.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
