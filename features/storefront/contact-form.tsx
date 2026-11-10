"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useLocale } from "@/features/i18n/locale-provider";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";

export function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", body: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await api.post(
        "/contact/",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.body,
        },
        { auth: false, cart: false },
      );
      setStatus("sent");
    } catch (error) {
      setStatus("idle");
      setMessage(errorMessage(error, t("contactError")));
    }
  }

  if (status === "sent") {
    return (
      <div className="border-t border-ink/10 pt-8">
        <p className="eyebrow text-gold">{t("sent")}</p>
        <p className="font-subtitle mt-3 text-lg text-ink">
          {t("contactThanks")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 md:space-y-5">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <Field tone="forest" label={t("name")}>
          <Input
            required
            tone="forest"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field tone="forest" label={t("email")}>
          <Input
            type="email"
            required
            tone="forest"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
      </div>
      <Field tone="forest" label={t("phone")} hint={t("optional")}>
        <Input
          type="tel"
          tone="forest"
          autoComplete="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </Field>
      <Field tone="forest" label={t("message")}>
        <Textarea
          required
          tone="forest"
          className="min-h-36"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
      </Field>
      <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? t("sending") : t("sendMessage")}
      </Button>
      {message ? <p className="font-subtitle text-sm text-muted">{message}</p> : null}
    </form>
  );
}
