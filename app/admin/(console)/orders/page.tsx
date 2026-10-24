"use client";

import Link from "next/link";
import { Input, Select } from "@/components/ui/field";
import { StatusPill } from "@/components/ui/status-pill";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { formatDate, formatMoney } from "@/lib/format";
import { useCan } from "@/features/admin/admin-shell";
import type { Order } from "@/types/api";
import { useMemo, useState } from "react";

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const extra = useMemo(() => (status ? { status } : undefined), [status]);
  const list = useAdminList<Order>("/admin/orders/", extra);
  const canExport = useCan("orders.export");

  function exportCsv() {
    const header = "order_number,customer,email,status,payment,total,placed_at\n";
    const body = list.rows
      .map((o) =>
        [o.order_number, o.customer_name, o.email, o.status, o.payment_status, o.total, o.placed_at].join(","),
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <AdminHeader
        title="Orders"
        action={
          canExport ? (
            <button type="button" className="text-sm text-forest" onClick={exportCsv} disabled={!list.rows.length}>
              Export page CSV
            </button>
          ) : (
            <span className="text-xs text-muted">Export requires orders.export</span>
          )
        }
      />
      <div className="mb-4 flex gap-3">
        <Input placeholder="Search" value={list.search} onChange={(e) => list.setSearch(e.target.value)} />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); list.setPage(1); }}>
          <option value="">All statuses</option>
          {["pending", "confirmed", "processing", "ready", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </div>
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      {list.loading ? <p className="text-sm text-muted">Loading…</p> : null}
      <AdminTable
        columns={["Order", "Customer", "Status", "Payment", "Total", "Placed"]}
        rows={list.rows.map((order) => [
          <Link key="n" href={`/admin/orders/${order.id}`} className="text-forest">
            {order.order_number}
          </Link>,
          <span key="c">
            {order.customer_name}
            <br />
            <span className="text-muted">{order.email}</span>
          </span>,
          <StatusPill key="s" value={order.status} />,
          <StatusPill key="p" value={order.payment_status} />,
          formatMoney(order.total, order.currency),
          formatDate(order.placed_at, true),
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
    </div>
  );
}
