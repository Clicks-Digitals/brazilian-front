import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCardSkeleton } from "@/components/ui/states";
import { ShopView } from "@/features/shop/shop-view";
import { serverGet } from "@/lib/server-get";
import type { Category } from "@/types/api";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  try {
    const data = await serverGet<Category>(`/categories/${category}/`);
    return {
      title: data.seo_title || data.name,
      description: data.seo_description || data.description || `Shop ${data.name} at Brazilian Coffee House.`,
    };
  } catch {
    return { title: "Shop" };
  }
}

export default async function CategoryShopPage({ params }: Props) {
  const { category } = await params;
  let title = category.replace(/-/g, " ");
  let description: string | undefined;
  try {
    const data = await serverGet<Category>(`/categories/${category}/`);
    title = data.name;
    description = data.description;
  } catch {
    /* still render the grid; API errors show inside ShopView */
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-16">
          <ProductCardSkeleton />
        </div>
      }
    >
      <ShopView lockedCategory={category} eyebrow="Category" title={title} description={description} />
    </Suspense>
  );
}
