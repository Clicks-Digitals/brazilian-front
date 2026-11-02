"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Quantity } from "@/components/ui/quantity";
import { SmartImage } from "@/components/ui/smart-image";
import { addToCart } from "@/features/cart/cart-api";
import { toast } from "@/features/ui/toast-store";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { pickImage } from "@/lib/settings";
import type { Product } from "@/types/api";

export function ProductCard({
  product,
  hidePrice = false,
  media,
  title,
}: {
  product: Product;
  hidePrice?: boolean;
  media?: ReactNode;
  title?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [qty, setQty] = useState(1);
  const variant = product.default_variant || product.variants?.find((item) => item.is_active !== false);
  const variantId = variant?.id || product.default_variant_id;
  const image = pickImage(product) || variant?.image;
  const inStock = variant?.in_stock ?? (variant ? variant.stock_quantity > 0 || product.allow_backorder : product.in_stock);
  const price = variant?.price || product.price || product.min_price;
  const compare = variant?.compare_at_price || product.compare_at_price;
  const maxQty = variant?.stock_quantity && variant.stock_quantity > 0 ? variant.stock_quantity : undefined;
  const canAdd = Boolean(variantId) && inStock !== false;
  const label = !variantId ? "View" : inStock === false ? "Sold out" : busy ? "Adding" : "Add to cart";

  async function quickAdd() {
    if (!variantId) {
      toast("This product has no purchasable size yet", undefined, "error");
      return;
    }
    setBusy(true);
    try {
      await addToCart(variantId, qty);
      toast("Added to bag", `${qty} × ${product.name}`, "success");
    } catch (error) {
      toast("Could not add to bag", errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link href={`/products/${product.slug}`} className="block min-w-0">
        {media ?? (
          <SmartImage
            src={image}
            alt={product.name}
            className="aspect-square w-full bg-white ring-1 ring-forest/10"
            imgClassName="p-3 transition duration-700 ease-out group-hover:scale-[1.03] sm:p-5 md:p-8"
          />
        )}
        <h3 className="font-display mt-3 min-h-[2.6em] break-words text-[15px] leading-snug text-ink transition group-hover:text-forest md:mt-5 md:min-h-[2.5em] md:text-xl">
          {title || product.name}
        </h3>
      </Link>
      {hidePrice ? (
        <p className="font-subtitle mt-auto pt-3 text-sm text-muted">
          {product.origin || product.roast_level || "House roast"}
        </p>
      ) : (
        <div className="mt-auto min-w-0 space-y-3 pt-3">
          <p className="font-subtitle text-sm text-muted">
            {price ? formatMoney(price) : "Price in store"}
            {compare ? <span className="ml-2 line-through opacity-60">{formatMoney(compare)}</span> : null}
          </p>
          {canAdd ? (
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Quantity
                size="sm"
                className="w-full justify-between sm:w-auto sm:justify-start"
                value={qty}
                min={1}
                max={maxQty}
                disabled={busy}
                onChange={setQty}
              />
              <button
                type="button"
                onClick={quickAdd}
                disabled={busy}
                className="h-8 w-full shrink-0 rounded-lg bg-forest px-3 text-[10px] uppercase tracking-[0.14em] text-cream transition hover:bg-forest-dark disabled:opacity-60 sm:w-auto"
              >
                {label}
              </button>
            </div>
          ) : (
            <Link href={`/products/${product.slug}`} className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {label}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

export function ProductGrid({
  products,
  className,
  hidePrice = false,
}: {
  products: Product[];
  className?: string;
  hidePrice?: boolean;
}) {
  const items = products.filter(
    (product) => product && typeof product === "object" && Boolean(product.slug || product.name),
  );
  return (
    <div
      className={cn("grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 md:gap-y-16", className)}
      data-reveal-stagger
    >
      {items.map((product, index) => (
        <ProductCard
          key={product.id || product.slug || `product-${index}`}
          product={product}
          hidePrice={hidePrice}
        />
      ))}
    </div>
  );
}
