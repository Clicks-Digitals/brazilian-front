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

      const timeline = gsap.timeline({
        defaults: { force3D: true, autoAlpha: 1, ease: compact ? "none" : "power2.inOut" },
        scrollTrigger: {
          id: "hero-pack-scroll",
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: compact ? 0.45 : 0.95,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      if (compact) {
        return timeline
          .to(pack, { duration: 0.1 })
          .to(pack, {
            x: d.cs.x,
            y: d.cs.y,
            scale: scaleFor(d.h, d.cs),
            duration: 0.95,
          })
          .to(pack, {
            x: d.c.x,
            y: d.c.y,
            scale: scaleFor(d.h, d.c),
            duration: 1.05,
          })
          .to(pack, {
            x: d.f.x,
            y: d.f.y,
            scale: featuredScale,
            duration: 1.1,
          })
          .to(pack, {
            x: d.b.x,
            y: d.b.y,
            scale: bannerScale,
            duration: 1.15,
          });
      }

      return timeline
        .to(pack, { duration: 0.32 })
        .to(pack, {
          x: d.cs.x,
          y: d.cs.y,
          scale: scaleFor(d.h, d.cs),
          rotate: 5,
          duration: 0.75,
          ease: "power2.in",
        })
        .to(pack, {
          x: d.c.x,
          y: d.c.y,
          scale: scaleFor(d.h, d.c),
          rotate: -4,
          duration: 1.15,
          ease: "none",
        })
        .to(pack, {
          x: d.f.x,
          y: d.f.y,
          scale: featuredScale,
          rotate: 0,
          duration: 1.35,
        })
        .to(pack, {
          x: d.b.x,
          y: d.b.y,
          scale: bannerScale,
          rotate: 3,
          duration: 1.2,
        })
        .to(pack, { rotate: 0, duration: 0.85, ease: "power1.inOut" });
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

    const frame = requestAnimationFrame(() => {
      tl = build();
      ScrollTrigger.refresh();
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onLoad);
    pack.querySelector("img")?.addEventListener("load", onLoad, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

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
