"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/api";

type CartState = {
  token: string | null;
  itemCount: number;
  items: CartItem[];
  hydrated: boolean;
  setToken: (token: string | null) => void;
  setItemCount: (count: number) => void;
  setItems: (items: CartItem[]) => void;
  setFromCart: (token?: string | null, itemCount?: number, items?: CartItem[]) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      token: null,
      itemCount: 0,
      items: [],
      hydrated: false,
      setToken: (token) => set({ token }),
      setItemCount: (itemCount) => set({ itemCount }),
      setItems: (items) =>
        set({
          items,
          itemCount: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
        }),
      setFromCart: (token, itemCount, items) =>
        set((state) => ({
          token: token || state.token,
          items: items ?? state.items,
          itemCount:
            itemCount ??
            (items ? items.reduce((sum, item) => sum + (item.quantity || 0), 0) : state.itemCount),
        })),
      clear: () => set({ token: null, itemCount: 0, items: [] }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "bch-cart",
      partialize: (state) => ({ token: state.token, itemCount: state.itemCount, items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.items?.length) {
          state.setItemCount(0);
          state.setToken(null);
        }
        state?.setHydrated(true);
      },
    },
  ),
);
