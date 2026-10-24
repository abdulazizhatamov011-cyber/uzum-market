"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { banners } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "./Icons";

export default function HeroSlider() {
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
      className="relative overflow-hidden rounded-2xl aspect-[3/1] bg-[#f2f4f7] group"
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
          <Link key={b.image} href={b.href} className="min-w-full h-full" tabIndex={k === i ? 0 : -1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.image}
              alt="Uzum aksiyalari, mahsulotlar termasi va xabarlari"
              referrerPolicy="no-referrer"
              loading={k === 0 ? "eager" : "lazy"}
              draggable={false}
              className="w-full h-full object-cover select-none"
            />
          </Link>
        ))}
      </div>

      <button
        aria-label="Oldingi"
        onClick={prev}
        className="hidden sm:grid absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur place-items-center text-ink transition"
      >
        <ChevronLeft />
      </button>
      <button
        aria-label="Keyingi"
        onClick={next}
        className="hidden sm:grid absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur place-items-center text-ink transition"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/10 px-1.5 py-1">
        {banners.map((b, k) => (
          <button
            key={b.image}
            aria-label={`Banner ${k + 1}`}
            onClick={() => setI(k)}
            className={`h-1.5 rounded-full transition-all ${k === i ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Telefonda: kartalar yonma-yon, chetida keyingisi ko'rinib turadi, barmoq bilan suriladi
function MobileBanners() {
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
        <Link key={b.image} href={b.href} className="shrink-0 w-[89%] snap-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.image}
            alt="Uzum aksiyalari, mahsulotlar termasi va xabarlari"
            referrerPolicy="no-referrer"
            loading={k < 2 ? "eager" : "lazy"}
            draggable={false}
            className="w-full aspect-[3/1] rounded-xl object-cover bg-[#f2f4f7]"
          />
        </Link>
      ))}
    </div>
  );
}
