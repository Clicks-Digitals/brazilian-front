"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { asList } from "@/lib/settings";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { AdminRole } from "@/types/api";

type Permission = { id: number; code: string };

export default function RolesPage() {
  const list = useAdminList<AdminRole>("/admin/roles/");
  const canEdit = useCan("roles.edit");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRole | null>(null);
  const [allPerms, setAllPerms] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    api.get("/admin/permissions/").then((data) => setAllPerms(asList<Permission>(data))).catch(() => undefined);
  }, []);

  function start(role?: AdminRole) {
    setEditing(role || null);
    setForm(role ? { name: role.name, slug: role.slug, description: role.description || "" } : { name: "", slug: "", description: "" });
    const codes = (role?.permissions || []).map((p) => (typeof p === "string" ? p : p.code));
    setSelected(codes);
    setOpen(true);
  }

  async function save() {
    const payload = { ...form, permissions: selected };
    try {
      if (editing) await api.patch(`/admin/roles/${editing.id}/`, payload);
      else await api.post("/admin/roles/", payload);
      setOpen(false); list.reload(); toast("Role saved", undefined, "success");
    } catch (err) { toast("Save failed", errorMessage(err), "error"); }
  }

  return (
    <div>
      <AdminHeader title="Roles" action={canEdit ? <Button size="sm" onClick={() => start()}>New role</Button> : undefined} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Name", "Slug", ""]}
        rows={list.rows.map((r) => [
          r.name, r.slug,
          canEdit && !r.is_system ? <button type="button" onClick={() => start(r)}>Edit</button> : r.is_system ? "System" : "",
        ])}
      />
      <Drawer open={open} title="Role" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          {allPerms.length ? (
            <div className="max-h-64 space-y-1 overflow-y-auto text-sm">
              {allPerms.map((p) => (
                <label key={p.code} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.code)}
                    onChange={(e) => setSelected(e.target.checked ? [...selected, p.code] : selected.filter((c) => c !== p.code))}
                  />
                  {p.code}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Assign permission codes after the API publishes /admin/permissions/.</p>
          )}
          <Button type="button" onClick={save} disabled={!canEdit}>Save</Button>
        </div>
      </Drawer>
    </div>
  );
}
