"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  token: string | null;
  itemCount: number;
  hydrated: boolean;
  setToken: (token: string | null) => void;
  setItemCount: (count: number) => void;
  setFromCart: (token?: string | null, itemCount?: number) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      token: null,
      itemCount: 0,
      hydrated: false,
      setToken: (token) => set({ token }),
      setItemCount: (itemCount) => set({ itemCount }),
      setFromCart: (token, itemCount) =>
        set((state) => ({
          token: token || state.token,
          itemCount: itemCount ?? state.itemCount,
        })),
      clear: () => set({ token: null, itemCount: 0 }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "bch-cart",
      partialize: (state) => ({ token: state.token, itemCount: state.itemCount }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
