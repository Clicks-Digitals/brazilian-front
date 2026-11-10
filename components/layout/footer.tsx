"use client";

import Link from "next/link";
import { NewsletterForm } from "@/features/storefront/newsletter-form";
import { useLocale } from "@/features/i18n/locale-provider";
import { BRAND } from "@/lib/brand";
import { localizedName } from "@/lib/i18n";
import type { Category, StoreSettings } from "@/types/api";

export function Footer({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: Category[];
}) {
  const { locale, t } = useLocale();
  const phone = settings.phone || BRAND.phone;
  const email = settings.email || BRAND.email;
  const shopLinks = categories.filter((c) => c.show_in_nav !== false).slice(0, 8);
  const social = { instagram: BRAND.instagram, ...(settings?.social || {}) };
  const houseName = locale === "ar" ? BRAND.nameAr : BRAND.name;
  const about = locale === "ar" ? t("aboutBody") : settings.about || BRAND.about;

  return (
    <footer className="bg-forest text-cream">
      <div className="h-px bg-gold/40" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logo} alt={houseName} className="size-16" />
          <p className="font-display text-2xl text-cream">{houseName}</p>
          <p className="text-sm leading-relaxed text-cream/75">{about}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
            {t("statEst", { year: BRAND.established })} · {t("jordan")} {BRAND.jordanSince}
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold">{t("shop")}</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/shop" className="hover:text-gold">
                {t("allCoffees")}
              </Link>
            </li>
            {shopLinks.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`} className="hover:text-gold">
                  {localizedName(locale, category)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">{t("house")}</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-gold">
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link href="/export" className="hover:text-gold">
                {t("exportCollection")}
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-gold">
                {t("categories")}
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-gold">
                {t("articles")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                {t("contact")}
              </Link>
            </li>
            <li>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-gold">
                {email}
              </a>
            </li>
            {Object.entries(social).map(([network, url]) =>
              url ? (
                <li key={network}>
                  <a href={url} className="capitalize hover:text-gold" target="_blank" rel="noreferrer">
                    {network}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">{t("theList")}</p>
          <p className="mt-5 mb-5 text-sm text-cream/75">{t("footerListBlurb")}</p>
          <NewsletterForm dark />
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-cream/55">
          <p>
            © {new Date().getFullYear()} {houseName}. {t("rights")}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy">{t("privacy")}</Link>
            <Link href="/terms">{t("terms")}</Link>
            <Link href="/shipping">{t("shipping")}</Link>
            <Link href="/returns">{t("returns")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
