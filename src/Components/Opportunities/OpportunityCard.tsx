import type { Opportunity } from "../../types";

const TYPE_LABEL: Record<Opportunity["type"], string> = {
  job: "Job",
  internship: "Internship",
  scholarship: "Scholarship",
  volunteer: "Volunteer",
};

const WORK_MODE_LABEL: Record<Opportunity["workMode"], string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "On-site",
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  isOpen: boolean;
  isSaved: boolean;
  isApplying: boolean;
  onToggleDetail: (id: number) => void;
  onToggleSave: (id: number) => void;
  onApply: (opportunity: Opportunity) => void;
}

export default function OpportunityCard({
  opportunity,
  isOpen,
  isSaved,
  isApplying,
  onToggleDetail,
  onToggleSave,
  onApply,
}: OpportunityCardProps) {
  return (
    <article className={`opp-card${isOpen ? " opp-card--open" : ""}`}>
      <div className="opp-card-top">
        <span className="opp-logo" aria-hidden="true">
          {opportunity.companyLogo}
        </span>
        <div className="opp-card-heading">
          <h3 className="opp-title">{opportunity.title}</h3>
          <span className="opp-company">{opportunity.company}</span>
        </div>
        <button
          type="button"
          className={`save-btn${isSaved ? " save-btn--active" : ""}`}
          onClick={() => onToggleSave(opportunity.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save opportunity"}
          title={isSaved ? "Remove from saved" : "Save opportunity"}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>

      <div className="opp-badges">
        <span className={`badge badge--type-${opportunity.type}`}>{TYPE_LABEL[opportunity.type]}</span>
        <span className="badge badge--mode">{WORK_MODE_LABEL[opportunity.workMode]}</span>
        <span className="opp-location">{opportunity.location}</span>
      </div>

      <div className="opp-skills">
        {opportunity.skills.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      <div className="opp-card-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onToggleDetail(opportunity.id)}
        >
          {isOpen ? "Hide details" : "View details"}
        </button>

        <button
          type="button"
          className={`btn${opportunity.applied ? " btn--applied" : " btn--primary"}`}
          onClick={() => onApply(opportunity)}
          disabled={opportunity.applied || isApplying}
        >
          {opportunity.applied ? "Applied ✓" : isApplying ? "Applying…" : "Apply"}
        </button>
      </div>
    </article>
  );
}
