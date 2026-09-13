interface LoadingViewProps {
  label: string;
}

export function LoadingView({ label }: LoadingViewProps) {
  return (
    <div className="status-view status-view--loading">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="status-view status-view--error">
      <p className="status-view-title">Couldn't load this.</p>
      <p className="status-view-message">{message}</p>
      <button type="button" className="btn btn--secondary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

interface EmptyViewProps {
  title: string;
  message: string;
}

export function EmptyView({ title, message }: EmptyViewProps) {
  return (
    <div className="status-view status-view--empty">
      <p className="status-view-title">{title}</p>
      <p className="status-view-message">{message}</p>
    </div>
  );
}
