"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ items, step = 0 }: { items: Product[]; step?: number }) {
  const [shown, setShown] = useState(step || items.length);
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-5 sm:gap-x-4 sm:gap-y-6">
        {items.slice(0, shown).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {shown < items.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShown((s) => s + step)}
            className="h-12 px-10 sm:px-40 rounded-xl bg-surface font-medium hover:bg-surface-2 transition"
          >
            Yana ko&apos;rsatish {Math.min(step, items.length - shown)}
          </button>
        </div>
      )}
    </>
  );
}
