import type { Metadata } from "next";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { CategoryCards } from "@/features/storefront/category-cards";
import { errorMessage } from "@/lib/http";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { serverGet } from "@/lib/server-get";
import { asList } from "@/lib/settings";
import type { Category } from "@/types/api";

export const metadata: Metadata = {
  title: "Categories",
  description: "Shop Brazilian Coffee House by brew — Turkish, filter, espresso, Arabic, Rio House, drip, and Caffitaly.",
};

export default async function CategoriesPage() {
  const locale = await getLocale();
  try {
    const data = await serverGet("/categories/");
    const categories = asList<Category>(data).filter((c) => c.is_active !== false);

    return (
      <div className="bg-forest pb-20">
        <header className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-12 md:pt-16" data-reveal>
          <p className="eyebrow text-gold">{t(locale, "shop")}</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-cream md:text-5xl">{t(locale, "categories")}</h1>
          <p className="font-subtitle mt-4 max-w-xl text-cream/75">
            {t(locale, "categoriesBlurb")}
          </p>
        </header>
        {categories.length === 0 ? (
          <EmptyState title={t(locale, "noCategories")} description={t(locale, "collectionsWillAppear")} />
        ) : (
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <CategoryCards categories={categories} />
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorState description={errorMessage(error)} />;
  }
}
