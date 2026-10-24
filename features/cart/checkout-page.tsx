"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ErrorState, PageHeader, Skeleton } from "@/components/ui/states";
import { fetchCart } from "@/features/cart/cart-api";
import { useAuthStore } from "@/features/account/auth-store";
import { api } from "@/lib/api";
import { newIdempotencyKey } from "@/lib/format";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { asList } from "@/lib/settings";
import type { Address, Cart, Order } from "@/types/api";

const CITIES = ["Amman", "Irbid", "Zarqa", "Balqa", "Madaba", "Mafraq", "Other"];

export function CheckoutPageClient() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
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
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "Amman",
    area: "",
    country: "Jordan",
    delivery_instructions: "",
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
      email: current.email || user.email,
      first_name: current.first_name || user.first_name || "",
      last_name: current.last_name || user.last_name || "",
      phone: current.phone || user.phone || "",
    }));
    api
      .get("/account/addresses/")
      .then((data) => {
        const list = asList<Address>(data);
        setAddresses(list);
        const def = list.find((a) => a.is_default) || list[0];
        if (def) {
          setForm((current) => ({
            ...current,
            phone: current.phone || def.phone,
            line1: def.line1,
            line2: def.line2 || "",
            city: def.city || "Amman",
            area: def.area || "",
            country: def.country || "Jordan",
            delivery_instructions: def.delivery_instructions || "",
            first_name: current.first_name || def.full_name.split(" ")[0],
            last_name: current.last_name || def.full_name.split(" ").slice(1).join(" "),
          }));
        }
      })
      .catch(() => undefined);
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
    return (
      <ErrorState
        title="Your bag is empty"
        description="Add coffees before checking out."
      />
    );
  }

  async function place(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const order = await api.post<Order>("/checkout/", {
        cart_token: cart!.token,
        customer: {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
        },
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          area: form.area,
          country: form.country,
          delivery_instructions: form.delivery_instructions,
        },
        payment_method: "cod",
        discount_code: cart!.discount_code || undefined,
        idempotency_key: idempotency,
        notes: form.notes,
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
      <PageHeader
        eyebrow="Checkout"
        title="Cash on delivery"
        description="Pay when your order arrives. Card checkout is not offered on this site."
      />
      <form onSubmit={place} className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {!user ? (
            <p className="text-sm text-muted">
              Guest checkout is available. Already have an account?{" "}
              <a className="text-forest" href="/login?next=/checkout">
                Sign in
              </a>
            </p>
          ) : null}
          {addresses.length > 0 ? (
            <Field label="Saved address">
              <Select
                onChange={(e) => {
                  const found = addresses.find((a) => String(a.id) === e.target.value);
                  if (!found) return;
                  setForm((current) => ({
                    ...current,
                    line1: found.line1,
                    line2: found.line2 || "",
                    city: found.city,
                    area: found.area || "",
                    phone: found.phone,
                    country: found.country || "Jordan",
                    delivery_instructions: found.delivery_instructions || "",
                  }));
                }}
              >
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label || address.line1} — {address.city}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="First name">
              <Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </Field>
            <Field label="Last name">
              <Input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Street address" className="md:col-span-2">
              <Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            </Field>
            <Field label="Apartment / extra">
              <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            </Field>
            <Field label="Area">
              <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </Field>
            <Field label="City">
              <Select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                {CITIES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </Select>
            </Field>
            <Field label="Country">
              <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </Field>
            <Field label="Delivery notes" className="md:col-span-2">
              <Textarea value={form.delivery_instructions} onChange={(e) => setForm({ ...form, delivery_instructions: e.target.value })} />
            </Field>
            <Field label="Order notes" className="md:col-span-2">
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>
          <div className="border border-ink/10 bg-cream p-4 text-sm">
            Payment method — Cash on delivery. No card details are collected.
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </Button>
        </div>
        <aside className="h-fit space-y-3 border border-ink/10 p-6">
          <h2 className="font-medium">Order summary</h2>
          {cart.items.map((item) => (
            <p key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product_name || item.product?.name || item.variant_name || "Coffee"} × {item.quantity}
              </span>
              <span>{formatMoney(item.line_total || "")}</span>
            </p>
          ))}
          <p className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatMoney(cart.subtotal || "0")}</span>
          </p>
          <p className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>{formatMoney(cart.delivery_fee || "0")}</span>
          </p>
          <p className="flex justify-between">
            <span>Total</span>
            <span>{formatMoney(cart.total || "0", cart.currency)}</span>
          </p>
        </aside>
      </form>
    </>
  );
}
