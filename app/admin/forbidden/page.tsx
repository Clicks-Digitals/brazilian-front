import { Button } from "@/components/ui/button";

export const metadata = { title: "Forbidden", robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-gold">403</p>
      <h1 className="mt-3 text-3xl font-light">You do not have access</h1>
      <p className="mt-3 max-w-md text-muted">
        This console is for staff with the right permission. The server remains the source of truth.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/admin/login">Staff sign in</Button>
        <Button href="/" variant="secondary">
          Storefront
        </Button>
      </div>
    </div>
  );
}
