"use client";

import { cn } from "@/lib/cn";
import { Minus, Plus } from "lucide-react";

export function Quantity({
  value,
  onChange,
  min = 1,
  max,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center border border-ink/15">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn("grid size-10 place-items-center text-ink disabled:opacity-40")}
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-8 text-center text-sm">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid size-10 place-items-center text-ink disabled:opacity-40"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
