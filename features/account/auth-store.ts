"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types/api";

type AuthState = {
  access: string | null;
  refresh: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setTokens: (access: string, refresh?: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setSession: (access: string, refresh: string, user?: AuthUser | null) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
  hasPermission: (code: string) => boolean;
  isStaff: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,
      hydrated: false,
      setTokens: (access, refresh) =>
        set((state) => ({
          access,
          refresh: refresh === undefined ? state.refresh : refresh,
        })),
      setUser: (user) => set({ user }),
      setSession: (access, refresh, user) => set({ access, refresh, user: user ?? get().user }),
      clear: () => set({ access: null, refresh: null, user: null }),
      setHydrated: (value) => set({ hydrated: value }),
      hasPermission: (code) => {
        const user = get().user;
        if (!user) return false;
        if (user.is_superuser) return true;
        const perms = user.permissions || [];
        if (perms.length) return perms.includes(code);
        return Boolean(user.is_staff || user.user_type === "staff");
      },
      isStaff: () => {
        const user = get().user;
        if (!user) return false;
        return Boolean(user.is_staff || user.is_superuser || user.user_type === "staff");
      },
    }),
    {
      name: "bch-auth",
      partialize: (state) => ({
        access: state.access,
        refresh: state.refresh,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
