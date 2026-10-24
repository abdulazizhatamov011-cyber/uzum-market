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
    { href: "/", label: "Bosh sahifa", icon: (on: boolean) => <UzumIcon active={on} /> },
    { href: "/catalog", label: "Katalog", icon: () => <CatalogIcon /> },
    { href: "/cart", label: "Savat", icon: () => <BagIcon className="w-7 h-7" />, count: cartCount },
    { href: "/favorites", label: "Saralangan", icon: () => <HeartIcon className="w-7 h-7" /> },
    { href: profileHref, label: "Kabinet", icon: () => <UserIcon className="w-7 h-7" /> },
  ];
  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href) || (href === profileHref && path === "/orders");

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-[60px]">
        {items.map((i) => {
          const on = isActive(i.href);
          return (
            <Link
              key={i.label}
              href={i.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] ${on ? "text-brand" : "text-muted"}`}
            >
              {i.icon(on)}
              {i.label}
              {!!i.count && (
                <span className="absolute top-1 left-1/2 ml-1.5 min-w-[18px] h-[18px] px-1 rounded-md bg-brand text-white text-[11px] grid place-items-center">
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

// Uzum belgisi: faol bo'lganda binafsha, aks holda kulrang chiziqli
function UzumIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7" aria-hidden>
      <circle cx="14" cy="14" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.5 10.5v4a4.5 4.5 0 0 0 9 0v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity={active ? 1 : 0.9}
      />
      <path d="M14 7.5v4.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5M19 7h6M21 11h4M21 15h4" strokeLinecap="round" />
    </svg>
  );
}
