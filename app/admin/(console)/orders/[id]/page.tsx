"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { StatusPill } from "@/components/ui/status-pill";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Order } from "@/types/api";

const STATUSES = ["pending", "confirmed", "processing", "ready", "shipped", "delivered", "cancelled"];
const PAYMENTS = ["unpaid", "pending", "paid", "refunded", "failed"];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const canEdit = useCan("orders.edit");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [note, setNote] = useState("");
  const [internal, setInternal] = useState("");

  async function load() {
    try {
      const data = await api.get<Order>(`/admin/orders/${params.id}/`);
      setOrder(data);
      setStatus(data.status);
      setPayment(data.payment_status);
      setInternal(data.internal_notes || "");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!order) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="print-receipt space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-gold">{formatDate(order.placed_at, true)}</p>
          <h1 className="mt-2 text-3xl font-light">{order.order_number}</h1>
          <div className="mt-2 flex gap-2">
            <StatusPill value={order.status} />
            <StatusPill value={order.payment_status} />
          </div>
        </div>
        <Button type="button" variant="secondary" className="no-print" onClick={() => window.print()}>
          Print receipt
        </Button>
      </div>
      <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper">
        {order.items?.map((item) => (
          <li key={item.sku} className="flex justify-between px-4 py-3 text-sm">
            <span>
              {item.product_name} {item.variant_name} × {item.quantity}
              <span className="block text-muted">{item.sku}</span>
            </span>
            <span>{formatMoney(item.line_total)}</span>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 text-sm">
        <p className="flex justify-between"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></p>
        <p className="flex justify-between"><span>Delivery</span><span>{formatMoney(order.delivery_fee || "0")}</span></p>
        <p className="flex justify-between font-medium"><span>Total</span><span>{formatMoney(order.total, order.currency)}</span></p>
        <p className="text-muted">{order.customer_name} · {order.email} · {order.phone}</p>
        <p>{order.shipping_line1}, {order.shipping_city}</p>
      </div>
      <div className="no-print grid gap-4 border border-ink/10 bg-paper p-5 md:grid-cols-2">
        <Field label="Fulfillment status">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!canEdit}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Field label="Note">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-16" />
        </Field>
        <Button
          type="button"
          disabled={!canEdit}
          onClick={async () => {
            try {
              await api.post(`/admin/orders/${order.id}/status/`, { status, note });
              toast("Status updated", undefined, "success");
              load();
            } catch (err) {
              toast("Update failed", errorMessage(err), "error");
            }
          }}
        >
          {canEdit ? "Update status" : "Need orders.edit"}
        </Button>
        <Field label="Payment status">
          <Select value={payment} onChange={(e) => setPayment(e.target.value)} disabled={!canEdit}>
            {PAYMENTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Field>
        <Button
          type="button"
          variant="secondary"
          disabled={!canEdit}
          onClick={async () => {
            try {
              await api.post(`/admin/orders/${order.id}/payment/`, { payment_status: payment });
              toast("Payment status updated", undefined, "success");
              load();
            } catch (err) {
              toast("Update failed", errorMessage(err), "error");
            }
          }}
        >
          Update payment
        </Button>
        <Field label="Internal notes" className="md:col-span-2">
          <Textarea value={internal} onChange={(e) => setInternal(e.target.value)} />
        </Field>
        <Button
          type="button"
          variant="secondary"
          disabled={!canEdit}
          onClick={async () => {
            try {
              await api.patch(`/admin/orders/${order.id}/`, { internal_notes: internal });
              toast("Notes saved", undefined, "success");
            } catch (err) {
              toast("Could not save notes", errorMessage(err), "error");
            }
          }}
        >
          Save notes
        </Button>
      </div>
    </div>
  );
}
