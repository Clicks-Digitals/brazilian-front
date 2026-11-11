"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/features/i18n/locale-provider";

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
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="eyebrow text-gold">{t("nothingHereYet")}</p>
      <h2 className="font-display mt-3 text-2xl text-cream">{title}</h2>
      {description ? <p className="font-subtitle mt-3 text-cream">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="eyebrow text-gold">{t("connection")}</p>
      <h2 className="font-display mt-3 text-2xl text-cream">{title || t("couldNotLoadNow")}</h2>
      <p className="font-subtitle mt-3 text-cream">
        {description || t("storeCouldNotReach")}
      </p>
      {onRetry ? (
        <Button className="mt-6" onClick={onRetry} type="button">
          {t("tryAgain")}
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
      <h1 className="font-display mt-3 text-4xl tracking-tight text-cream md:text-5xl">{title}</h1>
      {description ? <p className="font-subtitle mt-4 text-cream">{description}</p> : null}
    </header>
  );
}
