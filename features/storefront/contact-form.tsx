"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";

export function ContactForm() {
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
      setMessage(errorMessage(error, "We could not send that message. Please try again or call the house."));
    }
  }

  if (status === "sent") {
    return (
      <div className="border-t border-ink/10 pt-8">
        <p className="eyebrow text-gold">Sent</p>
        <p className="font-subtitle mt-3 text-lg text-ink">
          Thank you. We received your note and will reply from the house.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 md:space-y-5">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <Field label="Name">
          <Input
            required
            autoComplete="name"
            className="min-h-12 text-base"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className="min-h-12 text-base"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Phone" hint="Optional">
        <Input
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          className="min-h-12 text-base"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </Field>
      <Field label="Message">
        <Textarea
          required
          className="min-h-36 text-base"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
      </Field>
      <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
      {message ? <p className="font-subtitle text-sm text-muted">{message}</p> : null}
    </form>
  );
}
