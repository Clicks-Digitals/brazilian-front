"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Newspaper, Package, ShoppingBag, TriangleAlert, Users, Wallet } from "lucide-react";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader } from "@/features/admin/admin-table";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import type { DashboardData } from "@/types/api";

function num(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (value && typeof value === "object" && "count" in value) return Number((value as { count?: number }).count) || 0;
  return 0;
}

function moneyValue(data: DashboardData): string {
  if (typeof data.sales?.total === "string") return data.sales.total;
  if (typeof data.revenue === "string") return data.revenue;
  if (data.revenue && typeof data.revenue === "object" && data.revenue.total) return data.revenue.total;
  return "0";
}

function chartLabel(value: string): string {
  if (!value) return "";
  return value.length >= 10 ? value.slice(5, 10) : value;
}

const SLICE = ["#1b4a38", "#d4b46a", "#14362a", "#6b645c", "#c9a75a"];

function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  if (!data.length) return <p className="text-sm text-muted">No chart data for this range.</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 640;
  const bar = width / data.length;
  return (
    <svg viewBox={`0 0 ${width} 200`} className="w-full" role="img" aria-label="Sales chart">
      {data.map((item, i) => {
        const height = (item.value / max) * 150;
        return (
          <g key={`${item.label}-${i}`}>
            <rect
              x={i * bar + 8}
              y={160 - height}
              width={Math.max(bar - 16, 8)}
              height={height}
              rx="8"
              fill={i % 2 === 0 ? "#1b4a38" : "#d4b46a"}
            />
            <text x={i * bar + bar / 2} y={186} textAnchor="middle" fontSize="10" fill="#6B645C">
              {chartLabel(item.label)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Donut({ items }: { items: Array<[string, number]> }) {
  const total = items.reduce((sum, [, count]) => sum + count, 0) || 1;
  let offset = 0;
  const r = 36;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 96 96" className="size-28 shrink-0" role="img" aria-label="Orders by status">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f0ebe3" strokeWidth="12" />
        {items.map(([status, count], i) => {
          const len = (count / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={status}
              cx="48"
              cy="48"
              r={r}
              fill="none"
              stroke={SLICE[i % SLICE.length]}
              strokeWidth="12"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform="rotate(-90 48 48)"
            />
          );
          offset += len;
          return el;
        })}
        <text x="48" y="52" textAnchor="middle" fontSize="14" fill="#241f1a" fontWeight="700">
          {total}
        </text>
      </svg>
      <ul className="min-w-0 space-y-2 text-sm">
        {items.map(([status, count], i) => (
          <li key={status} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 capitalize text-muted">
              <span className="size-2 rounded-full" style={{ background: SLICE[i % SLICE.length] }} />
              {status.replaceAll("_", " ")}
            </span>
            <span className="text-ink">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });

  useEffect(() => {
    api
      .get<DashboardData>("/admin/dashboard/", { from: range.from || undefined, to: range.to || undefined })
      .then(setData)
      .catch((err) => setError(errorMessage(err)));
  }, [range.from, range.to]);

  if (error) return <ErrorState description={error} />;
  if (!data) return <p className="text-sm text-muted">Loading dashboard…</p>;

  const byStatus = data.orders_by_status || {};
  const cards = [
    { label: "Sales", hint: "Excl. cancelled", value: formatMoney(moneyValue(data)), icon: Wallet },
    { label: "Orders", hint: "All statuses", value: String(num(data.orders_count ?? data.orders)), icon: ShoppingBag },
    { label: "Customers", hint: "House accounts", value: String(num(data.customers)), icon: Users },
    { label: "Low stock", hint: "Needs a refill", value: String(num(data.low_stock)), icon: TriangleAlert },
    { label: "Paid", hint: "Settled", value: formatMoney(data.sales?.paid || "0"), icon: Wallet },
    { label: "Products", hint: "Active on the shelf", value: String(num(data.active_products ?? data.products)), icon: Package },
  ];
  const series = (data.sales_over_time || []).map((row) => ({
    label: String(row.day || row.date || ""),
    value: Number(row.total || row.revenue || row.orders || 0),
  }));
  const statuses = Object.entries(byStatus);
  const bestsellers = data.best_sellers || data.top_products || [];
  const recent = data.recent_orders || [];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        action={
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              className="rounded-xl border-0 bg-white px-3 py-2 text-sm text-ink"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
            />
            <input
              type="date"
              className="rounded-xl border-0 bg-white px-3 py-2 text-sm text-ink"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
            />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{card.label}</p>
                <p className="font-display mt-2 text-2xl">{card.value}</p>
                <p className="font-subtitle mt-1 text-xs text-muted">{card.hint}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-full bg-linen text-forest">
                <card.icon className="size-4" strokeWidth={1.75} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">Sales over time</h2>
          <div className="mt-4">
            <BarChart data={series} />
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">Orders by status</h2>
          <div className="mt-6">
            {statuses.length === 0 ? (
              <p className="text-sm text-muted">No orders in this range.</p>
            ) : (
              <Donut items={statuses} />
            )}
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">Best sellers</h2>
            <Link href="/admin/products" className="text-xs text-forest hover:text-forest-dark">
              Products
            </Link>
          </div>
          {bestsellers.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No product sales yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/6">
              {bestsellers.map((product) => (
                <li key={`${product.name}-${product.sku || product.quantity}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="min-w-0 truncate">{product.name}</span>
                  <span className="shrink-0 text-muted">
                    {product.quantity ?? 0}
                    {product.revenue ? ` · ${formatMoney(product.revenue)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[11px] uppercase tracking-[0.14em] text-muted">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-forest hover:text-forest-dark">
              All orders
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No recent orders.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/6">
              {recent.map((order) => (
                <li key={order.order_number} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate">{order.order_number}</span>
                    <span className="font-subtitle text-xs text-muted">{order.customer_name}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block">{formatMoney(order.total)}</span>
                    <span className="font-subtitle text-xs capitalize text-muted">{order.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-muted">
        <Newspaper className="size-3.5" strokeWidth={1.75} />
        {num(data.published_articles)} published articles
      </p>
    </div>
  );
}
