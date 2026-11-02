"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, ErrorState, ProductCardSkeleton } from "@/components/ui/states";
import { ProductGrid } from "@/features/shop/product-card";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { asPaginated, categorySlug } from "@/lib/settings";
import type { Category, Product } from "@/types/api";

function sortCategories(categories: Category[]) {
  return [...categories].sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));
}

export function ShopByCategory() {
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
        if (!ignore) setError(errorMessage(err, "The shop could not be loaded."));
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
          name: "More from the house",
          slug: "other",
        },
        products: leftover,
      });
    }
    return grouped.filter((section) => section.products.length > 0);
  }, [categories, products]);

  return (
    <div className="bg-white pb-24">
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16" data-reveal>
          <p className="eyebrow text-gold">Collection</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-forest md:text-5xl">Shop coffee</h1>
          <p className="font-subtitle mt-4 max-w-xl text-muted">
            Roasts for cezve, filter, espresso, and capsule — grouped the way the house brews.
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
          <EmptyState title="No coffees on the shelf yet" description="Products will appear here once they are published." />
        </div>
      ) : null}

      {!loading &&
        !error &&
        sections.map((section, index) => (
          <section
            key={section.category.slug}
            id={section.category.slug}
            className="bg-white"
          >
            <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
              <div className="flex items-end justify-between gap-4" data-reveal>
                <div>
                  <p className="eyebrow text-gold">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="font-display mt-2 text-3xl text-forest md:text-4xl">{section.category.name}</h2>
                  {section.category.description ? (
                    <p className="font-subtitle mt-3 max-w-xl text-sm text-muted">{section.category.description}</p>
                  ) : null}
                </div>
                {section.category.slug !== "other" ? (
                  <Link href={`/shop/${section.category.slug}`} className="link-arrow shrink-0">
                    View all
                    <span aria-hidden>→</span>
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
