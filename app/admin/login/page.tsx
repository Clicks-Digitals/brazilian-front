import { Suspense } from "react";
import { LoginForm } from "@/features/account/auth-forms";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Admin sign in", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND.logo} alt={BRAND.name} className="mb-6 size-16" />
      <p className="eyebrow text-gold">Staff</p>
      <h1 className="font-display mt-3 text-3xl">House Admin</h1>
      <p className="font-subtitle mt-2 mb-8 text-sm text-muted">Sign in to manage the house.</p>
      <Suspense>
        <LoginForm admin />
      </Suspense>
    </div>
  );
}
