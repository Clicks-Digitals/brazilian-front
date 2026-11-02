import Link from "next/link";
import { SmartImage } from "@/components/ui/smart-image";
import { categoryCover } from "@/lib/category-media";
import type { Category } from "@/types/api";

export function CategoryCards({
  categories,
  limit,
}: {
  categories: Category[];
  limit?: number;
}) {
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
          className="group overflow-hidden rounded-2xl bg-white ring-1 ring-forest/10 transition duration-300 hover:-translate-y-1 hover:ring-forest/30"
        >
          <SmartImage
            src={categoryCover(category)}
            alt={category.name}
            fit="cover"
            className="aspect-[4/3] w-full bg-forest-dark"
            imgClassName="transition duration-700 group-hover:scale-[1.05]"
          />
          <div className="border-t border-forest/8 px-4 py-4 md:px-5">
            <h3 className="font-subtitle text-lg font-normal leading-tight text-forest md:text-xl">{category.name}</h3>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-gold">
              {category.product_count
                ? `${category.product_count} ${category.product_count === 1 ? "item" : "items"}`
                : "Shop"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
