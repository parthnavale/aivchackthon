export interface SourcingCandidateView {
  id: string;
  company: string;
  source: string;
  thesisFit: number;
  trust: number | null;
  momentum: "up" | "down" | "neutral";
  status: "reviewing" | "deployed" | "passed" | "flagged" | "verified";
  foundedBy: string;
  founderId: string | null;
  opportunityId: string | null;
  note: string;
}

export function mapSourcingCandidate(row: {
  id: string;
  candidate_name: string | null;
  company_name: string | null;
  source_channel: string | null;
  thesis_fit: number | null;
  momentum: string | null;
  status: string | null;
  founder_id: string | null;
  surfaced_reason: string | null;
  trust: number | null;
}): SourcingCandidateView {
  return {
    id: row.id,
    company: row.company_name ?? "Unnamed company",
    source: row.source_channel ?? "Unknown source",
    thesisFit: Math.round((row.thesis_fit ?? 0) * 100),
    trust: row.trust ?? null,
    momentum: row.momentum === "down" ? "down" : row.momentum === "up" ? "up" : "neutral",
    status:
      row.status === "new" || row.status === "reviewing" || row.status === "reviewing"
        ? "reviewing"
        : row.status === "activated" || row.status === "converted"
          ? "deployed"
          : row.status === "ignored" || row.status === "rejected"
            ? "passed"
            : "reviewing",
    foundedBy: row.candidate_name ?? "Founder",
    founderId: row.founder_id ?? null,
    opportunityId: null,
    note: row.surfaced_reason ?? "No note available",
  };
}
