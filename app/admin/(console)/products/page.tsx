"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import {
  AdminFlagPills,
  AdminHeader,
  AdminPager,
  AdminRowActions,
  AdminSearch,
  AdminTable,
  AdminThumb,
} from "@/features/admin/admin-table";
import { pickImage } from "@/lib/settings";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Product } from "@/types/api";
import { useState } from "react";

export default function AdminProductsPage() {
  const list = useAdminList<Product>("/admin/products/");
  const canCreate = useCan("products.create");
  const canEdit = useCan("products.edit");
  const canDelete = useCan("products.delete");
  const [removeId, setRemoveId] = useState<number | null>(null);

  return (
    <div>
      <AdminHeader
        title="Products"
        subtitle="Manage shelf items, pricing flags, and pack shots."
        action={
          canCreate ? (
            <Button href="/admin/products/new" size="sm" className="rounded-lg">
              New product
            </Button>
          ) : (
            <span className="text-xs text-muted">Create disabled</span>
          )
        }
      />
      <AdminSearch value={list.search} onChange={list.setSearch} placeholder="Search products…" />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Product", "SKU", "Price", "Flags", ""]}
        rows={list.rows.map((p) => {
          const flags = [p.is_featured ? "Featured" : "", p.is_new ? "New" : "", p.is_active === false ? "Hidden" : ""].filter(
            Boolean,
          ) as string[];
          return [
            <Link key="n" href={`/admin/products/${p.id}`} className="group flex items-center gap-3">
              <AdminThumb src={pickImage(p) || p.default_variant?.image} alt={p.name} />
              <span className="font-medium text-ink group-hover:text-forest">{p.name}</span>
            </Link>,
            <span key="sku" className="font-mono text-xs text-muted">
              {p.sku || p.default_variant?.sku || "—"}
            </span>,
            <span key="price" className="tabular-nums">
              {p.default_variant?.price ? formatMoney(p.default_variant.price) : p.min_price ? formatMoney(p.min_price) : "—"}
            </span>,
            <AdminFlagPills key="flags" flags={flags} />,
            <AdminRowActions
              key="actions"
              editHref={`/admin/products/${p.id}`}
              canEdit={canEdit}
              canDelete={canDelete}
              onDelete={() => setRemoveId(p.id)}
            />,
          ];
        })}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <ConfirmModal
        open={removeId !== null}
        title="Delete this product?"
        danger
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          if (!removeId) return;
          try {
            await api.delete(`/admin/products/${removeId}/`);
            list.reload();
          } catch (err) {
            toast("Delete failed", errorMessage(err), "error");
          }
          setRemoveId(null);
        }}
      />
    </div>
  );
}
