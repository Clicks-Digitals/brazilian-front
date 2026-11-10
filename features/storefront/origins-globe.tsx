"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/features/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { COFFEE_ORIGINS, type GlobeFocusId } from "@/lib/coffee-origins";

const CoffeeGlobe = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.CoffeeGlobe),
  {
    ssr: false,
    loading: () => <div className="aspect-square w-full bg-cream/5" aria-hidden />,
  },
);

export function OriginsGlobe() {
  const { t } = useLocale();
  const [focusId, setFocusId] = useState<GlobeFocusId | null>(null);
  const labels = useMemo(
    () => ({
      colombia: t("originColombia"),
      ethiopia: t("originEthiopia"),
      kenya: t("originKenya"),
      brazil: t("originBrazil"),
      peru: t("originPeru"),
      nicaragua: t("originNicaragua"),
      jordan: t("originJordan"),
    }),
    [t],
  );

  return (
    <section className="bg-forest py-14 md:py-24" data-reveal>
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
        <div className="relative z-10 min-w-0 max-w-xl">
          <p className="eyebrow text-gold">{t("originsEyebrow")}</p>
          <h2 className="font-display mt-3 text-[1.75rem] leading-tight text-cream sm:text-3xl md:text-5xl">
            {t("originsTitle")}
          </h2>
          <p className="font-subtitle mt-4 max-w-md text-sm leading-relaxed text-cream/80 sm:mt-5 sm:text-base md:text-lg">
            {t("originsBlurb")}
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:max-w-md sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
            {COFFEE_ORIGINS.map((origin) => {
              const active = focusId === origin.id;
              return (
                <li key={origin.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setFocusId(origin.id)}
                    className={cn(
                      "flex w-full min-w-0 items-center gap-2.5 py-0.5 text-left transition",
                      active ? "text-gold" : "text-cream hover:text-gold",
                    )}
                  >
                    <span
                      className={cn("size-1.5 shrink-0 rounded-full", active ? "bg-gold" : "bg-cream/50")}
                      aria-hidden
                    />
                    <span className="font-subtitle text-sm md:text-base">{labels[origin.id]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setFocusId("jordan")}
            className={cn(
              "mt-5 text-[11px] uppercase tracking-[0.16em] transition sm:mt-6",
              focusId === "jordan" ? "text-cream" : "text-gold hover:text-cream",
            )}
          >
            {labels.jordan}
          </button>
          <div className="mt-6 sm:mt-8">
            <Button variant="gold" href="/shop">
              {t("shopCoffeeCta")}
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full min-w-0 max-w-[26rem] sm:max-w-[32rem] lg:max-w-none">
          <CoffeeGlobe
            labels={labels}
            focusId={focusId}
            className="relative mx-auto aspect-square w-full overflow-visible touch-none overscroll-none"
          />
        </div>
      </div>
    </section>
  );
}
