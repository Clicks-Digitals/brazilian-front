"use client";

import Link from "next/link";
import { useState } from "react";
import { SmartImage } from "@/components/ui/smart-image";
import { addToCart } from "@/features/cart/cart-api";
import { toast } from "@/features/ui/toast-store";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { pickImage } from "@/lib/settings";
import type { Product } from "@/types/api";

export function ProductCard({ product }: { product: Product }) {
  const [busy, setBusy] = useState(false);
  const variant = product.default_variant || product.variants?.find((item) => item.is_active !== false);
  const variantId = variant?.id || product.default_variant_id;
  const image = pickImage(product) || variant?.image;
  const inStock = variant?.in_stock ?? (variant ? variant.stock_quantity > 0 || product.allow_backorder : product.in_stock);
  const price = variant?.price || product.price || product.min_price;
  const compare = variant?.compare_at_price || product.compare_at_price;
  const label = !variantId ? "View" : inStock === false ? "Sold out" : busy ? "Adding" : "Add to cart";

  async function quickAdd() {
    if (!variantId) {
      toast("This product has no purchasable size yet", undefined, "error");
      return;
    }
    setBusy(true);
    try {
      await addToCart(variantId, 1);
      toast("Added to bag", product.name, "success");
    } catch (error) {
      toast("Could not add to bag", errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="group flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <SmartImage
          src={image}
          alt={product.name}
          className="aspect-square w-full bg-white"
          imgClassName="p-6 transition duration-700 ease-out group-hover:scale-[1.03] md:p-8"
        />
        <h3 className="font-display mt-5 text-lg leading-tight text-ink transition group-hover:text-forest md:text-xl">
          {product.name}
        </h3>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-subtitle text-sm text-muted">
          {price ? formatMoney(price) : "Price in store"}
          {compare ? <span className="ml-2 line-through opacity-60">{formatMoney(compare)}</span> : null}
        </p>
        {variantId && inStock !== false ? (
          <button
            type="button"
            onClick={quickAdd}
            disabled={busy}
            className="text-[11px] uppercase tracking-[0.16em] text-forest transition hover:text-forest-dark disabled:text-muted"
          >
            {label}
          </button>
        ) : (
          <Link href={`/products/${product.slug}`} className="text-[11px] uppercase tracking-[0.16em] text-muted">
            {label}
          </Link>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  const items = products.filter(
    (product) => product && typeof product === "object" && Boolean(product.slug || product.name),
  );
  return (
    <div
      className={cn("grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-10 md:gap-y-16", className)}
      data-reveal-stagger
    >
      {items.map((product, index) => (
        <ProductCard key={product.id || product.slug || `product-${index}`} product={product} />
      ))}
    </div>
  );
}
