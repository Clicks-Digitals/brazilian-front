const ARTICLE_SCENES: Record<string, string> = {
  "coffee-culture-in-amman": "/assets/editorial/cafe.jpg",
  "how-we-make-turkish-coffee": "/assets/editorial/tray.jpg",
  "from-the-mill-to-jordan": "/assets/editorial/beans.jpg",
};

export function articleCover(article: { slug?: string; cover_image?: string | null }) {
  if (article.slug && ARTICLE_SCENES[article.slug]) return ARTICLE_SCENES[article.slug];
  return article.cover_image || null;
}
