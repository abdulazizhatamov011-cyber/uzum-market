"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Banner } from "@/lib/types";
import { deleteBanner, moveBanner, saveBanner, type BannerInput } from "@/lib/actions/admin";
import { CloseIcon } from "@/components/Icons";

type Opt = { id: number; title: string; image: string };

const palette = ["#ea580c", "#13234a", "#1f5fbf", "#c2255c", "#2f7d4f", "#7c3aed", "#0f766e", "#b45309"];

const empty: BannerInput = { title: "", subtitle: "", color: palette[0], productId: 0, href: "/" };

// Saytdagi bannerning soddalashtirilgan nusxasi (oldindan ko'rish uchun)
function Preview({ b, image }: { b: BannerInput; image?: string }) {
  return (
    <div className="relative aspect-[3/1] rounded-2xl overflow-hidden text-white [container-type:inline-size]" style={{ background: b.color }}>
      <div className="h-full flex flex-col justify-center pl-[6cqw] max-w-[60%]">
        <div className="font-display font-bold leading-[1.05] text-[5.4cqw] tracking-tight">{b.title || "Sarlavha"}</div>
        <div className="mt-[1.2cqw] text-[2.4cqw] text-white/90">{b.subtitle || "Qisqa tavsif"}</div>
      </div>
      <div className="absolute right-[5cqw] top-1/2 -translate-y-1/2 w-[25cqw] aspect-square rounded-full bg-white grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image} alt="" className="w-[62%] h-[62%] object-contain" />}
      </div>
    </div>
  );
}

export default function BannersManager({ banners, products }: { banners: Banner[]; products: Opt[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<BannerInput | null>(null);
  const [notice, setNotice] = useState("");
  const [pending, start] = useTransition();
  const img = (id: number) => products.find((p) => p.id === id)?.image;

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, msg: string) =>
    start(async () => {
      const res = await fn();
      setNotice(res.ok ? msg : (res.error ?? "Xatolik"));
      router.refresh();
    });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-[24px] sm:text-[28px]">Bannerlar</h1>
        <button
          onClick={() => setEditing({ ...empty, productId: products[0]?.id ?? 0 })}
          className="h-10 px-5 rounded-full bg-brand text-white font-medium hover:bg-brand-dark"
        >
          Yangi banner
        </button>
      </div>
      <p className="text-sm text-muted mb-4">Bosh sahifadagi aylanib turuvchi bannerlar. Tartib shu ro&apos;yxatdagidek bo&apos;ladi.</p>
      {notice && <p className="mb-3 text-sm text-cobalt">{notice}</p>}
      {banners.length === 0 && (
        <div className="rounded-[20px] bg-white border border-line py-12 text-center text-muted text-sm">
          Banner yo&apos;q — bosh sahifada banner bloki ko&apos;rinmaydi.
        </div>
      )}

      <ul className={`grid gap-4 lg:grid-cols-2 ${pending ? "opacity-70" : ""}`}>
        {banners.map((b, i) => (
          <li key={b.id} className="rounded-[20px] bg-white border border-line p-3">
            <Preview b={b} image={img(b.productId)} />
            <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
              <span className="text-sm text-muted mr-auto truncate">
                {i + 1}-o&apos;rin, havola: {b.href}
              </span>
              <button
                aria-label="Yuqoriga"
                disabled={i === 0}
                onClick={() => run(() => moveBanner(b.id, -1), "Tartib o'zgardi")}
                className="w-8 h-8 rounded-full border border-line disabled:opacity-30"
              >
                ↑
              </button>
              <button
                aria-label="Pastga"
                disabled={i === banners.length - 1}
                onClick={() => run(() => moveBanner(b.id, 1), "Tartib o'zgardi")}
                className="w-8 h-8 rounded-full border border-line disabled:opacity-30"
              >
                ↓
              </button>
              <button onClick={() => setEditing({ ...b })} className="h-8 px-3.5 rounded-full text-sm bg-ink text-white">
                Tahrirlash
              </button>
              <button
                onClick={() => confirm(`«${b.title}» banneri o'chirilsinmi?`) && run(() => deleteBanner(b.id), "Banner o'chirildi")}
                className="h-8 px-3.5 rounded-full text-sm text-sale border border-line hover:border-sale"
              >
                O&apos;chirish
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <BannerForm
          initial={editing}
          products={products}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            setNotice("Banner saqlandi");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function BannerForm({
  initial,
  products,
  onClose,
  onSaved,
}: {
  initial: BannerInput;
  products: Opt[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = <K extends keyof BannerInput>(k: K, v: BannerInput[K]) => setF((x) => ({ ...x, [k]: v }));
  const product = products.find((p) => p.id === f.productId);
  const field = "w-full h-11 rounded-xl bg-surface px-3.5 text-sm outline-none border-2 border-transparent focus:border-cobalt";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await saveBanner(f);
      if (!res.ok) return setError(res.error);
      onSaved();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/50 sm:p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] bg-white p-5 sm:p-7"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px]">{f.id ? "Bannerni tahrirlash" : "Yangi banner"}</h2>
          <button type="button" onClick={onClose} aria-label="Yopish" className="w-9 h-9 grid place-items-center rounded-full hover:bg-surface">
            <CloseIcon />
          </button>
        </div>

        <Preview b={f} image={product?.image} />

        <div className="grid gap-4 mt-5">
          <label className="block text-sm">
            Sarlavha
            <input value={f.title} maxLength={40} onChange={(e) => set("title", e.target.value)} required className={`${field} mt-1`} />
          </label>
          <label className="block text-sm">
            Qisqa tavsif
            <input value={f.subtitle} maxLength={60} onChange={(e) => set("subtitle", e.target.value)} className={`${field} mt-1`} />
          </label>
          <fieldset className="text-sm">
            <legend>Fon rangi</legend>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {palette.map((c) => (
                <button
                  type="button"
                  key={c}
                  aria-label={c}
                  aria-pressed={f.color === c}
                  onClick={() => set("color", c)}
                  className={`w-8 h-8 rounded-full ring-offset-2 ${f.color === c ? "ring-2 ring-ink" : ""}`}
                  style={{ background: c }}
                />
              ))}
              <input type="color" value={f.color} onChange={(e) => set("color", e.target.value)} aria-label="Boshqa rang" className="w-9 h-9 rounded-full" />
            </div>
          </fieldset>
          <label className="block text-sm">
            Tovar ID (rasmi bannerda chiqadi)
            <input
              type="number"
              value={f.productId || ""}
              onChange={(e) => set("productId", Number(e.target.value))}
              required
              className={`${field} mt-1`}
            />
            <span className={`block mt-1 text-[13px] ${product ? "text-muted" : "text-sale"}`}>
              {product ? product.title : "Bu ID bilan tovar topilmadi — «Tovarlar» bo'limidan ID ni ko'ring"}
            </span>
          </label>
          <label className="block text-sm">
            Bosilganda ochiladigan sahifa
            <input value={f.href} onChange={(e) => set("href", e.target.value)} placeholder="/category/kiyim" required className={`${field} mt-1`} />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-sale">{error}</p>}
        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-full border border-line font-medium">
            Bekor qilish
          </button>
          <button type="submit" disabled={pending} className="flex-1 h-12 rounded-full bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-60">
            {pending ? "Saqlanmoqda…" : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
