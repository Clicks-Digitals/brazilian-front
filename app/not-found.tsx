import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND.logo} alt="" className="mb-8 size-20" />
      <p className="eyebrow text-gold">404</p>
      <h1 className="font-display mt-3 text-4xl">This page is not on the shelf</h1>
      <p className="mt-4 max-w-md text-muted">
        The cup you were looking for has been moved, or never existed. Return to the house collection.
      </p>
      <div className="mt-8">
        <Button href="/">Back home</Button>
      </div>
    </div>
  );
}
