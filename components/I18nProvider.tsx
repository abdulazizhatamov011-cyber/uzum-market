"use client";

import { createContext, useContext, useMemo } from "react";
import { getDict, localize, type Dict, type Lang } from "@/lib/i18n";

type I18n = { lang: Lang; t: Dict; href: (path: string) => string };

const I18nContext = createContext<I18n | null>(null);

// Joriy til ([lang] segmentidan) va lug'atni client komponentlarga yetkazadi
export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const value = useMemo(() => ({ lang, t: getDict(lang), href: (p: string) => localize(lang, p) }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
