"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { api } from "@/lib/api";
import { useLocale } from "@/features/i18n/locale-provider";
import { errorMessage } from "@/lib/http";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      await api.post("/newsletter/", { email }, { auth: false });
      setStatus("success");
      setMessage(t("newsletterThanks"));
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(errorMessage(error, t("newsletterError")));
    }
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailAddress")}
        aria-label={t("emailAddress")}
        className={dark ? "border-cream/30 bg-transparent text-cream placeholder:text-cream/60" : undefined}
      />
      <Button type="submit" disabled={status === "loading"} variant={dark ? "gold" : "primary"}>
        {status === "loading" ? t("sending") : t("subscribe")}
      </Button>
      {message ? (
        <p className={`text-sm sm:col-span-2 ${status === "error" ? "text-red-200" : dark ? "text-cream/80" : "text-muted"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
