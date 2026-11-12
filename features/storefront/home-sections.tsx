"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { ProductGrid } from "@/features/shop/product-card";
import { CategoryCards } from "@/features/storefront/category-cards";
import { NewsletterForm } from "@/features/storefront/newsletter-form";
import { useLocale } from "@/features/i18n/locale-provider";
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

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const { t } = useLocale();
  if (!categories.length) return null;
  return (
    <section id="home-categories" className="relative bg-forest py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="category-cover flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div>
            <p className="eyebrow text-gold">{t("shopByCategory")}</p>
            <h2 className="font-display mt-3 text-2xl text-cream sm:text-3xl md:text-5xl">{t("chooseABrew")}</h2>
          </div>
          <Link href="/categories" className="link-arrow">
            {t("allCategories")}
            <span aria-hidden className="rtl:inline-block rtl:rotate-180">→</span>
          </Link>
        </div>
        <div className="mt-10 md:mt-14">
          <CategoryCards categories={categories} limit={8} />
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
  title?: string;
  eyebrow?: string;
  products: Product[];
  href: string;
  limit?: number;
}) {
  const { t } = useLocale();
  const railTitle = title || t("newArrivals");
  const railEyebrow = eyebrow || t("justIn");
  if (!products.length) {
    return (
      <section className="bg-forest py-16" data-reveal>
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow text-gold">{railEyebrow}</p>
          <h2 className="font-display mt-3 text-3xl">{railTitle}</h2>
          <p className="mt-4 text-cream">{t("nothingYet")}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-forest py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow text-gold">{railEyebrow}</p>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">{railTitle}</h2>
          </div>
          <Link href={href} className="link-arrow">
            {t("viewAll")}
            <span aria-hidden className="rtl:inline-block rtl:rotate-180">→</span>
          </Link>
        </div>
        <div className="mt-12">
          <ProductGrid products={products.slice(0, limit)} className="md:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}

export function PromoBanner({ banners }: { banners: Banner[] }) {
  const { t } = useLocale();
  const banner = banners[0];
  return (
    <section id="home-banner" className="relative my-8 w-full overflow-x-clip bg-forest text-cream">
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div className="relative z-20 max-w-xl">
          <p className="eyebrow text-gold">{t("season")}</p>
          <span className="mt-4 block h-px w-10 bg-gold/80" />
          <h2 className="font-display mt-5 text-4xl leading-[1.08] text-cream md:text-6xl">
            {banner?.title || t("roastedForTheHouseCup")}
          </h2>
          {banner?.subtitle ? (
            <p className="font-subtitle mt-5 max-w-md text-base leading-relaxed text-cream">{banner.subtitle}</p>
          ) : null}
          {banner?.cta_label ? (
            <div className="mt-8">
              <Button variant="gold" href={promoHref(banner.cta_url)}>
                {banner.cta_label}
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <Button variant="gold" href="/shop">
                {t("shopTheCollection")}
              </Button>
            </div>
          )}
        </div>
        <div className="relative mx-auto w-full max-w-[22rem] md:max-w-[30rem]">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/30 shadow-[0_24px_60px_rgba(8,24,18,0.35)]">
            <SmartImage
              src="/assets/categories/turkish-coffee.jpg"
              alt={banner?.title || t("roastedForTheHouseCup")}
              fit="cover"
              className="aspect-[4/5] w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f2c22]/75 via-transparent to-[#0f2c22]/25" />
            <span className="absolute start-4 top-4 rounded-full bg-gold px-3.5 py-1.5 text-[10px] font-bold text-forest-dark">
              {t("statArabica")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoryBand({ settings }: { settings: StoreSettings }) {
  const { locale, t } = useLocale();
  return (
    <section className="bg-forest py-16 md:py-24" data-reveal>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
        <div className="relative min-h-[18rem] overflow-hidden rounded-3xl md:min-h-[28rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/editorial/cafe.jpg"
            alt={locale === "ar" ? BRAND.nameAr : BRAND.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow text-gold">{t("since")} {BRAND.established}</p>
          <p className="mt-3 text-sm tracking-[0.16em] text-gold uppercase">{t("jordan")} {BRAND.jordanSince}</p>
          <h2 className="font-display mt-5 text-3xl text-cream md:text-4xl">{t("fromKuwaitToJordan")}</h2>
          <p className="font-subtitle mt-6 max-w-2xl text-lg leading-relaxed text-cream">
            {locale === "ar" ? t("story") : settings.story || BRAND.story}
          </p>
          <Link href="/about" className="link-arrow mt-8">
            {t("aboutTheHouse")}
            <span aria-hidden className="rtl:inline-block rtl:rotate-180">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function JournalGrid({ articles }: { articles: Article[] }) {
  const { t } = useLocale();
  const notes = articles.slice(0, 3);
  return (
    <section className="border-y border-cream/10 bg-forest py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow text-gold">{t("articles")}</p>
            <h2 className="font-display mt-3 text-3xl text-cream md:text-4xl">{t("fromTheHouse")}</h2>
          </div>
          <Link href="/articles" className="link-arrow">
            {t("allArticles")}
            <span aria-hidden className="rtl:inline-block rtl:rotate-180">→</span>
          </Link>
        </div>

        {notes.length === 0 ? (
          <p className="mt-10 text-cream">{t("noArticles")}</p>
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
                  {formatDate(article.published_at) || t("houseNote")}
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
  const { t } = useLocale();
  return (
    <section className="bg-forest py-20 text-cream md:py-24" data-reveal>
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <p className="eyebrow text-gold">{t("correspondence")}</p>
        <h2 className="font-display mt-3 text-3xl md:text-4xl">{t("joinTheHouseList")}</h2>
        <p className="font-subtitle mt-3 mb-8 max-w-md text-cream">
          {t("newsletterBlurb")}
        </p>
        <NewsletterForm dark />
      </div>
    </section>
  );
}
