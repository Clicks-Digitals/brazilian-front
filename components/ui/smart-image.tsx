"use client";

import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  fit = "contain",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  fit?: "contain" | "cover";
}) {
  const url = mediaUrl(src);
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-white text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted",
          className,
        )}
      >
        Brazilian Coffee House
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className={cn(
          "absolute inset-0 h-full w-full object-center",
          fit === "cover" ? "object-cover" : "object-contain",
          imgClassName,
        )}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
