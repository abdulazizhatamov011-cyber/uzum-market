import { Suspense } from "react";
import { notFound } from "next/navigation";
import PromoView from "@/components/PromoView";
import { nestleAges, nestlePromo, nestleSubcategories } from "@/lib/promo";
import { getCatalog } from "@/lib/catalog";

// Aksiya tovarlari bazadan olinadi (promo maydoni shu aksiyaga teng bo'lganlari)
const promos = [{ slug: nestlePromo.slug, title: nestlePromo.title }];

export function generateStaticParams() {
  return promos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/promo/[slug]">) {
  const { slug } = await params;
  const promo = promos.find((p) => p.slug === slug);
  return { title: promo ? `${promo.title} — Bozorcha` : "Aksiya topilmadi" };
}

export default function PromoPage({ params }: PageProps<"/promo/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-muted">Yuklanmoqda…</div>}>
      <PromoContent params={params} />
    </Suspense>
  );
}

async function PromoContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const promo = promos.find((p) => p.slug === slug);
  if (!promo) notFound();
  const items = (await getCatalog()).products.filter((p) => p.promo === promo.slug);
  return (
    <PromoView
      title={promo.title}
      items={items}
      subcategories={nestleSubcategories}
      ages={nestleAges.filter((a) => items.some((p) => p.age === a))}
    />
  );
}
