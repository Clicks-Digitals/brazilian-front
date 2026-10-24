import { LegalPageView } from "@/features/storefront/legal-page";

export const metadata = { title: "Shipping" };

export default function ShippingPage() {
  return <LegalPageView slug="shipping" fallbackTitle="Shipping" />;
}
