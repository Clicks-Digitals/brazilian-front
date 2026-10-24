"use client";

import { useToastStore } from "@/features/ui/toast-store";
import { cn } from "@/lib/cn";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(92vw,22rem)] flex-col gap-2">
      {toasts.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => dismiss(item.id)}
          className={cn(
            "pointer-events-auto border px-4 py-3 text-left text-sm",
            item.tone === "error" && "border-red-800/30 bg-paper text-red-900",
            item.tone === "success" && "border-forest/30 bg-paper text-forest",
            (!item.tone || item.tone === "default") && "border-ink/10 bg-paper text-ink",
          )}
        >
          <div className="font-medium">{item.title}</div>
          {item.description ? <div className="mt-1 text-muted">{item.description}</div> : null}
        </button>
      ))}
    </div>
  );
}
