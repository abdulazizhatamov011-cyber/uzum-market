"use client";

import Link from "@/components/LocalLink";
import { catName, categories, categoryCover } from "@/lib/data";
import { useCatalog } from "./CatalogProvider";
import { useI18n } from "./I18nProvider";
import CategoryThumb from "./CategoryThumb";
import { SearchIcon } from "./Icons";

// Bozorcha sumkasi hayron bo'lib atrofga qaraydi, yonida "404" narx yorlig'i tebranadi
function LostBag() {
  const { t } = useI18n();
  return (
    <svg viewBox="0 0 280 290" className="w-[230px] sm:w-[300px] h-auto" role="img" aria-label={t.notFound.imgAlt}>
      <ellipse className="anim-shadow" cx="118" cy="272" rx="70" ry="8" fill="#13234a" />

      <g className="anim-bob">
        {/* Dasta */}
        <path d="M84 104V80a34 34 0 0 1 68 0v24" fill="none" stroke="#16408a" strokeWidth="10" strokeLinecap="round" />
        {/* Sumka */}
        <rect x="40" y="96" width="156" height="160" rx="26" fill="#1f5fbf" />
        <rect x="40" y="96" width="156" height="22" rx="11" fill="#fff" opacity=".12" />
        <circle cx="84" cy="114" r="6" fill="#16408a" />
        <circle cx="152" cy="114" r="6" fill="#16408a" />

        {/* Qoshlar — hayron ko'rinish */}
        <path d="M76 140q14-10 28-4" fill="none" stroke="#0b1633" strokeWidth="4" strokeLinecap="round" />
        <path d="M132 136q14-6 28 4" fill="none" stroke="#0b1633" strokeWidth="4" strokeLinecap="round" />
        {/* Ko'zlar */}
        <circle cx="92" cy="168" r="18" fill="#fff" />
        <circle cx="144" cy="168" r="18" fill="#fff" />
        <g className="anim-look">
          <circle cx="92" cy="170" r="8.5" fill="#13234a" />
          <circle cx="144" cy="170" r="8.5" fill="#13234a" />
          <circle cx="95" cy="167" r="2.6" fill="#fff" />
          <circle cx="147" cy="167" r="2.6" fill="#fff" />
        </g>
        {/* Og'iz: "o" */}
        <ellipse cx="118" cy="214" rx="9" ry="11" fill="#0b1633" />

        {/* Yorliq ilgagi */}
        <path d="M194 116q14-6 20 4" fill="none" stroke="#13234a" strokeWidth="3" strokeLinecap="round" />
        {/* Tebranuvchi narx yorlig'i — ilgak nuqtasi atrofida aylanadi */}
        <g className="anim-tag-swing" style={{ transformOrigin: "214px 120px" }}>
          <line x1="214" y1="120" x2="214" y2="148" stroke="#13234a" strokeWidth="2.5" />
          <path d="M180 166L214 144l34 22v88a10 10 0 0 1-10 10h-48a10 10 0 0 1-10-10z" fill="#13234a" />
          <circle cx="214" cy="160" r="5" fill="#fff" />
          <text x="214" y="214" textAnchor="middle" fill="#fff" fontFamily="var(--font-unbounded)" fontWeight="700" fontSize="25">
            404
          </text>
          <text x="214" y="236" textAnchor="middle" fill="#9cb8ff" fontFamily="var(--font-onest)" fontSize="11">
            {t.notFound.tag}
          </text>
        </g>
      </g>
    </svg>
  );
}

export default function NotFoundView() {
  const { products } = useCatalog();
  const { t, lang, href } = useI18n();
  const n = t.notFound;
  const popular = categories.slice(0, 6);

  return (
    <div className="container-x py-10 sm:py-16">
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-14 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <LostBag />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-[28px] sm:text-[40px] leading-[1.1]">{n.title}</h1>
          <p className="mt-3 text-muted max-w-md mx-auto md:mx-0">{n.text}</p>

          <form action={href("/search")} className="mt-6 flex items-center gap-2 h-12 max-w-md mx-auto md:mx-0 rounded-full bg-surface pl-5 pr-1.5 border-2 border-transparent focus-within:border-cobalt">
            <input
              name="q"
              type="search"
              placeholder={n.placeholder}
              aria-label={n.searchAria}
              className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted"
            />
            <button type="submit" aria-label={t.common.search} className="w-9 h-9 grid place-items-center rounded-full bg-brand text-white hover:bg-brand-dark">
              <SearchIcon className="w-[18px] h-[18px]" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <Link href="/" className="h-11 px-6 grid place-items-center rounded-full bg-ink text-white font-medium hover:bg-[#1d3266]">
              {n.home}
            </Link>
            <Link href="/catalog" className="h-11 px-6 grid place-items-center rounded-full border border-line font-medium hover:border-ink/30">
              {n.catalog}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-[17px] text-center md:text-left">{n.popular}</h2>
        <ul className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {popular.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 text-center">
                <CategoryThumb
                  c={c}
                  src={categoryCover(c, products)}
                  className="w-16 h-16 rounded-full ring-2 ring-transparent transition group-hover:ring-brand"
                />
                <span className="text-[12px] leading-tight">{catName(c, lang)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
