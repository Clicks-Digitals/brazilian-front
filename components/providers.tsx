"use client";

import { SessionBootstrap } from "@/features/cart/cart-bootstrap";
import { LocaleProvider } from "@/features/i18n/locale-provider";
import { Toaster } from "@/components/ui/toast";
import type { Locale } from "@/lib/i18n";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <SessionBootstrap />
      {children}
      <Toaster />
    </LocaleProvider>
  );
}
