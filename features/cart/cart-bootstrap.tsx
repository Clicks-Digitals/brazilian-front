"use client";

import { useEffect } from "react";
import { fetchCart } from "@/features/cart/cart-api";
import { useCartStore } from "@/features/cart/cart-store";
import { useAuthStore } from "@/features/account/auth-store";
import { hydrateUser } from "@/features/account/auth-api";

export function SessionBootstrap() {
  const cartHydrated = useCartStore((s) => s.hydrated);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const access = useAuthStore((s) => s.access);

  useEffect(() => {
    if (!cartHydrated) return;
    fetchCart().catch(() => undefined);
  }, [cartHydrated]);

  useEffect(() => {
    if (!authHydrated || !access) return;
    hydrateUser().catch(() => undefined);
  }, [authHydrated, access]);

  return null;
}
