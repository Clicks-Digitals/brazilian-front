"use client";

import type { ReactNode } from "react";
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
      <div className="rounded-2xl bg-white px-5 py-10 text-sm text-muted">
        {empty || "No records yet."}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-5 py-3.5 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-ink/6">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3.5 align-top">
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
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-center justify-between gap-3")}>
      <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
      {action}
    </div>
  );
}
