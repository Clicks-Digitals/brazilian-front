"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useAuthStore } from "@/features/account/auth-store";
import { useCartStore } from "@/features/cart/cart-store";
import { useLocale } from "@/features/i18n/locale-provider";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { localizedName } from "@/lib/i18n";
import type { Category } from "@/types/api";

function LogoMark({ overlay }: { overlay: boolean }) {
  return (
    <Link href="/" className="nav-brand" aria-label={BRAND.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND.logo} alt="" className={cn("nav-logo", overlay && "nav-logo-overlay")} />
      <span className="nav-wordmark">
        <span className="nav-brand-ar" dir="rtl" lang="ar">
          بيت البن البرازيلي
        </span>
        <span className="nav-brand-name">Brazilian Coffee House</span>
      </span>
    </Link>
  );
}

export function Header({
  categories,
  isHome = false,
  solid: _solid = false,
}: {
  categories: Category[];
  isHome?: boolean;
  solid?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCartStore((s) => s.itemCount);
  const user = useAuthStore((s) => s.user);
  const overlay = false;
  const { locale, t } = useLocale();
  const staticNav = [
    { href: "/about", label: t("about") },
    { href: "/categories", label: t("categories") },
    { href: "/shop", label: t("shop") },
    { href: "/export", label: t("export") },
    { href: "/articles", label: t("articles") },
    { href: "/contact", label: t("contact") },
  ];

  const navCategories = categories.filter((c) => c.show_in_nav !== false && c.is_active !== false).slice(0, 8);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [open, overlay, isHome]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function IconButton({
    label,
    onClick,
    href,
    children,
  }: {
    label: string;
    onClick?: () => void;
    href?: string;
    children: ReactNode;
  }) {
    const className = "nav-icon";
    if (href) {
      return (
        <Link href={href} aria-label={label} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" aria-label={label} className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <header
      ref={headerRef}
      data-nav={overlay ? "overlay" : "solid"}
      className={cn("site-header z-50 is-solid", isHome && "is-home")}
    >
      <div className="nav-shell">
        <div className="nav-mobile">
          <IconButton label={open ? t("closeMenu") : t("openMenu")} onClick={() => setOpen((v) => !v)}>
            {open ? <X className="size-[18px]" strokeWidth={1.5} /> : <Menu className="size-[18px]" strokeWidth={1.5} />}
          </IconButton>

          <Link href="/" className="nav-logo-center" aria-label={BRAND.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND.logo} alt="" className={cn("nav-logo", overlay && "nav-logo-overlay")} />
          </Link>

          <div className="flex items-center justify-end">
            <LanguageSwitcher className="me-1" />
            <IconButton label={t("search")} onClick={() => setSearchOpen(true)}>
              <Search className="size-4" strokeWidth={1.5} />
            </IconButton>
            <IconButton label={t("bag")} href="/cart">
              <span className="relative">
                <ShoppingBag className="size-4" strokeWidth={1.5} />
                {count > 0 ? <span className="nav-count">{count}</span> : null}
              </span>
            </IconButton>
          </div>
        </div>

        <div className="nav-desktop">
          <LogoMark overlay={overlay} />
          <nav className="nav-primary" aria-label="Primary">
            {staticNav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-1">
            <LanguageSwitcher />
            <IconButton label={t("search")} onClick={() => setSearchOpen(true)}>
              <Search className="size-4" strokeWidth={1.5} />
            </IconButton>
            <IconButton label={t("account")} href={user ? "/account" : "/login"}>
              <User className="size-4" strokeWidth={1.5} />
            </IconButton>
            <IconButton label={t("bag")} href="/cart">
              <span className="relative">
                <ShoppingBag className="size-4" strokeWidth={1.5} />
                {count > 0 ? <span className="nav-count">{count}</span> : null}
              </span>
            </IconButton>
          </div>
        </div>
      </div>

      {navCategories.length > 0 ? (
        <div className="nav-categories-row">
          <div className="nav-categories">
            {navCategories.map((category) => (
              <Link key={category.slug} href={`/shop/${category.slug}`} className="nav-cat-link">
                {localizedName(locale, category)}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className={cn("nav-drawer", open ? "is-open" : "")} aria-hidden={!open}>
        <div className="nav-drawer-top">
          <button type="button" aria-label={t("closeMenu")} className="nav-icon" onClick={() => setOpen(false)}>
            <X className="size-[18px]" strokeWidth={1.5} />
          </button>
          <Link href="/" className="nav-logo-center" aria-label={BRAND.name} onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND.logo} alt="" className="nav-logo" />
          </Link>
          <span />
        </div>
        <nav className="nav-drawer-inner" aria-label="Mobile">
          {staticNav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-drawer-link" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={user ? "/account" : "/login"} className="nav-drawer-link" onClick={() => setOpen(false)}>
            {user ? t("account") : t("signIn")}
          </Link>
          <div className="mt-6">
            <LanguageSwitcher align="start" />
          </div>
          <div className="gold-rule my-6" />
          <p className="eyebrow text-gold">{t("collections")}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {navCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="py-1.5 text-sm text-cream"
                onClick={() => setOpen(false)}
              >
                {localizedName(locale, category)}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
