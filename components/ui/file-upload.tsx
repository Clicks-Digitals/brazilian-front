"use client";

import { cn } from "@/lib/cn";

export function FileUpload({
  label,
  onFile,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  hint,
  className,
}: {
  label: string;
  onFile: (file: File | null) => void;
  accept?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs tracking-wide text-ink">{label}</span>
      <input
        type="file"
        accept={accept}
        className="block w-full text-sm text-muted file:mr-3 file:border-0 file:bg-forest file:px-3 file:py-2 file:text-cream"
        onChange={(event) => onFile(event.target.files?.[0] || null)}
      />
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
