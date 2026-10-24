"use client";

import { useCartStore } from "@/features/cart/cart-store";

export function useCartCount() {
  return useCartStore((s) => s.itemCount);
}
