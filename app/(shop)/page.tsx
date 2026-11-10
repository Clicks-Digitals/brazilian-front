import { ReloadError } from "@/components/ui/reload-error";
import { HeroSlider } from "@/features/storefront/hero-slider";
import { PackJourney } from "@/features/storefront/pack-journey";
import {
  CategoryGrid,
  JournalGrid,
  NewsletterBand,
  ProductRail,
  PromoBanner,
} from "@/features/storefront/home-sections";
import { OriginsGlobe } from "@/features/storefront/origins-globe";
import { FeaturedShelf } from "@/features/storefront/featured-shelf";
import { BRAND, SITE_URL } from "@/lib/brand";
import { errorMessage } from "@/lib/http";
import { asList } from "@/lib/settings";
import { getStorefront } from "@/lib/storefront-data";
import type { Article, Banner, StorefrontPayload } from "@/types/api";

export default async function HomePage() {
  try {
    const data = await getStorefront().catch(() => ({} as StorefrontPayload));
    const heroes =
      data.hero_banners ||
      (data.banners || []).filter((b) => !b.placement || b.placement === "hero");
    const promos =
      data.promo_banners ||
      (data.banners || []).filter((b: Banner) => b.placement === "promo");
    const categories = data.featured_categories || data.categories || [];
    const journal = asList<Article>(data.journal || data.articles);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: BRAND.name,
              url: BRAND.website,
              telephone: BRAND.phone,
              email: BRAND.email,
              logo: `${SITE_URL}${BRAND.logo}`,
              foundingDate: String(BRAND.established),
            }),
          }}
        />
        <PackJourney>
          <div data-home-page>
            <HeroSlider banners={heroes} />
          </div>
          <CategoryGrid categories={categories} />
          <FeaturedShelf products={data.featured_products || []} />
          <PromoBanner banners={promos} />
        </PackJourney>
        <ProductRail
          products={data.new_products || []}
          href="/shop?ordering=-created_at"
        />
        <OriginsGlobe />
        <JournalGrid articles={journal} />
        <NewsletterBand />
      </>
    );
  } catch (error) {
    return (
      <ReloadError
        title="The storefront is unavailable"
        description={errorMessage(error, "We could not reach Brazilian Coffee House. Please try again shortly.")}
      />
    );
  }
}
