"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { errorMessage, type Query } from "@/lib/http";
import { asPaginated } from "@/lib/settings";

export function useAdminList<T>(path: string, extra?: Query) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const extraKey = JSON.stringify(extra || {});
  const extraQuery = useMemo(() => JSON.parse(extraKey) as Query, [extraKey]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.get(path, { page, page_size: 20, search: search || undefined, ...extraQuery });
      const pageData = asPaginated<T>(data);
      setRows(pageData.results);
      setCount(pageData.count);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [path, page, search, extraQuery]);

  useEffect(() => {
    load();
  }, [load]);

  return { page, setPage, search, setSearch, rows, count, loading, error, reload: load };
}
