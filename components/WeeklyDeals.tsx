"use client";

import Link from "@/components/LocalLink";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { ChevronRight } from "./Icons";
import { useI18n } from "./I18nProvider";

// Aksiya hafta oxirida (yakshanba 23:59) tugaydi
function daysLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  end.setHours(23, 59, 59, 999);
  return Math.max(1, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

// Telefondagi bosh sahifa: rangli fondagi gorizontal tovarlar bloki
export default function WeeklyDeals({ items, href }: { items: Product[]; href: string }) {
  const { t } = useI18n();
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysLeft()), []);

  return (
    <section className="-mx-4 md:mx-0 mt-7 rounded-[28px] bg-ink py-6 md:py-7">
      <div className="px-5 md:px-7 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <Link href={href} className="inline-flex items-center gap-1 text-white hover:text-[#ffb27a]">
            <h2 className="text-[21px] sm:text-[26px]">{t.home.weekly}</h2>
            <ChevronRight className="w-5 h-5 shrink-0" />
          </Link>
          <p className="mt-1 text-white/70 text-[14px]">{t.home.weeklySub}</p>
        </div>
        {days !== null && (
          <span className="shrink-0 rounded-full bg-brand text-white text-[13px] font-medium px-3 py-1.5">
            {t.home.daysLeft(days)}
          </span>
        )}
      </div>
      <div className="mt-5 flex gap-2.5 overflow-x-auto no-scrollbar snap-x scroll-px-5 px-5 md:px-7">
        {items.map((p) => (
          <div key={p.id} className="shrink-0 w-[44%] sm:w-[200px] snap-start">
            <ProductCard product={p} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
