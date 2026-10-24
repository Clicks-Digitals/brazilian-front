"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/modal";
import { StatusPill } from "@/components/ui/status-pill";
import { ErrorState } from "@/components/ui/states";
import { AdminHeader, AdminPager, AdminRowActions, AdminTable, AdminThumb } from "@/features/admin/admin-table";
import { useAdminList } from "@/features/admin/use-list";
import { useCan } from "@/features/admin/admin-shell";
import { articleCover } from "@/lib/article-media";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Article } from "@/types/api";

export default function ArticlesPage() {
  const list = useAdminList<Article>("/admin/articles/");
  const canCreate = useCan("articles.create");
  const canEdit = useCan("articles.edit");
  const canDelete = useCan("articles.delete");
  const [removeId, setRemoveId] = useState<number | null>(null);

  return (
    <div>
      <AdminHeader
        title="Articles"
        subtitle="Journal posts and house stories."
        action={canCreate ? <Button href="/admin/articles/new" size="sm" className="rounded-lg">New article</Button> : undefined}
      />
      {list.error ? <ErrorState description={list.error} onRetry={list.reload} /> : null}
      <AdminTable
        columns={["Article", "Status", ""]}
        rows={list.rows.map((a) => [
          <Link key="t" href={`/admin/articles/${a.id}`} className="flex items-center gap-3 text-forest">
            <AdminThumb src={articleCover(a)} alt={a.title} wide />
            <span>{a.title}</span>
          </Link>,
          <StatusPill key="s" value={a.status} />,
          <AdminRowActions
            key="actions"
            editHref={`/admin/articles/${a.id}`}
            canEdit={canEdit}
            canDelete={canDelete}
            onDelete={() => setRemoveId(a.id)}
          />,
        ])}
      />
      <AdminPager page={list.page} pageSize={20} count={list.count} onPage={list.setPage} />
      <ConfirmModal open={removeId !== null} title="Delete article?" danger onClose={() => setRemoveId(null)} onConfirm={async () => {
        if (!removeId) return;
        try { await api.delete(`/admin/articles/${removeId}/`); list.reload(); } catch (err) { toast("Delete failed", errorMessage(err), "error"); }
        setRemoveId(null);
      }} />
    </div>
  );
}
