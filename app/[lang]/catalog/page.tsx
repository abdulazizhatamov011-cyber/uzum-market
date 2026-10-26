import Link from "@/components/LocalLink";
import PageShell from "@/components/PageShell";
import { catName, categories, categoryCover } from "@/lib/data";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import CategoryThumb from "@/components/CategoryThumb";
import { getCatalog } from "@/lib/catalog";

const langOf = (l: string): Lang => (isLang(l) ? l : "uz");

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog">) {
  const t = getDict(langOf((await params).lang));
  return { title: `${t.catalog.title} — ${t.meta.suffix}` };
}

export default async function CatalogPage({ params }: PageProps<"/[lang]/catalog">) {
  const lang = langOf((await params).lang);
  const t = getDict(lang);
  const { products } = await getCatalog();
  return (
    <PageShell title={t.catalog.title}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="flex items-center gap-4 rounded-[20px] bg-white border border-line p-4 hover:border-[#c9d4e8] transition">
            <CategoryThumb c={c} src={categoryCover(c, products)} className="w-16 h-16 rounded-2xl" />
            <div className="min-w-0">
            <div className="font-semibold leading-snug">{catName(c, lang)}</div>
            <div className="text-sm text-muted">{t.common.products(products.filter((p) => p.category === c.slug).length)}</div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
