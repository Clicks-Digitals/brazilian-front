import { LegalPageView } from "@/features/storefront/legal-page";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return <LegalPageView slug="terms" fallbackTitle="Terms" />;
}
