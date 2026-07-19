import { MetricCard, PageHeader, Panel, SourceTag, StatusBadge } from "@/components/vc-brain-ui";
import { decisionLogEntries, decisionMetrics } from "@/lib/vc-brain-data";

const verdictTone = {
  Proceed: "green",
  Hold: "blue",
  Pass: "red",
} as const;

export default function DecisionLogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Decision"
        title="Decision log"
        description="Record the final call, why it happened, and how it maps back to the original thesis."
        actions={<SourceTag>Board-visible history</SourceTag>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {decisionMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} tone={metric.tone} />
        ))}
      </div>

      <Panel>
        <div className="flex items-center justify-between gap-3 border-b border-[#273348] pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Recent decisions</p>
            <h2 className="mt-1 text-xl text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
              Internal decision trail
            </h2>
          </div>
          <StatusBadge tone="muted">Immutable log</StatusBadge>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-190 w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.22em] text-[#8ca2c8]">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Verdict</th>
                <th className="pb-2 font-medium">Thesis fit</th>
                <th className="pb-2 font-medium">Conviction</th>
                <th className="pb-2 font-medium">Owner</th>
                <th className="pb-2 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {decisionLogEntries.map((entry) => (
                <tr key={`${entry.company}-${entry.date}`} className="rounded-2xl bg-[#192334] align-top">
                  <td className="rounded-l-2xl px-4 py-4 font-mono text-sm text-[#8ca2c8]">{entry.date}</td>
                  <td className="px-4 py-4 text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
                    {entry.company}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge tone={verdictTone[entry.verdict]}>{entry.verdict}</StatusBadge>
                  </td>
                  <td className="px-4 py-4 font-mono text-[#f1c66d]">{entry.thesisFit}%</td>
                  <td className="px-4 py-4 font-mono text-[#f4f1eb]">{entry.conviction}%</td>
                  <td className="px-4 py-4 text-sm text-[#8ca2c8]">{entry.owner}</td>
                  <td className="rounded-r-2xl px-4 py-4 text-sm leading-6 text-[#c6d3ea]">{entry.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
