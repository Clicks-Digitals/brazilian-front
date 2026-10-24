import { serverGet } from "@/lib/server-get";
import { asList, normalizeSettings } from "@/lib/settings";
import type { Announcement, Category, StorefrontPayload, StoreSettings } from "@/types/api";

export type ChromeData = {
  announcements: Announcement[];
  categories: Category[];
  settings: StoreSettings;
};

export async function getChrome(): Promise<ChromeData> {
  const empty: ChromeData = { announcements: [], categories: [], settings: normalizeSettings({}) };
  try {
    const [storefront, categories, settings] = await Promise.all([
      serverGet<StorefrontPayload>("/storefront/").catch(() => null),
      serverGet("/categories/").catch(() => null),
      serverGet("/settings/").catch(() => null),
    ]);
    return {
      announcements: storefront?.announcements || [],
      categories: (storefront?.categories || asList<Category>(categories)).filter(
        (c) => c.is_active !== false,
      ),
      settings: normalizeSettings(storefront?.settings || settings || {}),
    };
  } catch {
    return empty;
  }
}

export async function getStorefront(): Promise<StorefrontPayload> {
  return serverGet<StorefrontPayload>("/storefront/", undefined, 20);
}
