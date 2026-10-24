import Link from "next/link";
import { NewsletterForm } from "@/features/storefront/newsletter-form";
import { BRAND } from "@/lib/brand";
import type { Category, StoreSettings } from "@/types/api";

export function Footer({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: Category[];
}) {
  const phone = settings.phone || BRAND.phone;
  const email = settings.email || BRAND.email;
  const shopLinks = categories.filter((c) => c.show_in_nav !== false).slice(0, 8);
  const social = settings?.social || {};

  return (
    <footer className="bg-forest-dark text-cream">
      <div className="h-px bg-gold/40" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logo} alt={BRAND.name} className="size-16" />
          <p className="font-display text-2xl text-cream">{BRAND.name}</p>
          <p className="text-sm leading-relaxed text-cream/75">{settings.about || BRAND.about}</p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
            Est. {BRAND.established} · Jordan {BRAND.jordanSince}
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold">Shop</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/shop" className="hover:text-gold">
                All coffees
              </Link>
            </li>
            {shopLinks.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`} className="hover:text-gold">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold">House</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/categories" className="hover:text-gold">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-gold">
                Articles
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
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
          <p className="eyebrow text-gold">The list</p>
          <p className="mt-5 mb-5 text-sm text-cream/75">Notes on roast, origin, and house news.</p>
          <NewsletterForm dark />
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-cream/55">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
