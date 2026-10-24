"use client";

import { api } from "@/lib/api";
import { useAuthStore } from "@/features/account/auth-store";
import type { AuthTokens, AuthUser } from "@/types/api";

function applySession(data: AuthTokens | (AuthTokens & { user?: AuthUser })) {
  const access = data.access;
  const refresh = data.refresh;
  if (!access || !refresh) {
    throw new Error("The server did not return authentication tokens.");
  }
  useAuthStore.getState().setSession(access, refresh, data.user || null);
}

export async function loginWithPassword(email: string, password: string, admin = false) {
  if (admin) {
    try {
      const data = await api.post<AuthTokens>("/admin/auth/login/", { email, password }, { auth: false });
      applySession(data);
      await hydrateUser();
      if (!useAuthStore.getState().isStaff()) {
        useAuthStore.getState().clear();
        throw new Error("This account does not have staff access.");
      }
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("staff")) throw error;
    }
  }

  const data = await api.post<AuthTokens>("/auth/login/", { email, password }, { auth: false });
  applySession(data);
  await hydrateUser();
  if (admin && !useAuthStore.getState().isStaff()) {
    useAuthStore.getState().clear();
    throw new Error("This account does not have staff access.");
  }
}

export async function registerAccount(payload: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  const data = await api.post<AuthTokens>("/auth/register/", payload, { auth: false });
  if (data.access && data.refresh) {
    applySession(data);
    await hydrateUser();
  }
  return data;
}

export async function hydrateUser() {
  try {
    const user = await api.get<AuthUser>("/account/");
    useAuthStore.getState().setUser(user);
  } catch {
    /* login payload may already include the user */
  }
}

export async function logoutSession() {
  const refresh = useAuthStore.getState().refresh;
  try {
    if (refresh) await api.post("/auth/logout/", { refresh });
  } catch {
    /* still clear locally */
  }
  useAuthStore.getState().clear();
}
