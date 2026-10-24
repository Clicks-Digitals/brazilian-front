"use client";

import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { formatDate } from "@/lib/format";
import type { AuditLog } from "@/types/api";

export default function AuditPage() {
  const list = useAdminList<AuditLog>("/admin/audit-logs/");
  return (
    <div>
      <AdminHeader title="Audit log" />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["When", "Actor", "Action", "Entity"]}
        rows={list.rows.map((row) => [
          formatDate(row.created_at, true),
          typeof row.actor === "string" ? row.actor : row.actor?.email || "system",
          row.action,
          `${row.entity_type} ${row.entity_id || ""}`,
        ])}
        empty="No audit events yet."
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
    </div>
  );
}
