"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";
import { toast } from "@/features/ui/toast-store";
import type { Article } from "@/types/api";

export function ArticleForm({ articleId }: { articleId?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    is_featured: false,
    published_at: "",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    if (!articleId) return;
    api.get<Article>(`/admin/articles/${articleId}/`).then((article) => {
      setForm({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        content: article.content || "",
        status: article.status || "draft",
        is_featured: Boolean(article.is_featured),
        published_at: article.published_at?.slice(0, 16) || "",
        seo_title: article.seo_title || "",
        seo_description: article.seo_description || "",
      });
    });
  }, [articleId]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "") body.append(k, String(v));
    });
    if (cover) body.append("cover_image", cover);
    try {
      const saved = articleId
        ? await api.patch<Article>(`/admin/articles/${articleId}/`, body)
        : await api.post<Article>("/admin/articles/", body);
      toast("Article saved", undefined, "success");
      if (!articleId) router.push(`/admin/articles/${saved.id}`);
    } catch (err) {
      toast("Save failed", errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="grid max-w-3xl gap-4">
      <Field label="Title"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
      <Field label="Excerpt"><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="min-h-20" /></Field>
      <Field label="Content">
        <Textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-56" />
      </Field>
      <Field label="Status">
        <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </Select>
      </Field>
      <Field label="Publish at"><Input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></Field>
      <Checkbox label="Featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
      <FileUpload label="Cover image" onFile={setCover} />
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save article"}</Button>
    </form>
  );
}
