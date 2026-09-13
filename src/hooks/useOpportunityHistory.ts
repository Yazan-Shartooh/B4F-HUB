import { useCallback, useRef, useState } from "react";
import { Stack } from "../lib/dataStructures";

/**
 * A genuine Stack: whenever the user opens a different opportunity's detail
 * while one is already open, the one being left behind is pushed. "Back to
 * previous opportunity" pops the most recently left one — LIFO, one step at
 * a time, no dedupe, no cap.
 */
export function useOpportunityHistory() {
  const stackRef = useRef(new Stack<number>());
  const [openId, setOpenId] = useState<number | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const open = useCallback((id: number) => {
    setOpenId((current) => {
      if (current !== null && current !== id) {
        stackRef.current.push(current);
        setCanGoBack(true);
      }
      return id;
    });
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
  }, []);

  const goBack = useCallback(() => {
    const previous = stackRef.current.pop();
    setCanGoBack(!stackRef.current.isEmpty());
    if (previous !== undefined) {
      setOpenId(previous);
    }
  }, []);

  return { openId, open, close, goBack, canGoBack };
}
