import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { serverGet } from "@/lib/server-get";
import { normalizeSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About us",
  description: BRAND.story,
};

export default async function AboutPage() {
  let settings = normalizeSettings({});
  try {
    settings = normalizeSettings(await serverGet("/settings/"));
  } catch {
    /* brand fallbacks */
  }
  const branches = settings.branches?.length
    ? settings.branches
    : BRAND.branches.map((branch) => ({ name: branch.name, city: branch.city }));

  return (
    <div className="bg-[#eff5f1]">
      {/* Hero — brand + one line + CTA over full-bleed mill */}
      <section className="relative isolate min-h-[88svh] overflow-hidden text-cream">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/editorial/mill.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c22]/92 via-[#0f2c22]/35 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 md:pb-24">
          <p className="font-display text-3xl leading-none tracking-[-0.03em] md:text-5xl">{BRAND.name}</p>
          <p className="mt-2 text-lg text-cream/90 md:text-xl" dir="rtl" lang="ar">
            {BRAND.nameAr}
          </p>
          <h1 className="font-subtitle mt-8 max-w-xl text-base leading-relaxed text-cream/85 md:text-lg">
            Coffee from Brazil, roasted for Jordan — a house with roots in Kuwait since {BRAND.established}.
          </h1>
          <div className="mt-8">
            <Button href="/shop" variant="gold" size="lg" className="px-8">
              Shop the collection
            </Button>
          </div>
        </div>
      </section>

      {/* Origin — two moments, one composition each */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-2 md:gap-10 md:py-28">
        <article data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/editorial/tray.jpg" alt="International Mill beginnings" className="h-full w-full object-cover" />
          </div>
          <p className="eyebrow mt-8 text-gold">{BRAND.established} · Kuwait</p>
          <h2 className="font-display mt-3 text-3xl text-forest md:text-4xl">International Mill</h2>
          <p className="font-subtitle mt-4 max-w-md text-base leading-relaxed text-muted">
            The house began as a mill — roasting and blending with a focus on quality and hospitality that still shapes every bag.
          </p>
        </article>
        <article className="md:mt-24" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/editorial/amman.jpg" alt="Jordanian branches" className="h-full w-full object-cover" />
          </div>
          <p className="eyebrow mt-8 text-gold">{BRAND.jordanSince} · Jordan</p>
          <h2 className="font-display mt-3 text-3xl text-forest md:text-4xl">Brazilian Coffee House</h2>
          <p className="font-subtitle mt-4 max-w-md text-base leading-relaxed text-muted">
            The first international branch opened in Jordan, bringing Brazilian and origin coffees into homes and cafés across the country.
          </p>
        </article>
      </section>

      {/* Story + café */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-12 md:gap-16 md:py-28">
          <div className="md:col-span-5" data-reveal>
            <p className="eyebrow text-gold">Our story</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.12] text-forest md:text-5xl">
              From the mill to the cup on your table.
            </h2>
            <span className="mt-6 block h-px w-14 bg-gold" />
            <p className="font-subtitle mt-6 text-base leading-relaxed text-muted md:text-lg">
              {settings.about || BRAND.about}
            </p>
            <p className="font-subtitle mt-4 text-base leading-relaxed text-muted md:text-lg">
              {settings.story || BRAND.story}
            </p>
          </div>
          <div className="relative md:col-span-7" data-reveal>
            <div className="relative aspect-[5/4] overflow-hidden bg-[#eff5f1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/editorial/cafe.jpg" alt="Brazilian Coffee House café" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 left-6 hidden w-[42%] overflow-hidden border-[6px] border-white bg-[#eff5f1] shadow-lg md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/editorial/turkish.jpg" alt="Turkish coffee of the house" className="aspect-[4/5] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="bg-[#eff5f1]" data-reveal>
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">Branches</p>
            <h2 className="font-display mt-3 text-3xl text-forest md:text-5xl">Find the house</h2>
            <p className="font-subtitle mt-5 text-base leading-relaxed text-muted">
              Across Amman and beyond — the same roast, the same welcome.
            </p>
          </div>

          <div className="mt-14 grid gap-x-12 gap-y-3 md:grid-cols-2">
            {branches.map((branch) => (
              <div
                key={`${branch.city}-${branch.name}`}
                className="flex items-baseline justify-between gap-6 border-b border-forest/15 py-4"
              >
                <p className="font-display text-xl text-ink md:text-2xl">{branch.name}</p>
                <p className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted">{branch.city || "Jordan"}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/contact" className="link-arrow">
              Contact and hours
              <span aria-hidden>→</span>
            </Link>
            <a href={BRAND.phoneHref} className="link-arrow">
              {BRAND.phone}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center md:py-28" data-reveal>
        <p className="eyebrow text-gold">Visit or shop</p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl text-forest md:text-5xl">
          The house cup, wherever you are.
        </h2>
        <p className="font-subtitle mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
          Come into a branch, or take Turkish, filter, espresso, and drip home.
        </p>
        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/shop" size="lg" className="w-full max-w-[17rem] px-8">
            Shop coffee
          </Button>
          <Button href="/contact" variant="secondary" size="lg" className="w-full max-w-[17rem] px-8">
            Visit a branch
          </Button>
        </div>
      </section>
    </div>
  );
}
