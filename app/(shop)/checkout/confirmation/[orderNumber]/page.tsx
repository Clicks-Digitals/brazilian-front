import type { Metadata } from "next";
import { ConfirmationView } from "@/features/cart/confirmation-view";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <ConfirmationView orderNumber={orderNumber} />;
}
