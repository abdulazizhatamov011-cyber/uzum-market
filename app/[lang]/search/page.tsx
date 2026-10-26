import { Suspense } from "react";
import SearchResults from "./SearchResults";

import { getDict, isLang } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/search">) {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "uz");
  return { title: `${t.catalog.searchTitle} — ${t.meta.suffix}` };
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">…</div>}>
      <SearchResults />
    </Suspense>
  );
}
