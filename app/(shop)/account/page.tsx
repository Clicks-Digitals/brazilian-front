"use client";

import Link from "next/link";
import { LoyaltyWidget } from "@/features/account/loyalty-widget";
import { useAuthStore } from "@/features/account/auth-store";

export default function AccountOverviewPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light">Hello{user?.first_name ? `, ${user.first_name}` : ""}</h1>
        <p className="mt-2 text-muted">{user?.email}</p>
      </div>
      <LoyaltyWidget />
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/account/orders" className="border border-ink/10 p-5 hover:border-forest">
          Orders
        </Link>
        <Link href="/account/addresses" className="border border-ink/10 p-5 hover:border-forest">
          Addresses
        </Link>
        <Link href="/account/profile" className="border border-ink/10 p-5 hover:border-forest">
          Profile
        </Link>
      </div>
    </div>
  );
}
