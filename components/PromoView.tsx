"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/data";
import ProductCard from "./ProductCard";
import { ChevronDown, ChevronRight, CloseIcon } from "./Icons";

const PAGE = 48;

const sorts = {
  popular: { label: "Ommabop", fn: (a: Product, b: Product) => b.reviews - a.reviews },
  cheap: { label: "Arzonroq", fn: (a: Product, b: Product) => a.price - b.price },
  expensive: { label: "Qimmatroq", fn: (a: Product, b: Product) => b.price - a.price },
  rating: { label: "Yuqori reyting", fn: (a: Product, b: Product) => b.rating - a.rating || b.reviews - a.reviews },
  discount: {
    label: "Chegirma kattaroq",
    fn: (a: Product, b: Product) => b.price / b.oldPrice - a.price / a.oldPrice,
  },
};
type SortKey = keyof typeof sorts;

const toggle = (set: string[], v: string) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

export default function PromoView({
  title,
  items,
  subcategories,
  ages,
}: {
  title: string;
  items: Product[];
  subcategories: string[];
  ages: string[];
}) {
  const bounds = useMemo(
    () => ({ min: Math.min(...items.map((p) => p.price)), max: Math.max(...items.map((p) => p.price)) }),
    [items]
  );
  const [lo, setLo] = useState(bounds.min);
  const [hi, setHi] = useState(bounds.max);
  const [sub, setSub] = useState<string | null>(null);
  const [age, setAge] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [country, setCountry] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Filtrlardan biri o'zgarsa, ro'yxat boshidan ko'rsatiladi
  useEffect(() => setShown(PAGE), [lo, hi, sub, age, brand, country, sort]);

  const brands = useMemo(() => [...new Set(items.map((p) => p.brand!))].sort(), [items]);
  const countries = useMemo(() => [...new Set(items.map((p) => p.country!))], [items]);
  const subs = subcategories.filter((s) => items.some((p) => p.subcategory === s));

  const list = useMemo(
    () =>
      items
        .filter(
          (p) =>
            p.price >= lo &&
            p.price <= hi &&
            (!sub || p.subcategory === sub) &&
            (!age.length || age.includes(p.age!)) &&
            (!brand.length || brand.includes(p.brand!)) &&
            (!country.length || country.includes(p.country!))
        )
        .sort(sorts[sort].fn),
    [items, lo, hi, sub, age, brand, country, sort]
  );

  const active = [
    ...(lo !== bounds.min || hi !== bounds.max
      ? [{ label: `${formatPrice(lo)} – ${formatPrice(hi)} so'm`, clear: () => (setLo(bounds.min), setHi(bounds.max)) }]
      : []),
    ...(sub ? [{ label: sub, clear: () => setSub(null) }] : []),
    ...age.map((v) => ({ label: v, clear: () => setAge((s) => toggle(s, v)) })),
    ...brand.map((v) => ({ label: v, clear: () => setBrand((s) => toggle(s, v)) })),
    ...country.map((v) => ({ label: v, clear: () => setCountry((s) => toggle(s, v)) })),
  ];
  const resetAll = () => {
    setLo(bounds.min);
    setHi(bounds.max);
    setSub(null);
    setAge([]);
    setBrand([]);
    setCountry([]);
  };

  const filters = (
    <Filters
      bounds={bounds}
      lo={lo}
      hi={hi}
      setLo={setLo}
      setHi={setHi}
      ages={ages}
      age={age}
      onAge={(v) => setAge((s) => toggle(s, v))}
      brands={brands}
      brand={brand}
      onBrand={(v) => setBrand((s) => toggle(s, v))}
      countries={countries}
      country={country}
      onCountry={(v) => setCountry((s) => toggle(s, v))}
    />
  );

  return (
    <div className="container-x pt-4">
      <nav className="text-[13px] text-muted flex gap-2 mb-6">
        <Link href="/" className="hover:text-ink">Bosh sahifa</Link>/
        <span className="text-ink line-clamp-1">{title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[230px_1fr]">
        <aside className="hidden md:block">{filters}</aside>

        <div className="min-w-0">
          <div className="text-[15px] mb-3">
            Termada quyidagi turkumlardan <b>{list.length}</b> ta tovar
          </div>

          <Chips subs={subs} value={sub} onChange={setSub} />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-5">
            <div className="relative">
              <button onClick={() => setSortOpen((o) => !o)} className="flex items-center gap-1.5 text-sm">
                <span className="text-muted">Avval ko&apos;rsatiladi</span>
                <span className="font-medium">{sorts[sort].label}</span>
                <ChevronDown className={`w-4 h-4 transition ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                  <ul className="absolute left-0 top-8 z-30 w-56 rounded-xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)] py-2">
                    {(Object.keys(sorts) as SortKey[]).map((k) => (
                      <li key={k}>
                        <button
                          onClick={() => {
                            setSort(k);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-surface ${k === sort ? "text-brand font-medium" : ""}`}
                        >
                          {sorts[k].label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <button
              onClick={() => setMobileFilters(true)}
              className="md:hidden h-9 px-4 rounded-lg bg-surface text-sm font-medium"
            >
              Filtrlar{active.length ? ` (${active.length})` : ""}
            </button>
          </div>

          {active.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {active.map((f) => (
                <button
                  key={f.label}
                  onClick={f.clear}
                  className="flex items-center gap-1 h-8 pl-3 pr-2 rounded-lg bg-brand-soft text-brand text-sm"
                >
                  {f.label} <CloseIcon className="w-4 h-4" />
                </button>
              ))}
              <button onClick={resetAll} className="h-8 px-3 text-sm text-muted hover:text-ink">
                Hammasini tozalash
              </button>
            </div>
          )}

          {list.length ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-5 sm:gap-x-4 sm:gap-y-6">
                {list.slice(0, shown).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {shown < list.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShown((s) => s + PAGE)}
                    className="h-12 w-full max-w-md rounded-xl bg-surface font-medium hover:bg-surface-2 transition"
                  >
                    Yana koʻrsatish {Math.min(PAGE, list.length - shown)}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="text-5xl">🔍</div>
              <p className="mt-3 text-muted">Tanlangan filtrlar bo&apos;yicha tovar topilmadi</p>
              <button onClick={resetAll} className="mt-4 h-10 px-5 rounded-full bg-brand text-white text-sm font-medium">
                Filtrlarni tozalash
              </button>
            </div>
          )}
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
          <div className="flex items-center justify-between px-4 h-14 border-b border-line">
            <span className="font-semibold">Filtrlar</span>
            <button aria-label="Yopish" onClick={() => setMobileFilters(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{filters}</div>
          <div className="p-4 border-t border-line flex gap-3">
            <button onClick={resetAll} className="flex-1 h-12 rounded-xl bg-surface font-medium">
              Tozalash
            </button>
            <button
              onClick={() => setMobileFilters(false)}
              className="flex-1 h-12 rounded-full bg-brand text-white font-medium"
            >
              {list.length} ta tovarni ko&apos;rsatish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Chips({ subs, value, onChange }: { subs: string[]; value: string | null; onChange: (v: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative">
      <div ref={ref} className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pr-10">
        {subs.map((s) => (
          <button
            key={s}
            onClick={() => onChange(value === s ? null : s)}
            className={`shrink-0 h-9 px-3 rounded-lg text-sm transition ${
              value === s ? "bg-brand text-white" : "bg-surface hover:bg-surface-2"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <button
        aria-label="Keyingi turkumlar"
        onClick={() => ref.current?.scrollBy({ left: 240 })}
        className="hidden sm:grid absolute right-0 top-0.5 w-8 h-8 rounded-full bg-ink text-white place-items-center shadow"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Filters(props: {
  bounds: { min: number; max: number };
  lo: number;
  hi: number;
  setLo: (n: number) => void;
  setHi: (n: number) => void;
  ages: string[];
  age: string[];
  onAge: (v: string) => void;
  brands: string[];
  brand: string[];
  onBrand: (v: string) => void;
  countries: string[];
  country: string[];
  onCountry: (v: string) => void;
}) {
  const { bounds, lo, hi, setLo, setHi } = props;
  const [allAges, setAllAges] = useState(false);
  const visibleAges = allAges ? props.ages : props.ages.slice(0, 6);
  const pct = (n: number) => ((n - bounds.min) / (bounds.max - bounds.min)) * 100;

  return (
    <div className="space-y-7">
      <section>
        <h3 className="font-semibold mb-3">Turkumlar</h3>
        <Link href="/category/bolalar" className="block px-1.5 py-1 text-sm hover:text-brand">
          Bolalar tovarlari
        </Link>
      </section>

      <section>
        <h3 className="font-semibold mb-3">Narx, baho, so&apos;m</h3>
        <div className="flex gap-2">
          <PriceInput label="dan" value={lo} onCommit={(n) => setLo(Math.min(Math.max(n, bounds.min), hi))} />
          <PriceInput label="oldin" value={hi} onCommit={(n) => setHi(Math.max(Math.min(n, bounds.max), lo))} />
        </div>
        <div className="relative h-6 mt-3">
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-0.5 bg-line rounded" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-brand rounded"
            style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
          />
          <input
            type="range"
            aria-label="Eng kam narx"
            min={bounds.min}
            max={bounds.max}
            step={100}
            value={lo}
            onChange={(e) => setLo(Math.min(Number(e.target.value), hi))}
            className="range-dual absolute inset-0 w-full"
          />
          <input
            type="range"
            aria-label="Eng ko'p narx"
            min={bounds.min}
            max={bounds.max}
            step={100}
            value={hi}
            onChange={(e) => setHi(Math.max(Number(e.target.value), lo))}
            className="range-dual absolute inset-0 w-full"
          />
        </div>
      </section>

      <CheckGroup title="Bolaning yoshi" options={visibleAges} value={props.age} onToggle={props.onAge}>
        {props.ages.length > 6 && (
          <button onClick={() => setAllAges((v) => !v)} className="mt-1 text-sm text-muted hover:text-brand">
            {allAges ? "Yashirish" : `Yana ${props.ages.length - 6}`}
          </button>
        )}
      </CheckGroup>
      <CheckGroup title="Brend" options={props.brands} value={props.brand} onToggle={props.onBrand} />
      <CheckGroup title="Ishlab chiqarish mamlakati" options={props.countries} value={props.country} onToggle={props.onCountry} />
    </div>
  );
}

function PriceInput({ label, value, onCommit }: { label: string; value: number; onCommit: (n: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const commit = () => text && onCommit(Number(text));
  return (
    <label className="flex-1 flex items-center gap-1.5 h-10 rounded-lg border border-line px-2 text-sm focus-within:border-brand">
      <span className="text-muted text-xs">{label}</span>
      <input
        inputMode="numeric"
        value={text}
        onChange={(e) => setText(e.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="w-full min-w-0 outline-none"
      />
    </label>
  );
}

function CheckGroup({
  title,
  options,
  value,
  onToggle,
  children,
}: {
  title: string;
  options: string[];
  value: string[];
  onToggle: (v: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-2.5">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(o)}
              onChange={() => onToggle(o)}
              className="w-[18px] h-[18px] accent-brand"
            />
            {o}
          </label>
        ))}
      </div>
      {children}
    </section>
  );
}
