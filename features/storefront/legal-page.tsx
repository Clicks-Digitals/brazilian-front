import { ErrorState, PageHeader } from "@/components/ui/states";
import { isProbablyHtml, sanitizeHtml } from "@/lib/html";
import { errorMessage } from "@/lib/http";
import { serverGet } from "@/lib/server-get";
import type { LegalPage } from "@/types/api";

const FALLBACK: Record<string, string> = {
  privacy:
    "Brazilian Coffee House respects your privacy. Account data, addresses, and orders are used to fulfil purchases and improve the house. We do not sell personal information. Contact info@bch-coffee.com with requests.",
  terms:
    "Orders placed on this site are fulfilled by Brazilian Coffee House in Jordan. Prices are in JOD. Cash on delivery is currently the only checkout method. Stock and promotions are confirmed at dispatch.",
  shipping:
    "We deliver across Amman and selected cities in Jordan. Delivery fees are calculated at checkout from store settings. Branch pickup details are listed on Contact. Call 06 222 3330 for large orders.",
  returns:
    "Unopened retail packs in original condition may be returned according to store policy. Perishable opened coffee is generally not returnable. Write to info@bch-coffee.com or visit a branch with your receipt.",
};

export async function LegalPageView({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  try {
    const page = await serverGet<LegalPage>(`/pages/${slug}/`);
    const html = page.content
      ? isProbablyHtml(page.content)
        ? sanitizeHtml(page.content)
        : `<p>${page.content}</p>`
      : `<p>${FALLBACK[slug] || ""}</p>`;
    return (
      <>
        <PageHeader title={page.title || fallbackTitle} />
        <div className="prose-bch mx-auto max-w-3xl px-6 pb-24" dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error ? (error as { status: number }).status : 0;
    if (status === 404) {
      return (
        <>
          <PageHeader title={fallbackTitle} />
          <div className="prose-bch mx-auto max-w-3xl px-6 pb-24">
            <p>{FALLBACK[slug]}</p>
          </div>
        </>
      );
    }
    return <ErrorState description={errorMessage(error)} />;
  }
}
