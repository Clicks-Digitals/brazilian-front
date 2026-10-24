"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { ConfirmModal, Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable, AdminThumb } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Category } from "@/types/api";

const empty = { name: "", name_ar: "", slug: "", description: "", show_in_nav: true, is_active: true, display_order: "0" };

export default function CategoriesPage() {
  const list = useAdminList<Category>("/admin/categories/");
  const canCreate = useCan("categories.create");
  const canEdit = useCan("categories.edit");
  const canDelete = useCan("categories.delete");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);

  function start(category?: Category) {
    setEditing(category || null);
    setForm(
      category
        ? {
            name: category.name,
            name_ar: category.name_ar || "",
            slug: category.slug,
            description: category.description || "",
            show_in_nav: category.show_in_nav !== false,
            is_active: category.is_active !== false,
            display_order: String(category.display_order ?? 0),
          }
        : empty,
    );
    setFile(null);
    setOpen(true);
  }

  async function save() {
    const body = new FormData();
    Object.entries({ ...form, display_order: Number(form.display_order) }).forEach(([k, v]) => body.append(k, String(v)));
    if (file) body.append("image", file);
    try {
      if (editing) await api.patch(`/admin/categories/${editing.id}/`, body);
      else await api.post("/admin/categories/", body);
      setOpen(false);
      list.reload();
      toast("Category saved", undefined, "success");
    } catch (err) {
      toast("Save failed", errorMessage(err), "error");
    }
  }

  return (
    <div>
      <AdminHeader title="Categories" action={canCreate ? <Button size="sm" onClick={() => start()}>New category</Button> : undefined} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Category", "Slug", "Nav", ""]}
        rows={list.rows.map((c) => [
          <span key="n" className="flex items-center gap-3">
            <AdminThumb src={c.image} alt={c.name} />
            {c.name}
          </span>,
          c.slug,
          c.show_in_nav === false ? "Hidden" : "Yes",
          <span key="a" className="flex gap-3">
            {canEdit ? <button type="button" onClick={() => start(c)}>Edit</button> : null}
            {canDelete ? <button type="button" onClick={() => setRemoveId(c.id)}>Delete</button> : null}
          </span>,
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <Drawer open={open} title={editing ? "Edit category" : "New category"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Arabic"><Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></Field>
          <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Order"><Input value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} /></Field>
          <Checkbox label="Show in nav" checked={form.show_in_nav} onChange={(e) => setForm({ ...form, show_in_nav: e.target.checked })} />
          <Checkbox label="Active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <FileUpload label="Image" onFile={setFile} />
          <Button type="button" onClick={save} disabled={!canCreate && !canEdit}>Save</Button>
        </div>
      </Drawer>
      <ConfirmModal open={removeId !== null} title="Delete category?" danger onClose={() => setRemoveId(null)} onConfirm={async () => {
        if (!removeId) return;
        try { await api.delete(`/admin/categories/${removeId}/`); list.reload(); } catch (err) { toast("Delete failed", errorMessage(err), "error"); }
        setRemoveId(null);
      }} />
    </div>
  );
}
