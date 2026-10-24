import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-cream", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="eyebrow text-gold">Nothing here yet</p>
      <h2 className="font-display mt-3 text-2xl text-ink">{title}</h2>
      {description ? <p className="font-subtitle mt-3 text-muted">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "We could not load this just now",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="eyebrow text-gold">Connection</p>
      <h2 className="font-display mt-3 text-2xl text-ink">{title}</h2>
      <p className="font-subtitle mt-3 text-muted">
        {description || "The store could not reach Brazilian Coffee House. Please try again."}
      </p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry} type="button">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center md:pt-24">
      {eyebrow ? <p className="eyebrow text-gold">{eyebrow}</p> : null}
      <h1 className="font-display mt-3 text-4xl tracking-tight text-ink md:text-5xl">{title}</h1>
      {description ? <p className="font-subtitle mt-4 text-muted">{description}</p> : null}
    </header>
  );
}
