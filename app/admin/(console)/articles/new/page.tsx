import { ArticleForm } from "@/features/admin/article-form";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-light">New article</h1>
      <ArticleForm />
    </div>
  );
}
