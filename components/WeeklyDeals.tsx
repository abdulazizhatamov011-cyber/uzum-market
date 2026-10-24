"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { ChevronRight } from "./Icons";

// Aksiya hafta oxirida (yakshanba 23:59) tugaydi
function daysLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  end.setHours(23, 59, 59, 999);
  return Math.max(1, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

// Telefondagi bosh sahifa: binafsha fondagi gorizontal tovarlar bloki (uzum.uz'dagidek)
export default function WeeklyDeals({ items, href }: { items: Product[]; href: string }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => setDays(daysLeft()), []);

  return (
    <section className="md:hidden -mx-4 mt-4 rounded-[28px] bg-[#7f4dff] pt-5 pb-5">
      <div className="px-4 flex items-center gap-2">
        <Link href={href} className="flex-1 min-w-0 flex items-center gap-1 text-white">
          <h2 className="truncate text-[22px] font-bold">Hafta xitlari</h2>
          <ChevronRight className="w-5 h-5 shrink-0" />
        </Link>
        {days !== null && (
          <span className="shrink-0 rounded-xl bg-white text-brand text-sm font-medium px-2.5 py-1">
            {days} kun qoldi
          </span>
        )}
      </div>
      <p className="px-4 mt-1 text-white/90 text-[15px]">Hafta xitlarini buyurtma qilishga ulguring</p>
      <div className="mt-4 flex gap-2.5 overflow-x-auto no-scrollbar snap-x scroll-px-4 px-4">
        {items.map((p) => (
          <div key={p.id} className="shrink-0 w-[42%] snap-start rounded-2xl bg-white p-1.5 pb-2 flex">
            <ProductCard product={p} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
