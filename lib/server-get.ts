import { parseError, readBody, usesStorefrontSnapshot, withQuery, type Query } from "@/lib/http";
import { readSnapshot } from "@/lib/snapshot-catalog";

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
  const snapshot = readSnapshot(path, snapshotQuery(query));
  const preferSnapshot =
    process.env.USE_STOREFRONT_SNAPSHOT === "1" ||
    (process.env.USE_STOREFRONT_SNAPSHOT !== "0" &&
      (usesStorefrontSnapshot() || process.env.NODE_ENV === "production"));
  if (preferSnapshot && snapshot != null) {
    return snapshot as T;
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
  } catch (error) {
    if (snapshot != null) return snapshot as T;
    throw error;
  }
}
