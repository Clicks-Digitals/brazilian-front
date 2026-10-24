import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { SmartImage } from "@/components/ui/smart-image";
import { articleCover } from "@/lib/article-media";
import { formatDate } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import { serverGet } from "@/lib/server-get";
import { asPaginated } from "@/lib/settings";
import type { Article } from "@/types/api";

export const metadata: Metadata = {
  title: "Articles",
  description: "Stories from Brazilian Coffee House — roast, origin, and house notes.",
};

export default async function ArticlesPage() {
  try {
    const data = await serverGet("/articles/");
    const { results } = asPaginated<Article>(data);

    return (
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <header className="max-w-2xl pb-10 pt-12 md:pt-16" data-reveal>
          <p className="eyebrow text-gold">House</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-ink md:text-5xl">Articles</h1>
          <p className="font-subtitle mt-4 text-muted">Roast notes, origin stories, and life in the branches.</p>
        </header>

        {results.length === 0 ? (
          <EmptyState title="No articles yet" description="Articles will appear here when they are published." />
        ) : (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
            {results.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group transition duration-500 ease-out hover:-translate-y-1"
              >
                <div className="overflow-hidden border border-ink/8 bg-white">
                  <SmartImage
                    src={articleCover(article)}
                    alt={article.title}
                    fit="cover"
                    className="aspect-[3/4] w-full bg-linen"
                    imgClassName="transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-muted">
                  {formatDate(article.published_at)}
                </p>
                <h2 className="font-display mt-2 text-2xl group-hover:text-forest">{article.title}</h2>
                {article.excerpt ? (
                  <p className="font-subtitle mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt}</p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorState description={errorMessage(error)} />;
  }
}
