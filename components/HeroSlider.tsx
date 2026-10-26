"use client";

import Link from "@/components/LocalLink";
import { useEffect, useRef, useState } from "react";
import { useCatalog } from "./CatalogProvider";
import { ChevronLeft, ChevronRight } from "./Icons";
import BannerSlide from "./BannerSlide";
import { useI18n } from "./I18nProvider";

export default function HeroSlider() {
  // Admin hamma bannerlarni o'chirgan bo'lsa, blok ko'rsatilmaydi
  if (!useCatalog().banners.length) return null;
  return (
    <>
      <MobileBanners />
      <div className="hidden md:block">
        <DesktopSlider />
      </div>
    </>
  );
}

function DesktopSlider() {
  const { banners } = useCatalog();
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = banners.length;

  const prev = () => setI((x) => (x - 1 + n) % n);
  const next = () => setI((x) => (x + 1) % n);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 5000);
    return () => clearInterval(t);
  }, [n, paused]);

  return (
    <div
      className="relative overflow-hidden rounded-[28px] aspect-[3/1] bg-surface group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {banners.map((b, k) => (
          <Link key={b.title} href={b.href} className="min-w-full h-full" tabIndex={k === i ? 0 : -1}>
            <BannerSlide b={b} eager={k === 0} />
          </Link>
        ))}
      </div>

      {/* Pastki o'ng burchak: "joriy / jami" va strelkalar bitta kapsulada */}
      <div className="absolute right-5 bottom-5 flex items-center gap-1 rounded-full bg-white/95 text-ink p-1 pl-3.5">
        <span className="font-display text-[13px] font-medium tabular-nums mr-1.5" aria-live="polite">
          {i + 1} / {n}
        </span>
        <button aria-label={t.home.prevBanner} onClick={prev} className="w-8 h-8 grid place-items-center rounded-full hover:bg-surface">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button aria-label={t.home.nextBanner} onClick={next} className="w-8 h-8 grid place-items-center rounded-full bg-ink text-white hover:bg-[#1d3266]">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Telefonda: kartalar yonma-yon, chetida keyingisi ko'rinib turadi, barmoq bilan suriladi
function MobileBanners() {
  const { banners } = useCatalog();
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el || !el.firstElementChild) return;
      const step = (el.firstElementChild as HTMLElement).offsetWidth + 8;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      ref={ref}
      onTouchStart={() => setPaused(true)}
      className="md:hidden -mx-4 flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[5.5%]"
    >
      {banners.map((b, k) => (
        <Link key={b.title} href={b.href} className="shrink-0 w-[89%] snap-center">
          <div className="aspect-[2.2/1] rounded-[20px] overflow-hidden">
            <BannerSlide b={b} eager={k < 2} phone />
          </div>
        </Link>
      ))}
    </div>
  );
}
