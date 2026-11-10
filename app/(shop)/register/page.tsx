import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { RegisterForm } from "@/features/account/auth-forms";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader eyebrow={t(locale, "account")} title={t(locale, "createAccount")} />
      <RegisterForm />
    </>
  );
}
