"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/features/i18n/locale-provider";

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

function travel(from: Dock, to: Dock) {
  return Math.max(Math.hypot(to.x - from.x, to.y - from.y), 48);
}

export function PackJourney({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const packRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pack = packRef.current;
    if (!root || !pack) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let resizeTimer = 0;
    let lastWidth = window.innerWidth;

    const docks = () => {
      const hero = root.querySelector("#pack-dock-hero");
      if (!hero) return null;
      const catsStart = root.querySelector("#pack-dock-categories-start");
      const cats = root.querySelector("#pack-dock-categories");
      const featured = root.querySelector("#pack-dock-featured");
      const banner = root.querySelector("#pack-dock-banner");
      const h = measure(hero, root);
      return {
        h,
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

      const compact = window.matchMedia("(max-width: 767px)").matches;
      const bannerScale = compact ? scaleFor(d.h, d.b) : Math.max(scaleFor(d.h, d.b) * 1.35, 1.35);
      const featuredScale = compact
        ? Math.max(scaleFor(d.h, d.f), scaleFor(d.h, d.c) * 0.92)
        : scaleFor(d.h, d.f);
      const toStart = travel(d.h, d.cs);
      const toCats = travel(d.cs, d.c);
      const toFeatured = Math.max(travel(d.c, d.f) * 1.45, toStart * 0.6);
      const featuredHold = Math.max(toFeatured * 0.8, compact ? 180 : 220);
      const toBanner = travel(d.f, d.b) * 0.9;

      const timeline = gsap.timeline({
        defaults: { force3D: true, autoAlpha: 1, ease: compact ? "none" : "power2.inOut" },
        scrollTrigger: {
          id: "hero-pack-scroll",
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: compact ? 0.42 : 0.85,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      if (compact) {
        return timeline
          .to(pack, { duration: 0.08 })
          .to(pack, {
            x: d.cs.x,
            y: d.cs.y,
            scale: scaleFor(d.h, d.cs),
            duration: toStart,
          })
          .to(pack, {
            x: d.c.x,
            y: d.c.y,
            scale: scaleFor(d.h, d.c),
            duration: toCats,
          })
          .to(pack, {
            x: d.f.x,
            y: d.f.y,
            scale: featuredScale,
            duration: toFeatured,
            ease: "power1.out",
          })
          .to(pack, { duration: featuredHold })
          .to(pack, {
            x: d.b.x,
            y: d.b.y,
            scale: bannerScale,
            duration: toBanner,
          });
      }

      return timeline
        .to(pack, { duration: 0.32 })
        .to(pack, {
          x: d.cs.x,
          y: d.cs.y,
          scale: scaleFor(d.h, d.cs),
          rotate: 5,
          duration: toStart,
          ease: "power2.in",
        })
        .to(pack, {
          x: d.c.x,
          y: d.c.y,
          scale: scaleFor(d.h, d.c),
          rotate: -4,
          duration: toCats,
          ease: "none",
        })
        .to(pack, {
          x: d.f.x,
          y: d.f.y,
          scale: featuredScale,
          rotate: 0,
          duration: toFeatured,
          ease: "power2.out",
        })
        .to(pack, { duration: featuredHold })
        .to(pack, {
          x: d.b.x,
          y: d.b.y,
          scale: bannerScale,
          rotate: 3,
          duration: toBanner,
        })
        .to(pack, { rotate: 0, duration: 80, ease: "power1.inOut" });
    };

    const remount = () => {
      const progress = tl?.scrollTrigger?.progress ?? 0;
      tl?.scrollTrigger?.kill();
      tl?.kill();
      tl = build();
      tl?.progress(progress);
    };

    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < 8) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(remount, 220);
    };

    let nestedFrame = 0;
    const frame = requestAnimationFrame(() => {
      tl = build();
      ScrollTrigger.refresh();
      nestedFrame = requestAnimationFrame(remount);
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad);
    pack.querySelector("img")?.addEventListener("load", onLoad, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nestedFrame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, [locale]);

  return (
    <div ref={rootRef} id="pack-journey" className="pack-journey relative">
      {children}
      <div ref={packRef} className="hero-pack-stage" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/hero/hero-pack.png"
          alt=""
          className="hero-pack-img"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}
