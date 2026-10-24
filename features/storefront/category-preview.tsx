"use client";

import Link from "next/link";
import { useState } from "react";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/cn";
import type { Category } from "@/types/api";

function countLabel(count?: number) {
  if (!count) return "View";
  return `${count} ${count === 1 ? "item" : "items"}`;
}

export function CategoryPreview({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(0);
  const current = categories[active] ?? categories[0];
  if (!current) return null;

  return (
    <>
      <ul className="lg:hidden">
        {categories.map((category) => (
          <li key={category.slug} className="border-t border-ink/10 last:border-b">
            <Link href={`/shop/${category.slug}`} className="flex items-center gap-4 py-4">
              <SmartImage
                src={category.image}
                alt=""
                className="size-[4.5rem] shrink-0 bg-white sm:size-20"
                imgClassName="p-2"
              />
              <span className="min-w-0 flex-1">
                <span className="font-subtitle block text-xl font-normal leading-snug text-ink">
                  {category.name}
                </span>
                <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-muted">
                  {countLabel(category.product_count)}
                </span>
              </span>
              <span className="shrink-0 text-gold" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden items-start gap-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)]">
        <ul>
          {categories.map((category, index) => {
            const on = index === active;
            return (
              <li key={category.slug} className="border-t border-ink/10 last:border-b">
                <Link
                  href={`/shop/${category.slug}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className="group flex items-baseline justify-between gap-6 py-6"
                >
                  <span
                    className={cn(
                      "font-subtitle text-5xl font-normal leading-none transition",
                      on ? "text-forest" : "text-ink group-hover:text-forest",
                    )}
                  >
                    {category.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-[11px] uppercase tracking-[0.16em]",
                      on ? "text-gold" : "text-muted",
                    )}
                  >
                    {countLabel(category.product_count)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="sticky top-[calc(var(--nav-h)+2rem)]">
          <SmartImage
            src={current.image}
            alt={current.name}
            className="aspect-[4/5] w-full bg-white"
            imgClassName="p-8 transition duration-500"
          />
          {current.description ? (
            <p className="font-subtitle mt-6 text-sm leading-relaxed text-muted">{current.description}</p>
          ) : null}
          <Link href={`/shop/${current.slug}`} className="link-arrow mt-5">
            Shop {current.name}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
