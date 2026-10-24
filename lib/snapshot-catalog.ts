import snapshot from "@/data/storefront-snapshot.json";

type Product = Record<string, unknown> & {
  slug?: string;
  name?: string;
  name_ar?: string;
  tasting_notes?: string;
  sku?: string;
  price?: string;
  roast_level?: string;
  is_featured?: boolean;
  is_new?: boolean;
  in_stock?: boolean;
  on_sale?: boolean;
  category?: { slug?: string } | number | null;
};

type Snapshot = {
  storefront: Record<string, unknown>;
  categories: unknown;
  settings: Record<string, unknown>;
  products: { count?: number; results: Product[] };
  articles: { results?: unknown[] } | unknown[];
  product_details: Record<string, unknown>;
  article_details: Record<string, unknown>;
  pages: Record<string, unknown>;
};

function rewriteLocalMedia(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, "");
  }
  if (Array.isArray(value)) return value.map(rewriteLocalMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, rewriteLocalMedia(nested)]),
    );
  }
  return value;
}

const data = rewriteLocalMedia(snapshot) as Snapshot;

function asList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { results?: T[] }).results)) {
    return (value as { results: T[] }).results;
  }
  return [];
}

function categorySlug(product: Product): string | undefined {
  if (product.category && typeof product.category === "object") return product.category.slug;
  return undefined;
}

function paginate(items: unknown[], searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.max(1, Math.min(200, Number(searchParams.get("page_size") || 24)));
  const start = (page - 1) * pageSize;
  return {
    count: items.length,
    next: start + pageSize < items.length ? "next" : null,
    previous: page > 1 ? "previous" : null,
    results: items.slice(start, start + pageSize),
  };
}

function filterProducts(searchParams: URLSearchParams): Product[] {
  let items = [...(data.products.results || [])];
  const category = searchParams.get("category");
  const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
  const roast = searchParams.get("roast");
  const availability = searchParams.get("availability");
  const onSale = searchParams.get("on_sale");
  const minPrice = Number(searchParams.get("min_price") || "");
  const maxPrice = Number(searchParams.get("max_price") || "");
  const ordering = searchParams.get("ordering") || "featured";

  if (category) items = items.filter((item) => categorySlug(item) === category);
  if (roast) items = items.filter((item) => item.roast_level === roast);
  if (availability === "in_stock") items = items.filter((item) => item.in_stock !== false);
  if (onSale === "true") items = items.filter((item) => item.on_sale);
  if (!Number.isNaN(minPrice) && searchParams.get("min_price")) {
    items = items.filter((item) => Number(item.price || 0) >= minPrice);
  }
  if (!Number.isNaN(maxPrice) && searchParams.get("max_price")) {
    items = items.filter((item) => Number(item.price || 0) <= maxPrice);
  }
  if (search) {
    items = items.filter((item) =>
      [item.name, item.name_ar, item.tasting_notes, item.sku]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search)),
    );
  }

  const sorted = [...items];
  if (ordering === "name") sorted.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  else if (ordering === "-name") sorted.sort((a, b) => String(b.name || "").localeCompare(String(a.name || "")));
  else if (ordering === "price") sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  else if (ordering === "-price") sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  else if (ordering === "-created_at") sorted.sort((a, b) => Number(b.is_new) - Number(a.is_new));
  else {
    sorted.sort(
      (a, b) =>
        Number(b.is_featured) - Number(a.is_featured) ||
        String(a.name || "").localeCompare(String(b.name || "")),
    );
  }
  return sorted;
}

export function snapshotPath(path: string): string {
  return path.replace(/^\//, "").replace(/\/$/, "").split("?")[0];
}

export function readSnapshot(path: string, searchParams: URLSearchParams = new URLSearchParams()): unknown {
  const key = snapshotPath(path);
  if (key === "storefront") return data.storefront;
  if (key === "settings") return data.settings;
  if (key === "categories") return data.categories;
  if (key.startsWith("categories/")) {
    const slug = key.slice("categories/".length);
    return asList<{ slug?: string }>(data.categories).find((item) => item.slug === slug) || null;
  }
  if (key === "products") return paginate(filterProducts(searchParams), searchParams);
  if (key.startsWith("products/")) {
    const slug = key.slice("products/".length);
    return data.product_details[slug] || null;
  }
  if (key === "articles") return data.articles;
  if (key.startsWith("articles/")) {
    const slug = key.slice("articles/".length);
    return data.article_details[slug] || null;
  }
  if (key.startsWith("pages/")) {
    const slug = key.slice("pages/".length);
    return data.pages[slug] || null;
  }
  if (key === "search") return paginate(filterProducts(searchParams), searchParams);
  if (key === "banners") return data.storefront.hero_banners || [];
  if (key === "announcements") return data.storefront.announcements || [];
  return null;
}
