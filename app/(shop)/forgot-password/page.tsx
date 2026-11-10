import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { ForgotForm } from "@/features/account/auth-forms";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default async function ForgotPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader title={t(locale, "resetYourPassword")} description={t(locale, "resetPasswordBlurb")} />
      <ForgotForm />
    </>
  );
}
