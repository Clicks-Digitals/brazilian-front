import Link from "next/link";
import { ProductGrid } from "@/features/shop/product-card";
import type { Product } from "@/types/api";

export function FeaturedShelf({ products }: { products: Product[] }) {
  const items = products.filter((product) => product?.slug || product?.name).slice(0, 6);

  if (!items.length) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20" data-reveal>
        <p className="eyebrow text-gold">The shelf</p>
        <h2 className="font-display mt-3 text-3xl">Featured coffees</h2>
        <p className="mt-4 text-muted">Nothing in this collection yet.</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow text-gold">The shelf</p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Featured coffees</h2>
          </div>
          <Link href="/shop" className="link-arrow">
            Shop all
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-12">
          <ProductGrid products={items} />
        </div>
      </div>
    </section>
  );
}
