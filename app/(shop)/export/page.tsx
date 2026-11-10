import type { Metadata } from "next";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { ProductGrid } from "@/features/shop/product-card";
import { errorMessage } from "@/lib/http";
import { localizedName, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { serverGet } from "@/lib/server-get";
import { asPaginated, categorySlug } from "@/lib/settings";
import type { Category, Product } from "@/types/api";

export const metadata: Metadata = {
  title: "Export collection",
  description: "A showcase of Brazilian Coffee House products without retail prices.",
};

export default async function ExportPage() {
  const locale = await getLocale();
  try {
    const [categoryData, productData] = await Promise.all([
      serverGet("/categories/").catch(() => ({ results: [] as Category[] })),
      serverGet("/products/", { page_size: 100, availability: "all" }),
    ]);
    const categories = asPaginated<Category>(categoryData).results.filter((c) => c.is_active !== false);
    const products = asPaginated<Product>(productData).results;
    const ordered = [...categories].sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));
    const sections = ordered
      .map((category) => ({
        category,
        products: products.filter((product) => categorySlug(product) === category.slug),
      }))
      .filter((section) => section.products.length > 0);

    return (
      <div className="bg-forest pb-24">
        <header className="bg-forest">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-16" data-reveal>
            <p className="eyebrow text-gold">{t(locale, "export")}</p>
            <h1 className="font-display mt-3 text-4xl tracking-tight text-cream md:text-5xl">{t(locale, "productShowcase")}</h1>
            <p className="font-subtitle mt-4 max-w-xl text-cream/75">
              {t(locale, "exportBlurb")}
            </p>
          </div>
        </header>

        {products.length === 0 ? (
          <div className="mx-auto max-w-7xl px-6 pt-12">
            <EmptyState title={t(locale, "noProductsYet")} description={t(locale, "showcaseWillFill")} />
          </div>
        ) : sections.length === 0 ? (
          <div className="mx-auto max-w-7xl px-6 py-16">
            <ProductGrid products={products} hidePrice />
          </div>
        ) : (
          sections.map((section, index) => (
            <section key={section.category.slug} className="bg-forest">
              <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
                <div data-reveal>
                  <p className="eyebrow text-gold">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="font-display mt-2 text-3xl text-cream md:text-4xl">{localizedName(locale, section.category)}</h2>
                </div>
                <div className="mt-10">
                  <ProductGrid products={section.products} hidePrice />
                </div>
              </div>
            </section>
          ))
        )}
      </div>
    );
  } catch (error) {
    return <ErrorState description={errorMessage(error)} />;
  }
}
