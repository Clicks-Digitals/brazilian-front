"use client";

import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminTable } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { formatDate } from "@/lib/format";
import type { NewsletterSubscriber } from "@/types/api";

export default function NewsletterPage() {
  const list = useAdminList<NewsletterSubscriber>("/admin/newsletter/");
  return (
    <div>
      <AdminHeader title="Newsletter" />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Email", "Source", "Joined"]}
        rows={list.rows.map((row) => [
          row.email,
          row.source || "storefront",
          formatDate(row.consented_at, true),
        ])}
        empty="No subscribers yet."
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
    </div>
  );
}
