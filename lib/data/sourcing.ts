import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentOrganization } from "./current-organization";
import { getCurrentFund } from "./current-fund";
import { score100ToDecimal } from "./score-utils";
import { mapSourcingCandidate, type SourcingCandidateView } from "@/lib/mappers/sourcing-mapper";

export interface SourcingDashboardView {
  metrics: Array<{ label: string; value: string; detail: string; tone: "gold" | "blue" | "green" | "red" | "muted" }>;
  candidates: SourcingCandidateView[];
}

export async function getSourcingDashboardView(): Promise<SourcingDashboardView> {
  const organization = await getCurrentOrganization();
  const fund = await getCurrentFund();

  if (!fund) {
    return { metrics: [], candidates: [] };
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: candidates, error: candidateError }, { data: trustRows, error: trustError }] = await Promise.all([
    supabase
      .from("sourcing_candidates")
      .select("id, candidate_name, company_name, source_channel, thesis_fit, momentum, status, founder_id, surfaced_reason")
      .eq("organization_id", organization.id)
      .eq("fund_id", fund.id)
      .order("thesis_fit", { ascending: false })
      .limit(8),
    supabase
      .from("founder_score_snapshots")
      .select("founder_id, confidence")
      .order("created_at", { ascending: false }),
  ]);

  const candidateRows = (candidates ?? []) as Array<{
    id: string;
    candidate_name: string | null;
    company_name: string | null;
    source_channel: string | null;
    thesis_fit: number | null;
    momentum: string | null;
    status: string | null;
    founder_id: string | null;
    surfaced_reason: string | null;
  }>;
  const trustRowsTyped = (trustRows ?? []) as Array<{ founder_id: string | null; confidence: number | null }>;

  if (candidateError) {
    throw new Error(`Unable to load sourcing candidates: ${candidateError.message}`);
  }

  if (trustError) {
    throw new Error(`Unable to load trust scores: ${trustError.message}`);
  }

  const trustByFounder = new Map<string, number>();
  for (const row of trustRowsTyped) {
    if (row.founder_id && row.confidence !== null) {
      trustByFounder.set(row.founder_id, row.confidence);
    }
  }

  const mappedCandidates = candidateRows.map((candidate) => {
    const trust = candidate.founder_id ? trustByFounder.get(candidate.founder_id) ?? null : null;
    return mapSourcingCandidate({
      ...candidate,
      trust: trust === null ? null : score100ToDecimal(trust),
    });
  });

  const metrics = [
    { label: "New intros", value: `${mappedCandidates.length}`, detail: "Up to the latest active queue", tone: "gold" as const },
    { label: "Ready", value: `${mappedCandidates.filter((item) => item.status === "reviewing").length}`, detail: "Candidates still under review", tone: "blue" as const },
    { label: "Deployed", value: `${mappedCandidates.filter((item) => item.status === "deployed").length}`, detail: "Moved into active diligence", tone: "green" as const },
    { label: "Passed", value: `${mappedCandidates.filter((item) => item.status === "passed").length}`, detail: "Filtered out of the active pool", tone: "red" as const },
  ];

  return {
    metrics,
    candidates: mappedCandidates,
  };
}
