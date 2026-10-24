"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState, PageHeader, Skeleton } from "@/components/ui/states";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { useAuthStore } from "@/features/account/auth-store";
import type { Order } from "@/types/api";

export function ConfirmationView({ orderNumber }: { orderNumber: string }) {
  const access = useAuthStore((s) => s.access);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!access) return;
    api
      .get<Order>(`/account/orders/${orderNumber}/`)
      .then(setOrder)
      .catch((err) => setError(errorMessage(err)));
  }, [access, orderNumber]);

  return (
    <>
      <PageHeader
        eyebrow="Thank you"
        title={`Order ${orderNumber}`}
        description="Your order is pending confirmation. Pay with cash on delivery when it arrives."
      />
      <div className="mx-auto max-w-xl px-6 pb-24 text-center">
        {access && !order && !error ? <Skeleton className="mx-auto h-24 w-full" /> : null}
        {error ? <ErrorState description={error} /> : null}
        {order ? (
          <div className="space-y-2 text-left">
            {order.items?.map((item) => (
              <p key={item.sku} className="flex justify-between text-sm">
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>{formatMoney(item.line_total)}</span>
              </p>
            ))}
            <p className="flex justify-between pt-3 font-medium">
              <span>Total</span>
              <span>{formatMoney(order.total, order.currency)}</span>
            </p>
          </div>
        ) : !access ? (
          <p className="text-muted">
            Keep this number for your records. Sign in to follow the order in your account.
          </p>
        ) : null}
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/shop" variant="secondary">
            Continue shopping
          </Button>
          {access ? <Button href={`/account/orders/${orderNumber}`}>View order</Button> : null}
        </div>
      </div>
    </>
  );
}
