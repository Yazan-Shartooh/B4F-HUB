import { useCallback, useRef, useState } from "react";
import { Queue } from "../lib/dataStructures";

export interface AppNotification {
  id: number;
  kind: "success" | "error";
  message: string;
}

let nextNotificationId = 1;

/**
 * A genuine Queue: new notifications join the back with enqueue(), and only
 * the notification at the front is ever shown. Dismissing the one on screen
 * dequeues the next one, in the order it originally arrived.
 */
export function useNotificationQueue() {
  const queueRef = useRef(new Queue<AppNotification>());
  const [current, setCurrent] = useState<AppNotification | null>(null);

  const notify = useCallback((kind: AppNotification["kind"], message: string) => {
    const notification: AppNotification = { id: nextNotificationId++, kind, message };

    setCurrent((existing) => {
      if (existing) {
        // Something is already on screen — this one waits its turn.
        queueRef.current.enqueue(notification);
        return existing;
      }
      // Nothing showing — display it right away.
      return notification;
    });
  }, []);

  const dismiss = useCallback(() => {
    setCurrent(queueRef.current.dequeue() ?? null);
  }, []);

  return { current, notify, dismiss };
}
