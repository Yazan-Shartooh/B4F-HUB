import type { AppNotification } from "../../hooks/useNotificationQueue";

interface NotificationToastProps {
  notification: AppNotification | null;
  onDismiss: () => void;
}

export default function NotificationToast({ notification, onDismiss }: NotificationToastProps) {
  if (!notification) return null;

  return (
    <div className="toast-stage" role="status" aria-live="polite">
      <div className={`toast toast--${notification.kind}`}>
        <span className="toast-icon" aria-hidden="true">
          {notification.kind === "success" ? "✓" : "!"}
        </span>
        <span className="toast-message">{notification.message}</span>
        <button
          type="button"
          className="toast-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
