"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Quantity } from "@/components/ui/quantity";
import { EmptyState, ErrorState, PageHeader, Skeleton } from "@/components/ui/states";
import { SmartImage } from "@/components/ui/smart-image";
import { applyDiscountCode, fetchCart, removeCartItem, updateCartItem } from "@/features/cart/cart-api";
import { toast } from "@/features/ui/toast-store";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { pickImage } from "@/lib/settings";
import type { Cart } from "@/types/api";

export function CartPageClient() {
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
      setError(errorMessage(err, "The bag could not be loaded."));
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
        title="Your bag is empty"
        description="Add a roast from the shop when you are ready."
        action={<Button href="/shop">Shop coffee</Button>}
      />
    );
  }

  return (
    <>
      <PageHeader eyebrow="Bag" title="Your bag" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-ink/10">
          {cart.items.map((item) => {
            const variant = typeof item.variant === "object" ? item.variant : null;
            const product = item.product || variant?.product;
            const name = item.product_name || product?.name || variant?.name || "Coffee";
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
                  <p className="text-sm text-muted">{variantName}</p>
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
                          toast("Could not update", errorMessage(err), "error");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="text-sm text-muted hover:text-ink"
                      disabled={busyId === item.id}
                      onClick={async () => {
                        setBusyId(item.id);
                        try {
                          setCart(await removeCartItem(item.id));
                        } catch (err) {
                          toast("Could not remove", errorMessage(err), "error");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm">{formatMoney(item.line_total || "")}</p>
              </li>
            );
          })}
        </ul>
        <aside className="h-fit space-y-4 border border-ink/10 bg-cream p-6">
          <h2 className="text-lg font-medium">Summary</h2>
          <p className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatMoney(cart.subtotal || "0")}</span>
          </p>
          {Number(cart.discount_amount || 0) > 0 ? (
            <p className="flex justify-between text-sm text-forest">
              <span>Discount {cart.discount_code ? `(${cart.discount_code})` : ""}</span>
              <span>-{formatMoney(cart.discount_amount || "0")}</span>
            </p>
          ) : null}
          <p className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>{cart.delivery_fee ? formatMoney(cart.delivery_fee) : "Calculated at checkout"}</span>
          </p>
          <div className="gold-rule" />
          <p className="flex justify-between">
            <span>Total</span>
            <span>{formatMoney(cart.total || cart.subtotal || "0", cart.currency)}</span>
          </p>
          <form
            className="space-y-2"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                setCart(await applyDiscountCode(code));
                toast("Code applied", code, "success");
              } catch (err) {
                toast("Code not applied", errorMessage(err), "error");
              }
            }}
          >
            <Field label="Discount code">
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </Field>
            <Button type="submit" variant="secondary" className="w-full" disabled={!code}>
              Apply
            </Button>
          </form>
          <Button href="/checkout" className="w-full">
            Checkout
          </Button>
          <p className="text-xs text-muted">Cash on delivery only. Totals are confirmed by the server.</p>
        </aside>
      </div>
    </>
  );
}
