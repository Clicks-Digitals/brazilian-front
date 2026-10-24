"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select } from "@/components/ui/field";
import { ConfirmModal, Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Discount } from "@/types/api";

const empty = {
  code: "", name: "", discount_type: "percentage", value: "", min_order_amount: "0",
  usage_limit: "", is_active: true, starts_at: "", ends_at: "",
};

export default function DiscountsPage() {
  const list = useAdminList<Discount>("/admin/discounts/");
  const canCreate = useCan("discounts.create");
  const canDelete = useCan("discounts.delete");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [form, setForm] = useState(empty);
  const [removeId, setRemoveId] = useState<number | null>(null);

  function start(item?: Discount) {
    setEditing(item || null);
    setForm(item ? {
      code: item.code, name: item.name, discount_type: item.discount_type, value: item.value,
      min_order_amount: item.min_order_amount || "0", usage_limit: item.usage_limit ? String(item.usage_limit) : "",
      is_active: item.is_active !== false, starts_at: item.starts_at?.slice(0, 16) || "", ends_at: item.ends_at?.slice(0, 16) || "",
    } : empty);
    setOpen(true);
  }

  async function save() {
    const payload = { ...form, value: form.value, min_order_amount: form.min_order_amount, usage_limit: form.usage_limit ? Number(form.usage_limit) : null };
    try {
      if (editing) await api.patch(`/admin/discounts/${editing.id}/`, payload);
      else await api.post("/admin/discounts/", payload);
      setOpen(false); list.reload(); toast("Discount saved", undefined, "success");
    } catch (err) { toast("Save failed", errorMessage(err), "error"); }
  }

  return (
    <div>
      <AdminHeader title="Discounts" action={canCreate ? <Button size="sm" onClick={() => start()}>New code</Button> : undefined} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Code", "Type", "Value", "Active", ""]}
        rows={list.rows.map((d) => [
          d.code, d.discount_type, d.value, d.is_active === false ? "No" : "Yes",
          <span key="a" className="flex gap-3">
            <button type="button" onClick={() => start(d)}>Edit</button>
            {canDelete ? <button type="button" onClick={() => setRemoveId(d.id)}>Delete</button> : null}
          </span>,
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <Drawer open={open} title="Discount" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Code"><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Type">
            <Select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed JOD</option>
            </Select>
          </Field>
          <Field label="Value"><Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
          <Field label="Min order"><Input value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} /></Field>
          <Field label="Usage limit"><Input value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} /></Field>
          <Checkbox label="Active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <Button type="button" onClick={save}>Save</Button>
        </div>
      </Drawer>
      <ConfirmModal open={removeId !== null} title="Delete discount?" danger onClose={() => setRemoveId(null)} onConfirm={async () => {
        if (!removeId) return;
        try { await api.delete(`/admin/discounts/${removeId}/`); list.reload(); } catch (err) { toast("Delete failed", errorMessage(err), "error"); }
        setRemoveId(null);
      }} />
    </div>
  );
}
