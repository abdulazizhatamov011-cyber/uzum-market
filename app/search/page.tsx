import { Suspense } from "react";
import SearchResults from "./SearchResults";

export const metadata = { title: "Qidiruv — Bozorcha" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <SearchResults />
    </Suspense>
  );
}
