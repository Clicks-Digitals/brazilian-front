"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { ConfirmModal, Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Announcement } from "@/types/api";

const empty = { text: "", link_url: "", is_active: true, dismissible: true, display_order: "0", starts_at: "", ends_at: "" };

export default function AnnouncementsPage() {
  const list = useAdminList<Announcement>("/admin/announcements/");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState(empty);
  const [removeId, setRemoveId] = useState<number | null>(null);

  function start(item?: Announcement) {
    setEditing(item || null);
    setForm(item ? {
      text: item.text, link_url: item.link_url || "", is_active: item.is_active !== false, dismissible: item.dismissible !== false,
      display_order: String(item.display_order ?? 0), starts_at: item.starts_at?.slice(0, 16) || "", ends_at: item.ends_at?.slice(0, 16) || "",
    } : empty);
    setOpen(true);
  }

  async function save() {
    const payload = { ...form, display_order: Number(form.display_order) };
    try {
      if (editing) await api.patch(`/admin/announcements/${editing.id}/`, payload);
      else await api.post("/admin/announcements/", payload);
      setOpen(false); list.reload(); toast("Announcement saved", undefined, "success");
    } catch (err) { toast("Save failed", errorMessage(err), "error"); }
  }

  return (
    <div>
      <AdminHeader title="Announcements" action={<Button size="sm" onClick={() => start()}>New</Button>} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Text", "Active", ""]}
        rows={list.rows.map((a) => [
          a.text,
          a.is_active === false ? "No" : "Yes",
          <span key="x" className="flex gap-3">
            <button type="button" onClick={() => start(a)}>Edit</button>
            <button type="button" onClick={() => setRemoveId(a.id)}>Delete</button>
          </span>,
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <Drawer open={open} title="Announcement" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Text"><Input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
          <Field label="Link"><Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></Field>
          <Field label="Starts"><Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></Field>
          <Field label="Ends"><Input type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></Field>
          <Checkbox label="Active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <Checkbox label="Dismissible" checked={form.dismissible} onChange={(e) => setForm({ ...form, dismissible: e.target.checked })} />
          <Button type="button" onClick={save}>Save</Button>
        </div>
      </Drawer>
      <ConfirmModal open={removeId !== null} title="Delete announcement?" danger onClose={() => setRemoveId(null)} onConfirm={async () => {
        if (!removeId) return;
        try { await api.delete(`/admin/announcements/${removeId}/`); list.reload(); } catch (err) { toast("Delete failed", errorMessage(err), "error"); }
        setRemoveId(null);
      }} />
    </div>
  );
}
