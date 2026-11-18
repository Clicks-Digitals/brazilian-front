const ARTICLE_SCENES: Record<string, string> = {
  "coffee-culture-in-amman": "/assets/editorial/world-map.jpg",
  "how-we-make-turkish-coffee": "/assets/editorial/turkish-cup.jpg",
  "from-the-mill-to-jordan": "/assets/editorial/mill-jordan.jpg",
};

export function articleCover(article: { slug?: string; cover_image?: string | null }) {
  if (article.slug && ARTICLE_SCENES[article.slug]) return ARTICLE_SCENES[article.slug];
  return article.cover_image || null;
}
