import type { PostCategory } from "../../types";

const CATEGORY_OPTIONS: { value: PostCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "announcement", label: "Announcement" },
  { value: "event", label: "Event" },
  { value: "community", label: "Community" },
  { value: "resource", label: "Resource" },
];

interface CommunityFiltersProps {
  category: PostCategory | "all";
  onCategoryChange: (category: PostCategory | "all") => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function CommunityFilters({
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: CommunityFiltersProps) {
  return (
    <div className="filters-bar">
      <div className="filter-chips" role="radiogroup" aria-label="Filter by category">
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`chip${category === option.value ? " chip--selected" : ""}`}
            aria-pressed={category === option.value}
            onClick={() => onCategoryChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Search author or content…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search posts"
      />
    </div>
  );
}
