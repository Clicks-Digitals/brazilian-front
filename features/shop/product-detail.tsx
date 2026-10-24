"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Quantity } from "@/components/ui/quantity";
import { SmartImage } from "@/components/ui/smart-image";
import { ProductGrid } from "@/features/shop/product-card";
import { addToCart } from "@/features/cart/cart-api";
import { toast } from "@/features/ui/toast-store";
import { formatMoney, titleCase } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { categoryName, categorySlug, pickImage } from "@/lib/settings";
import type { Product, ProductVariant } from "@/types/api";

export function ProductDetail({ product }: { product: Product }) {
  const variants = (product.variants || []).filter((item) => item.is_active !== false);
  const [selectedId, setSelectedId] = useState(product.default_variant?.id || variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [gallery, setGallery] = useState(0);

  const selected: ProductVariant | undefined = useMemo(
    () => variants.find((item) => item.id === selectedId) || product.default_variant || variants[0],
    [variants, selectedId, product.default_variant],
  );

  const images = [
    ...(product.images || []).map((img) => img.image || img.url),
    pickImage(product),
    selected?.image,
  ].filter((value, index, arr): value is string => Boolean(value) && arr.indexOf(value) === index);

  const inStock = selected?.in_stock ?? (selected ? selected.stock_quantity > 0 || product.allow_backorder : false);
  const related = product.related || product.related_products || [];

  async function add() {
    if (!selected) {
      toast("This product has no available size", undefined, "error");
      return;
    }
    setBusy(true);
    try {
      await addToCart(selected.id, qty);
      toast("Added to bag", `${qty} × ${product.name}`, "success");
    } catch (error) {
      toast("Could not add to bag", errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12" data-reveal>
      <p className="text-sm text-muted">
        <Link href="/shop">Shop</Link>
        {categorySlug(product) ? (
          <>
            {" / "}
            <Link href={`/shop/${categorySlug(product)}`}>{categoryName(product)}</Link>
          </>
        ) : null}
      </p>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <SmartImage src={images[gallery]} alt={product.name} className="aspect-[4/5] w-full border border-ink/8 bg-white" />
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setGallery(i)}
                  className={i === gallery ? "ring-2 ring-gold" : ""}
                >
                  <SmartImage src={src} alt="" className="aspect-square" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <p className="eyebrow text-gold">{product.roast_level ? `${titleCase(product.roast_level)} roast` : "House roast"}</p>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">{product.name}</h1>
          {product.name_ar ? (
            <p className="font-subtitle mt-2 text-muted" dir="rtl">
              {product.name_ar}
            </p>
          ) : null}
          <p className="mt-4 text-xl">
            {selected?.price ? formatMoney(selected.price) : "Price unavailable"}
            {selected?.compare_at_price ? (
              <span className="ml-3 text-base text-muted line-through">
                {formatMoney(selected.compare_at_price)}
              </span>
            ) : null}
          </p>
          {product.tasting_notes ? (
            <p className="mt-4 text-muted">Tasting notes — {product.tasting_notes}</p>
          ) : null}
          {product.short_description ? <p className="mt-4 leading-relaxed">{product.short_description}</p> : null}

          {variants.length > 1 ? (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedId(variant.id)}
                    className={`border px-4 py-2 text-sm ${
                      selectedId === variant.id ? "border-forest bg-forest text-cream" : "border-ink/15"
                    }`}
                  >
                    {variant.name}
                    {variant.weight_label ? ` · ${variant.weight_label}` : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : selected?.weight_label ? (
            <p className="mt-6 text-sm text-muted">{selected.weight_label}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Quantity
              value={qty}
              onChange={setQty}
              min={1}
              max={product.allow_backorder ? undefined : selected?.stock_quantity}
            />
            <Button onClick={add} disabled={busy || !selected || !inStock}>
              {!selected ? "Unavailable" : !inStock ? "Sold out" : busy ? "Adding…" : "Add to bag"}
            </Button>
          </div>
          {!inStock ? <p className="mt-3 text-sm text-muted">This size is currently unavailable.</p> : null}
          {product.origin ? <p className="mt-6 text-sm text-muted">Origin — {product.origin}</p> : null}
          {product.description ? (
            <div className="prose-bch mt-8 whitespace-pre-wrap text-sm">{product.description}</div>
          ) : null}
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-20 border-t border-ink/8 pt-16" data-reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">The shelf</p>
              <h2 className="font-display mt-3 text-2xl md:text-3xl">You may also like</h2>
            </div>
            {categorySlug(product) ? (
              <Link href={`/shop/${categorySlug(product)}`} className="text-sm text-forest">
                Shop the collection
              </Link>
            ) : null}
          </div>
          <div className="mt-10">
            <ProductGrid products={related.slice(0, 4)} className="lg:grid-cols-4" />
          </div>
        </section>
      ) : null}
    </div>
  );
}
