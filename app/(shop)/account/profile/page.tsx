"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { useAuthStore } from "@/features/account/auth-store";
import { toast } from "@/features/ui/toast-store";
import type { AuthUser } from "@/types/api";

export default function ProfilePage() {
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    marketing_opt_in: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<AuthUser>("/account/").then((user) => {
      setUser(user);
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        marketing_opt_in: Boolean(user.marketing_opt_in),
      });
    });
  }, [setUser]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const user = await api.patch<AuthUser>("/account/", form);
      setUser(user);
      toast("Profile saved", undefined, "success");
    } catch (err) {
      toast("Could not save", errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-lg space-y-4">
      <h1 className="text-3xl font-light">Profile</h1>
      <Field label="First name">
        <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
      </Field>
      <Field label="Last name">
        <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </Field>
      <Field label="Date of birth">
        <Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
      </Field>
      <Checkbox
        label="Hear about new lots by email"
        checked={form.marketing_opt_in}
        onChange={(e) => setForm({ ...form, marketing_opt_in: e.target.checked })}
      />
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
