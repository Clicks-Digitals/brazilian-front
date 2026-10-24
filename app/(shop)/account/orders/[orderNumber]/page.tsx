"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { StatusPill } from "@/components/ui/status-pill";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import type { Order } from "@/types/api";

export default function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Order>(`/account/orders/${params.orderNumber}/`)
      .then(setOrder)
      .catch((err) => setError(errorMessage(err)));
  }, [params.orderNumber]);

  if (error) return <ErrorState description={error} />;
  if (!order) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-gold">{formatDate(order.placed_at, true)}</p>
        <h1 className="mt-2 text-3xl font-light">{order.order_number}</h1>
        <div className="mt-3 flex gap-2">
          <StatusPill value={order.status} />
          <StatusPill value={order.payment_status} />
        </div>
      </div>
      <ul className="divide-y divide-ink/10">
        {order.items?.map((item) => (
          <li key={item.sku} className="flex justify-between py-3 text-sm">
            <span>
              {item.product_name} {item.variant_name ? `— ${item.variant_name}` : ""} × {item.quantity}
            </span>
            <span>{formatMoney(item.line_total)}</span>
          </li>
        ))}
      </ul>
      <p className="flex justify-between font-medium">
        <span>Total</span>
        <span>{formatMoney(order.total, order.currency)}</span>
      </p>
      <p className="text-sm text-muted">
        {order.shipping_line1}, {order.shipping_city}
      </p>
    </div>
  );
}
