"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, cities, navLinks } from "@/lib/data";
import { useStore } from "./StoreProvider";
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

export function Logo() {
  return (
    <Link href="/" className="flex items-center shrink-0">
      <Image src="/logo.png" alt="Uzum Market" width={320} height={73} priority className="h-9 sm:h-11 w-auto" />
    </Link>
  );
}

function TopBar() {
  const { city, setCity } = useStore();
  const [menu, setMenu] = useState<null | "city" | "lang">(null);
  return (
    <div className="bg-[#f2f4f7] text-[13px] hidden md:block whitespace-nowrap relative z-50">
      <div className="container-x flex h-9 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <button className="flex items-center gap-1 font-medium" onClick={() => setMenu(menu === "city" ? null : "city")}>
              <PinIcon /> {city} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {menu === "city" && (
              <Dropdown onClose={() => setMenu(null)}>
                <div className="px-3 pt-1 pb-2 text-xs text-muted">Shaharni tanlang</div>
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setMenu(null); }}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f2f4f7] ${c === city ? "text-brand font-medium" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </Dropdown>
            )}
          </div>
          <Link href="/pickup-points" className="text-ink hidden lg:inline hover:text-brand">Topshirish punktlari</Link>
        </div>
        <div className="text-muted hidden xl:block">Buyurtmangizni 1 kunda bepul yetkazib beramiz</div>
        <div className="flex items-center gap-5">
          <Link className="text-brand font-medium" href="/seller">Sotuvchi bo&apos;lish</Link>
          <Link className="text-brand font-medium hidden lg:inline" href="/open-pickup-point">Topshirish punktini ochish</Link>
          <Link href="/faq" className="hover:text-brand">Savol-javob</Link>
          <Link href="/orders" className="hover:text-brand">Buyurtmalarim</Link>
          <div className="relative">
            <button className="flex items-center gap-1.5" onClick={() => setMenu(menu === "lang" ? null : "lang")}>
              <UzFlag /> O&apos;zbekcha
            </button>
            {menu === "lang" && (
              <Dropdown onClose={() => setMenu(null)} right>
                <button onClick={() => setMenu(null)} className="flex w-full items-center gap-2 px-3 py-1.5 rounded-lg text-brand font-medium hover:bg-[#f2f4f7]">
                  <UzFlag /> O&apos;zbekcha
                </button>
                <span className="flex items-center gap-2 px-3 py-1.5 text-muted" title="Tez orada">
                  🇷🇺 Русский <span className="text-[11px]">(tez orada)</span>
                </span>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UzFlag() {
  return (
    <span className="w-4 h-4 rounded-full overflow-hidden flex flex-col">
      <span className="flex-1 bg-[#1eb5ea]" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-[#1eb53a]" />
    </span>
  );
}

function Dropdown({ children, onClose, right }: { children: React.ReactNode; onClose: () => void; right?: boolean }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={`absolute top-7 ${right ? "right-0" : "left-0"} z-50 min-w-48 max-h-80 overflow-auto rounded-xl bg-white p-2 shadow-xl border border-line`}
      >
        {children}
      </div>
    </>
  );
}

function CatalogMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full z-40 bg-white shadow-xl border-t border-line">
      <div className="container-x grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 py-6 max-h-[70vh] overflow-auto">
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#f2f4f7]"
              >
                <span className="text-lg">{c.icon}</span>
                <span className="flex-1">{c.name}</span>
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
              className="rounded-2xl bg-[#f2f4f7] p-5 hover:bg-[#e9ecf1] transition"
            >
              <div className="text-4xl mb-3">{c.icon}</div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted mt-1">Barcha tovarlar →</div>
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
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  // Boshqa sahifaga o'tilganda katalog menyusini yopamiz
  useEffect(() => setOpen(false), [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  };

  return (
    <header className="sticky top-0 z-30 bg-white">
      <TopBar />
      <div className="relative">
        <MobileHeader q={q} setQ={setQ} submit={submit} />
        <div className="container-x hidden md:flex items-center gap-4 h-[72px]">
          <Logo />
          <button
            onClick={() => setOpen((o) => !o)}
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-lg bg-brand-soft text-brand font-medium hover:bg-[#e2d4ff] transition"
          >
            {open ? <CloseIcon /> : <MenuIcon />} Katalog
          </button>
          <form onSubmit={submit} className="flex flex-1 h-10 rounded-lg border border-line overflow-hidden focus-within:border-brand">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Mahsulotlar va turkumlar izlash"
              className="flex-1 min-w-0 px-4 text-sm outline-none"
            />
            <button type="submit" aria-label="Qidirish" className="px-5 sm:px-8 bg-[#f2f4f7] hover:bg-[#e9ecf1]">
              <SearchIcon />
            </button>
          </form>
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href={user ? "/profile" : "/login"} className="flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[#f2f4f7] max-w-40">
              <UserIcon /> <span className="truncate">{user ? user.name : "Kirish"}</span>
            </Link>
            <Link href="/favorites" className="relative flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[#f2f4f7]">
              <HeartIcon /> Saralangan
              {favorites.length > 0 && <Badge n={favorites.length} />}
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[#f2f4f7]">
              <BagIcon /> Savat
              {cartCount > 0 && <Badge n={cartCount} />}
            </Link>
          </nav>
        </div>
        <div className="container-x hidden md:flex items-center gap-6 h-10 text-sm text-muted overflow-x-auto no-scrollbar">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`whitespace-nowrap hover:text-ink ${l.accent ? "text-ink font-medium" : ""}`}
            >
              {l.accent && "💳 "}
              {l.label}
            </Link>
          ))}
          <button className="flex items-center gap-1 whitespace-nowrap hover:text-ink" onClick={() => setOpen(true)}>
            Yana <ChevronDown className="w-3.5 h-3.5" />
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
  const [picker, setPicker] = useState(false);
  return (
    <div className="md:hidden px-4 pt-2 pb-2.5">
      <div className="flex items-center justify-between h-8">
        <button onClick={() => setPicker(true)} className="flex items-center gap-1 font-medium text-[15px]">
          <PinIcon className="w-5 h-5" /> {city} <ChevronDown className="w-4 h-4" />
        </button>
        <span className="text-[13px] text-muted">yetkazib beriladigan shahar</span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <form onSubmit={submit} className="flex flex-1 items-center gap-2 h-10 rounded-xl bg-[#eef0f4] px-3">
          <SearchIcon className="w-5 h-5 text-ink/80 shrink-0" />
          <input
            type="search"
            enterKeyHint="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mahsulotlar va turkumlar izlash"
            className="flex-1 min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
        </form>
        <Link href="/favorites" aria-label="Saralangan" className="relative">
          <HeartIcon className="w-6 h-6" />
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-md bg-brand text-white text-[11px] grid place-items-center">
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
              <span className="font-semibold text-lg">Shaharni tanlang</span>
              <button aria-label="Yopish" onClick={() => setPicker(false)}>
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm text-muted mb-3">Tovarlar assortimenti va yetkazib berish shaharga bog&apos;liq</p>
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
                {c}
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
