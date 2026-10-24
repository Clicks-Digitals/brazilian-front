import type { Metadata } from "next";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { CategoryIndex } from "@/features/storefront/category-index";
import { errorMessage } from "@/lib/http";
import { serverGet } from "@/lib/server-get";
import { asList } from "@/lib/settings";
import type { Category } from "@/types/api";

export const metadata: Metadata = {
  title: "Categories",
  description: "Shop Brazilian Coffee House by brew — Turkish, filter, espresso, Arabic, Rio House, drip, and Caffitaly.",
};

export default async function CategoriesPage() {
  try {
    const data = await serverGet("/categories/");
    const categories = asList<Category>(data).filter((c) => c.is_active !== false);

    return (
      <div className="bg-white">
        <header className="mx-auto max-w-7xl px-6 pb-8 pt-12 md:pt-16" data-reveal>
          <p className="eyebrow text-gold">Shop</p>
          <h1 className="font-display mt-3 text-4xl tracking-tight text-ink md:text-5xl">Categories</h1>
          <p className="font-subtitle mt-4 max-w-xl text-muted">
            Choose a brew and go through to the coffees in that collection.
          </p>
        </header>
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Collections will appear here once they are published." />
        ) : (
          <CategoryIndex categories={categories} />
        )}
      </div>
    );
  } catch (error) {
    return <ErrorState description={errorMessage(error)} />;
  }
}
