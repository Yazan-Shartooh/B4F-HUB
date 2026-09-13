import { useMemo, useState } from "react";
import type { Opportunity, OpportunityType, WorkMode } from "../../types";
import { applyToOpportunity, fetchOpportunities } from "../../lib/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useOpportunityHistory } from "../../hooks/useOpportunityHistory";
import { useSavedOpportunities } from "../../hooks/useSavedOpportunities";
import { HashTable } from "../../lib/dataStructures";
import { ErrorView, LoadingView, EmptyView } from "../StatusViews";
import OpportunityFilters from "./OpportunityFilters";
import OpportunityCard from "./OpportunityCard";
import OpportunityDetailPanel from "./OpportunityDetailPanel";

interface OpportunitiesSectionProps {
  notify: (kind: "success" | "error", message: string) => void;
}

export default function OpportunitiesSection({
  notify,
}: OpportunitiesSectionProps) {
  const {
    data: opportunities,
    setData: setOpportunities,
    status,
    error,
    reload,
  } = useAsyncData(fetchOpportunities);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "all">("all");
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | "all">("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [applyingIds, setApplyingIds] = useState<Set<number>>(new Set());

  const { openId, open, close, goBack, canGoBack } = useOpportunityHistory();
  const { savedIds, toggleSaved, isSaved } = useSavedOpportunities();

  // Hash Table: id -> full opportunity object. Built once whenever the list
  // loads/changes, then used for O(1) lookup (e.g. turning the open detail's
  // id, or a history id from the Stack below, back into its full object)
  // instead of scanning the array with .find() every time.
  const opportunitiesById = useMemo(() => {
    const table = new HashTable<Opportunity>();
    (opportunities ?? []).forEach((opportunity) =>
      table.set(opportunity.id, opportunity),
    );
    return table;
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    if (!opportunities) return [];
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      if (typeFilter !== "all" && opportunity.type !== typeFilter) return false;
      if (workModeFilter !== "all" && opportunity.workMode !== workModeFilter)
        return false;
      if (savedOnly && !isSaved(opportunity.id)) return false;
      if (!query) return true;
      return (
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.company.toLowerCase().includes(query) ||
        opportunity.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    });
  }, [
    opportunities,
    search,
    typeFilter,
    workModeFilter,
    savedOnly,
    isSaved,
    savedIds,
  ]);

  function handleToggleDetail(id: number) {
    if (openId === id) {
      close();
    } else {
      open(id);
    }
  }

  async function handleApply(opportunity: Opportunity) {
    if (opportunity.applied || applyingIds.has(opportunity.id)) return;

    setApplyingIds((prev) => new Set(prev).add(opportunity.id));
    try {
      const updated = await applyToOpportunity(opportunity.id);
      setOpportunities((prev) =>
        prev ? prev.map((o) => (o.id === updated.id ? updated : o)) : prev,
      );
      notify(
        "success",
        `Applied to ${opportunity.title} at ${opportunity.company}.`,
      );
    } catch (err) {
      notify(
        "error",
        err instanceof Error
          ? err.message
          : "Couldn't submit that application. Please try again.",
      );
    } finally {
      setApplyingIds((prev) => {
        const next = new Set(prev);
        next.delete(opportunity.id);
        return next;
      });
    }
  }

  // The id at the top of the history Stack (or the currently open one)
  // resolved to a full object through the Hash Table above.
  const openOpportunity =
    openId !== null ? opportunitiesById.get(openId) : undefined;

  return (
    <section className="main-content panel" aria-label="Opportunities">
      <header className="panel-header">
        <h2>Opportunities</h2>
        <p className="panel-subtitle">
          Jobs, internships, scholarships, and volunteering.
        </p>
      </header>

      {status === "success" && opportunities && opportunities.length > 0 && (
        <OpportunityFilters
          search={search}
          onSearchChange={setSearch}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          workMode={workModeFilter}
          onWorkModeChange={setWorkModeFilter}
          savedOnly={savedOnly}
          onSavedOnlyChange={setSavedOnly}
        />
      )}
      <div className="panel-scroll">
        {status === "loading" && <LoadingView label="Loading opportunities…" />}

        {status === "error" && (
          <ErrorView
            message={error ?? "Something went wrong."}
            onRetry={reload}
          />
        )}

        {status === "success" &&
          opportunities &&
          opportunities.length === 0 && (
            <EmptyView
              title="No opportunities yet"
              message="Check back soon for new listings."
            />
          )}

        {status === "success" &&
          opportunities &&
          opportunities.length > 0 &&
          filteredOpportunities.length === 0 && (
            <EmptyView
              title="Nothing here"
              message="No opportunities match your filters. Try widening your search."
            />
          )}

        {openOpportunity && (
          <OpportunityDetailPanel
            opportunity={openOpportunity}
            canGoBack={canGoBack}
            onGoBack={goBack}
            onClose={close}
          />
        )}

        {status === "success" && filteredOpportunities.length > 0 && (
          <div className="opp-list">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                isOpen={openId === opportunity.id}
                isSaved={isSaved(opportunity.id)}
                isApplying={applyingIds.has(opportunity.id)}
                onToggleDetail={handleToggleDetail}
                onToggleSave={toggleSaved}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
