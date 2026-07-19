import { AccordionSection, FounderTabs, PageHeader, Panel, SourceTag, StatusBadge } from "@/components/vc-brain-ui";
import { founderEvents, founderTabs } from "@/lib/vc-brain-data";

export default function FounderLedgerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Pipeline"
        title="Founder ledger"
        description="Maintain a single view of founder evidence, references, and disputed claims so the team can move quickly without losing context."
        actions={<SourceTag>Evidence-linked</SourceTag>}
      />

      <FounderTabs tabs={founderTabs} active="Overview" />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Founder status</p>
              <h2 className="mt-1 text-xl text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
                Maya Singh
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#8ca2c8]">Aurelia Health • Seed • Berlin / Boston</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#273348] bg-[#192334] p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#536887]">Thesis fit</div>
                <div className="mt-2 font-mono text-2xl text-[#f1c66d]">94%</div>
              </div>
              <div className="rounded-2xl border border-[#273348] bg-[#192334] p-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#536887]">Trust</div>
                <div className="mt-2 font-mono text-2xl text-[#f4f1eb]">91%</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="green">Verified</StatusBadge>
              <StatusBadge tone="gold">Priority</StatusBadge>
              <StatusBadge tone="blue">Repeat operator</StatusBadge>
            </div>
          </div>
        </Panel>

        <Panel className="p-0">
          <div className="border-b border-[#273348] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Evidence trail</p>
            <h2 className="mt-1 text-xl text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
              Ledger entries
            </h2>
          </div>
          <div className="space-y-3 p-5">
            {founderEvents.map((event) => (
              <AccordionSection key={event.title} title={event.title} summary={`${event.date} • ${event.source}`} defaultOpen={event.status === "verified"}>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={event.status === "verified" ? "green" : event.status === "flagged" ? "red" : event.status === "resolved" ? "blue" : "muted"}>
                    {event.status}
                  </StatusBadge>
                </div>
                <p className="mt-3">{event.note}</p>
              </AccordionSection>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
