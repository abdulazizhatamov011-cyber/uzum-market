"use client";

import BrandMark from "./BrandMark";
import Link from "@/components/LocalLink";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { catName, categories, categoryCover, cities, cityName, navLinks } from "@/lib/data";
import { localize, stripLocale, type Lang } from "@/lib/i18n";
import CategoryThumb from "./CategoryThumb";
import { useCatalog } from "./CatalogProvider";
import { useStore } from "./StoreProvider";
import { useI18n } from "./I18nProvider";
import {
  BagIcon,
  ChevronDown,
  ChevronRight,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  PinIcon,
  SearchIcon,
  UserIcon,
} from "./Icons";

// Shu sahifaning boshqa tildagi manzili (so'rov parametrlari saqlanadi)
function useSwitchLang() {
  const router = useRouter();
  const pathname = usePathname();
  return (to: Lang) => {
    const target = localize(to, stripLocale(pathname)) + window.location.search + window.location.hash;
    router.push(target);
  };
}

export function Logo({ small }: { small?: boolean }) {
  const { t } = useI18n();
  return (
    <Link href="/" aria-label={t.header.homeAria} className="flex items-center gap-2 shrink-0">
      <BrandMark className={small ? "w-8 h-8" : "w-10 h-10"} />
      <span className={`font-display font-bold tracking-tight text-ink leading-none ${small ? "text-[19px]" : "text-[23px]"}`}>
        bozorcha
      </span>
    </Link>
  );
}

const langNames: Record<Lang, string> = { uz: "O'zbekcha", ru: "Русский" };

function TopBar() {
  const { city, setCity } = useStore();
  const { t, lang } = useI18n();
  const switchLang = useSwitchLang();
  const [menu, setMenu] = useState<null | "city" | "lang">(null);
  return (
    <div className="bg-ink text-white/85 text-[13px] hidden md:block whitespace-nowrap relative z-50">
      <div className="container-x flex h-9 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <button className="flex items-center gap-1 font-medium" onClick={() => setMenu(menu === "city" ? null : "city")}>
              <PinIcon /> {cityName(city, lang)} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {menu === "city" && (
              <Dropdown onClose={() => setMenu(null)}>
                <div className="px-3 pt-1 pb-2 text-xs text-muted">{t.header.chooseCity}</div>
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setMenu(null); }}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg hover:bg-surface ${c === city ? "text-brand font-medium" : ""}`}
                  >
                    {cityName(c, lang)}
                  </button>
                ))}
              </Dropdown>
            )}
          </div>
          <Link href="/pickup-points" className="hidden lg:inline hover:text-white">{t.header.pickupPoints}</Link>
        </div>
        <div className="text-white/60 hidden xl:block">{t.header.deliveryNote}</div>
        <div className="flex items-center gap-5">
          <Link className="text-[#9cb8ff] font-medium hover:text-white" href="/seller">{t.header.beSeller}</Link>
          <Link className="text-[#9cb8ff] font-medium hidden lg:inline hover:text-white" href="/open-pickup-point">{t.header.openPoint}</Link>
          <Link href="/faq" className="hover:text-white">{t.header.faq}</Link>
          <Link href="/orders" className="hover:text-white">{t.header.myOrders}</Link>
          <div className="relative">
            <button
              className="flex items-center gap-1.5"
              aria-label={t.header.language}
              aria-expanded={menu === "lang"}
              onClick={() => setMenu(menu === "lang" ? null : "lang")}
            >
              <Flag lang={lang} /> {langNames[lang]}
            </button>
            {menu === "lang" && (
              <Dropdown onClose={() => setMenu(null)} right>
                {(["uz", "ru"] as const).map((l) => (
                  <button
                    key={l}
                    lang={l}
                    onClick={() => {
                      setMenu(null);
                      if (l !== lang) switchLang(l);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface ${l === lang ? "text-brand font-medium" : ""}`}
                  >
                    <Flag lang={l} /> {langNames[l]}
                  </button>
                ))}
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Flag({ lang }: { lang: Lang }) {
  const colors = lang === "uz" ? ["#1eb5ea", "#ffffff", "#1eb53a"] : ["#ffffff", "#0039a6", "#d52b1e"];
  return (
    <span className="w-4 h-4 rounded-full overflow-hidden flex flex-col ring-1 ring-black/10" aria-hidden>
      {colors.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

function Dropdown({ children, onClose, right }: { children: React.ReactNode; onClose: () => void; right?: boolean }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`absolute top-7 ${right ? "right-0" : "left-0"} z-50 min-w-48 max-h-80 overflow-auto rounded-2xl bg-white text-ink p-2 shadow-xl border border-line`}
      >
        {children}
      </div>
    </>
  );
}

function CatalogMenu({ onClose }: { onClose: () => void }) {
  const { products } = useCatalog();
  const { t, lang } = useI18n();
  return (
    <div className="absolute left-0 right-0 top-full z-40 bg-white shadow-xl border-t border-line">
      <div className="container-x grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 py-6 max-h-[70vh] overflow-auto">
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-full px-3 py-2 hover:bg-surface"
              >
                <CategoryThumb c={c} src={categoryCover(c, products)} className="w-8 h-8 rounded-full" />
                <span className="flex-1">{catName(c, lang)}</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden md:grid grid-cols-3 gap-4 content-start">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              onClick={onClose}
              className="rounded-2xl bg-surface p-5 hover:bg-surface-2 transition"
            >
              <CategoryThumb c={c} src={categoryCover(c, products)} className="w-16 h-16 rounded-2xl mb-3" />
              <div className="font-semibold">{catName(c, lang)}</div>
              <div className="text-sm text-muted mt-1">{t.header.allGoods}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, favorites, user } = useStore();
  const { t, lang, href } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  // Boshqa sahifaga o'tilganda katalog menyusini yopamiz
  useEffect(() => setOpen(false), [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(href(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"));
  };

  return (
    <header className="sticky top-0 z-30 bg-white">
      <TopBar />
      <div className="relative">
        <MobileHeader q={q} setQ={setQ} submit={submit} />
        <div className="container-x hidden md:flex items-center gap-3 h-[76px]">
          <Logo />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="hidden md:flex items-center gap-2 h-11 pl-4 pr-5 ml-3 rounded-full bg-brand text-white font-medium hover:bg-brand-dark transition"
          >
            {open ? <CloseIcon /> : <MenuIcon />} {t.header.catalog}
          </button>
          <form onSubmit={submit} className="flex flex-1 items-center h-11 rounded-full bg-surface pl-5 pr-1 border-2 border-transparent focus-within:border-cobalt">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="flex-1 min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
            <button type="submit" aria-label={t.common.search} className="w-9 h-9 grid place-items-center rounded-full bg-brand text-white hover:bg-brand-dark">
              <SearchIcon className="w-[18px] h-[18px]" />
            </button>
          </form>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href={user ? "/profile" : "/login"} className="flex items-center gap-2 h-11 px-3.5 rounded-full hover:bg-surface max-w-40">
              <UserIcon /> <span className="truncate">{user ? user.name : t.header.login}</span>
            </Link>
            <Link href="/favorites" className="relative flex items-center gap-2 h-11 px-3.5 rounded-full hover:bg-surface">
              <HeartIcon /> {t.header.favorites}
              {favorites.length > 0 && <Badge n={favorites.length} />}
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 h-11 px-3.5 rounded-full hover:bg-surface">
              <BagIcon /> {t.header.cart}
              {cartCount > 0 && <Badge n={cartCount} />}
            </Link>
          </nav>
        </div>
        <div className="container-x hidden md:flex items-center gap-2 pb-3 text-sm overflow-x-auto no-scrollbar">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`whitespace-nowrap h-8 px-3.5 grid place-items-center rounded-full border transition ${
                l.accent ? "border-transparent bg-brand-soft text-brand-dark font-medium" : "border-line text-ink/80 hover:border-ink/30 hover:text-ink"
              }`}
            >
              {lang === "ru" ? l.labelRu : l.label}
            </Link>
          ))}
          <button className="flex items-center gap-1 whitespace-nowrap h-8 px-3.5 rounded-full border border-line text-ink/80 hover:text-ink" onClick={() => setOpen(true)}>
            {t.header.more} <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
        {open && <CatalogMenu onClose={() => setOpen(false)} />}
      </div>
    </header>
  );
}

function MobileHeader({
  q,
  setQ,
  submit,
}: {
  q: string;
  setQ: (v: string) => void;
  submit: (e: React.FormEvent) => void;
}) {
  const { city, setCity, favorites } = useStore();
  const { t, lang } = useI18n();
  const switchLang = useSwitchLang();
  const [picker, setPicker] = useState(false);
  const other: Lang = lang === "uz" ? "ru" : "uz";
  return (
    <div className="md:hidden px-4 pt-2.5 pb-3 border-b border-line">
      <div className="flex items-center gap-2 h-9">
        <Logo small />
        <div className="flex-1" />
        <button
          onClick={() => setPicker(true)}
          aria-label={t.header.deliveryCity(cityName(city, lang))}
          className="flex items-center gap-1 h-8 pl-2 pr-2.5 rounded-full bg-surface text-[13px] font-medium"
        >
          <PinIcon className="w-4 h-4 text-brand" /> {cityName(city, lang)} <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => switchLang(other)}
          lang={other}
          aria-label={langNames[other]}
          className="h-8 px-2.5 rounded-full border border-line text-[12px] font-semibold uppercase"
        >
          {other}
        </button>
      </div>
      <div className="flex items-center gap-3 mt-2.5">
        <form onSubmit={submit} className="flex flex-1 items-center gap-2 h-11 rounded-full bg-surface pl-4 pr-1 border-2 border-transparent focus-within:border-cobalt">
          <input
            type="search"
            enterKeyHint="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="flex-1 min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <button type="submit" aria-label={t.common.search} className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-brand text-white">
            <SearchIcon className="w-[18px] h-[18px]" />
          </button>
        </form>
        <Link href="/favorites" aria-label={t.header.favorites} className="relative">
          <HeartIcon className="w-6 h-6" />
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[11px] grid place-items-center">
              {favorites.length}
            </span>
          )}
        </Link>
      </div>

      {picker && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setPicker(false)}>
          <div
            className="w-full max-h-[75vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">{t.header.chooseCity}</span>
              <button aria-label={t.common.close} onClick={() => setPicker(false)}>
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm text-muted mb-3">{t.header.cityHint}</p>
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  setPicker(false);
                }}
                className={`flex w-full items-center justify-between py-3 border-b border-line text-left ${
                  c === city ? "text-brand font-medium" : ""
                }`}
              >
                {cityName(c, lang)}
                {c === city && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -top-0.5 left-6 min-w-[18px] h-[18px] px-1 rounded-md bg-brand text-white text-[11px] grid place-items-center">
      {n}
    </span>
  );
}
