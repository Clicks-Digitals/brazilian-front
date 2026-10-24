"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { ConfirmModal, Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable, AdminThumb } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Banner } from "@/types/api";

const empty = {
  title: "", subtitle: "", cta_label: "", cta_url: "", secondary_cta_label: "", secondary_cta_url: "",
  alignment: "left", placement: "hero", is_active: true, display_order: "0", starts_at: "", ends_at: "",
};

export default function BannersPage() {
  const list = useAdminList<Banner>("/admin/banners/");
  const canCreate = useCan("banners.create");
  const canEdit = useCan("banners.edit");
  const canDelete = useCan("banners.delete");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(empty);
  const [desktop, setDesktop] = useState<File | null>(null);
  const [mobile, setMobile] = useState<File | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);

  function start(banner?: Banner) {
    setEditing(banner || null);
    setForm(banner ? {
      title: banner.title, subtitle: banner.subtitle || "", cta_label: banner.cta_label || "", cta_url: banner.cta_url || "",
      secondary_cta_label: banner.secondary_cta_label || "", secondary_cta_url: banner.secondary_cta_url || "",
      alignment: banner.alignment || "left", placement: banner.placement || "hero", is_active: banner.is_active !== false,
      display_order: String(banner.display_order ?? 0), starts_at: banner.starts_at?.slice(0, 16) || "", ends_at: banner.ends_at?.slice(0, 16) || "",
    } : empty);
    setDesktop(null); setMobile(null); setOpen(true);
  }

  async function save() {
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== "") body.append(k, String(v)); });
    body.set("display_order", form.display_order);
    body.set("is_active", String(form.is_active));
    if (desktop) body.append("desktop_image", desktop);
    if (mobile) body.append("mobile_image", mobile);
    try {
      if (editing) await api.patch(`/admin/banners/${editing.id}/`, body);
      else await api.post("/admin/banners/", body);
      setOpen(false); list.reload(); toast("Banner saved", undefined, "success");
    } catch (err) { toast("Save failed", errorMessage(err), "error"); }
  }

  return (
    <div>
      <AdminHeader title="Banners" action={canCreate ? <Button size="sm" onClick={() => start()}>New banner</Button> : undefined} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Banner", "Placement", "Active", ""]}
        rows={list.rows.map((b) => [
          <span key="n" className="flex items-center gap-3">
            <AdminThumb src={b.desktop_image || b.mobile_image} alt={b.title} wide />
            {b.title}
          </span>,
          b.placement || "hero",
          b.is_active === false ? "No" : "Yes",
          <span key="a" className="flex gap-3">
            {canEdit ? <button type="button" onClick={() => start(b)}>Edit</button> : null}
            {canDelete ? <button type="button" onClick={() => setRemoveId(b.id)}>Delete</button> : null}
          </span>,
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <Drawer open={open} title={editing ? "Edit banner" : "New banner"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Subtitle"><Textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
          <Field label="CTA label"><Input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} /></Field>
          <Field label="CTA URL"><Input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} /></Field>
          <Field label="Placement">
            <Select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
              <option value="hero">Hero</option>
              <option value="promo">Promo</option>
              <option value="category">Category</option>
            </Select>
          </Field>
          <Field label="Alignment">
            <Select value={form.alignment} onChange={(e) => setForm({ ...form, alignment: e.target.value })}>
              <option>left</option><option>center</option><option>right</option>
            </Select>
          </Field>
          <Field label="Starts"><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></Field>
          <Field label="Ends"><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></Field>
          <Field label="Order"><Input value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} /></Field>
          <Checkbox label="Active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <FileUpload label="Desktop image" onFile={setDesktop} />
          <FileUpload label="Mobile image" onFile={setMobile} />
          <Button type="button" onClick={save}>Save</Button>
        </div>
      </Drawer>
      <ConfirmModal open={removeId !== null} title="Delete banner?" danger onClose={() => setRemoveId(null)} onConfirm={async () => {
        if (!removeId) return;
        try { await api.delete(`/admin/banners/${removeId}/`); list.reload(); } catch (err) { toast("Delete failed", errorMessage(err), "error"); }
        setRemoveId(null);
      }} />
    </div>
  );
}
