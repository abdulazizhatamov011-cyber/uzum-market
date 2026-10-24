import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductGrid from "@/components/ProductGrid";
import WeeklyDeals from "@/components/WeeklyDeals";
import { ChevronRight } from "@/components/Icons";
import { products, quickCategories } from "@/lib/data";
import { nestleProducts } from "@/lib/promo";

// Deterministik "aralashtirish" — server va client bir xil natija beradi
const shuffled = [...products].sort((a, b) => ((a.id * 37) % 51) - ((b.id * 37) % 51));
const popular = shuffled.slice(0, 10);
const discounted = [...products]
  .sort((a, b) => b.oldPrice / b.price - a.oldPrice / a.price)
  .slice(0, 10);
const weekly = [...nestleProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 10);

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1 mb-4 sm:mb-5">
      <h2 className="text-[22px] sm:text-[28px] font-bold">{title}</h2>
      <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="container-x pt-1 md:pt-2">
      <HeroSlider />

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {quickCategories.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex items-center gap-3 h-14 rounded-xl bg-[#f2f4f7] px-3 hover:bg-[#e9ecf1] transition"
          >
            <span className="text-2xl">{c.icon}</span>
            <span className="flex-1 text-center text-sm font-medium">{c.label}</span>
          </Link>
        ))}
      </div>

      <WeeklyDeals items={weekly} href="/promo/nestle-baby-me" />

      <section className="mt-6 md:mt-10">
        {/* Telefonda "Mashhur" — tagiga chizilgan tab ko'rinishida */}
        <div className="md:hidden mb-4 text-center">
          <span className="inline-block px-6 pb-2 font-medium">Mashhur</span>
          <div className="h-[3px] rounded-full bg-brand" />
        </div>
        <div className="hidden md:block">
          <SectionTitle title="Mashhur" href="/category/elektronika" />
        </div>
        <ProductGrid items={popular} />
      </section>

      <section className="mt-12">
        <div className="rounded-2xl bg-gradient-to-r from-[#ff3d00] to-[#ff9500] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-widest opacity-80">Faqat bugun</div>
            <div className="text-2xl sm:text-3xl font-black">Arzon narxlar kafolati 🔥</div>
          </div>
          <Link href="/search?q=" className="self-start sm:self-auto rounded-xl bg-white text-ink font-semibold px-6 h-12 grid place-items-center">
            Barcha aksiyalar
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle title="Katta chegirmalar" href="/search?q=" />
        <ProductGrid items={discounted} />
      </section>

      <section className="mt-12">
        <SectionTitle title="Siz uchun tavsiyalar" href="/search?q=" />
        <ProductGrid items={shuffled.slice(10)} step={15} />
      </section>
    </div>
  );
}
