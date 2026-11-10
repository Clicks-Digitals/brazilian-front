"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ErrorState, PageHeader, Skeleton } from "@/components/ui/states";
import { fetchCart } from "@/features/cart/cart-api";
import { useLocale } from "@/features/i18n/locale-provider";
import { useAuthStore } from "@/features/account/auth-store";
import { api } from "@/lib/api";
import { formatMoney, newIdempotencyKey } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import type { Cart, Order } from "@/types/api";

export function CheckoutPageClient() {
  const { t } = useLocale();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const idempotency = useMemo(() => {
    if (typeof window === "undefined") return newIdempotencyKey();
    const existing = sessionStorage.getItem("bch-checkout-id");
    if (existing) return existing;
    const key = newIdempotencyKey();
    sessionStorage.setItem("bch-checkout-id", key);
    return key;
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: current.name || [user.first_name, user.last_name].filter(Boolean).join(" "),
      phone: current.phone || user.phone || "",
    }));
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (error) return <ErrorState description={error} />;
  if (!cart?.items?.length) {
    return <ErrorState title={t("bagEmpty")} description={t("addCoffeesBeforeCheckout")} />;
  }

  async function place(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const order = await api.post<Order>("/checkout/", {
        cart_token: cart!.token,
        customer: {
          full_name: form.name.trim(),
          phone: form.phone.trim(),
        },
        address: {
          line1: form.location.trim(),
          city: form.location.trim(),
          country: "Jordan",
        },
        payment_method: "cod",
        discount_code: cart!.discount_code || undefined,
        idempotency_key: idempotency,
        notes: form.notes.trim(),
      });
      sessionStorage.removeItem("bch-checkout-id");
      router.push(`/checkout/confirmation/${order.order_number}`);
    } catch (err) {
      setError(errorMessage(err, "The order could not be placed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader eyebrow={t("checkout")} title={t("cashOnDelivery")} description={t("checkoutBlurb")} />
      <form onSubmit={place} className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <Field tone="forest" label={t("name")}>
            <Input
              required
              tone="forest"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field tone="forest" label={t("phoneNumber")}>
            <Input
              required
              tone="forest"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field tone="forest" label={t("location")}>
            <Input
              required
              tone="forest"
              autoComplete="street-address"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field tone="forest" label={t("notes")} hint={t("optional")}>
            <Textarea
              tone="forest"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>
          <p className="min-h-12 border border-cream/15 bg-cream/10 px-4 py-3 text-sm text-cream/80">
            {t("paymentCod")}
          </p>
          <Button type="submit" variant="gold" className="w-full sm:w-auto" disabled={submitting}>
            {submitting ? t("placingOrder") : t("placeOrder")}
          </Button>
        </div>
        <aside className="h-fit space-y-3 border border-cream/15 bg-cream/10 p-6 text-cream">
          <h2 className="font-medium">{t("orderSummary")}</h2>
          {cart.items.map((item) => (
            <p key={item.id} className="flex justify-between text-sm text-cream/80">
              <span>
                {item.product_name || item.product?.name || item.variant_name || t("coffee")} × {item.quantity}
              </span>
              <span>{formatMoney(item.line_total || "")}</span>
            </p>
          ))}
          <p className="flex justify-between text-sm text-cream/80">
            <span>{t("subtotal")}</span>
            <span>{formatMoney(cart.subtotal || "0")}</span>
          </p>
          <p className="flex justify-between text-sm text-cream/80">
            <span>{t("delivery")}</span>
            <span>{cart.delivery_fee ? formatMoney(cart.delivery_fee) : t("calculatedAtCheckout")}</span>
          </p>
          <p className="flex justify-between">
            <span>{t("total")}</span>
            <span>{formatMoney(cart.total || "0", cart.currency)}</span>
          </p>
        </aside>
      </form>
    </>
  );
}
