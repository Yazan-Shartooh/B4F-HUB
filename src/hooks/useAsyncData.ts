import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "loading" | "success" | "error";

/**
 * Custom hook (Independent Learning Challenge).
 *
 * Community and Opportunities each need the exact same loading/error/fetch
 * pattern: fetch on mount, track a loading flag, capture an error message,
 * expose the loaded data, and offer a way to retry. Rather than duplicate
 * that logic in both sections, it's extracted here into one hook that both
 * use.
 *
 * `fetcher` is wrapped in a ref so callers can pass an inline function
 * without re-triggering the effect on every render.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(() => {
    let cancelled = false;

    setStatus("loading");
    setError(null);

    fetcherRef.current().then(
      (result) => {
        if (cancelled) return;
        setData(result);
        setStatus("success");
      },
      (err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  return { data, setData, status, error, reload: load };
}
