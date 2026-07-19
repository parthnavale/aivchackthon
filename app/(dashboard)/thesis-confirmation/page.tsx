import { ConfidenceMeter, MetricCard, PageHeader, Panel, SourceTag, StatusBadge } from "@/components/vc-brain-ui";
import { thesisCompanies, thesisSignals } from "@/lib/vc-brain-data";

export default function ThesisConfirmationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Onboarding"
        title="Thesis confirmation"
        description="Confirm the platform thesis before pushing more sourcing volume into the pipeline. The goal is to stay selective and make the next step obvious."
        actions={<StatusBadge tone="gold">Active review</StatusBadge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {thesisSignals.map((signal) => (
          <MetricCard key={signal.label} label={signal.label} value={signal.value} detail={signal.detail} tone={signal.tone} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Panel>
          <div className="flex items-center justify-between gap-4 border-b border-[#273348] pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Thesis checkpoints</p>
              <h2 className="mt-1 text-xl text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
                What must stay true
              </h2>
            </div>
            <SourceTag>Updated 14m ago</SourceTag>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#273348] bg-[#192334] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Market</p>
              <p className="mt-2 text-sm leading-6 text-[#c6d3ea]">
                Fragmented categories with measurable outcomes and enough budget authority for fast proof.
              </p>
            </div>
            <div className="rounded-2xl border border-[#273348] bg-[#192334] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Founder profile</p>
              <p className="mt-2 text-sm leading-6 text-[#c6d3ea]">
                Repeat operators who understand the buyer workflow and can close the first wedge quickly.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ConfidenceMeter value={84} label="Thesis confidence" />
            <ConfidenceMeter value={72} label="Go-to-market confidence" />
          </div>
        </Panel>

        <Panel>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Current signals</p>
          <div className="mt-4 space-y-3">
            {thesisCompanies.map((company) => (
              <div key={company.name} className="rounded-2xl border border-[#273348] bg-[#192334] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
                      {company.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#8ca2c8]">{company.note}</p>
                  </div>
                  <StatusBadge tone={company.status === "flagged" ? "red" : company.status === "verified" ? "green" : company.status === "deployed" ? "blue" : "muted"}>
                    {company.status}
                  </StatusBadge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#8ca2c8]">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em]">Source</div>
                    <div className="mt-1 text-[#f4f1eb]">{company.source}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em]">Momentum</div>
                    <div className="mt-1 text-[#f4f1eb]">{company.momentum}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
