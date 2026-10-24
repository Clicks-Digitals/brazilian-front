"use client";

import { useState } from "react";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/modal";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { AuthUser } from "@/types/api";

export default function CustomersPage() {
  const list = useAdminList<AuthUser>("/admin/customers/");
  const canEdit = useCan("customers.edit");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<AuthUser | null>(null);
  const [notes, setNotes] = useState("");

  return (
    <div>
      <AdminHeader title="Customers" />
      <Input className="mb-4 max-w-sm" placeholder="Search" value={list.search} onChange={(e) => list.setSearch(e.target.value)} />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Email", "Name", "Joined", ""]}
        rows={list.rows.map((c) => [
          c.email,
          `${c.first_name || ""} ${c.last_name || ""}`.trim() || "—",
          formatDate((c as AuthUser & { date_joined?: string }).date_joined),
          canEdit ? (
            <button
              type="button"
              onClick={() => {
                setCurrent(c);
                setNotes((c as AuthUser & { notes_internal?: string }).notes_internal || "");
                setOpen(true);
              }}
            >
              Notes
            </button>
          ) : (
            ""
          ),
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <Drawer open={open} title={current?.email || "Customer"} onClose={() => setOpen(false)}>
        <Field label="Internal notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          className="mt-4"
          type="button"
          disabled={!canEdit || !current}
          onClick={async () => {
            if (!current) return;
            try {
              await api.patch(`/admin/customers/${current.id}/`, { notes_internal: notes });
              toast("Customer updated", undefined, "success");
              setOpen(false);
              list.reload();
            } catch (err) {
              toast("Update failed", errorMessage(err), "error");
            }
          }}
        >
          Save notes
        </Button>
      </Drawer>
    </div>
  );
}
