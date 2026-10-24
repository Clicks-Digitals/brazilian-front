"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/cn";
import type { Category } from "@/types/api";

function pairsOf<T>(items: T[]) {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

function CategoryTile({
  category,
  index,
  speed,
}: {
  category: Category;
  index: number;
  speed: number;
}) {
  return (
    <Link href={`/shop/${category.slug}`} className="group block min-w-0">
      <div className="overflow-hidden">
        <div data-parallax-img data-speed={speed} className="will-change-transform">
          <SmartImage
            src={category.image}
            alt={category.name}
            className="aspect-[16/10] max-h-[28svh] w-full bg-transparent md:max-h-[52svh] md:aspect-[5/4]"
            imgClassName="scale-[1.12] p-3 transition duration-700 ease-out group-hover:scale-[1.16] md:p-5"
          />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 md:mt-6">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-gold">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="font-display mt-1 text-2xl leading-tight text-ink transition group-hover:text-forest md:text-5xl">
            {category.name}
          </h3>
          {category.name_ar ? (
            <p className="font-subtitle mt-1 text-sm text-muted">
              <span dir="rtl" lang="ar">
                {category.name_ar}
              </span>
            </p>
          ) : null}
          {category.description ? (
            <p className="font-subtitle mt-3 hidden max-w-md text-sm leading-relaxed text-muted md:line-clamp-2 md:block">
              {category.description}
            </p>
          ) : null}
        </div>
        <span className="mt-7 shrink-0 text-gold transition group-hover:translate-x-1 md:mt-10" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}

export function CategoryIndex({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pairs = pairsOf(categories);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || pairs.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const images = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax-img]"));
    let frame = 0;

    const update = () => {
      const vh = window.innerHeight;
      images.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const delta = (rect.top + rect.height / 2 - vh / 2) / vh;
        const speed = Number(el.dataset.speed || 1);
        el.style.transform = `translate3d(0, ${delta * -72 * speed}px, 0)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pairs.length]);

  if (!categories.length) return null;

  return (
    <div ref={rootRef} className={cn("relative isolate", className)}>
      {pairs.map((pair, pairIndex) => (
        <article
          key={pair.map((item) => item.slug).join("-")}
          className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] items-center bg-white motion-reduce:relative motion-reduce:h-auto motion-reduce:py-12"
          style={{ zIndex: pairIndex + 1 }}
        >
          <div className="mx-auto w-full max-w-7xl px-6">
            <p className="mb-6 text-[11px] tracking-[0.22em] text-muted">
              {String(pairIndex * 2 + 1).padStart(2, "0")}
              {pair.length > 1 ? ` — ${String(pairIndex * 2 + 2).padStart(2, "0")}` : ""}
              <span className="text-ink/25"> / {String(categories.length).padStart(2, "0")}</span>
            </p>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              {pair.map((category, offset) => (
                <CategoryTile
                  key={category.slug}
                  category={category}
                  index={pairIndex * 2 + offset}
                  speed={offset === 0 ? 0.7 : 1.15}
                />
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
