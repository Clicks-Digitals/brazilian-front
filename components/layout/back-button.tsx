"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/features/i18n/locale-provider";
import { cn } from "@/lib/cn";

export function BackButton({
  fallback = "/",
  className,
}: {
  fallback?: string;
  className?: string;
}) {
  const router = useRouter();
  const { t } = useLocale();

  function goBack() {
    if (typeof window === "undefined") {
      router.push(fallback);
      return;
    }
    const referrer = document.referrer;
    if (referrer) {
      try {
        const url = new URL(referrer);
        if (url.origin === window.location.origin && `${url.pathname}${url.search}` !== `${window.location.pathname}${window.location.search}`) {
          router.back();
          return;
        }
      } catch {
        /* use fallback below */
      }
    }
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallback);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={t("goBack")}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-cream/35 text-cream transition hover:border-gold hover:text-gold",
        className,
      )}
    >
      <ArrowLeft className="size-5 rtl:rotate-180" strokeWidth={1.75} />
    </button>
  );
}
