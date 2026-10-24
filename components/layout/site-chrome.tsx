"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MotionRoot } from "@/components/motion/motion-root";
import type { Announcement, Category, StoreSettings } from "@/types/api";

export function SiteChrome({
  announcements,
  categories,
  settings,
  children,
}: {
  announcements: Announcement[];
  categories: Category[];
  settings: StoreSettings;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setSolid(false);
      return;
    }

    let frame = 0;
    const observer = new ResizeObserver(() => schedule());

    const tallestHero = (): DOMRect | null => {
      const heroes = Array.from(document.querySelectorAll<HTMLElement>("[data-hero]"));
      if (!heroes.length) return null;
      return heroes
        .map((el) => el.getBoundingClientRect())
        .reduce((best, rect) => (rect.height > best.height ? rect : best));
    };

    const update = () => {
      const rect = tallestHero();
      if (!rect || rect.height < 160) {
        setSolid(false);
        return;
      }
      setSolid(rect.bottom <= 8);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    const main = document.querySelector("main");
    if (main) observer.observe(main);
    document.querySelectorAll("[data-hero]").forEach((el) => observer.observe(el));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isHome]);

  return (
    <div className="flex min-h-screen flex-col">
      {isHome ? null : <AnnouncementBar announcements={announcements} />}
      <Header categories={categories} isHome={isHome} solid={solid} />
      <MotionRoot>
        <main className="flex-1">{children}</main>
      </MotionRoot>
      <Footer settings={settings} categories={categories} />
    </div>
  );
}
