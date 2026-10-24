import { BRAND } from "@/lib/brand";
import type { StoreSettings } from "@/types/api";

function flattenSettings(raw: unknown): StoreSettings {
  if (!raw || typeof raw !== "object") return {};
  const data = raw as Record<string, unknown>;
  if (Array.isArray(data)) {
    const out: StoreSettings = {};
    for (const item of data as Array<{ key?: string; value?: unknown }>) {
      if (item?.key) out[item.key] = item.value as never;
    }
    return out;
  }
  if (Array.isArray(data.results)) {
    return flattenSettings(data.results);
  }
  if (data.settings && typeof data.settings === "object") {
    return flattenSettings(data.settings);
  }
  return data as StoreSettings;
}

export function normalizeSettings(raw: unknown): StoreSettings {
  const flat = flattenSettings(raw);
  const nested = (flat.value && typeof flat.value === "object" ? flat.value : {}) as StoreSettings;
  const merged: StoreSettings = { ...nested, ...flat };
  return {
    store_name: String(merged.store_name || merged.name || BRAND.name),
    store_name_ar: String(merged.store_name_ar || merged.name_ar || BRAND.nameAr),
    phone: String(merged.phone || BRAND.phone),
    email: String(merged.email || BRAND.email),
    about: String(merged.about || BRAND.about),
    story: String(merged.story || BRAND.story),
    currency: String(merged.currency || BRAND.currency),
    social: (merged.social as Record<string, string>) || {},
    branches: Array.isArray(merged.branches) && merged.branches.length
      ? merged.branches
      : BRAND.branches.map((b) => ({ name: b.name, city: b.city })),
    delivery: merged.delivery,
    homepage: merged.homepage,
    announcement: merged.announcement,
    ...merged,
  };
}

function imageSrc(image?: { image?: string; url?: string } | string | null) {
  if (!image) return null;
  if (typeof image === "string") return image || null;
  return image.image || image.url || null;
}

export function pickImage(product: {
  primary_image?: { image?: string; url?: string } | string | null;
  images?: Array<{ image?: string; url?: string; is_primary?: boolean }>;
  variants?: Array<{ image?: string | null }>;
}): string | null {
  const primary = imageSrc(product.primary_image);
  if (primary) return primary;
  const featured = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const featuredSrc = imageSrc(featured);
  if (featuredSrc) return featuredSrc;
  return product.variants?.find((v) => v.image)?.image || null;
}

export function categorySlug(product: {
  category?: { slug?: string } | number | null;
  category_slug?: string;
}): string | undefined {
  if (product.category_slug) return product.category_slug;
  if (product.category && typeof product.category === "object") return product.category.slug;
  return undefined;
}

export function categoryName(product: {
  category?: { name?: string } | number | null;
}): string | undefined {
  if (product.category && typeof product.category === "object") return product.category.name;
  return undefined;
}

export function asList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as { results?: T[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

export function asPaginated<T>(data: unknown): { count: number; results: T[]; next: string | null; previous: string | null } {
  if (data && typeof data === "object" && Array.isArray((data as { results?: T[] }).results)) {
    const page = data as { count?: number; results: T[]; next?: string | null; previous?: string | null };
    return {
      count: page.count ?? page.results.length,
      results: page.results,
      next: page.next ?? null,
      previous: page.previous ?? null,
    };
  }
  const list = asList<T>(data);
  return { count: list.length, results: list, next: null, previous: null };
}

export function itemCount(cart: { items?: Array<{ quantity?: number }>; item_count?: number } | null | undefined): number {
  if (!cart) return 0;
  if (typeof cart.item_count === "number") return cart.item_count;
  return (cart.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
}
