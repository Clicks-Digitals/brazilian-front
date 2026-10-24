import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { ResetForm } from "@/features/account/auth-forms";

export const metadata: Metadata = { title: "New password", robots: { index: false } };

export default function ResetPage() {
  return (
    <>
      <PageHeader title="Choose a new password" />
      <Suspense>
        <ResetForm />
      </Suspense>
    </>
  );
}
