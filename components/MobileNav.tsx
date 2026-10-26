"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "./StoreProvider";
import { BagIcon, HeartIcon, UserIcon } from "./Icons";

export default function MobileNav() {
  const path = usePathname();
  const { cartCount, user } = useStore();
  const profileHref = user ? "/profile" : "/login";
  const items = [
    { href: "/", label: "Bosh sahifa", icon: (on: boolean) => <HomeMark active={on} /> },
    { href: "/catalog", label: "Katalog", icon: () => <CatalogIcon /> },
    { href: "/cart", label: "Savat", icon: () => <BagIcon className="w-[22px] h-[22px]" />, count: cartCount },
    { href: "/favorites", label: "Saralangan", icon: () => <HeartIcon className="w-[22px] h-[22px]" /> },
    { href: profileHref, label: "Kabinet", icon: () => <UserIcon className="w-[22px] h-[22px]" /> },
  ];
  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href) || (href === profileHref && path === "/orders");

  return (
    // Ekran tagida suzib turuvchi to'q ko'k kapsula; faol bo'lim to'q sariq doirada
    <nav className="md:hidden fixed inset-x-3 z-30 bottom-[calc(10px+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 h-[62px] rounded-full bg-ink px-1.5 shadow-[0_10px_30px_rgba(19,35,74,0.35)]">
        {items.map((i) => {
          const on = isActive(i.href);
          return (
            <Link
              key={i.label}
              href={i.href}
              aria-current={on ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] ${on ? "text-white" : "text-white/60"}`}
            >
              <span className={`grid place-items-center w-9 h-8 rounded-full transition ${on ? "bg-brand" : ""}`}>
                {i.icon(on)}
              </span>
              {i.label}
              {!!i.count && (
                <span className="absolute top-1.5 left-1/2 ml-2 min-w-[17px] h-[17px] px-1 rounded-full bg-white text-ink text-[10px] font-semibold grid place-items-center">
                  {i.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Bozorcha belgisi (sumka): faol bo'lganda to'ldirilgan, aks holda chiziqli
function HomeMark({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className="w-[22px] h-[22px]" aria-hidden>
      <path d="M9.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="10" width="18" height="14" rx="3.5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 15.5q3.5 3.2 7 0" fill="none" stroke={active ? "#ea580c" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg viewBox="0 0 28 28" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5M19 7h6M21 11h4M21 15h4" strokeLinecap="round" />
    </svg>
  );
}
