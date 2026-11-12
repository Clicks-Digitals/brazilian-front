"use client";

import Link from "next/link";
import { ProductCard } from "@/features/shop/product-card";
import { useLocale } from "@/features/i18n/locale-provider";
import type { Product } from "@/types/api";

function isEspresso(product: Product) {
  return `${product.slug} ${product.name}`.toLowerCase().includes("espresso");
}

export function FeaturedShelf({ products }: { products: Product[] }) {
  const { t } = useLocale();
  const usable = products.filter((product) => product?.slug || product?.name);
  const espresso = usable.find(isEspresso) || usable[0];
  const items = usable.filter((product) => product.slug !== espresso?.slug).slice(0, 5);

  return (
    <section id="home-featured" className="bg-forest py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow text-gold">{t("theShelf")}</p>
            <h2 className="font-display mt-3 text-3xl text-cream md:text-4xl">{t("featuredCoffees")}</h2>
          </div>
          <Link href="/shop" className="link-arrow">
            {t("shopAll")}
            <span aria-hidden className="rtl:inline-block rtl:rotate-180">→</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 md:gap-y-16">
          {espresso ? <ProductCard product={espresso} title={t("espressoCoffee")} /> : null}
          {items.map((product, index) => (
            <ProductCard
              key={product.id || product.slug || `product-${index}`}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
