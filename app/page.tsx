import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductGrid from "@/components/ProductGrid";
import WeeklyDeals from "@/components/WeeklyDeals";
import { categories, products } from "@/lib/data";
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
    <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
      <h2 className="text-[21px] sm:text-[26px]">{title}</h2>
      <Link href={href} className="shrink-0 text-sm font-medium text-cobalt hover:underline underline-offset-4">
        Hammasi
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="container-x pt-3 md:pt-1">
      <HeroSlider />

      {/* Turkumlar — bozor rastalari kabi dumaloq belgilar qatori */}
      <nav aria-label="Turkumlar" className="-mx-4 mt-5 md:mx-0">
        <ul className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar px-4 md:px-0 md:justify-between">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/category/${c.slug}`} className="group flex w-[68px] flex-col items-center gap-1.5 text-center">
                <span className="grid place-items-center w-[60px] h-[60px] rounded-full bg-surface text-[28px] transition group-hover:bg-brand-soft">
                  {c.icon}
                </span>
                <span className="text-[12px] leading-tight line-clamp-2">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <WeeklyDeals items={weekly} href="/promo/nestle-baby-me" />

      <section className="mt-9">
        <SectionTitle title="Ko'p sotilayotganlar" href="/category/elektronika" />
        <ProductGrid items={popular} />
      </section>

      <section className="mt-12 rounded-[28px] bg-brand-soft px-6 py-7 sm:px-10 sm:py-9 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <h2 className="text-[22px] sm:text-[28px] text-ink">Kafolatlangan narx</h2>
          <p className="mt-2 text-ink/75">
            Belgisi bor tovarni boshqa joyda arzonroq topsangiz, farqini Bozorcha hisobingizga qaytaramiz.
          </p>
        </div>
        <Link
          href="/search?q="
          className="self-start sm:self-auto shrink-0 rounded-full bg-ink text-white font-medium px-6 h-12 grid place-items-center hover:bg-[#1d3266]"
        >
          Barcha aksiyalar
        </Link>
      </section>

      <section className="mt-12">
        <SectionTitle title="Katta chegirmalar" href="/search?q=" />
        <ProductGrid items={discounted} />
      </section>

      <section className="mt-12">
        <SectionTitle title="Siz uchun tanladik" href="/search?q=" />
        <ProductGrid items={shuffled.slice(10)} step={15} />
      </section>
    </div>
  );
}
