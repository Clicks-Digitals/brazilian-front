"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/states";
import { StatusPill } from "@/components/ui/status-pill";
import { api } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { asPaginated } from "@/lib/settings";
import type { Order } from "@/types/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/account/orders/")
      .then((data) => setOrders(asPaginated<Order>(data).results))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-40 w-full" />;
  if (error) return <ErrorState description={error} />;
  if (!orders.length) return <EmptyState title="No orders yet" description="When you place an order, it will live here." />;

  return (
    <div>
      <h1 className="text-3xl font-light">Orders</h1>
      <ul className="mt-6 divide-y divide-ink/10">
        {orders.map((order) => (
          <li key={order.order_number} className="flex items-center justify-between py-4">
            <div>
              <Link href={`/account/orders/${order.order_number}`} className="font-medium">
                {order.order_number}
              </Link>
              <p className="text-sm text-muted">{formatDate(order.placed_at)}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusPill value={order.status} />
              <span>{formatMoney(order.total, order.currency)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
