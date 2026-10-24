"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X } from "lucide-react";
import type { Announcement } from "@/types/api";

const KEY = "bch-announcement-dismissed";

export function AnnouncementBar({ announcements }: { announcements: Announcement[] }) {
  const [active, setActive] = useState<Announcement | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = new Set(
      (typeof window !== "undefined" ? sessionStorage.getItem(KEY) : "")?.split(",").filter(Boolean) || [],
    );
    const next = announcements.find((item) => item.is_active !== false && !dismissed.has(String(item.id))) || null;
    setActive(next);
  }, [announcements]);

  useEffect(() => {
    if (!active || !barRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(barRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
  }, [active]);

  if (!active) return null;

  function dismiss() {
    const current = sessionStorage.getItem(KEY) || "";
    sessionStorage.setItem(KEY, [current, String(active?.id)].filter(Boolean).join(","));
    setActive(null);
  }

  const inner = <span>{active.text}</span>;

  return (
    <div ref={barRef} className="announcement-bar bg-forest text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2 text-center text-[12px] tracking-[0.12em]">
        {active.link_url ? (
          <Link href={active.link_url} className="hover:text-gold">
            {inner}
          </Link>
        ) : (
          inner
        )}
        {active.dismissible !== false ? (
          <button type="button" aria-label="Dismiss announcement" onClick={dismiss} className="p-1">
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
