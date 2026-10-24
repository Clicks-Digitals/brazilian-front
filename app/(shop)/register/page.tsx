import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { RegisterForm } from "@/features/account/auth-forms";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <>
      <PageHeader eyebrow="Account" title="Create an account" />
      <RegisterForm />
    </>
  );
}
