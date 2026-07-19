import { MetricCard, PageHeader, Panel, SourceTag, StatusBadge } from "@/components/vc-brain-ui";
import { pipelineCompanies, sourcingMetrics } from "@/lib/vc-brain-data";

const statusTone = {
  moving: "green",
  stalled: "red",
  ready: "gold",
  watch: "blue",
} as const;

export default function SourcingDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Pipeline"
        title="Sourcing dashboard"
        description="Track the live sourcing motion, from first intro to partner-ready opportunities, without losing the thesis filter."
        actions={<SourceTag>Live intake</SourceTag>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sourcingMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} tone={metric.tone} />
        ))}
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3 border-b border-[#273348] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Active queue</p>
            <h2 className="mt-1 text-xl text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
              Current sourcing flow
            </h2>
          </div>
          <StatusBadge tone="muted">Updated continuously</StatusBadge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-190 w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.22em] text-[#8ca2c8]">
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Stage</th>
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium">Score</th>
                <th className="pb-2 font-medium">Owner</th>
                <th className="pb-2 font-medium">Last touch</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pipelineCompanies.map((company) => (
                <tr key={company.company} className="rounded-2xl bg-[#192334]">
                  <td className="rounded-l-2xl px-4 py-4 text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
                    {company.company}
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-[#8ca2c8]">{company.stage}</td>
                  <td className="px-4 py-4 text-sm text-[#8ca2c8]">{company.source}</td>
                  <td className="px-4 py-4 font-mono text-[#f1c66d]">{company.score}</td>
                  <td className="px-4 py-4 text-sm text-[#8ca2c8]">{company.owner}</td>
                  <td className="px-4 py-4 text-sm text-[#8ca2c8]">{company.lastTouch}</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <StatusBadge tone={statusTone[company.status]}>{company.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
