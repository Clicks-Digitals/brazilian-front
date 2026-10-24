import type { Metadata } from "next";
import { CheckoutPageClient } from "@/features/cart/checkout-page";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
