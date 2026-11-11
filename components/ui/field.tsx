import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldTone = "light" | "forest";

function fieldSurface(tone: FieldTone) {
  return cn(
    "w-full min-h-12 border px-4 py-3 text-base outline-none transition",
    tone === "forest"
      ? "rounded-full border-cream/40 bg-transparent text-cream caret-cream placeholder:text-cream/70 focus:border-cream [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1b4a38] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--cream)]"
      : "border-ink/15 bg-white text-forest placeholder:text-muted/70 focus:border-gold",
  );
}

export function Field({
  label,
  hint,
  error,
  className,
  tone = "light",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  tone?: FieldTone;
  children: ReactNode;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span
        className={
          tone === "forest"
            ? "text-[11px] uppercase tracking-[0.14em] text-cream"
            : "text-xs tracking-wide text-ink"
        }
      >
        {label}
      </span>
      {children}
      {hint && !error ? (
        <span className={cn("block text-xs", tone === "forest" ? "text-cream" : "text-muted")}>{hint}</span>
      ) : null}
      {error ? (
        <span className={cn("block text-xs", tone === "forest" ? "text-gold" : "text-red-800")}>{error}</span>
      ) : null}
    </label>
  );
}

export function Input({
  className,
  tone = "light",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { tone?: FieldTone }) {
  return <input className={cn(fieldSurface(tone), className)} {...props} />;
}

export function Textarea({
  className,
  tone = "light",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { tone?: FieldTone }) {
  return (
    <textarea
      className={cn(fieldSurface(tone), "min-h-32", tone === "forest" && "rounded-2xl", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  tone = "light",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { tone?: FieldTone }) {
  return <select className={cn(fieldSurface(tone), className)} {...props} />;
}

export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("flex items-center gap-2 text-sm text-ink", className)}>
      <input type="checkbox" className="size-4 accent-forest" {...props} />
      {label}
    </label>
  );
}
