"use client";

import { cn } from "@/lib/cn";
import { Minus, Plus } from "lucide-react";

export function Quantity({
  value,
  onChange,
  min = 1,
  max,
  disabled,
  size = "md",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const compact = size === "sm";
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-2xl border border-cream/20 bg-cream/10",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn(
          "grid place-items-center text-cream disabled:opacity-40",
          compact ? "size-8" : "size-10",
        )}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className={compact ? "size-3" : "size-3.5"} />
      </button>
      <span className={cn("min-w-8 text-center tabular-nums text-cream", compact ? "text-xs" : "text-sm")}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={cn(
          "grid place-items-center text-cream disabled:opacity-40",
          compact ? "size-8" : "size-10",
        )}
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
      >
        <Plus className={compact ? "size-3" : "size-3.5"} />
      </button>
    </div>
  );
}
