"use client";

import Link from "@/components/LocalLink";
import { useI18n } from "./I18nProvider";

export default function PageShell({
  title,
  subtitle,
  children,
  narrow,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className={`container-x pt-4 ${narrow ? "max-w-[880px]" : ""}`}>
      <nav className="text-sm text-muted flex gap-2 mb-4">
        <Link href="/" className="hover:text-ink">{t.common.home}</Link>/
        <span className="text-ink line-clamp-1">{title}</span>
      </nav>
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted mt-2">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  text,
  href = "/",
  action,
}: {
  icon: string;
  title: string;
  text: string;
  href?: string;
  action?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="py-16 text-center">
      <div className="text-7xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-muted mt-2">{text}</p>
      <Link href={href} className="inline-block mt-6 rounded-full bg-brand text-white font-semibold px-8 h-12 leading-[48px] hover:bg-brand-dark">
        {action ?? t.common.home}
      </Link>
    </div>
  );
}

export const inputCls =
  "w-full h-12 rounded-xl border border-line px-4 outline-none focus:border-brand bg-white";
