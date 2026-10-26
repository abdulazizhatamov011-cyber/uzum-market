import Link from "@/components/LocalLink";
import HeroSlider from "@/components/HeroSlider";
import ProductGrid from "@/components/ProductGrid";
import WeeklyDeals from "@/components/WeeklyDeals";
import { catName, categories, categoryCover } from "@/lib/data";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import CategoryThumb from "@/components/CategoryThumb";
import { getCatalog } from "@/lib/catalog";

function SectionTitle({ title, href, all }: { title: string; href: string; all: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
      <h2 className="text-[21px] sm:text-[26px]">{title}</h2>
      <Link href={href} className="shrink-0 text-sm font-medium text-cobalt hover:underline underline-offset-4">
        {all}
      </Link>
    </div>
  );
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const t = getDict(lang).home;
  const { products } = await getCatalog();
  // Deterministik "aralashtirish" — server va client bir xil natija beradi
  const shuffled = [...products].sort((a, b) => ((a.id * 37) % 51) - ((b.id * 37) % 51));
  const popular = shuffled.slice(0, 10);
  const discounted = [...products].sort((a, b) => b.oldPrice / b.price - a.oldPrice / a.price).slice(0, 10);
  const weekly = products
    .filter((p) => p.promo === "nestle-baby-me")
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 10);

  return (
    <div className="container-x pt-3 md:pt-1">
      <HeroSlider />

      {/* Turkumlar — bozor rastalari kabi dumaloq belgilar qatori */}
      <nav aria-label={t.categoriesAria} className="-mx-4 mt-5 md:mx-0">
        <ul className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar px-4 md:px-0 md:justify-between">
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/category/${c.slug}`} className="group flex w-[72px] sm:w-[84px] flex-col items-center gap-1.5 text-center">
                <CategoryThumb
                  c={c}
                  src={categoryCover(c, products)}
                  className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] rounded-full ring-2 ring-transparent transition group-hover:ring-brand"
                />
                <span className="text-[12px] leading-tight line-clamp-2">{catName(c, lang)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <WeeklyDeals items={weekly} href="/promo/nestle-baby-me" />

      <section className="mt-9">
        <SectionTitle title={t.popular} href="/category/elektronika" all={t.all} />
        <ProductGrid items={popular} />
      </section>

      <section className="mt-12 rounded-[28px] bg-brand-soft px-6 py-7 sm:px-10 sm:py-9 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <h2 className="text-[22px] sm:text-[28px] text-ink">{t.guaranteeTitle}</h2>
          <p className="mt-2 text-ink/75">
            {t.guaranteeText}
          </p>
        </div>
        <Link
          href="/search?q="
          className="self-start sm:self-auto shrink-0 rounded-full bg-ink text-white font-medium px-6 h-12 grid place-items-center hover:bg-[#1d3266]"
        >
          {t.allPromos}
        </Link>
      </section>

      <section className="mt-12">
        <SectionTitle title={t.bigSales} href="/search?q=" all={t.all} />
        <ProductGrid items={discounted} />
      </section>

      <section className="mt-12">
        <SectionTitle title={t.forYou} href="/search?q=" all={t.all} />
        <ProductGrid items={shuffled.slice(10)} step={15} />
      </section>
    </div>
  );
}
