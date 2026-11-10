import type { Metadata } from "next";
import { AboutView } from "@/features/storefront/about-view";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About us",
  description: BRAND.story,
};

export default function AboutPage() {
  return <AboutView />;
}
