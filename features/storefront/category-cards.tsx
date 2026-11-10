"use client";

import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";
import { useLocale } from "@/features/i18n/locale-provider";
import { categoryCover } from "@/lib/category-media";
import { localizedName } from "@/lib/i18n";
import type { Category } from "@/types/api";

export function CategoryCards({
  categories,
  limit,
}: {
  categories: Category[];
  limit?: number;
}) {
  const { locale, t } = useLocale();
  const items = [...categories]
    .sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99))
    .slice(0, limit);

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
      {items.map((category) => (
        <Link
          key={category.slug}
          href={`/shop/${category.slug}`}
          className="category-card group overflow-hidden border border-cream/15 bg-cream/10 transition duration-300 hover:border-cream/35"
        >
          <SmartImage
            src={categoryCover(category)}
            alt={localizedName(locale, category)}
            fit="cover"
            className="aspect-[4/3] w-full bg-forest"
            imgClassName="transition duration-700 group-hover:scale-[1.05]"
          />
          <div className="border-t border-cream/15 px-4 py-4 md:px-5">
            <h3 className="font-subtitle text-lg font-normal leading-tight text-cream md:text-xl">
              {localizedName(locale, category)}
            </h3>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-gold">
              {category.product_count
                ? `${category.product_count} ${category.product_count === 1 ? t("item") : t("items")}`
                : t("shop")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
