import Link from "next/link";
import { categories, categoryCover } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";
import CategoryThumb from "@/components/CategoryThumb";
import { SearchIcon } from "@/components/Icons";

export const metadata = { title: "Sahifa topilmadi — Bozorcha" };

// Bozorcha sumkasi hayron bo'lib atrofga qaraydi, yonida "404" narx yorlig'i tebranadi
function LostBag() {
  return (
    <svg viewBox="0 0 280 290" className="w-[230px] sm:w-[300px] h-auto" role="img" aria-label="Hayron bo'lgan xarid sumkasi va 404 yorlig'i">
      <ellipse className="anim-shadow" cx="118" cy="272" rx="70" ry="8" fill="#13234a" />

      <g className="anim-bob">
        {/* Dasta */}
        <path d="M84 104V80a34 34 0 0 1 68 0v24" fill="none" stroke="#c2410c" strokeWidth="10" strokeLinecap="round" />
        {/* Sumka */}
        <rect x="40" y="96" width="156" height="160" rx="26" fill="#ea580c" />
        <rect x="40" y="96" width="156" height="22" rx="11" fill="#fff" opacity=".12" />
        <circle cx="84" cy="114" r="6" fill="#c2410c" />
        <circle cx="152" cy="114" r="6" fill="#c2410c" />

        {/* Qoshlar — hayron ko'rinish */}
        <path d="M76 140q14-10 28-4" fill="none" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />
        <path d="M132 136q14-6 28 4" fill="none" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />
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
        <ellipse cx="118" cy="214" rx="9" ry="11" fill="#7c2d12" />

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
          <text x="214" y="236" textAnchor="middle" fill="#ffb27a" fontFamily="var(--font-onest)" fontSize="11">
            topilmadi
          </text>
        </g>
      </g>
    </svg>
  );
}

export default async function NotFound() {
  const { products } = await getCatalog();
  const popular = categories.slice(0, 6);

  return (
    <div className="container-x py-10 sm:py-16">
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-14 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <LostBag />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-[28px] sm:text-[40px] leading-[1.1]">Bu rasta bo&apos;sh</h1>
          <p className="mt-3 text-muted max-w-md mx-auto md:mx-0">
            Sahifa topilmadi: havola eskirgan yoki tovar sotuvdan olingan bo&apos;lishi mumkin. Kerakli narsani qidiruvdan
            toping yoki bosh sahifaga qayting.
          </p>

          <form action="/search" className="mt-6 flex items-center gap-2 h-12 max-w-md mx-auto md:mx-0 rounded-full bg-surface pl-5 pr-1.5 border-2 border-transparent focus-within:border-cobalt">
            <input
              name="q"
              type="search"
              placeholder="Masalan, krossovka"
              aria-label="Tovar qidirish"
              className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted"
            />
            <button type="submit" aria-label="Qidirish" className="w-9 h-9 grid place-items-center rounded-full bg-brand text-white hover:bg-brand-dark">
              <SearchIcon className="w-[18px] h-[18px]" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <Link href="/" className="h-11 px-6 grid place-items-center rounded-full bg-ink text-white font-medium hover:bg-[#1d3266]">
              Bosh sahifaga qaytish
            </Link>
            <Link href="/catalog" className="h-11 px-6 grid place-items-center rounded-full border border-line font-medium hover:border-ink/30">
              Katalogni ochish
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-[17px] text-center md:text-left">Ko&apos;pchilik shu yerdan boshlaydi</h2>
        <ul className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {popular.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 text-center">
                <CategoryThumb
                  c={c}
                  src={categoryCover(c, products)}
                  className="w-16 h-16 rounded-full ring-2 ring-transparent transition group-hover:ring-brand"
                />
                <span className="text-[12px] leading-tight">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
