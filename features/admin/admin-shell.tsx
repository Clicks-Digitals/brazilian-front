"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, Store, X } from "lucide-react";
import { logoutSession } from "@/features/account/auth-api";
import { useAuthStore } from "@/features/account/auth-store";
import { ADMIN_NAV } from "@/features/admin/admin-nav";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";

type AdminNavItem = (typeof ADMIN_NAV)[number];

function groupedNav(items: readonly AdminNavItem[]) {
  const groups: { name: string; items: AdminNavItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (!last || last.name !== item.group) groups.push({ name: item.group, items: [item] });
    else last.items.push(item);
  }
  return groups;
}

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: AdminNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-5" aria-label="Admin">
      {groupedNav(items).map((group) => (
        <div key={group.name}>
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-cream/40">{group.name}</p>
          <div className="mt-2 space-y-1">
            {group.items.map((item) => {
              const on =
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    on ? "bg-cream text-forest" : "text-cream/75 hover:bg-white/10 hover:text-cream",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const access = useAuthStore((s) => s.access);
  const user = useAuthStore((s) => s.user);
  const isStaff = useAuthStore((s) => s.isStaff);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!access) {
      router.replace("/admin/login");
      return;
    }
    if (user && !isStaff()) {
      router.replace("/admin/forbidden");
    }
  }, [hydrated, access, user, isStaff, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const visible = useMemo(
    () => ADMIN_NAV.filter((item) => hasPermission(item.permission) || user?.is_superuser),
    [hasPermission, user?.is_superuser],
  );

  if (!hydrated || !access) {
    return (
      <div className="grid min-h-screen place-items-center bg-linen text-sm text-muted">Loading console…</div>
    );
  }

  async function signOut() {
    await logoutSession();
    router.push("/admin/login");
  }

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Staff";

  const sidebar = (
    <>
      <Link href="/admin" className="flex items-center gap-3 px-5 py-6" onClick={() => setOpen(false)}>
        <span className="grid size-10 place-items-center rounded-full bg-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logo} alt="" className="size-7" />
        </span>
        <span>
          <span className="block text-sm font-medium text-cream">House Admin</span>
          <span className="font-subtitle block text-xs text-cream/50">{BRAND.name}</span>
        </span>
      </Link>
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        <NavLinks items={visible} pathname={pathname} onNavigate={() => setOpen(false)} />
      </div>
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="grid size-9 place-items-center rounded-full bg-gold text-xs font-medium text-forest-dark">
            {name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm text-cream">{name}</p>
            <p className="truncate text-xs text-cream/45">{user?.email}</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/70 hover:bg-white/10 hover:text-cream"
          onClick={() => setOpen(false)}
        >
          <Store className="size-4" strokeWidth={1.75} />
          View storefront
        </Link>
        <button
          type="button"
          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-cream/70 hover:bg-white/10 hover:text-cream"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-linen text-ink">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[16.5rem_1fr]">
        <aside className="no-print hidden flex-col bg-forest-dark lg:flex">{sidebar}</aside>

        <div className="min-w-0">
          <header className="no-print sticky top-0 z-40 flex items-center justify-between gap-3 bg-linen/90 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-xl bg-white text-ink lg:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <p className="hidden truncate font-subtitle text-sm text-muted sm:block">{user?.email}</p>
            </div>
          </header>

          {open ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={() => setOpen(false)} />
              <aside className="relative flex h-full w-[16.5rem] max-w-[85vw] flex-col bg-forest-dark shadow-xl">
                {sidebar}
              </aside>
            </div>
          ) : null}

          <div className="px-4 pb-8 sm:px-6 md:pb-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function useCan(code: string) {
  return useAuthStore((s) => s.hasPermission(code) || Boolean(s.user?.is_superuser));
}
