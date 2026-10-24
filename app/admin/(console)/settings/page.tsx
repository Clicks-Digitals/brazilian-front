"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader } from "@/features/admin/admin-table";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import { BRAND } from "@/lib/brand";

export default function SettingsPage() {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    store_name: BRAND.name as string,
    store_name_ar: BRAND.nameAr as string,
    phone: BRAND.phone as string,
    email: BRAND.email as string,
    about: BRAND.about as string,
    story: BRAND.story as string,
    currency: "JOD",
    delivery_fee: "",
    free_over: "",
    instagram: "",
    facebook: "",
  });

  useEffect(() => {
    api
      .get("/admin/settings/")
      .then((raw) => {
        const data = raw as Record<string, unknown>;
        const nested = (data.settings || data) as Record<string, unknown>;
        const delivery = (nested.delivery || {}) as Record<string, string>;
        const social = (nested.social || {}) as Record<string, string>;
        setForm((current) => ({
          ...current,
          store_name: String(nested.store_name || current.store_name),
          store_name_ar: String(nested.store_name_ar || current.store_name_ar),
          phone: String(nested.phone || current.phone),
          email: String(nested.email || current.email),
          about: String(nested.about || current.about),
          story: String(nested.story || current.story),
          currency: String(nested.currency || "JOD"),
          delivery_fee: String(delivery.fee || ""),
          free_over: String(delivery.free_over || ""),
          instagram: social.instagram || "",
          facebook: social.facebook || "",
        }));
      })
      .catch((err) => setError(errorMessage(err)));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      store_name: form.store_name,
      store_name_ar: form.store_name_ar,
      phone: form.phone,
      email: form.email,
      about: form.about,
      story: form.story,
      currency: form.currency,
      delivery: { fee: form.delivery_fee, free_over: form.free_over },
      social: { instagram: form.instagram, facebook: form.facebook },
    };
    try {
      await api.patch("/admin/settings/", payload);
      toast("Settings saved", undefined, "success");
    } catch (err) {
      toast("Save failed", errorMessage(err), "error");
    }
  }

  if (error) return <ErrorState description={error} />;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-4">
      <AdminHeader title="Store settings" />
      <Field label="Store name"><Input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} /></Field>
      <Field label="Arabic name"><Input value={form.store_name_ar} onChange={(e) => setForm({ ...form, store_name_ar: e.target.value })} /></Field>
      <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
      <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
      <Field label="About"><Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></Field>
      <Field label="Story"><Textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} /></Field>
      <Field label="Currency"><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></Field>
      <Field label="Delivery fee JOD"><Input value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })} /></Field>
      <Field label="Free delivery over"><Input value={form.free_over} onChange={(e) => setForm({ ...form, free_over: e.target.value })} /></Field>
      <Field label="Instagram"><Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} /></Field>
      <Field label="Facebook"><Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} /></Field>
      <Button type="submit">Save settings</Button>
    </form>
  );
}
