import { Suspense } from "react";
import { notFound } from "next/navigation";
import PromoView from "@/components/PromoView";
import { nestleAges, nestlePromo, nestleSubcategories } from "@/lib/promo";
import { getCatalog } from "@/lib/catalog";
import { getDict, isLang, type Lang } from "@/lib/i18n";

// Aksiya tovarlari bazadan olinadi (promo maydoni shu aksiyaga teng bo'lganlari)
const promos = [{ slug: nestlePromo.slug, title: { uz: nestlePromo.title, ru: "Акция от «Nestle Baby&Me»" } }];

export function generateStaticParams() {
  return promos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/promo/[slug]">) {
  const { slug, lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const promo = promos.find((p) => p.slug === slug);
  return { title: promo ? `${promo.title[lang]} — ${getDict(lang).meta.suffix}` : getDict(lang).notFound.meta };
}

export default function PromoPage({ params }: PageProps<"/[lang]/promo/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">…</div>}>
      <PromoContent params={params} />
    </Suspense>
  );
}

async function PromoContent({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang: l } = await params;
  const lang: Lang = isLang(l) ? l : "uz";
  const promo = promos.find((p) => p.slug === slug);
  if (!promo) notFound();
  const items = (await getCatalog()).products.filter((p) => p.promo === promo.slug);
  return (
    <PromoView
      title={promo.title[lang]}
      items={items}
      subcategories={nestleSubcategories}
      ages={nestleAges.filter((a) => items.some((p) => p.age === a))}
    />
  );
}
