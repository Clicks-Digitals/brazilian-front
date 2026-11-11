"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, ProductCardSkeleton } from "@/components/ui/states";
import { ProductGrid } from "@/features/shop/product-card";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { useLocale } from "@/features/i18n/locale-provider";
import { localizedName } from "@/lib/i18n";
import { asPaginated, categorySlug } from "@/lib/settings";
import type { Category, Product } from "@/types/api";

function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));
}

export function ShopByCategory() {
  const { locale, t } = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    Promise.all([
      api.get("/categories/", undefined, { auth: false, cart: false }),
      api.get("/products/", { page_size: 100, availability: "all" }, { auth: false, cart: false }),
    ])
      .then(([categoryData, productData]) => {
        if (ignore) return;
        setCategories(asPaginated<Category>(categoryData).results.filter((c) => c.is_active !== false));
        setProducts(asPaginated<Product>(productData).results);
      })
      .catch((err) => {
        if (!ignore) setError(errorMessage(err, t("shopCouldNotLoad")));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const sections = useMemo(() => {
    const ordered = sortCategories(categories);
    const grouped = ordered.map((category) => ({
      category,
      products: products.filter((product) => categorySlug(product) === category.slug),
    }));
    const known = new Set(ordered.map((c) => c.slug));
    const leftover = products.filter((product) => {
      const slug = categorySlug(product);
      return !slug || !known.has(slug);
    });
    if (leftover.length) {
      grouped.push({
        category: {
          id: 0,
          name: t("moreFromTheHouse"),
          name_ar: t("moreFromTheHouse"),
          slug: "other",
        },
        products: leftover,
      });
    }
    return grouped.filter((section) => section.products.length > 0);
  }, [categories, products, t]);

  return (
    <div className="bg-forest pb-24">
      <header className="bg-forest">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16" data-reveal>
          <p className="eyebrow text-gold">{t("collection")}</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-cream md:text-5xl">{t("shopCoffee")}</h1>
          <p className="font-subtitle mt-4 max-w-xl text-cream">
            {t("shopCoffeeBlurb")}
          </p>
        </div>
      </header>

      {error ? (
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <ErrorState description={error} />
        </div>
      ) : null}

      {loading ? (
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : null}

      {!loading && !error && sections.length === 0 ? (
        <div className="mx-auto max-w-7xl px-6 pt-12">
          <EmptyState title={t("noCoffees")} description={t("productsWillAppear")} />
        </div>
      ) : null}

      {!loading &&
        !error &&
        sections.map((section, index) => (
          <section
            key={section.category.slug}
            id={section.category.slug}
            className="bg-forest"
          >
            <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
              <div className="flex items-end justify-between gap-4" data-reveal>
                <div>
                  <p className="eyebrow text-gold">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="font-display mt-2 text-3xl text-cream md:text-4xl">{localizedName(locale, section.category)}</h2>
                  {section.category.description ? (
                    <p className="font-subtitle mt-3 max-w-xl text-sm text-cream">{section.category.description}</p>
                  ) : null}
                </div>
                {section.category.slug !== "other" ? (
                  <Link href={`/shop/${section.category.slug}`} className="link-arrow shrink-0">
                    {t("viewAll")}
                    <span aria-hidden className="rtl:inline-block rtl:rotate-180">→</span>
                  </Link>
                ) : null}
              </div>
              <div className="mt-10">
                <ProductGrid products={section.products} />
              </div>
            </div>
          </section>
        ))}
    </div>
  );
}
