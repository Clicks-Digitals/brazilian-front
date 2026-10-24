"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Field, Input, Select, Checkbox } from "@/components/ui/field";
import type { Category } from "@/types/api";

export type ShopQuery = {
  category?: string;
  search?: string;
  min_price?: string;
  max_price?: string;
  roast?: string;
  availability?: string;
  on_sale?: string;
  ordering?: string;
  page?: string;
};

export function CategoryChips({
  categories,
  value,
  onSelect,
}: {
  categories: Category[];
  value?: string;
  onSelect: (slug: string) => void;
}) {
  if (!categories.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip active={!value} onClick={() => onSelect("")}>
        All coffees
      </Chip>
      {categories.map((category) => (
        <Chip key={category.id} active={value === category.slug} onClick={() => onSelect(category.slug)}>
          {category.name}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition",
        active
          ? "border-forest bg-forest text-cream"
          : "border-ink/10 bg-white text-ink hover:border-forest/40",
      )}
    >
      {children}
    </button>
  );
}

export function ShopToolbar({
  value,
  count,
  onChange,
}: {
  value: ShopQuery;
  count: number;
  onChange: (next: ShopQuery) => void;
}) {
  const [search, setSearch] = useState(value.search || "");
  const [open, setOpen] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    setSearch(value.search || "");
  }, [value.search]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const current = valueRef.current;
      if ((search || undefined) === (current.search || undefined)) return;
      onChange({ ...current, search: search || undefined, page: "1" });
    }, 350);
    return () => window.clearTimeout(handle);
  }, [search, onChange]);

  function set(key: keyof ShopQuery, next: string) {
    onChange({ ...value, [key]: next || undefined, page: "1" });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-y border-ink/8 py-4 md:flex-row md:items-center md:justify-between">
        <label className="relative flex min-w-0 flex-1 items-center gap-2 md:max-w-sm">
          <Search className="size-4 shrink-0 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the shelf"
            className="w-full border-0 bg-transparent py-1 text-sm text-ink outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={value.roast || ""}
            onChange={(e) => set("roast", e.target.value)}
            className="bg-transparent text-xs tracking-[0.12em] uppercase text-ink outline-none"
          >
            <option value="">Any roast</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="medium-dark">Medium dark</option>
            <option value="dark">Dark</option>
          </select>
          <select
            value={value.ordering || "featured"}
            onChange={(e) => set("ordering", e.target.value)}
            className="bg-transparent text-xs tracking-[0.12em] uppercase text-ink outline-none"
          >
            <option value="featured">Featured</option>
            <option value="-created_at">Newest</option>
            <option value="price">Price, low to high</option>
            <option value="-price">Price, high to low</option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
            <option value="best_selling">Best selling</option>
          </select>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs tracking-[0.12em] uppercase text-muted hover:text-forest"
          >
            {open ? "Hide filters" : "More filters"}
          </button>
          <p className="text-xs tracking-[0.12em] uppercase text-muted">{count} {count === 1 ? "coffee" : "coffees"}</p>
        </div>
      </div>
      {open ? (
        <div className="grid gap-4 pb-2 md:grid-cols-4">
          <Field label="Min JOD">
            <Input
              inputMode="decimal"
              value={value.min_price || ""}
              onChange={(e) => set("min_price", e.target.value)}
            />
          </Field>
          <Field label="Max JOD">
            <Input
              inputMode="decimal"
              value={value.max_price || ""}
              onChange={(e) => set("max_price", e.target.value)}
            />
          </Field>
          <Field label="Availability">
            <Select value={value.availability || "in_stock"} onChange={(e) => set("availability", e.target.value)}>
              <option value="in_stock">In stock</option>
              <option value="all">All products</option>
            </Select>
          </Field>
          <div className="flex items-end pb-2">
            <Checkbox
              label="On sale"
              checked={value.on_sale === "true"}
              onChange={(e) => set("on_sale", e.target.checked ? "true" : "")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
