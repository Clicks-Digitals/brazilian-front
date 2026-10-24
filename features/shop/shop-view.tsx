"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState, ErrorState, ProductCardSkeleton } from "@/components/ui/states";
import { Pagination } from "@/components/ui/pagination";
import { ProductGrid } from "@/features/shop/product-card";
import { CategoryChips, ShopToolbar, type ShopQuery } from "@/features/shop/filters";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { asPaginated } from "@/lib/settings";
import type { Category, Product } from "@/types/api";

function fromParams(params: URLSearchParams, fallbackCategory?: string): ShopQuery {
  return {
    category: params.get("category") || fallbackCategory,
    search: params.get("search") || params.get("q") || undefined,
    min_price: params.get("min_price") || undefined,
    max_price: params.get("max_price") || undefined,
    roast: params.get("roast") || undefined,
    availability: params.get("availability") || "in_stock",
    on_sale: params.get("on_sale") || undefined,
    ordering: params.get("ordering") || "featured",
    page: params.get("page") || "1",
  };
}

export function ShopView({
  eyebrow,
  title,
  description,
  lockedCategory,
  extraQuery,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  lockedCategory?: string;
  extraQuery?: Record<string, string>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(
    () => fromParams(searchParams, lockedCategory),
    [searchParams, lockedCategory],
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const write = useCallback(
    (next: ShopQuery) => {
      const params = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => {
        if (!value || (key === "category" && lockedCategory) || (key === "page" && value === "1")) return;
        if (key === "availability" && value === "in_stock") return;
        if (key === "ordering" && value === "featured") return;
        params.set(key, value);
      });
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [lockedCategory, pathname, router],
  );

  useEffect(() => {
    let ignore = false;
    api
      .get("/categories/", undefined, { auth: false, cart: false })
      .then((data) => {
        if (!ignore) setCategories(asPaginated<Category>(data).results.filter((c) => c.is_active !== false));
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    const page = Number(query.page || 1);
    api
      .get(
        "/products/",
        {
          category: lockedCategory || query.category,
          search: query.search,
          min_price: query.min_price,
          max_price: query.max_price,
          roast: query.roast,
          availability: query.availability,
          on_sale: query.on_sale === "true" ? true : undefined,
          ordering: query.ordering,
          page,
          page_size: 24,
          ...extraQuery,
        },
        { auth: false, cart: false },
      )
      .then((data) => {
        if (ignore) return;
        const pageData = asPaginated<Product>(data);
        setProducts(pageData.results);
        setCount(pageData.count);
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
  }, [query, lockedCategory, extraQuery]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      {title ? (
        <header className="max-w-2xl pb-10 pt-12 md:pt-16" data-reveal>
          {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
          <h1 className="font-display mt-3 text-4xl tracking-tight text-ink md:text-5xl">{title}</h1>
          {description ? <p className="font-subtitle mt-4 max-w-xl text-muted">{description}</p> : null}
        </header>
      ) : (
        <div className="pt-8" />
      )}

      {!lockedCategory ? (
        <CategoryChips
          categories={categories}
          value={query.category}
          onSelect={(slug) => write({ ...query, category: slug || undefined, page: "1" })}
        />
      ) : null}

      <div className={lockedCategory ? "mt-2" : "mt-8"}>
        <ShopToolbar value={lockedCategory ? { ...query, category: lockedCategory } : query} count={count} onChange={write} />
      </div>

      <div className="mt-10">
        {error ? <ErrorState description={error} onRetry={() => write({ ...query })} /> : null}
        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : null}
        {!loading && !error && products.length === 0 ? (
          <EmptyState
            title="No coffees match these filters"
            description="Try a broader roast, price range, or category."
          />
        ) : null}
        {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
        <Pagination
          page={Number(query.page || 1)}
          pageSize={24}
          count={count}
          onPage={(page) => write({ ...query, page: String(page) })}
        />
      </div>
    </div>
  );
}
