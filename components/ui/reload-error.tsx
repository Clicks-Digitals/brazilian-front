"use client";

import { ErrorState } from "@/components/ui/states";

export function ReloadError({ title, description }: { title?: string; description?: string }) {
  return (
    <ErrorState
      title={title}
      description={description}
      onRetry={() => window.location.reload()}
    />
  );
}
