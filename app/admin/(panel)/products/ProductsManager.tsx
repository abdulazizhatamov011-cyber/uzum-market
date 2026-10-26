"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { categories, formatPrice } from "@/lib/data";
import { deleteProduct, saveProduct, type ProductInput } from "@/lib/actions/admin";
import { CloseIcon } from "@/components/Icons";

const PAGE = 40;
const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

const empty: ProductInput = {
  title: "",
  category: categories[0].slug,
  price: 0,
  oldPrice: 0,
  stock: 10,
  brand: "",
  image: "",
  images: "",
  original: false,
  guarantee: false,
};

export default function ProductsManager({ products }: { products: Product[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [shown, setShown] = useState(PAGE);
  const [editing, setEditing] = useState<ProductInput | null>(null);
  const [notice, setNotice] = useState("");
  const [pending, start] = useTransition();

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter(
      (p) => (cat === "all" || p.category === cat) && (!s || p.title.toLowerCase().includes(s) || String(p.id) === s)
    );
  }, [products, q, cat]);

  const edit = (p: Product) =>
    setEditing({
      id: p.id,
      title: p.title,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      stock: p.stock,
      brand: p.brand ?? "",
      image: p.image,
      images: p.images.join("\n"),
      original: Boolean(p.original),
      guarantee: Boolean(p.guarantee),
    });

  const remove = (p: Product) => {
    if (!confirm(`«${p.title}» o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.`)) return;
    start(async () => {
      const res = await deleteProduct(p.id);
      setNotice(res.ok ? `«${p.title}» o'chirildi` : res.error);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-[24px] sm:text-[28px]">Tovarlar</h1>
        <button onClick={() => setEditing({ ...empty })} className="h-10 px-5 rounded-full bg-brand text-white font-medium hover:bg-brand-dark">
          Yangi tovar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setShown(PAGE);
          }}
          placeholder="Nomi yoki ID bo'yicha qidirish"
          className="flex-1 min-w-[220px] h-10 rounded-full bg-white border border-line px-4 text-sm outline-none focus:border-cobalt"
        />
        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setShown(PAGE);
          }}
          className="h-10 rounded-full bg-white border border-line px-4 text-sm outline-none"
        >
          <option value="all">Barcha turkumlar</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {notice && <p className="mb-3 text-sm text-cobalt">{notice}</p>}

      <div className={`rounded-[20px] bg-white border border-line overflow-hidden ${pending ? "opacity-70" : ""}`}>
        <div className="hidden sm:grid grid-cols-[56px_1fr_150px_120px_96px_150px] gap-3 px-4 py-2.5 text-[12px] text-muted border-b border-line">
          <span />
          <span>Nomi</span>
          <span>Turkum</span>
          <span className="text-right">Narx, so&apos;m</span>
          <span className="text-right">Qoldiq</span>
          <span />
        </div>
        {list.length === 0 && <p className="py-10 text-center text-muted text-sm">Hech narsa topilmadi</p>}
        <ul className="divide-y divide-line">
          {list.slice(0, shown).map((p) => (
            <li key={p.id} className="grid grid-cols-[56px_1fr] sm:grid-cols-[56px_1fr_150px_120px_96px_150px] gap-x-3 gap-y-1 px-4 py-3 items-center text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" className="row-span-3 sm:row-span-1 w-14 h-16 rounded-lg object-cover bg-surface" />
              <div className="min-w-0">
                <Link href={`/product/${p.id}`} target="_blank" className="line-clamp-2 hover:text-brand">
                  {p.title}
                </Link>
                <div className="text-[12px] text-muted">ID {p.id}{p.brand ? `, ${p.brand}` : ""}</div>
              </div>
              <span className="text-muted sm:text-ink">{catName(p.category)}</span>
              <span className="sm:text-right font-medium">{formatPrice(p.price)}</span>
              <span className={`sm:text-right whitespace-nowrap ${p.stock === 0 ? "text-sale font-medium" : p.stock < 5 ? "text-[#8a5a00]" : ""}`}>
                {p.stock === 0 ? "Tugagan" : `${p.stock} dona`}
              </span>
              <div className="col-span-2 sm:col-span-1 flex gap-2 sm:justify-end">
                <button onClick={() => edit(p)} className="h-8 px-3.5 rounded-full text-sm bg-ink text-white">
                  Tahrirlash
                </button>
                <button onClick={() => remove(p)} className="h-8 px-3.5 rounded-full text-sm text-sale border border-line hover:border-sale">
                  O&apos;chirish
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {shown < list.length && (
        <button onClick={() => setShown((s) => s + PAGE)} className="mt-4 w-full h-11 rounded-full bg-white border border-line text-sm font-medium">
          Yana ko&apos;rsatish ({list.length - shown} ta qoldi)
        </button>
      )}

      {editing && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            setEditing(null);
            setNotice(msg);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ initial, onClose, onSaved }: { initial: ProductInput; onClose: () => void; onSaved: (msg: string) => void }) {
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setF((x) => ({ ...x, [k]: v }));
  const field = "w-full h-11 rounded-xl bg-surface px-3.5 text-sm outline-none border-2 border-transparent focus:border-cobalt";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await saveProduct(f);
      if (!res.ok) return setError(res.error);
      onSaved(f.id ? `«${f.title}» saqlandi` : `«${f.title}» qo'shildi (ID ${res.id})`);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 p-0 sm:p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] bg-white p-5 sm:p-7"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[20px]">{f.id ? "Tovarni tahrirlash" : "Yangi tovar"}</h2>
          <button type="button" onClick={onClose} aria-label="Yopish" className="w-9 h-9 grid place-items-center rounded-full hover:bg-surface">
            <CloseIcon />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <div className="space-y-4">
            <label className="block text-sm">
              Nomi
              <input value={f.title} onChange={(e) => set("title", e.target.value)} required className={`${field} mt-1`} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                Turkum
                <select value={f.category} onChange={(e) => set("category", e.target.value)} className={`${field} mt-1`}>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Brend
                <input value={f.brand} onChange={(e) => set("brand", e.target.value)} className={`${field} mt-1`} />
              </label>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-2xl bg-surface overflow-hidden grid place-items-center text-[12px] text-muted text-center p-2">
            {f.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.image} alt="Rasm ko'rinishi" className="w-full h-full object-cover" />
            ) : (
              "Rasm havolasini kiriting"
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <label className="block text-sm">
            Narx, so&apos;m
            <input type="number" min={1} value={f.price || ""} onChange={(e) => set("price", Number(e.target.value))} required className={`${field} mt-1`} />
          </label>
          <label className="block text-sm">
            Eski narx
            <input type="number" min={0} value={f.oldPrice || ""} onChange={(e) => set("oldPrice", Number(e.target.value))} className={`${field} mt-1`} />
          </label>
          <label className="block text-sm">
            Qoldiq, dona
            <input type="number" min={0} value={f.stock} onChange={(e) => set("stock", Number(e.target.value))} className={`${field} mt-1`} />
          </label>
        </div>

        <label className="block text-sm mt-4">
          Asosiy rasm (havola)
          <input value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." required className={`${field} mt-1`} />
        </label>
        <label className="block text-sm mt-4">
          Galereya rasmlari — har birini yangi qatordan
          <textarea
            value={f.images}
            onChange={(e) => set("images", e.target.value)}
            rows={3}
            className="w-full mt-1 rounded-xl bg-surface px-3.5 py-2.5 text-sm outline-none border-2 border-transparent focus:border-cobalt"
          />
        </label>

        <div className="flex flex-wrap gap-5 mt-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.original} onChange={(e) => set("original", e.target.checked)} className="w-4 h-4 accent-brand" />
            «Original» belgisi
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={f.guarantee} onChange={(e) => set("guarantee", e.target.checked)} className="w-4 h-4 accent-brand" />
            «Kafolatlangan narx» belgisi
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-sale">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-full border border-line font-medium">
            Bekor qilish
          </button>
          <button type="submit" disabled={pending} className="flex-1 h-12 rounded-full bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-60">
            {pending ? "Saqlanmoqda…" : f.id ? "Saqlash" : "Qo'shish"}
          </button>
        </div>
      </form>
    </div>
  );
}
