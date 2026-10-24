import type { ApiErrorPayload } from "@/types/api";

function publicHost(): string {
  const fromEnv = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].find((value) => value && !/localhost|127\.0\.0\.1/.test(value));
  if (!fromEnv) return "";
  return fromEnv.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function resolveApiBase(): string {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicit && !/localhost|127\.0\.0\.1/.test(explicit)) {
    return explicit.replace(/\/$/, "");
  }
  const host = publicHost();
  if (host) return `https://${host}/api/v1`;
  return (explicit || "http://localhost:8000/api/v1").replace(/\/$/, "");
}

export const API_BASE = resolveApiBase();

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown;

  constructor(message: string, status = 500, code = "error", details: unknown = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type Query = Record<string, string | number | boolean | undefined | null>;

export function joinApi(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${suffix}`;
}

export function withQuery(path: string, query?: Query): string {
  const url = joinApi(path);
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url;
}

export function parseError(data: unknown, status: number, fallback: string): ApiError {
  const payload = (data || {}) as ApiErrorPayload;
  const message = payload.error?.message || payload.detail || payload.message || fallback;
  return new ApiError(
    String(message),
    status,
    payload.error?.code || "error",
    payload.error?.details || payload,
  );
}

export async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function errorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
