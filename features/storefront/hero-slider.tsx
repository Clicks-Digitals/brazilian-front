"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Coffee, Droplets, Flame, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import type { Banner } from "@/types/api";

const PACKS = [
  {
    src: "/assets/hero/hero-espresso.png",
    alt: "Espresso coffee",
    left: {
      icon: Flame,
      title: "For the machine",
      body: "100% Arabica espresso with chocolate and orange — the house shot.",
    },
    right: {
      icon: Coffee,
      title: "Crema first",
      body: "Roasted for a thick, lasting crema in the cup you pull at home.",
    },
  },
  {
    src: "/assets/hero/hero-turkish.png",
    alt: "Turkish coffee",
    left: {
      icon: Landmark,
      title: "With cardamom",
      body: "Medium Turkish roast, packed for a proper cezve at home.",
    },
    right: {
      icon: Coffee,
      title: "As it should be",
      body: "Fine grind, slow foam, and the cup the house has made for decades.",
    },
  },
  {
    src: "/assets/hero/hero-filter.png",
    alt: "Filter coffee",
    left: {
      icon: Droplets,
      title: "Origin lots",
      body: "Brazil, Colombia, Kenya, and Ethiopia — roasted for pour-over and drip.",
    },
    right: {
      icon: Coffee,
      title: "Clear cup",
      body: "A brighter brew for the filter, with the sweetness still in the cup.",
    },
  },
];


export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const count = Math.max(PACKS.length, banners.length || 0);
  const pack = PACKS[index % PACKS.length];

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), 8000);
    return () => window.clearInterval(timer);
  }, [count]);

  function go(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <section
      data-hero
      className="home-hero hero-stage relative isolate overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      <div className="hero-beans hero-beans-left" aria-hidden>
        <div className="hero-beans-in">
          <img src="/assets/hero/beans-left.png" alt="" />
        </div>
      </div>
      <div className="hero-beans hero-beans-right" aria-hidden>
        <div className="hero-beans-in hero-beans-in-delay">
          <img src="/assets/hero/beans-right.png" alt="" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center px-6 pb-8 pt-[calc(var(--nav-h)+5.5rem)] md:px-10 md:pb-10 md:pt-[calc(var(--nav-h)+6.75rem)]">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <p className="eyebrow hero-copy-in text-forest">
            Est. {BRAND.established} · Jordan {BRAND.jordanSince}
          </p>
          <h1 className="font-display mt-5 text-[2.55rem] leading-[1.02] tracking-[-0.03em] text-ink md:text-6xl lg:text-[4.75rem]">
            Coffee from Brazil, roasted for Jordan.
          </h1>
          <p className="font-subtitle mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {BRAND.nameAr} — Turkish, filter, espresso, and capsule coffees from a house established in 1955.
          </p>
          <div className="hero-copy-in mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "0.25s" }}>
            <Button href="/shop" variant="primary" size="lg" className="rounded-full px-8">
              Shop the collection
            </Button>
            <Button href="/categories" variant="secondary" size="lg" className="rounded-full px-8">
              Browse categories
            </Button>
          </div>
        </div>

        <div className="mt-14 grid w-full flex-1 grid-cols-1 items-end gap-6 md:mt-20 lg:grid-cols-[1fr_minmax(17rem,28rem)_1fr] lg:gap-8">
          <HeroNote
            side="left"
            icon={<pack.left.icon className="size-4" strokeWidth={1.5} />}
            title={pack.left.title}
            body={pack.left.body}
            noteKey={`left-${index}`}
          />

          <div className="hero-pack relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="hero-pack-glow" aria-hidden />
            <div className="relative mx-auto h-[min(48svh,32rem)] w-full md:h-[min(54svh,36rem)]">
              {PACKS.map((item, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  className={cn(
                    "absolute inset-0 m-auto h-full w-auto max-w-full object-contain drop-shadow-[0_28px_50px_rgba(36,31,26,0.18)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    i === index
                      ? "z-10 translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none z-0 translate-y-8 scale-95 opacity-0",
                  )}
                />
              ))}
            </div>
          </div>

          <HeroNote
            side="right"
            icon={<pack.right.icon className="size-4" strokeWidth={1.5} />}
            title={pack.right.title}
            body={pack.right.body}
            noteKey={`right-${index}`}
          />
        </div>

        {count > 1 ? (
          <div className="mt-4 flex items-center gap-5">
            <p className="text-[11px] tracking-[0.22em] text-muted">
              <span className="text-forest">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-ink/20">/</span>
              {String(count).padStart(2, "0")}
            </p>
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(index - 1)}
                className="grid size-10 place-items-center text-ink/70 transition hover:text-forest"
              >
                <ChevronLeft className="size-5" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(index + 1)}
                className="grid size-10 place-items-center text-ink/70 transition hover:text-forest"
              >
                <ChevronRight className="size-5" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HeroNote({
  side,
  icon,
  title,
  body,
  noteKey,
}: {
  side: "left" | "right";
  icon: ReactNode;
  title: string;
  body: string;
  noteKey: string;
}) {
  return (
    <div
      className={cn(
        "relative hidden pb-16 lg:block",
        side === "left" ? "justify-self-end text-right" : "justify-self-start text-left",
      )}
    >
      <div className={cn("flex max-w-[14rem] items-start gap-3", side === "left" && "flex-row-reverse")}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-forest/20 text-forest">
          {icon}
        </span>
        <div key={noteKey} className="hero-note-copy">
          <p className="font-display text-xl leading-tight text-ink">{title}</p>
          <p className="font-subtitle mt-2 text-sm leading-relaxed text-muted">{body}</p>
        </div>
      </div>
      <span
        className={cn(
          "absolute top-5 h-px w-16 bg-ink/15",
          side === "left" ? "left-full ml-3" : "right-full mr-3",
        )}
        aria-hidden
      />
    </div>
  );
}
