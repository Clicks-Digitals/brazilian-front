"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select } from "@/components/ui/field";
import { Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { asList } from "@/lib/settings";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { AdminRole, AuthUser } from "@/types/api";

export default function UsersPage() {
  const list = useAdminList<AuthUser>("/admin/users/");
  const canCreate = useCan("users.create");
  const canEdit = useCan("users.edit");
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [form, setForm] = useState({
    email: "", first_name: "", last_name: "", password: "", user_type: "staff", is_staff: true, is_active: true, role: "",
  });

  useEffect(() => {
    api.get("/admin/roles/").then((data) => setRoles(asList<AdminRole>(data))).catch(() => undefined);
  }, []);

  function start(user?: AuthUser) {
    setEditing(user || null);
    setForm(user ? {
      email: user.email, first_name: user.first_name || "", last_name: user.last_name || "", password: "",
      user_type: user.user_type || "staff", is_staff: user.is_staff !== false, is_active: true,
      role: user.role ? String(user.role.id) : "",
    } : { email: "", first_name: "", last_name: "", password: "", user_type: "staff", is_staff: true, is_active: true, role: "" });
    setOpen(true);
  }

  async function save() {
    const payload = { ...form, role: form.role ? Number(form.role) : null };
    try {
      if (editing) {
        const body = { ...payload } as Record<string, unknown>;
        if (!form.password) delete body.password;
        await api.patch(`/admin/users/${editing.id}/`, body);
      } else {
        await api.post("/admin/users/", payload);
      }
      setOpen(false); list.reload(); toast("User saved", undefined, "success");
    } catch (err) { toast("Save failed", errorMessage(err), "error"); }
  }

  return (
    <div>
      <AdminHeader title="Users" action={canCreate ? <Button size="sm" onClick={() => start()}>New user</Button> : undefined} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Email", "Role", "Staff", ""]}
        rows={list.rows.map((u) => [
          u.email,
          u.role?.name || u.user_type || "—",
          u.is_staff ? "Yes" : "No",
          canEdit ? <button type="button" onClick={() => start(u)}>Edit</button> : "",
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <Drawer open={open} title={editing ? "Edit user" : "New user"} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="First name"><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></Field>
          <Field label="Last name"><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></Field>
          <Field label="Password" hint={editing ? "Leave blank to keep the current password" : undefined}>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="">None</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </Field>
          <Checkbox label="Staff" checked={form.is_staff} onChange={(e) => setForm({ ...form, is_staff: e.target.checked })} />
          <Button type="button" onClick={save}>Save</Button>
        </div>
      </Drawer>
    </div>
  );
}
