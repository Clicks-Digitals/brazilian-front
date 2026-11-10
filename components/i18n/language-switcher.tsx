"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/features/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";

const OPTIONS: Array<{ value: Locale; label: string; short: string; lang: string }> = [
  { value: "en", label: "English", short: "EN", lang: "en" },
  { value: "ar", label: "العربية", short: "AR", lang: "ar" },
];

export function LanguageSwitcher({
  className,
  align = "end",
}: {
  className?: string;
  align?: "start" | "end";
}) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((option) => option.value === locale) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("lang-switch", open && "is-open", className)}>
      <button
        type="button"
        className="lang-switch-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        onClick={() => setOpen((value) => !value)}
      >
        <span lang={current.lang}>{current.short}</span>
        <ChevronDown
          className={cn("lang-switch-caret", open && "is-open")}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          className={cn("lang-switch-menu", align === "start" ? "is-start" : "is-end")}
          role="listbox"
          aria-label={t("language")}
        >
          {OPTIONS.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === locale}>
              <button
                type="button"
                className={cn("lang-switch-option", option.value === locale && "is-active")}
                lang={option.lang}
                onClick={() => pick(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
