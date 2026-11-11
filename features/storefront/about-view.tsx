"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/features/i18n/locale-provider";
import { BRAND, branchTelHref } from "@/lib/brand";

export function AboutView() {
  const { locale, t } = useLocale();
  const houseName = locale === "ar" ? BRAND.nameAr : BRAND.name;

  return (
    <div className="bg-forest">
      <section className="relative isolate min-h-[88svh] overflow-hidden text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/editorial/storefront.jpg"
          alt={houseName}
          className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c22]/92 via-[#0f2c22]/35 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 md:pb-24">
          <p className="font-display text-3xl leading-none tracking-[-0.03em] md:text-5xl">{houseName}</p>
          {locale === "en" ? (
            <p className="mt-2 text-lg text-cream md:text-xl" dir="rtl" lang="ar">
              {BRAND.nameAr}
            </p>
          ) : (
            <p className="mt-2 text-lg text-cream md:text-xl">{BRAND.name}</p>
          )}
          <h1 className="font-subtitle mt-8 max-w-xl text-base leading-relaxed text-cream md:text-lg">
            {t("aboutHero", { year: BRAND.established })}
          </h1>
          <div className="mt-8">
            <Button href="/shop" variant="gold" size="lg" className="px-8">
              {t("shopTheCollection")}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-forest py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2 md:gap-16">
          <div className="relative pb-10 md:pb-14" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#eff5f1] md:aspect-[5/6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/editorial/mill.jpg" alt="" className="h-full w-full object-cover" />
              <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-forest">
                {t("estYear", { year: BRAND.established })}
              </span>
            </div>
            <div className="absolute -bottom-2 end-4 w-[46%] overflow-hidden rounded-[1.25rem] border-[6px] border-white bg-[#eff5f1] shadow-[0_18px_40px_rgba(15,44,34,0.18)] sm:end-8 md:-bottom-4 md:w-[42%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/editorial/turkish.jpg" alt="" className="aspect-[4/5] w-full object-cover" />
            </div>
          </div>

          <div data-reveal>
            <p className="eyebrow text-gold">{t("aboutUs")}</p>
            <h2 className="font-display mt-4 max-w-lg text-3xl leading-[1.12] text-cream md:text-5xl">
              {t("millHeadline")}
            </h2>
            <span className="mt-6 block h-px w-14 bg-gold" />
            <p className="font-subtitle mt-6 max-w-xl text-base leading-relaxed text-cream md:text-lg">
              {t("millHeritage")}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { src: "/assets/brand/logo-kuwait.png", label: "1955–2011" },
                { src: "/assets/brand/logo-jordan.png", label: "2012–2023" },
                { src: "/assets/brand/logo-house.png", label: "2024" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center rounded-2xl bg-cream/10 px-2 py-4 text-center sm:px-3 sm:py-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stat.src}
                    alt=""
                    className="h-14 w-14 object-contain sm:h-16 sm:w-16 md:h-[4.75rem] md:w-[4.75rem]"
                  />
                  <p className="mt-2.5 text-[10px] uppercase tracking-[0.16em] text-cream" dir="ltr">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a href="#our-story" className="link-arrow">
                {t("readOurStory")}
                <span aria-hidden className="rtl:inline-block rtl:rotate-180">
                  →
                </span>
              </a>
              <Link href="/contact" className="link-arrow">
                {t("visitABranch")}
                <span aria-hidden className="rtl:inline-block rtl:rotate-180">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="our-story" className="bg-forest scroll-mt-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 py-20 md:grid-cols-12 md:gap-16 md:py-28">
          <div className="md:col-span-6" data-reveal>
            <p className="eyebrow text-gold">{t("ourStory")}</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.12] text-cream md:text-5xl">{t("aboutHeadline")}</h2>
            <span className="mt-6 block h-px w-14 bg-gold" />
            <p className="font-subtitle mt-6 text-base leading-relaxed text-cream md:text-lg">{t("aboutLead")}</p>
            <p className="font-subtitle mt-4 text-base leading-relaxed text-cream md:text-lg">{t("aboutKuwait")}</p>
            <p className="font-subtitle mt-4 text-base leading-relaxed text-cream md:text-lg">{t("aboutJordan")}</p>
            <h3 className="font-display mt-10 text-2xl leading-snug text-cream md:text-3xl">{t("aboutJourneyTitle")}</h3>
            <p className="font-subtitle mt-4 text-base leading-relaxed text-cream md:text-lg">{t("aboutJourneyBody")}</p>
            <p className="font-display mt-8 text-xl text-gold md:text-2xl">{t("moreThanCoffee")}</p>
          </div>
          <div className="relative md:col-span-6 md:sticky md:top-28" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#eff5f1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/editorial/founder.jpg"
                alt={houseName}
                className="h-full w-full object-cover object-[center_18%]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest" data-reveal>
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">{t("branches")}</p>
            <h2 className="font-display mt-3 text-3xl text-cream md:text-5xl">{t("findTheHouse")}</h2>
            <p className="font-subtitle mt-5 text-base leading-relaxed text-cream">{t("branchesBlurb")}</p>
          </div>

          <div className="mt-14 grid gap-x-12 gap-y-3 md:grid-cols-2">
            {BRAND.branches.map((branch) => {
              const label = locale === "ar" ? branch.nameAr : branch.name;
              return (
                <div
                  key={branch.name}
                  className="flex items-baseline justify-between gap-6 border-b border-cream/15 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-display text-xl text-cream md:text-2xl">{label}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cream">
                      {locale === "ar" ? branch.cityAr : branch.city}
                    </p>
                  </div>
                  {"phone" in branch && branch.phone ? (
                    <a
                      href={branchTelHref(branch.phone)}
                      className="shrink-0 text-sm text-gold transition hover:text-cream"
                      dir="ltr"
                    >
                      {branch.phone}
                    </a>
                  ) : (
                    <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-cream">
                      {t("jordan")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/contact" className="link-arrow">
              {t("contactAndHours")}
              <span aria-hidden className="rtl:inline-block rtl:rotate-180">
                →
              </span>
            </Link>
            <a href={BRAND.phoneHref} className="link-arrow">
              {BRAND.phone}
              <span aria-hidden className="rtl:inline-block rtl:rotate-180">
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center md:py-28" data-reveal>
        <p className="eyebrow text-gold">{t("visitOrShop")}</p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl text-cream md:text-5xl">{t("houseCupWherever")}</h2>
        <p className="font-subtitle mx-auto mt-5 max-w-lg text-base leading-relaxed text-cream">
          {t("visitOrShopBlurb")}
        </p>
        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/shop" variant="gold" size="lg" className="w-full max-w-[17rem] px-8">
            {t("shopCoffeeCta")}
          </Button>
          <Button href="/contact" variant="gold" size="lg" className="w-full max-w-[17rem] px-8">
            {t("visitABranch")}
          </Button>
        </div>
      </section>
    </div>
  );
}
