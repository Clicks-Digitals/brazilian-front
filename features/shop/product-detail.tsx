"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Quantity } from "@/components/ui/quantity";
import { SmartImage } from "@/components/ui/smart-image";
import { ProductGrid } from "@/features/shop/product-card";
import { addToCart } from "@/features/cart/cart-api";
import { useLocale } from "@/features/i18n/locale-provider";
import { toast } from "@/features/ui/toast-store";
import { formatMoney, titleCase } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { localizedName } from "@/lib/i18n";
import { categorySlug, pickImage } from "@/lib/settings";
import type { Product, ProductVariant } from "@/types/api";

const ROAST_KEYS = {
  light: "roastLight",
  medium: "roastMedium",
  "medium-dark": "roastMediumDark",
  dark: "roastDark",
} as const;

export function ProductDetail({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const variants = (product.variants || []).filter((item) => item.is_active !== false);
  const displayName = localizedName(locale, product);
  const category =
    product.category && typeof product.category === "object" ? product.category : null;
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
      toast(t("noAvailableSize"), undefined, "error");
      return;
    }
    setBusy(true);
    try {
      await addToCart(selected.id, qty, product);
      toast(t("addedToBag"), `${qty} × ${displayName}`, "success");
    } catch (error) {
      toast(t("couldNotAdd"), errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12" data-reveal>
      <p className="text-sm text-cream/70">
        <Link href="/shop">{t("shop")}</Link>
        {categorySlug(product) ? (
          <>
            {" / "}
            <Link href={`/shop/${categorySlug(product)}`}>
              {localizedName(locale, category) || categorySlug(product)}
            </Link>
          </>
        ) : null}
      </p>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <SmartImage src={images[gallery]} alt={displayName} className="aspect-[4/5] w-full border border-ink/8 bg-white" />
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={t("viewImage", { n: i + 1 })}
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
          <p className="eyebrow text-gold">
            {product.roast_level
              ? t("roastLevel", {
                  level:
                    ROAST_KEYS[product.roast_level as keyof typeof ROAST_KEYS]
                      ? t(ROAST_KEYS[product.roast_level as keyof typeof ROAST_KEYS])
                      : titleCase(product.roast_level),
                })
              : t("houseRoast")}
          </p>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">{displayName}</h1>
          <p className="mt-4 text-xl">
            {selected?.price ? formatMoney(selected.price) : t("priceUnavailable")}
            {selected?.compare_at_price ? (
              <span className="ml-3 text-base text-cream/55 line-through">
                {formatMoney(selected.compare_at_price)}
              </span>
            ) : null}
          </p>
          {product.tasting_notes ? (
            <p className="mt-4 text-cream/75">{t("tastingNotesLine", { notes: product.tasting_notes })}</p>
          ) : null}
          {product.short_description ? (
            <p className="font-subtitle mt-4 leading-relaxed text-cream/80">{product.short_description}</p>
          ) : null}

          {variants.length > 1 ? (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.16em] text-cream/70">{t("size")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedId(variant.id)}
                    className={`border px-4 py-2 text-sm ${
                      selectedId === variant.id ? "border-gold bg-gold text-forest-dark" : "border-cream/25"
                    }`}
                  >
                    {variant.name}
                    {variant.weight_label ? ` · ${variant.weight_label}` : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : selected?.weight_label ? (
            <p className="mt-6 text-sm text-cream/70">{selected.weight_label}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Quantity
              value={qty}
              onChange={setQty}
              min={1}
              max={product.allow_backorder ? undefined : selected?.stock_quantity}
            />
            <Button variant="gold" onClick={add} disabled={busy || !selected || !inStock}>
              {!selected ? t("unavailable") : !inStock ? t("soldOut") : busy ? `${t("adding")}…` : t("addToBag")}
            </Button>
          </div>
          {!inStock ? <p className="mt-3 text-sm text-cream/70">{t("thisSizeUnavailable")}</p> : null}
          {product.origin ? <p className="mt-6 text-sm text-cream/70">{t("originLine", { origin: product.origin })}</p> : null}
          {product.description ? (
            <div className="prose-bch mt-8 whitespace-pre-wrap text-sm text-cream/80">{product.description}</div>
          ) : null}
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-20 border-t border-ink/8 pt-16" data-reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold">{t("theShelf")}</p>
              <h2 className="font-display mt-3 text-2xl md:text-3xl">{t("youMayAlsoLike")}</h2>
            </div>
            {categorySlug(product) ? (
              <Link href={`/shop/${categorySlug(product)}`} className="text-sm text-gold">
                {t("shopTheCollection")}
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
