"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/account/auth-store";
import { logoutSession } from "@/features/account/auth-api";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/account", label: "Overview" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/orders", label: "Orders" },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const access = useAuthStore((s) => s.access);

  useEffect(() => {
    if (hydrated && !access) router.replace("/login?next=/account");
  }, [hydrated, access, router]);

  if (!hydrated) return <div className="px-6 py-20 text-muted">Loading account…</div>;
  if (!access) return null;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[14rem_1fr]">
      <aside>
        <p className="eyebrow text-gold">Account</p>
        <nav className="mt-4 space-y-2" aria-label="Account">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("block text-sm", pathname === link.href ? "text-forest" : "text-muted hover:text-ink")}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="mt-4 text-sm text-muted hover:text-ink"
            onClick={async () => {
              await logoutSession();
              router.push("/");
            }}
          >
            Sign out
          </button>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
