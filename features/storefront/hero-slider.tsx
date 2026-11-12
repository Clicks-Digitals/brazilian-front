"use client";

import Link from "next/link";
import { Clock3, Droplets, Landmark } from "lucide-react";
import { useLocale } from "@/features/i18n/locale-provider";
import { BRAND } from "@/lib/brand";
import type { Banner } from "@/types/api";

export function HeroSlider({ banners: _banners }: { banners: Banner[] }) {
  const { locale, t } = useLocale();
  const stats = [
    { icon: Droplets, label: t("statArabica") },
    { icon: Landmark, label: t("statJordan") },
    { icon: Clock3, label: t("statEst", { year: BRAND.established }) },
  ];
  const marquee = [
    t("marqueeTurkish"),
    t("marqueeFilter"),
    t("marqueeEspresso"),
    t("marqueeArabic"),
    t("marqueeCapsules"),
    t("statArabica"),
    t("marqueeSlow"),
    t("marqueeSince", { year: BRAND.established }),
  ];

  return (
    <>
      <section data-hero className="home-hero hero-stage relative flex min-h-[100svh] flex-col">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="hero-ember" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[80rem] flex-1 flex-col px-6 md:px-10">
          <div className="relative z-20 flex justify-center pt-[4vh] md:pt-[5vh]">
            <p className="text-center text-[15px] text-gold md:text-[17px]">{t("heroEyebrow")}</p>
          </div>

          <h1 className="relative z-0 mt-[1.5vh] select-none text-center font-display font-bold leading-[0.88] tracking-[-0.045em] text-cream">
            {locale === "ar" ? (
              <>
                <span className="block text-[10vw] md:text-[8vw] lg:text-[7vw]">بيت البن</span>
                <span className="block text-[8vw] md:text-[6.5vw] lg:text-[5.5vw]">البرازيلي</span>
              </>
            ) : (
              <>
                <span className="block text-[12vw] md:text-[10vw] lg:text-[9vw]">Brazilian</span>
                <span className="block text-[7.2vw] md:text-[6vw] lg:text-[5.4vw]">Coffee House</span>
              </>
            )}
          </h1>

          <div className="hero-pack-slot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/hero/hero-pack.png"
              alt=""
              className="hero-pack-img"
              decoding="async"
              draggable={false}
            />
          </div>

          <div className="relative z-20 mt-auto grid grid-cols-12 items-end gap-x-6 gap-y-10 pt-6 pb-10 lg:pt-[4vh] lg:pb-12">
            <div className="col-span-12 flex flex-col gap-8 md:col-span-6 lg:col-span-3">
              <p className="font-subtitle max-w-[290px] text-[17px] leading-[1.47] text-cream">
                {t("heroCopy", { year: BRAND.established })}
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-gold px-8 py-4 text-sm font-bold text-forest-dark transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white"
              >
                {t("shopTheCollection")}
                <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180">→</span>
              </Link>
            </div>

            <div className="hidden lg:col-span-5 lg:block" />

            <div className="col-span-12 flex flex-col gap-2.5 md:col-span-6 md:items-end lg:col-span-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl bg-white py-1.5 pl-1.5 pr-5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[9px] bg-white text-gold">
                    <stat.icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-medium text-ink">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute end-6 top-[14.5vh] z-20 hidden text-cream md:block lg:end-10">
          <div className="relative size-[92px]">
            <svg viewBox="0 0 100 100" className="hero-seal-spin absolute inset-0 h-full w-full">
              <defs>
                <path id="hero-seal-path" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none" />
              </defs>
              <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
              <circle cx="50" cy="50" r="30.5" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
              <text fontSize="7.4" letterSpacing="2.1" fill="currentColor">
                <textPath href="#hero-seal-path" startOffset="0">
                  {t("roastedForJordan", { year: BRAND.established })}
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
              <span className="text-[15px] font-bold tracking-[-0.03em]">100%</span>
              <span className="mt-0.5 text-[10px] tracking-[0.04em] text-cream">Arabica</span>
            </div>
          </div>
        </div>

      </section>

      <div className="hero-marquee-wrap overflow-hidden border-y border-cream/10 bg-forest-dark py-4">
        <div className="hero-marquee flex w-max items-center gap-10 pr-10">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
              {marquee.map((item) => (
                <div key={`${copy}-${item}`} className="flex items-center gap-10">
                  <span className="whitespace-nowrap text-sm uppercase tracking-[0.14em] text-cream">{item}</span>
                  <span className="size-[5px] shrink-0 rounded-full bg-gold" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
