"use client";

import { useParams } from "next/navigation";
import { ArticleForm } from "@/features/admin/article-form";

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-light">Edit article</h1>
      <ArticleForm articleId={params.id} />
    </div>
  );
}
