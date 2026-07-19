export type FounderStatus =
  | "reviewing"
  | "deployed"
  | "flagged"
  | "passed"
  | "verified"
  | "resolved"
  | "inferred"
  | "unavailable";

export interface Founder {
  id: string;
  name: string;
  company: string;
  source: string;
  thesisFit: number;
  trust: number;
  momentum: "up" | "down" | "neutral";
  status: FounderStatus;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export interface ThesisSignal {
  label: string;
  value: string;
  detail: string;
  tone: "gold" | "green" | "blue" | "red" | "muted";
}

export interface MetricCardData {
  label: string;
  value: string;
  detail: string;
  tone?: "gold" | "green" | "blue" | "red" | "muted";
}

export interface PipelineCompany {
  company: string;
  stage: string;
  source: string;
  score: number;
  owner: string;
  lastTouch: string;
  status: "moving" | "stalled" | "ready" | "watch";
}

export interface SearchRow extends Founder {
  companyStage: string;
  round: string;
  region: string;
  lastSignal: string;
}

export interface FounderEvent {
  date: string;
  title: string;
  source: string;
  status: "verified" | "inferred" | "resolved" | "flagged";
  note: string;
}

export interface MemoSectionData {
  title: string;
  summary: string;
  bullets: string[];
  tone?: "gold" | "green" | "blue" | "red" | "muted";
}

export interface DecisionLogEntry {
  date: string;
  company: string;
  verdict: "Proceed" | "Hold" | "Pass";
  thesisFit: number;
  conviction: number;
  owner: string;
  reason: string;
}

export const dashboardNavigation: NavigationSection[] = [
  {
    label: "Onboarding",
    items: [{ label: "Thesis confirmation", href: "/thesis-confirmation" }],
  },
  {
    label: "Pipeline",
    items: [
      { label: "Sourcing dashboard", href: "/sourcing-dashboard" },
      { label: "Multi-attribute search", href: "/multi-attribute-search" },
      { label: "Founder ledger", href: "/founder-ledger" },
      { label: "Investment memo", href: "/investment-memo" },
      { label: "Decision log", href: "/decision-log" },
    ],
  },
];

export const thesisSignals: ThesisSignal[] = [
  {
    label: "Market shape",
    value: "Confirmed",
    detail: "Verticals with fragmented distribution and measurable outcomes keep surfacing.",
    tone: "green",
  },
  {
    label: "Founder signal",
    value: "Strong",
    detail: "Repeat operator pattern is visible in the most relevant inbound and sourced deals.",
    tone: "gold",
  },
  {
    label: "Deal friction",
    value: "Moderate",
    detail: "Speed matters; the best teams convert in 10-14 days once the thesis is aligned.",
    tone: "blue",
  },
  {
    label: "Portfolio overlap",
    value: "Low",
    detail: "Most targets sit outside current exposure and are additive to the platform.",
    tone: "muted",
  },
];

export const thesisCompanies = [
  {
    name: "Aurelia Health",
    source: "Warm intro",
    thesisFit: 92,
    trust: 88,
    momentum: "up" as const,
    status: "verified" as const,
    note: "Clinical workflow automation with repeatable buyer pull.",
  },
  {
    name: "Northstar Robotics",
    source: "Proactive source",
    thesisFit: 86,
    trust: 82,
    momentum: "up" as const,
    status: "reviewing" as const,
    note: "Capital-efficient deployment and a clear wedge in logistics.",
  },
  {
    name: "Lattice Security",
    source: "Portfolio referral",
    thesisFit: 79,
    trust: 77,
    momentum: "neutral" as const,
    status: "deployed" as const,
    note: "Good operator access but the market is slightly crowded.",
  },
  {
    name: "VantaWave",
    source: "Inbound",
    thesisFit: 73,
    trust: 69,
    momentum: "down" as const,
    status: "flagged" as const,
    note: "Evidence is still thin; watching customer pull-through.",
  },
];

export const sourcingMetrics: MetricCardData[] = [
  { label: "New intros", value: "42", detail: "+11 since last week", tone: "gold" },
  { label: "Screened", value: "18", detail: "6 moved to diligence", tone: "blue" },
  { label: "Partner review", value: "6", detail: "2 ready for next step", tone: "green" },
  { label: "Blocked", value: "4", detail: "Flagged for missing proof", tone: "red" },
];

export const pipelineCompanies: PipelineCompany[] = [
  {
    company: "Aurelia Health",
    stage: "Screening",
    source: "Warm intro",
    score: 91,
    owner: "M. Patel",
    lastTouch: "Today, 09:30",
    status: "ready",
  },
  {
    company: "Northstar Robotics",
    stage: "Sourcing",
    source: "Outbound",
    score: 86,
    owner: "J. Keller",
    lastTouch: "Yesterday",
    status: "moving",
  },
  {
    company: "Lattice Security",
    stage: "Diligence",
    source: "Referral",
    score: 82,
    owner: "A. Chen",
    lastTouch: "2 days ago",
    status: "watch",
  },
  {
    company: "Helio Grid",
    stage: "Sourcing",
    source: "Sector map",
    score: 78,
    owner: "N. Singh",
    lastTouch: "Today, 07:10",
    status: "moving",
  },
  {
    company: "Crescent Materials",
    stage: "Screening",
    source: "Inbound",
    score: 71,
    owner: "M. Patel",
    lastTouch: "3 days ago",
    status: "stalled",
  },
];

export const searchAttributes = [
  "EU / US expansion",
  "Founder-led distribution",
  "Seed to Series A",
  "Low CAC / high trust",
  "Enterprise workflow",
  "Operational intensity",
];

export const searchResults: SearchRow[] = [
  {
    id: "f-001",
    name: "Maya Singh",
    company: "Aurelia Health",
    source: "Operator network",
    thesisFit: 94,
    trust: 91,
    momentum: "up",
    status: "verified",
    companyStage: "Seed",
    round: "€3.8M",
    region: "Berlin / Boston",
    lastSignal: "3 enterprise pilots converted to paid",
  },
  {
    id: "f-002",
    name: "Jonah Adler",
    company: "Northstar Robotics",
    source: "Outbound",
    thesisFit: 86,
    trust: 84,
    momentum: "up",
    status: "reviewing",
    companyStage: "Pre-Seed",
    round: "€2.1M",
    region: "Munich",
    lastSignal: "Supply chain lead joined as advisor",
  },
  {
    id: "f-003",
    name: "Lena Park",
    company: "Lattice Security",
    source: "Referral",
    thesisFit: 79,
    trust: 77,
    momentum: "neutral",
    status: "deployed",
    companyStage: "Series A",
    round: "€7.5M",
    region: "London",
    lastSignal: "SOC2 complete; ACV expanding in 4 accounts",
  },
  {
    id: "f-004",
    name: "Omar El-Sayed",
    company: "Helio Grid",
    source: "Conference",
    thesisFit: 74,
    trust: 71,
    momentum: "down",
    status: "flagged",
    companyStage: "Seed",
    round: "€1.9M",
    region: "Amsterdam",
    lastSignal: "Customer proof still concentrated in one vertical",
  },
];

export const founderTabs = ["Overview", "Proof", "Risks", "Sources"];

export const founderEvents: FounderEvent[] = [
  {
    date: "2026-07-17",
    title: "Customer reference verified",
    source: "Investor memo",
    status: "verified",
    note: "Two customer calls confirmed the urgency of the pain point.",
  },
  {
    date: "2026-07-15",
    title: "Prior exit cross-checked",
    source: "Public records",
    status: "resolved",
    note: "Exit timing and role attribution align with the founder’s claim.",
  },
  {
    date: "2026-07-13",
    title: "Market claim inferred",
    source: "LinkedIn + interviews",
    status: "inferred",
    note: "Distribution playbook appears stronger than product narrative.",
  },
  {
    date: "2026-07-11",
    title: "Reference check flagged",
    source: "Backchannel",
    status: "flagged",
    note: "One prior manager mentioned pace issues under deep ambiguity.",
  },
];

export const memoSections: MemoSectionData[] = [
  {
    title: "Why this fits the thesis",
    summary:
      "The opportunity sits squarely in the wedge where repeated operational pain creates a fast feedback loop for product adoption.",
    bullets: [
      "Founder has seen the problem from inside the buyer workflow.",
      "Customer pain is measurable and already budgeted.",
      "Distribution relies on trust, not pure brand spend.",
    ],
    tone: "gold",
  },
  {
    title: "Commercial evidence",
    summary:
      "Recent pilot conversions suggest the product is pulling demand rather than being pushed through selling effort.",
    bullets: [
      "Three pilots converted inside four weeks.",
      "Average seat expansion is above plan.",
      "Procurement time is under the median for category peers.",
    ],
    tone: "green",
  },
  {
    title: "Key risks",
    summary:
      "The main question is whether the category expands beyond the first buyer cohort without heavy founder intervention.",
    bullets: [
      "Concentration in one buyer segment.",
      "Need to prove repeatable onboarding motion.",
      "Competitive intensity could rise if growth accelerates.",
    ],
    tone: "red",
  },
  {
    title: "Decision posture",
    summary:
      "Proceed if the next round of diligence confirms repeatable demand and clean founder ownership of the wedge.",
    bullets: [
      "Keep one human in the loop for oversight.",
      "Push to partner review once diligence references are complete.",
      "Use the same thesis tags across future logs.",
    ],
    tone: "blue",
  },
];

export const decisionMetrics: MetricCardData[] = [
  { label: "Passed", value: "12", detail: "No thesis overlap", tone: "red" },
  { label: "Held", value: "6", detail: "Need more evidence", tone: "blue" },
  { label: "Proceed", value: "4", detail: "Partner review ready", tone: "green" },
  { label: "Conviction", value: "78%", detail: "Across current active deals", tone: "gold" },
];

export const decisionLogEntries: DecisionLogEntry[] = [
  {
    date: "2026-07-18",
    company: "Aurelia Health",
    verdict: "Proceed",
    thesisFit: 94,
    conviction: 88,
    owner: "M. Patel",
    reason: "Strong buyer pull and repeatable founder narrative.",
  },
  {
    date: "2026-07-16",
    company: "Northstar Robotics",
    verdict: "Hold",
    thesisFit: 86,
    conviction: 72,
    owner: "J. Keller",
    reason: "Commercial traction looks good, but hardware sequencing still needs proof.",
  },
  {
    date: "2026-07-14",
    company: "VantaWave",
    verdict: "Pass",
    thesisFit: 73,
    conviction: 51,
    owner: "A. Chen",
    reason: "Evidence is too early and the wedge is not differentiated enough yet.",
  },
  {
    date: "2026-07-12",
    company: "Helio Grid",
    verdict: "Proceed",
    thesisFit: 84,
    conviction: 81,
    owner: "N. Singh",
    reason: "Expansion curve is consistent and the founder has unusually strong buyer access.",
  },
];
