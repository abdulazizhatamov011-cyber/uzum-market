"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import { logout } from "@/lib/actions/admin";

const links = [
  { href: "/admin", label: "Bosh panel" },
  { href: "/admin/orders", label: "Buyurtmalar" },
  { href: "/admin/products", label: "Tovarlar" },
  { href: "/admin/banners", label: "Bannerlar" },
];

export default function AdminNav() {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  return (
    <aside className="bg-ink text-white md:sticky md:top-0 md:h-screen md:flex md:flex-col">
      <div className="flex items-center gap-2.5 px-5 h-16 md:h-20">
        <BrandMark className="w-9 h-9" />
        <div className="leading-tight">
          <div className="font-display font-bold">bozorcha</div>
          <div className="text-[12px] text-white/55">Boshqaruv paneli</div>
        </div>
      </div>

      <nav className="flex md:flex-col gap-1 px-3 pb-3 overflow-x-auto no-scrollbar md:flex-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active(l.href) ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm transition ${
              active(l.href) ? "bg-brand text-white font-medium" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <form action={logout} className="md:hidden shrink-0">
          <button className="rounded-full px-4 py-2.5 text-sm text-white/75">Chiqish</button>
        </form>
      </nav>

      <div className="hidden md:flex flex-col gap-1 p-3 border-t border-white/10">
        <Link href="/" className="rounded-full px-4 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white">
          Saytni ochish
        </Link>
        <form action={logout}>
          <button className="w-full text-left rounded-full px-4 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white">
            Chiqish
          </button>
        </form>
      </div>
    </aside>
  );
}
