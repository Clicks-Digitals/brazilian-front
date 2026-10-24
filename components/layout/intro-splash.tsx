"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";

export function IntroSplash() {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => !pathname.startsWith("/admin"));

  useEffect(() => {
    if (!open) {
      document.documentElement.dataset.intro = "done";
      return;
    }

    document.documentElement.dataset.intro = "pending";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 350 : 1700;
    const fade = reduce ? 0 : 650;
    const hide = window.setTimeout(() => {
      document.documentElement.dataset.intro = "leaving";
      window.setTimeout(() => {
        document.documentElement.dataset.intro = "done";
        setOpen(false);
      }, fade);
    }, hold);

    return () => window.clearTimeout(hide);
  }, [open]);

  if (!open) return null;

  return (
    <div className="intro-splash" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND.logo} alt="" className="intro-splash-logo" />
    </div>
  );
}
