"use client";

import { useAuthStore } from "@/features/account/auth-store";

export function useAuth() {
  return useAuthStore();
}
