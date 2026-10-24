import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/states";
import { ForgotForm } from "@/features/account/auth-forms";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default function ForgotPage() {
  return (
    <>
      <PageHeader title="Reset your password" description="We will email a reset link if the account exists." />
      <ForgotForm />
    </>
  );
}
