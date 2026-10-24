import type { ReactNode } from "react";
import { SiteChrome } from "@/components/layout/site-chrome";
import { getChrome } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const chrome = await getChrome();
  return (
    <SiteChrome
      announcements={chrome.announcements}
      categories={chrome.categories}
      settings={chrome.settings}
    >
      {children}
    </SiteChrome>
  );
}
