import { LegalPageView } from "@/features/storefront/legal-page";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return <LegalPageView slug="returns" fallbackTitle="Returns" />;
}
