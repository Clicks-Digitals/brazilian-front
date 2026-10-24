"use client";

import type { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { SmartImage } from "@/components/ui/smart-image";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/cn";

export function AdminThumb({
  src,
  alt,
  wide = false,
}: {
  src?: string | null;
  alt: string;
  wide?: boolean;
}) {
  return (
    <SmartImage
      src={src}
      alt={alt}
      fit={wide ? "cover" : "contain"}
      className={cn("shrink-0 bg-linen", wide ? "h-14 w-24 rounded-xl" : "size-14 rounded-xl")}
      imgClassName={wide ? "" : "p-1.5"}
    />
  );
}

export function AdminTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-ink/6 bg-white px-5 py-12 text-center text-sm text-muted shadow-sm">
        {empty || "No records yet."}
      </div>
    );
  }
  const actionCol = columns.length - 1;
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/6 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-ink/6 bg-linen/70 text-[11px] uppercase tracking-[0.14em] text-muted">
          <tr>
            {columns.map((column, j) => (
              <th
                key={column || j}
                className={cn("px-5 py-3.5 font-medium", j === actionCol && column === "" && "text-right")}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-ink/5 transition hover:bg-linen/35">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn("px-5 py-3.5 align-middle", j === actionCol && "text-right whitespace-nowrap")}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminPager(props: {
  page: number;
  pageSize: number;
  count: number;
  onPage: (page: number) => void;
}) {
  return <Pagination {...props} className="justify-start" />;
}

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink/8 pb-5")}>
      <div>
        <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
        {subtitle ? <p className="font-subtitle mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Input
      className={cn(
        "mb-4 max-w-md rounded-xl border-ink/10 bg-white shadow-sm focus:border-forest/40",
        className,
      )}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function AdminRowActions({
  editHref,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: {
  editHref?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  if (!canEdit && !canDelete) return null;
  return (
    <div className="inline-flex items-center gap-2">
      {canEdit && editHref ? (
        <Button
          href={editHref}
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 rounded-lg px-3 normal-case tracking-normal"
        >
          <Pencil className="size-3.5" strokeWidth={1.75} />
          Edit
        </Button>
      ) : null}
      {canEdit && !editHref && onEdit ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 rounded-lg px-3 normal-case tracking-normal"
          onClick={onEdit}
        >
          <Pencil className="size-3.5" strokeWidth={1.75} />
          Edit
        </Button>
      ) : null}
      {canDelete && onDelete ? (
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted transition hover:bg-red-50 hover:text-red-900"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" strokeWidth={1.75} />
          Delete
        </button>
      ) : null}
    </div>
  );
}

export function AdminFlagPills({ flags }: { flags: string[] }) {
  if (!flags.length) {
    return <span className="text-xs text-muted">Live</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {flags.map((flag) => (
        <span
          key={flag}
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
            flag === "Hidden" ? "bg-ink/8 text-muted" : "bg-forest/10 text-forest",
            flag === "New" && "bg-gold/25 text-forest-dark",
            flag === "Featured" && "bg-gold/20 text-forest-dark",
          )}
        >
          {flag}
        </span>
      ))}
    </div>
  );
}
