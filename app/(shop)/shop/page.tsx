import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCardSkeleton } from "@/components/ui/states";
import { ShopView } from "@/features/shop/shop-view";

export const metadata: Metadata = {
  title: "Shop",
  description: "Turkish, filter, espresso, Arabic, Rio House, and Caffitaly coffees from Brazilian Coffee House.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-16 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      }
    >
      <ShopView
        eyebrow="Collection"
        title="Shop coffee"
        description="Roasts for cezve, filter, espresso, and capsule — sourced from Brazil and other origins."
      />
    </Suspense>
  );
}
