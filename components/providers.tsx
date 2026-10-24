"use client";

import { SessionBootstrap } from "@/features/cart/cart-bootstrap";
import { Toaster } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionBootstrap />
      {children}
      <Toaster />
    </>
  );
}
