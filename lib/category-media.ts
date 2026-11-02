import type { Category } from "@/types/api";

const CATEGORY_COVERS: Record<string, string> = {
  "turkish-coffee": "/assets/categories/turkish-coffee.jpg",
  "filter-coffee": "/assets/categories/filter-coffee.png",
  "drip-coffee": "/assets/categories/drip-coffee.png",
  espresso: "/assets/categories/espresso.png",
  "arabic-coffee": "/assets/categories/arabic-coffee.png",
  "rio-house": "/assets/categories/rio-house.png",
  "caffitaly-machines": "/assets/categories/caffitaly-machines.png",
};

export function categoryCover(category: Pick<Category, "slug" | "image"> | { slug?: string; image?: string | null }) {
  if (category.slug && CATEGORY_COVERS[category.slug]) return CATEGORY_COVERS[category.slug];
  return category.image || null;
}
