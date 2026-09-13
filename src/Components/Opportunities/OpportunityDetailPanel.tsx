import type { Opportunity } from "../../types";

interface OpportunityDetailPanelProps {
  opportunity: Opportunity;
  canGoBack: boolean;
  onGoBack: () => void;
  onClose: () => void;
}

export default function OpportunityDetailPanel({
  opportunity,
  canGoBack,
  onGoBack,
  onClose,
}: OpportunityDetailPanelProps) {
  return (
    <div className="detail-panel" role="region" aria-label={`${opportunity.title} details`}>
      <div className="detail-panel-head">
        <div>
          <h3>{opportunity.title}</h3>
          <span className="opp-company">{opportunity.company}</span>
        </div>
        <button type="button" className="detail-close" onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>

      <p className="detail-description">{opportunity.description}</p>

      <dl className="opp-detail-meta">
        <div>
          <dt>Level</dt>
          <dd>{opportunity.level}</dd>
        </div>
        <div>
          <dt>Posted</dt>
          <dd>{opportunity.postedAt}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{opportunity.deadline}</dd>
        </div>
      </dl>

      <button type="button" className="btn btn--ghost" onClick={onGoBack} disabled={!canGoBack}>
        ← Back to previous opportunity
      </button>
    </div>
  );
}
