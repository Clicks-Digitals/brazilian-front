import type { Metadata } from "next";
import { ShopByCategory } from "@/features/shop/shop-by-category";

export const metadata: Metadata = {
  title: "Shop",
  description: "Turkish, filter, espresso, Arabic, Rio House, and Caffitaly coffees from Brazilian Coffee House.",
};

export default function ShopPage() {
  return <ShopByCategory />;
}
