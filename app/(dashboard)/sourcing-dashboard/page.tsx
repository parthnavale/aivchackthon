import {
  MetricCard,
  PageHeader,
  Panel,
  SourceTag,
  StatusBadge,
} from "@/components/vc-brain-ui";
import { getSourcingDashboardView } from "@/lib/data/sourcing";

const statusTone = {
  reviewing: "blue",
  deployed: "green",
  passed: "red",
  flagged: "red",
  verified: "gold",
} as const;

const momentumLabel = {
  up: "Improving",
  down: "Declining",
  neutral: "Stable",
} as const;

export const dynamic = "force-dynamic";

export default async function SourcingDashboardPage() {
  const {
    metrics: sourcingMetrics,
    candidates: pipelineCompanies,
  } = await getSourcingDashboardView();

  return (
    <div className="space-y-6">
      <PageHeader
        label="Pipeline"
        title="Sourcing dashboard"
        description="Track the live sourcing motion, from first signal to partner-ready opportunities, without losing the thesis filter."
        actions={<SourceTag>Live Supabase data</SourceTag>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sourcingMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
          />
        ))}
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3 border-b border-[#273348] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">
              Active queue
            </p>

            <h2
              className="mt-1 text-xl text-[#f4f1eb]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Current sourcing flow
            </h2>
          </div>

          <StatusBadge tone="muted">Updated from Supabase</StatusBadge>
        </div>

        {pipelineCompanies.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#39495f] bg-[#0d141f] px-5 py-8 text-center">
            <p className="text-base text-[#f4f1eb]">
              No sourcing candidates found
            </p>

            <p className="mt-2 text-sm leading-6 text-[#8ca2c8]">
              Run the outbound n8n workflow or add candidates to the
              sourcing_candidates table.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-190 border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.22em] text-[#8ca2c8]">
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Founder</th>
                  <th className="pb-2 font-medium">Source</th>
                  <th className="pb-2 font-medium">Thesis fit</th>
                  <th className="pb-2 font-medium">Trust</th>
                  <th className="pb-2 font-medium">Momentum</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {pipelineCompanies.map((company) => (
                  <tr key={company.id} className="rounded-2xl bg-[#192334]">
                    <td
                      className="rounded-l-2xl px-4 py-4 text-[#f4f1eb]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      <div>{company.company}</div>

                      <p className="mt-1 max-w-xs text-xs leading-5 text-[#8ca2c8]">
                        {company.note}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-[#c6d3ea]">
                      {company.foundedBy}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#8ca2c8]">
                      {company.source}
                    </td>

                    <td className="px-4 py-4 font-mono text-[#f1c66d]">
                      {company.thesisFit}%
                    </td>

                    <td className="px-4 py-4 font-mono text-[#c6d3ea]">
                      {company.trust === null
                        ? "Not scored"
                        : `${Math.round(company.trust * 100)}%`}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#8ca2c8]">
                      {momentumLabel[company.momentum]}
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <StatusBadge tone={statusTone[company.status]}>
                        {company.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
