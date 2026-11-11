"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Field, Input, Select, Checkbox } from "@/components/ui/field";
import { useLocale } from "@/features/i18n/locale-provider";
import { localizedName } from "@/lib/i18n";
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
  const { locale, t } = useLocale();
  if (!categories.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip active={!value} onClick={() => onSelect("")}>
        {t("allCoffees")}
      </Chip>
      {categories.map((category) => (
        <Chip key={category.id} active={value === category.slug} onClick={() => onSelect(category.slug)}>
          {localizedName(locale, category)}
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
  const { t } = useLocale();
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
          <Search className="size-4 shrink-0 text-cream" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchTheShelf")}
            className="w-full border-0 bg-transparent py-1 text-sm text-cream outline-none placeholder:text-cream"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={value.roast || ""}
            onChange={(e) => set("roast", e.target.value)}
            className="bg-transparent text-xs tracking-[0.12em] uppercase text-cream outline-none"
          >
            <option value="">{t("anyRoast")}</option>
            <option value="light">{t("roastLight")}</option>
            <option value="medium">{t("roastMedium")}</option>
            <option value="medium-dark">{t("roastMediumDark")}</option>
            <option value="dark">{t("roastDark")}</option>
          </select>
          <select
            value={value.ordering || "featured"}
            onChange={(e) => set("ordering", e.target.value)}
            className="bg-transparent text-xs tracking-[0.12em] uppercase text-cream outline-none"
          >
            <option value="featured">{t("featured")}</option>
            <option value="-created_at">{t("newest")}</option>
            <option value="price">{t("priceLowHigh")}</option>
            <option value="-price">{t("priceHighLow")}</option>
            <option value="name">{t("nameAZ")}</option>
            <option value="-name">{t("nameZA")}</option>
            <option value="best_selling">{t("bestSelling")}</option>
          </select>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs tracking-[0.12em] uppercase text-cream hover:text-gold"
          >
            {open ? t("hideFilters") : t("moreFilters")}
          </button>
          <p className="text-xs tracking-[0.12em] uppercase text-cream">
            {t(count === 1 ? "coffeeOne" : "coffeeMany", { count })}
          </p>
        </div>
      </div>
      {open ? (
        <div className="grid gap-4 pb-2 md:grid-cols-4">
          <Field label={t("minJod")}>
            <Input
              inputMode="decimal"
              value={value.min_price || ""}
              onChange={(e) => set("min_price", e.target.value)}
            />
          </Field>
          <Field label={t("maxJod")}>
            <Input
              inputMode="decimal"
              value={value.max_price || ""}
              onChange={(e) => set("max_price", e.target.value)}
            />
          </Field>
          <Field label={t("availability")}>
            <Select value={value.availability || "in_stock"} onChange={(e) => set("availability", e.target.value)}>
              <option value="in_stock">{t("inStock")}</option>
              <option value="all">{t("allProducts")}</option>
            </Select>
          </Field>
          <div className="flex items-end pb-2">
            <Checkbox
              label={t("onSale")}
              checked={value.on_sale === "true"}
              onChange={(e) => set("on_sale", e.target.checked ? "true" : "")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
