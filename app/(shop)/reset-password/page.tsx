import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { ResetForm } from "@/features/account/auth-forms";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export const metadata: Metadata = { title: "New password", robots: { index: false } };

export default async function ResetPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader title={t(locale, "chooseNewPassword")} />
      <Suspense>
        <ResetForm />
      </Suspense>
    </>
  );
}
