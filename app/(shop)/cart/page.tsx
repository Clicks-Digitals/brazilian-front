import type { Metadata } from "next";
import { CartPageClient } from "@/features/cart/cart-page";

export const metadata: Metadata = {
  title: "Bag",
  description: "Your Brazilian Coffee House bag.",
};

export default function CartPage() {
  return <CartPageClient />;
}
