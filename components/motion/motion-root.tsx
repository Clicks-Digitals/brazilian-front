"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function play(root: ParentNode) {
  if (prefersReducedMotion()) {
    root.querySelectorAll("[data-reveal], [data-reveal-stagger]").forEach((el) => {
      el.setAttribute("data-reveal-ready", "");
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-ready])").forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        immediateRender: true,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
    el.setAttribute("data-reveal-ready", "");
  });

  root.querySelectorAll<HTMLElement>("[data-reveal-stagger]:not([data-reveal-ready])").forEach((el) => {
    const items = el.querySelectorAll<HTMLElement>(":scope > *");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power2.out",
        immediateRender: true,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
    el.setAttribute("data-reveal-ready", "");
  });
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.querySelector("main") ?? document.body;
    play(document.body);

    if (prefersReducedMotion()) return undefined;

    gsap.fromTo(root, { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 0.45, ease: "power1.out" });

    let timer = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        play(document.body);
        ScrollTrigger.refresh();
      }, 60);
    });
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  return children;
}
