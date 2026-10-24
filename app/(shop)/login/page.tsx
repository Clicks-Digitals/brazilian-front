import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { LoginForm } from "@/features/account/auth-forms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Sign in" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
