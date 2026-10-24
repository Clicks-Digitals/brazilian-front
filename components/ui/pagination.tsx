import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  pageSize,
  count,
  onPage,
  className,
}: {
  page: number;
  pageSize: number;
  count: number;
  onPage: (page: number) => void;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(count / pageSize));
  if (count === 0) return null;
  return (
    <div className={cn("flex items-center justify-center gap-3 pt-10", className)}>
      <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted">
        {page} / {pages}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
