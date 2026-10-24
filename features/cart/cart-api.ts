"use client";

import { api } from "@/lib/api";
import { useCartStore } from "@/features/cart/cart-store";
import { itemCount } from "@/lib/settings";
import type { Cart } from "@/types/api";

function sync(cart: Cart) {
  useCartStore.getState().setFromCart(cart.token, itemCount(cart));
  return cart;
}

export async function fetchCart(): Promise<Cart> {
  const cart = await api.get<Cart>("/cart/");
  return sync(cart);
}

export async function addToCart(variantId: number, quantity = 1): Promise<Cart> {
  const cart = await api.post<Cart>("/cart/", { variant_id: variantId, quantity });
  return sync(cart);
}

export async function updateCartItem(id: number, quantity: number): Promise<Cart> {
  const cart = await api.patch<Cart>(`/cart/items/${id}/`, { quantity });
  return sync(cart);
}

export async function removeCartItem(id: number): Promise<Cart> {
  const cart = await api.delete<Cart>(`/cart/items/${id}/`);
  return sync(cart);
}

export async function applyDiscountCode(code: string): Promise<Cart> {
  const token = useCartStore.getState().token;
  await api.post("/discounts/validate/", { code, cart_token: token });
  const cart = await api.post<Cart>("/cart/", { discount_code: code });
  return sync(cart);
}
