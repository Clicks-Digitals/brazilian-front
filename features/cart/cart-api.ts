"use client";

import { api, ApiError } from "@/lib/api";
import { useCartStore } from "@/features/cart/cart-store";
import { itemCount, pickImage } from "@/lib/settings";
import type { Cart, CartItem, Product } from "@/types/api";

const LOCAL_TOKEN = "local-bag";

function isUnreachable(error: unknown) {
  if (error instanceof ApiError && (error.status === 501 || error.status === 404 || error.status >= 500)) {
    return true;
  }
  if (error instanceof TypeError) return true;
  const message = error instanceof Error ? error.message : String(error || "");
  return /failed to fetch|network|load failed|econnrefused/i.test(message);
}

function money(value: number) {
  return value.toFixed(2);
}

function cartFromItems(items: CartItem[], token?: string | null): Cart {
  const subtotal = items.reduce((sum, item) => sum + Number(item.line_total || 0), 0);
  const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  return {
    token: token || LOCAL_TOKEN,
    items,
    item_count: count,
    subtotal: money(subtotal),
    total: money(subtotal),
    currency: "JOD",
  };
}

function localCart(): Cart {
  const { items, token } = useCartStore.getState();
  return cartFromItems(items || [], token);
}

function persistLocal(items: CartItem[]) {
  const cart = cartFromItems(items, LOCAL_TOKEN);
  useCartStore.getState().setFromCart(cart.token, cart.item_count, items);
  return cart;
}

function sync(cart: Cart) {
  useCartStore.getState().setFromCart(cart.token, itemCount(cart), cart.items || []);
  return cart;
}

function lineFromProduct(product: Product, variantId: number, quantity: number): CartItem | null {
  const variant =
    product.variants?.find((item) => item.id === variantId) ||
    (product.default_variant?.id === variantId ? product.default_variant : undefined);
  if (!variant) return null;
  const unit = Number(variant.price || product.min_price || 0);
  return {
    id: variantId,
    quantity,
    unit_price: variant.price,
    line_total: money(unit * quantity),
    product_name: product.name,
    product_slug: product.slug,
    variant_name: variant.name || variant.weight_label,
    sku: variant.sku || product.sku,
    image: pickImage(product) || variant.image || null,
    stock_quantity: variant.stock_quantity,
    variant,
    product: {
      id: product.id,
      name: product.name,
      name_ar: product.name_ar,
      slug: product.slug,
      primary_image: product.primary_image,
    },
  };
}

export async function fetchCart(): Promise<Cart> {
  try {
    return sync(await api.get<Cart>("/cart/"));
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    const cart = localCart();
    useCartStore.getState().setFromCart(cart.token, cart.item_count || 0, cart.items);
    return cart;
  }
}

export async function addToCart(variantId: number, quantity = 1, product?: Product): Promise<Cart> {
  try {
    return sync(await api.post<Cart>("/cart/", { variant_id: variantId, quantity }));
  } catch (error) {
    if (!isUnreachable(error) || !product) throw error;
    const current = [...(useCartStore.getState().items || [])];
    const existing = current.find((item) => item.id === variantId || (typeof item.variant === "object" && item.variant?.id === variantId));
    if (existing) {
      existing.quantity += quantity;
      existing.line_total = money(Number(existing.unit_price || 0) * existing.quantity);
    } else {
      const line = lineFromProduct(product, variantId, quantity);
      if (!line) throw error;
      current.push(line);
    }
    return persistLocal(current);
  }
}

export async function updateCartItem(id: number, quantity: number): Promise<Cart> {
  try {
    return sync(await api.patch<Cart>(`/cart/items/${id}/`, { quantity }));
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    const current = (useCartStore.getState().items || [])
      .map((item) =>
        item.id === id
          ? { ...item, quantity, line_total: money(Number(item.unit_price || 0) * quantity) }
          : item,
      )
      .filter((item) => item.quantity > 0);
    return persistLocal(current);
  }
}

export async function removeCartItem(id: number): Promise<Cart> {
  try {
    return sync(await api.delete<Cart>(`/cart/items/${id}/`));
  } catch (error) {
    if (!isUnreachable(error)) throw error;
    return persistLocal((useCartStore.getState().items || []).filter((item) => item.id !== id));
  }
}

export async function applyDiscountCode(code: string): Promise<Cart> {
  const token = useCartStore.getState().token;
  await api.post("/discounts/validate/", { code, cart_token: token });
  const cart = await api.post<Cart>("/cart/", { discount_code: code });
  return sync(cart);
}
