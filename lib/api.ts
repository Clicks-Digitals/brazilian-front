"use client";

import { useAuthStore } from "@/features/account/auth-store";
import { useCartStore } from "@/features/cart/cart-store";
import {
  ApiError,
  errorMessage,
  joinApi,
  parseError,
  readBody,
  withQuery,
  type Query,
} from "@/lib/http";

export { ApiError, errorMessage, joinApi, withQuery };
export type { Query };

function captureCartToken(res: Response, data: unknown) {
  const headerToken = res.headers.get("X-Cart-Token") || res.headers.get("x-cart-token");
  const bodyToken =
    data && typeof data === "object" && "token" in data
      ? String((data as { token?: string }).token || "")
      : "";
  const token = headerToken || bodyToken;
  if (token) useCartStore.getState().setToken(token);
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccess(): Promise<boolean> {
  const refresh = useAuthStore.getState().refresh;
  if (!refresh) return false;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(joinApi("/auth/refresh/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refresh }),
      });
      const data = await readBody(res);
      if (!res.ok) {
        useAuthStore.getState().clear();
        return false;
      }
      const payload = data as { access?: string; refresh?: string };
      if (!payload.access) {
        useAuthStore.getState().clear();
        return false;
      }
      useAuthStore.getState().setTokens(payload.access, payload.refresh || refresh);
      return true;
    } catch {
      useAuthStore.getState().clear();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

export type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Query;
  auth?: boolean;
  cart?: boolean;
  headers?: Record<string, string>;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true, cart = true, headers = {} } = options;
  const url = withQuery(path, query);
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const initHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (!isForm && body !== undefined) initHeaders["Content-Type"] = "application/json";

  if (auth) {
    const access = useAuthStore.getState().access;
    if (access) initHeaders.Authorization = `Bearer ${access}`;
  }
  if (cart) {
    const token = useCartStore.getState().token;
    if (token) initHeaders["X-Cart-Token"] = token;
  }

  const fetchInit: RequestInit = {
    method,
    headers: initHeaders,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  };

  let res = await fetch(url, fetchInit);
  let data = await readBody(res);

  if (res.status === 401 && auth && !path.includes("/auth/")) {
    const ok = await refreshAccess();
    if (ok) {
      const access = useAuthStore.getState().access;
      if (access) initHeaders.Authorization = `Bearer ${access}`;
      res = await fetch(url, { ...fetchInit, headers: initHeaders });
      data = await readBody(res);
    }
  }

  captureCartToken(res, data);

  if (!res.ok) {
    throw parseError(data, res.status, res.statusText || "Request failed");
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, query?: Query, options?: Omit<RequestOptions, "method" | "query">) =>
    apiFetch<T>(path, { ...options, method: "GET", query }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
