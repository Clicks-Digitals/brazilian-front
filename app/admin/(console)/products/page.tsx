"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { ConfirmModal } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable, AdminThumb } from "@/features/admin/admin-table";
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
  const canDelete = useCan("products.delete");
  const [removeId, setRemoveId] = useState<number | null>(null);

  return (
    <div>
      <AdminHeader
        title="Products"
        action={
          canCreate ? <Button href="/admin/products/new" size="sm">New product</Button> : <span className="text-xs text-muted">Create disabled</span>
        }
      />
      <Input className="mb-4 max-w-sm" placeholder="Search" value={list.search} onChange={(e) => list.setSearch(e.target.value)} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Product", "SKU", "Price", "Flags", ""]}
        rows={list.rows.map((p) => [
          <Link key="n" href={`/admin/products/${p.id}`} className="flex items-center gap-3 text-forest">
            <AdminThumb src={pickImage(p) || p.default_variant?.image} alt={p.name} />
            <span>{p.name}</span>
          </Link>,
          p.sku || p.default_variant?.sku || "—",
          p.default_variant?.price ? formatMoney(p.default_variant.price) : p.min_price ? formatMoney(p.min_price) : "—",
          [p.is_featured ? "Featured" : "", p.is_new ? "New" : "", p.is_active === false ? "Hidden" : ""].filter(Boolean).join(" · ") || "Live",
          canDelete ? (
            <button type="button" className="text-sm text-muted" onClick={() => setRemoveId(p.id)}>Delete</button>
          ) : (
            ""
          ),
        ])}
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
