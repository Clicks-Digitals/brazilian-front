import { LegalPageView } from "@/features/storefront/legal-page";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return <LegalPageView slug="privacy" fallbackTitle="Privacy" />;
}
