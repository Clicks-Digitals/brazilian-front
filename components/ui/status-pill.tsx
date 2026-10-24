import { cn } from "@/lib/cn";
import { titleCase } from "@/lib/format";

const TONES: Record<string, string> = {
  pending: "bg-cream text-ink",
  confirmed: "bg-forest/10 text-forest",
  processing: "bg-gold/20 text-forest-dark",
  ready: "bg-gold/20 text-forest-dark",
  shipped: "bg-forest/10 text-forest",
  delivered: "bg-forest text-cream",
  cancelled: "bg-ink/10 text-muted",
  unpaid: "bg-cream text-ink",
  paid: "bg-forest text-cream",
  refunded: "bg-ink/10 text-muted",
  failed: "bg-red-900/10 text-red-900",
  published: "bg-forest text-cream",
  draft: "bg-cream text-muted",
  scheduled: "bg-gold/20 text-forest-dark",
  active: "bg-forest/10 text-forest",
  inactive: "bg-cream text-muted",
};

export function StatusPill({ value }: { value?: string | null }) {
  if (!value) return null;
  return (
    <span className={cn("inline-block px-2 py-0.5 text-[11px] uppercase tracking-wider", TONES[value] || "bg-cream text-ink")}>
      {titleCase(value)}
    </span>
  );
}
