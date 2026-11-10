"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Quantity } from "@/components/ui/quantity";
import { EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/ui/states";
import { SmartImage } from "@/components/ui/smart-image";
import { applyDiscountCode, fetchCart, removeCartItem, updateCartItem } from "@/features/cart/cart-api";
import { useLocale } from "@/features/i18n/locale-provider";
import { toast } from "@/features/ui/toast-store";
import { localizedName } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { pickImage } from "@/lib/settings";
import type { Cart } from "@/types/api";

export function CartPageClient() {
  const { locale, t } = useLocale();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setCart(await fetchCart());
    } catch (err) {
      setError(errorMessage(err, t("bagCouldNotLoad")));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-6 py-16">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!cart || !cart.items?.length) {
    return (
      <EmptyState
        title={t("bagEmpty")}
        description={t("bagEmptyBlurb")}
        action={<Button href="/shop">{t("shopCoffeeCta")}</Button>}
      />
    );
  }

  return (
    <>
      <PageHeader eyebrow={t("bag")} title={t("yourBag")} />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-cream/15">
          {cart.items.map((item) => {
            const variant = typeof item.variant === "object" ? item.variant : null;
            const product = item.product || variant?.product;
            const name =
              localizedName(locale, product) || item.product_name || product?.name || variant?.name || t("coffee");
            const slug = item.product_slug || product?.slug;
            const variantName = item.variant_name || variant?.name;
            const image = item.image || variant?.image || (product ? pickImage(product) : null);
            const price = item.unit_price || variant?.price;
            return (
              <li key={item.id} className="flex gap-4 py-6">
                <SmartImage
                  src={image}
                  alt={name}
                  className="size-24 shrink-0"
                />
                <div className="flex-1">
                  <Link href={slug ? `/products/${slug}` : "/shop"} className="font-medium">
                    {name}
                  </Link>
                  <p className="text-sm text-cream/70">{variantName}</p>
                  <p className="mt-1 text-sm">{formatMoney(price || "0")}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Quantity
                      value={item.quantity}
                      disabled={busyId === item.id}
                      onChange={async (quantity) => {
                        setBusyId(item.id);
                        try {
                          setCart(await updateCartItem(item.id, quantity));
                        } catch (err) {
                          toast(t("couldNotUpdate"), errorMessage(err), "error");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="text-sm text-cream/70 hover:text-gold"
                      disabled={busyId === item.id}
                      onClick={async () => {
                        setBusyId(item.id);
                        try {
                          setCart(await removeCartItem(item.id));
                        } catch (err) {
                          toast(t("couldNotRemove"), errorMessage(err), "error");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
                <p className="text-sm">{formatMoney(item.line_total || "")}</p>
              </li>
            );
          })}
        </ul>
        <aside className="h-fit space-y-4 border border-cream/15 bg-cream/10 p-6 text-cream">
          <h2 className="text-lg font-medium">{t("summary")}</h2>
          <p className="flex justify-between text-sm text-cream/80">
            <span>{t("subtotal")}</span>
            <span>{formatMoney(cart.subtotal || "0")}</span>
          </p>
          {Number(cart.discount_amount || 0) > 0 ? (
            <p className="flex justify-between text-sm text-gold">
              <span>{t("discount")} {cart.discount_code ? `(${cart.discount_code})` : ""}</span>
              <span>-{formatMoney(cart.discount_amount || "0")}</span>
            </p>
          ) : null}
          <p className="flex justify-between text-sm text-cream/80">
            <span>{t("delivery")}</span>
            <span>{cart.delivery_fee ? formatMoney(cart.delivery_fee) : t("calculatedAtCheckout")}</span>
          </p>
          <div className="gold-rule" />
          <p className="flex justify-between">
            <span>{t("total")}</span>
            <span>{formatMoney(cart.total || cart.subtotal || "0", cart.currency)}</span>
          </p>
          <form
            className="space-y-2"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setCart(await applyDiscountCode(code));
                toast(t("codeApplied"), code, "success");
              } catch (err) {
                toast(t("codeNotApplied"), errorMessage(err), "error");
              }
            }}
          >
            <Field tone="forest" label={t("discountCode")}>
              <Input tone="forest" value={code} onChange={(e) => setCode(e.target.value)} />
            </Field>
            <Button type="submit" variant="secondary" className="w-full border-cream/25 text-cream hover:border-gold hover:text-gold" disabled={!code}>
              {t("apply")}
            </Button>
          </form>
          <Button href="/checkout" variant="gold" className="w-full">
            {t("checkout")}
          </Button>
          <p className="text-xs text-cream/55">{t("codOnly")}</p>
        </aside>
      </div>
    </>
  );
}
