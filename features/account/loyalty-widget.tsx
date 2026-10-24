"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import type { LoyaltyStatus } from "@/types/api";

export function LoyaltyWidget() {
  const [data, setData] = useState<LoyaltyStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<LoyaltyStatus>("/account/loyalty/")
      .then(setData)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <p className="text-sm text-muted">{error}</p>;
  if (!data) return <p className="text-sm text-muted">Checking loyalty…</p>;
  if (!data.configured) {
    return (
      <div className="border border-ink/10 bg-cream p-5">
        <p className="eyebrow text-gold">Clicks Loyalty</p>
        <h3 className="mt-2 text-lg">Coming soon</h3>
        <p className="mt-2 text-sm text-muted">
          Clicks Loyalty is not connected on this store yet. Ask in branch to link your card — we never invent points
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-ink/10 bg-cream p-5">
      <p className="eyebrow text-gold">Loyalty</p>
      {data.tier ? <p className="mt-2">{String(data.tier)}</p> : null}
      {"points" in data && data.points !== undefined ? <p className="text-sm">{String(data.points)} points</p> : null}
      {data.message ? <p className="mt-2 text-sm text-muted">{data.message}</p> : null}
      {data.wallet_pass_url ? (
        <a className="mt-3 inline-block text-sm text-forest" href={data.wallet_pass_url}>
          Open wallet pass
        </a>
      ) : null}
    </div>
  );
}
