import { parseError, readBody, withQuery, type Query } from "@/lib/http";
import { readSnapshot } from "@/lib/snapshot-catalog";

function shouldUseSnapshot(): boolean {
  if (process.env.USE_STOREFRONT_SNAPSHOT === "0") return false;
  if (process.env.USE_STOREFRONT_SNAPSHOT === "1") return true;
  if (!process.env.VERCEL) return false;
  const api = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return !api || /localhost|127\.0\.0\.1|vercel\.app/.test(api);
}

function snapshotQuery(query?: Query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query || {})) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  return params;
}

function fromSnapshot<T>(path: string, query?: Query): T {
  const payload = readSnapshot(path, snapshotQuery(query));
  if (payload == null) {
    throw parseError({ detail: "Not found." }, 404, "Unable to load this page right now.");
  }
  return payload as T;
}

export async function serverGet<T>(path: string, query?: Query, revalidate = 30): Promise<T> {
  if (shouldUseSnapshot()) {
    return fromSnapshot<T>(path, query);
  }
  try {
    const url = withQuery(path, query);
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    const data = await readBody(res);
    if (!res.ok) {
      throw parseError(data, res.status, "Unable to load this page right now.");
    }
    return data as T;
  } catch {
    return fromSnapshot<T>(path, query);
  }
}
