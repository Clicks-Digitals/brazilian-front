import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { LoginForm } from "@/features/account/auth-forms";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader eyebrow={t(locale, "account")} title={t(locale, "signIn")} />
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
