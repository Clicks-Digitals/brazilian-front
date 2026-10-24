import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ErrorState } from "@/components/ui/states";
import { SmartImage } from "@/components/ui/smart-image";
import { ProductGrid } from "@/features/shop/product-card";
import { articleCover } from "@/lib/article-media";
import { formatDate } from "@/lib/format";
import { isProbablyHtml, sanitizeHtml } from "@/lib/html";
import { errorMessage } from "@/lib/http";
import { serverGet } from "@/lib/server-get";
import type { Article } from "@/types/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await serverGet<Article>(`/articles/${slug}/`);
    return {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
    };
  } catch {
    return { title: "Articles" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  try {
    const article = await serverGet<Article>(`/articles/${slug}/`);
    const html = article.content
      ? isProbablyHtml(article.content)
        ? sanitizeHtml(article.content)
        : sanitizeHtml(article.content.split("\n").map((p) => `<p>${p}</p>`).join(""))
      : "";
    const related = (article.related_products || []).slice(0, 3);
    const cover = articleCover(article);
    return (
      <>
        <article className="mx-auto max-w-3xl px-6 pb-8 pt-12 md:pt-16" data-reveal>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: article.title,
                datePublished: article.published_at,
                image: cover,
              }),
            }}
          />
          <p className="text-sm text-muted">
            <Link href="/articles" className="hover:text-forest">
              Articles
            </Link>
          </p>
          <p className="eyebrow mt-6 text-gold">{formatDate(article.published_at)}</p>
          <h1 className="font-display mt-3 text-4xl md:text-5xl">{article.title}</h1>
          {article.excerpt ? <p className="font-subtitle mt-4 text-lg text-muted">{article.excerpt}</p> : null}
          {cover ? (
            <SmartImage
              src={cover}
              alt={article.title}
              fit="cover"
              className="mt-10 aspect-[3/4] w-full bg-linen"
            />
          ) : null}
          <div className="prose-bch mt-10" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        {related.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 pb-24 pt-8" data-reveal>
            <h2 className="font-display text-2xl md:text-3xl">Related coffees</h2>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </section>
        ) : null}
      </>
    );
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && (error as { status: number }).status === 404) {
      notFound();
    }
    return <ErrorState description={errorMessage(error)} />;
  }
}
