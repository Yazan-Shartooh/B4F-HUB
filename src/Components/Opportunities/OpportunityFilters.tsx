import type { OpportunityType, WorkMode } from "../../types";

const TYPE_OPTIONS: { value: OpportunityType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "volunteer", label: "Volunteer" },
];

const MODE_OPTIONS: { value: WorkMode | "all"; label: string }[] = [
  { value: "all", label: "All modes" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

interface OpportunityFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: OpportunityType | "all";
  onTypeChange: (value: OpportunityType | "all") => void;
  workMode: WorkMode | "all";
  onWorkModeChange: (value: WorkMode | "all") => void;
  savedOnly: boolean;
  onSavedOnlyChange: (value: boolean) => void;
}

export default function OpportunityFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  workMode,
  onWorkModeChange,
  savedOnly,
  onSavedOnlyChange,
}: OpportunityFiltersProps) {
  return (
    <div className="filters-bar filters-bar--opps">
      <input
        type="search"
        className="search-input"
        placeholder="Search title, company, or skill…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search opportunities"
      />

      <select
        className="select-input"
        value={type}
        onChange={(event) => onTypeChange(event.target.value as OpportunityType | "all")}
        aria-label="Filter by type"
      >
        {TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="select-input"
        value={workMode}
        onChange={(event) => onWorkModeChange(event.target.value as WorkMode | "all")}
        aria-label="Filter by work mode"
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label className="saved-only-toggle">
        <input
          type="checkbox"
          checked={savedOnly}
          onChange={(event) => onSavedOnlyChange(event.target.checked)}
        />
        Saved only
      </label>
    </div>
  );
}
