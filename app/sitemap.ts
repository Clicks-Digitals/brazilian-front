import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/brand";
import { serverGet } from "@/lib/server-get";
import { asList } from "@/lib/settings";
import type { Article, Category, Product } from "@/types/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/articles",
    "/contact",
    "/privacy",
    "/terms",
    "/shipping",
    "/returns",
  ].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
  }));

  try {
    const [products, categories, articles] = await Promise.all([
      serverGet("/products/", { page_size: 100 }).catch(() => ({ results: [] })),
      serverGet("/categories/").catch(() => ({ results: [] })),
      serverGet("/articles/").catch(() => ({ results: [] })),
    ]);
    return [
      ...staticRoutes,
      ...asList<Product>(products).map((p) => ({ url: `${SITE_URL}/products/${p.slug}` })),
      ...asList<Category>(categories).map((c) => ({ url: `${SITE_URL}/shop/${c.slug}` })),
      ...asList<Article>(articles).map((a) => ({ url: `${SITE_URL}/articles/${a.slug}` })),
    ];
  } catch {
    return staticRoutes;
  }
}
