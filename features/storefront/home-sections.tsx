import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { ProductGrid } from "@/features/shop/product-card";
import { CategoryPreview } from "@/features/storefront/category-preview";
import { NewsletterForm } from "@/features/storefront/newsletter-form";
import { articleCover } from "@/lib/article-media";
import { BRAND } from "@/lib/brand";
import { formatDate } from "@/lib/format";
import type { Article, Banner, Category, Product, StoreSettings } from "@/types/api";

function promoHref(url?: string) {
  if (!url) return "/shop";
  const category = url.match(/[?&]category=([^&]+)/);
  if (category) return `/shop/${category[1]}`;
  if (url === "/products" || url.startsWith("/products?")) return "/shop";
  return url;
}

export function BrandIntro({ settings }: { settings: StoreSettings }) {
  return (
    <section className="border-b border-ink/8 bg-white">
      <div
        className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[auto_1px_1fr] md:gap-14 md:py-24"
        data-reveal
      >
        <div className="flex items-center gap-5 md:flex-col md:items-start md:gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND.logo}
            alt={settings.store_name || BRAND.name}
            className="size-[4.5rem] md:size-24"
          />
          <div>
            <p className="eyebrow text-gold">The house</p>
            <p className="font-subtitle mt-2 text-sm text-muted" dir="rtl" lang="ar">
              {settings.store_name_ar || BRAND.nameAr}
            </p>
          </div>
        </div>

        <span className="hidden h-28 w-px bg-gold/70 md:block" aria-hidden />

        <div className="max-w-2xl">
          <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">
            A mill in Kuwait. A house in Jordan.
          </h2>
          <p className="font-subtitle mt-5 text-base leading-relaxed text-muted md:text-lg">
            {settings.about || BRAND.about}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/shop" className="link-arrow">
              Shop the collection
              <span aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="link-arrow">
              Visit a branch
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  return (
    <section className="bg-white py-14 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <p className="eyebrow text-gold">Shop by category</p>
            <h2 className="font-display mt-3 text-2xl sm:text-3xl md:text-5xl">Choose a brew</h2>
          </div>
          <Link href="/categories" className="link-arrow">
            All categories
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-8 md:mt-16">
          <CategoryPreview categories={categories.slice(0, 8)} />
        </div>
      </div>
    </section>
  );
}

export function ProductRail({
  title,
  eyebrow,
  products,
  href,
  limit = 4,
}: {
  title: string;
  eyebrow: string;
  products: Product[];
  href: string;
  limit?: number;
}) {
  if (!products.length) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16" data-reveal>
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h2 className="font-display mt-3 text-3xl">{title}</h2>
        <p className="mt-4 text-muted">Nothing in this collection yet.</p>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
      <div className="flex items-end justify-between gap-4" data-reveal>
        <div>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">{title}</h2>
        </div>
        <Link href={href} className="link-arrow">
          View all
          <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="mt-12">
        <ProductGrid products={products.slice(0, limit)} className="md:grid-cols-4" />
      </div>
    </section>
  );
}

export function PromoBanner({ banners }: { banners: Banner[] }) {
  const banner = banners[0];
  if (!banner) return null;
  return (
    <section className="relative my-8 w-full overflow-hidden bg-forest-dark text-cream" data-reveal>
      {banner.desktop_image || banner.mobile_image ? (
        <div className="absolute inset-0">
          <SmartImage
            src={banner.desktop_image || banner.mobile_image}
            alt=""
            className="h-full min-h-[24rem] w-full bg-forest-dark"
            fit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark via-forest-dark/80 to-black/20" />
        </div>
      ) : null}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-xl">
          <p className="eyebrow text-gold">Season</p>
          <span className="mt-4 block h-px w-10 bg-gold/80" />
          <h2 className="font-display mt-5 text-4xl leading-[1.08] md:text-6xl">{banner.title}</h2>
          {banner.subtitle ? (
            <p className="font-subtitle mt-5 max-w-md text-base leading-relaxed text-cream/80">{banner.subtitle}</p>
          ) : null}
          {banner.cta_label ? (
            <div className="mt-8">
              <Button variant="gold" href={promoHref(banner.cta_url)}>
                {banner.cta_label}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function StoryBand({ settings }: { settings: StoreSettings }) {
  return (
    <section className="border-y border-ink/8 bg-white py-20 md:py-28" data-reveal>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-[11rem_1fr] md:gap-16">
        <div>
          <p className="eyebrow text-gold">Since {BRAND.established}</p>
          <p className="mt-3 text-sm tracking-[0.16em] text-muted uppercase">Jordan {BRAND.jordanSince}</p>
        </div>
        <div>
          <h2 className="font-display text-3xl md:text-4xl">From Kuwait to Jordan</h2>
          <p className="font-subtitle mt-6 max-w-2xl text-lg leading-relaxed text-muted">{settings.story || BRAND.story}</p>
          <Link href="/contact" className="link-arrow mt-8">
            Visit our branches
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function JournalGrid({ articles }: { articles: Article[] }) {
  const notes = articles.slice(0, 3);
  return (
    <section className="border-y border-ink/8 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow text-gold">Articles</p>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">From the house</h2>
          </div>
          <Link href="/articles" className="link-arrow">
            All articles
            <span aria-hidden>→</span>
          </Link>
        </div>

        {notes.length === 0 ? (
          <p className="mt-10 text-muted">No articles have been published yet.</p>
        ) : (
          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
            {notes.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden p-6 md:min-h-[26rem] lg:min-h-[30rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={articleCover(article) || ""}
                  alt={article.title}
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40" />

                <div className="relative z-10">
                  <h3 className="font-display text-2xl leading-tight text-white md:text-[1.7rem]">
                    {article.title}
                  </h3>
                  {article.excerpt ? (
                    <p className="font-subtitle mt-3 max-w-[17rem] text-sm leading-relaxed text-white/85">
                      {article.excerpt}
                    </p>
                  ) : null}
                </div>

                <p className="relative z-10 flex items-center gap-2 text-[11px] text-white/90">
                  <span aria-hidden className="grid size-3.5 place-items-center rounded-full border border-white/80">
                    <span className="size-1 rounded-full bg-white/80" />
                  </span>
                  {formatDate(article.published_at) || "House note"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function NewsletterBand() {
  return (
    <section className="border-t border-ink/8 bg-linen py-20 md:py-24" data-reveal>
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <p className="eyebrow text-gold">Correspondence</p>
        <h2 className="font-display mt-3 text-3xl md:text-4xl">Join the house list</h2>
        <p className="font-subtitle mt-3 mb-8 max-w-md text-muted">
          Occasional notes on roast, origin lots, and what is new on the shelf.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
