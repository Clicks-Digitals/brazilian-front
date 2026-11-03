"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Dock = { x: number; y: number; w: number; h: number };

function measure(dock: Element, journey: Element): Dock {
  const j = journey.getBoundingClientRect();
  const d = dock.getBoundingClientRect();
  return {
    x: d.left - j.left + d.width / 2,
    y: d.top - j.top + d.height / 2,
    w: d.width,
    h: d.height,
  };
}

function scaleFor(base: Dock, target: Dock) {
  return Math.min(target.w / Math.max(base.w, 1), target.h / Math.max(base.h, 1));
}

export function PackJourney({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const packRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pack = packRef.current;
    if (!root || !pack) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let resizeTimer = 0;

    const docks = () => {
      const hero = root.querySelector("#pack-dock-hero");
      if (!hero) return null;
      const about = root.querySelector("#pack-dock-about");
      const catsStart = root.querySelector("#pack-dock-categories-start");
      const cats = root.querySelector("#pack-dock-categories");
      const featured = root.querySelector("#pack-dock-featured");
      const banner = root.querySelector("#pack-dock-banner");
      const h = measure(hero, root);
      return {
        h,
        a: about ? measure(about, root) : h,
        cs: catsStart ? measure(catsStart, root) : h,
        c: cats ? measure(cats, root) : h,
        f: featured ? measure(featured, root) : h,
        b: banner ? measure(banner, root) : h,
      };
    };

    const build = () => {
      const d = docks();
      if (!d) return null;

      gsap.set(pack, {
        width: d.h.w,
        height: d.h.h,
        x: d.h.x,
        y: d.h.y,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        rotate: 0,
        autoAlpha: 1,
        force3D: true,
        transformOrigin: "center center",
      });

      const travel = { duration: 1.15, ease: "power2.inOut" };
      const settle = { duration: 0.8, ease: "power1.inOut" };
      const compact = window.matchMedia("(max-width: 767px)").matches;
      const bannerScale = compact ? scaleFor(d.h, d.b) : Math.max(scaleFor(d.h, d.b) * 1.35, 1.35);

      return gsap
        .timeline({
          defaults: { force3D: true },
          scrollTrigger: {
            id: "hero-pack-scroll",
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        })
        .to(pack, { duration: 0.5 })
        // Go under the About mill photo.
        .to(pack, {
          x: d.a.x,
          y: d.a.y,
          scale: scaleFor(d.h, d.a),
          rotate: -4,
          ...travel,
        })
        .to(pack, { rotate: 0, ...settle })
        // Stay hidden through the category cards.
        .to(pack, { autoAlpha: 0, duration: 0.4, ease: "power1.in" })
        .to(pack, {
          x: d.cs.x,
          y: d.cs.y,
          scale: scaleFor(d.h, d.cs),
          rotate: 8,
          autoAlpha: 0,
          duration: 0.5,
          ease: "none",
        })
        // Pass through the gap under Caffitaly — no pause — into Featured.
        .to(pack, {
          x: d.c.x,
          y: d.c.y,
          scale: scaleFor(d.h, d.c),
          rotate: -4,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power2.out",
        })
        .to(pack, {
          x: d.f.x,
          y: d.f.y,
          scale: scaleFor(d.h, d.f),
          rotate: 0,
          duration: 1.7,
          ease: "power2.inOut",
        })
        // Stop on the right of the banner.
        .to(pack, {
          x: d.b.x,
          y: d.b.y,
          scale: bannerScale,
          rotate: 3,
          ...travel,
        })
        .to(pack, { rotate: 0, duration: 1, ease: "power1.inOut" });
    };

    const remount = () => {
      const progress = tl?.scrollTrigger?.progress ?? 0;
      tl?.scrollTrigger?.kill();
      tl?.kill();
      tl = build();
      tl?.progress(progress);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(remount, 180);
    };

    const frame = requestAnimationFrame(() => {
      tl = build();
      ScrollTrigger.refresh();
    });

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div ref={rootRef} id="pack-journey" className="pack-journey relative">
      {children}
      <div ref={packRef} className="hero-pack-stage" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/hero/hero-espresso.png" alt="" className="hero-pack-img" />
      </div>
    </div>
  );
}
