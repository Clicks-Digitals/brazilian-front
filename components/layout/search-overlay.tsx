"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/field";
import { api } from "@/lib/api";
import { asList } from "@/lib/settings";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/api";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setBusy(true);
      try {
        const data = await api.get("/search/", { q: q.trim() }, { auth: false });
        const products = asList<Product>(
          (data as { products?: Product[]; results?: Product[] }).products || data,
        );
        setResults(products.slice(0, 8));
      } catch {
        try {
          const data = await api.get("/products/", { search: q.trim(), page_size: 8 }, { auth: false });
          setResults(asList<Product>((data as { results?: Product[] }).results || data));
        } catch {
          setResults([]);
        }
      } finally {
        setBusy(false);
      }
    }, 280);
    return () => clearTimeout(handle);
  }, [q, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 p-6 pt-[max(1.5rem,env(safe-area-inset-top))] backdrop-blur-sm">
      <div className="mx-auto max-w-2xl pt-6">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-gold">Search the house</p>
          <button type="button" onClick={onClose} aria-label="Close search">
            <X className="size-5" />
          </button>
        </div>
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/shop?search=${encodeURIComponent(q)}`);
            onClose();
          }}
        >
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search coffees, origins, machines…"
            aria-label="Search products"
          />
        </form>
        <div className="mt-6 space-y-3">
          {busy ? <p className="text-sm text-muted">Searching…</p> : null}
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-between border-b border-ink/10 py-3 text-sm"
            >
              <span>{product.name}</span>
              <span className="text-muted">
                {product.default_variant?.price || product.min_price
                  ? formatMoney(product.default_variant?.price || product.min_price || "")
                  : ""}
              </span>
            </Link>
          ))}
          {q.trim().length >= 2 && !busy && results.length === 0 ? (
            <p className="text-sm text-muted">No matches. Try another origin or roast.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
