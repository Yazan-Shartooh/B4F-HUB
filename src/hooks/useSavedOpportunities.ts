import { useCallback, useState } from "react";

/**
 * A genuine Hash Set. The only question this ever answers is "is this id
 * saved or not" — a native Set gives O(1) has()/add()/delete() with
 * guaranteed-unique membership, which is exactly the job. This lives only
 * on the frontend; there's no API endpoint for it.
 */
export function useSavedOpportunities() {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const toggleSaved = useCallback((id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((id: number) => savedIds.has(id), [savedIds]);

  return { savedIds, toggleSaved, isSaved };
}
