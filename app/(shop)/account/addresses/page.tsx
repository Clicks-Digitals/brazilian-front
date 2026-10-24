"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/states";
import { ConfirmModal } from "@/components/ui/modal";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { asList } from "@/lib/settings";
import { toast } from "@/features/ui/toast-store";
import type { Address } from "@/types/api";

const empty = {
  label: "",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "Amman",
  area: "",
  country: "Jordan",
  delivery_instructions: "",
  is_default: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await api.get("/account/addresses/");
    setAddresses(asList<Address>(data));
  }

  useEffect(() => {
    load().catch((err) => toast("Could not load addresses", errorMessage(err), "error"));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (editing) await api.patch(`/account/addresses/${editing}/`, form);
      else await api.post("/account/addresses/", form);
      setForm(empty);
      setEditing(null);
      await load();
      toast("Address saved", undefined, "success");
    } catch (err) {
      toast("Could not save", errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-light">Addresses</h1>
      {addresses.length === 0 ? (
        <EmptyState title="No saved addresses" description="Add one for faster checkout." />
      ) : (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li key={address.id} className="flex items-start justify-between border border-ink/10 p-4">
              <div>
                <p className="font-medium">
                  {address.full_name} {address.is_default ? "· Default" : ""}
                </p>
                <p className="text-sm text-muted">
                  {address.line1}, {address.city}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(address.id);
                    setForm({
                      label: address.label || "",
                      full_name: address.full_name,
                      phone: address.phone,
                      line1: address.line1,
                      line2: address.line2 || "",
                      city: address.city,
                      area: address.area || "",
                      country: address.country || "Jordan",
                      delivery_instructions: address.delivery_instructions || "",
                      is_default: Boolean(address.is_default),
                    });
                  }}
                >
                  Edit
                </button>
                <button type="button" onClick={() => setRemoveId(address.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={save} className="grid max-w-xl gap-3">
        <h2 className="text-lg">{editing ? "Edit address" : "New address"}</h2>
        <Field label="Label">
          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </Field>
        <Field label="Full name">
          <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="Line 1">
          <Input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
        </Field>
        <Field label="City">
          <Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </Field>
        <Field label="Area">
          <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        </Field>
        <Checkbox
          label="Default address"
          checked={form.is_default}
          onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
        />
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save address"}
        </Button>
      </form>
      <ConfirmModal
        open={removeId !== null}
        title="Remove this address?"
        danger
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          if (!removeId) return;
          try {
            await api.delete(`/account/addresses/${removeId}/`);
            await load();
          } catch (err) {
            toast("Could not remove", errorMessage(err), "error");
          }
          setRemoveId(null);
        }}
      />
    </div>
  );
}
