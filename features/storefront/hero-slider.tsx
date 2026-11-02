import Link from "next/link";
import { Clock3, Droplets, Landmark } from "lucide-react";
import { BRAND } from "@/lib/brand";
import type { Banner } from "@/types/api";

const STATS = [
  { icon: Droplets, label: "100% Arabica" },
  { icon: Landmark, label: "Roasted in Jordan" },
  { icon: Clock3, label: `Est. ${BRAND.established}` },
];

const MARQUEE = [
  "Turkish roast",
  "Filter coffee",
  "Espresso",
  "Arabic coffee",
  "Capsules",
  "100% Arabica",
  "Slow roasted",
  `Since ${BRAND.established}`,
];

export function HeroSlider({ banners: _banners }: { banners: Banner[] }) {
  return (
    <>
      <section data-hero className="home-hero hero-stage relative flex min-h-[100svh] flex-col">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="hero-ember" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[80rem] flex-1 flex-col px-6 md:px-10">
          <div className="relative z-20 flex justify-center pt-[4vh] md:pt-[5vh]">
            <p className="text-center text-[15px] text-gold md:text-[17px]">Coffee from Brazil. Roasted for Jordan.</p>
          </div>

          <h1 className="relative z-0 mt-[1.5vh] select-none whitespace-nowrap text-center font-display text-[16vw] font-bold leading-[0.82] tracking-[-0.055em] text-forest md:text-[14.5vw] lg:text-[13.5vw]">
            Brazilian
          </h1>

          <div className="hero-pack-slot">
            <div id="pack-dock-hero" className="pack-dock pack-dock-hero" aria-hidden />
          </div>

          <div className="relative z-20 mt-auto grid grid-cols-12 items-end gap-x-6 gap-y-10 pt-6 pb-2 lg:pt-[4vh]">
            <div className="col-span-12 flex flex-col gap-8 md:col-span-6 lg:col-span-3">
              <p className="font-subtitle max-w-[290px] text-[17px] leading-[1.47] text-muted">
                Turkish, filter, espresso, and capsule coffees from a house established in {BRAND.established}. No bitterness in the story — just the cup the house has roasted for decades.
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 self-start rounded-full bg-forest px-8 py-4 text-sm font-medium text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-gold hover:text-forest-dark"
              >
                Shop the collection
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="hidden lg:col-span-5 lg:block" />

            <div className="col-span-12 flex flex-col gap-2.5 md:col-span-6 md:items-end lg:col-span-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl bg-white/70 py-1.5 pl-1.5 pr-5 backdrop-blur-sm"
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

        <div className="absolute right-6 top-[14.5vh] z-20 hidden text-ink md:block lg:right-10">
          <div className="relative size-[92px]">
            <svg viewBox="0 0 100 100" className="hero-seal-spin absolute inset-0 h-full w-full">
              <defs>
                <path id="hero-seal-path" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none" />
              </defs>
              <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
              <circle cx="50" cy="50" r="30.5" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
              <text fontSize="7.4" letterSpacing="2.1" fill="currentColor">
                <textPath href="#hero-seal-path" startOffset="0">
                  ROASTED IN JORDAN · SINCE {BRAND.established} · ROASTED IN JORDAN ·
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
              <span className="text-[15px] font-bold tracking-[-0.03em]">100%</span>
              <span className="mt-0.5 text-[10px] tracking-[0.04em] text-muted">Arabica</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-8 flex justify-center pb-6">
          <a
            href="#home-about"
            className="hero-nudge flex flex-col items-center gap-2 text-[12px] tracking-[0.08em] text-muted uppercase transition-colors hover:text-ink"
          >
            Scroll to brew
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M12 4.8v14.4M6.6 13.8 12 19.2l5.4-5.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <div className="hero-marquee-wrap overflow-hidden border-y border-forest/10 bg-white py-4">
        <div className="hero-marquee flex w-max items-center gap-10 pr-10">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
              {MARQUEE.map((item) => (
                <div key={`${copy}-${item}`} className="flex items-center gap-10">
                  <span className="whitespace-nowrap text-sm uppercase tracking-[0.14em] text-ink/80">{item}</span>
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
