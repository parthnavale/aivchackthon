import { ConfidenceMeter, EmptyAdjustmentNote, PageHeader, Panel, SourceTag, StatusBadge } from "@/components/vc-brain-ui";
import { searchAttributes, searchResults } from "@/lib/vc-brain-data";

export default function MultiAttributeSearchPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Pipeline"
        title="Multi-attribute search"
        description="Search founders and companies across the thesis dimensions that matter most for the investment team."
        actions={<SourceTag>7 active filters</SourceTag>}
      />

      <Panel>
        <div className="flex flex-wrap gap-2">
          {searchAttributes.map((attribute) => (
            <span key={attribute} className="rounded-full border border-[#36465e] bg-[#192334] px-3 py-1.5 text-sm text-[#c6d3ea]">
              {attribute}
            </span>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="p-0">
          <div className="border-b border-[#273348] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Matches</p>
            <h2 className="mt-1 text-xl text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
              Ranked founder results
            </h2>
          </div>
          <div className="divide-y divide-[#273348]">
            {searchResults.map((row) => (
              <div key={row.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1.1fr_0.8fr_0.7fr] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base text-[#f4f1eb]" style={{ fontFamily: "Georgia, serif" }}>
                      {row.name}
                    </h3>
                    <StatusBadge tone={row.status === "verified" ? "green" : row.status === "flagged" ? "red" : row.status === "deployed" ? "blue" : "muted"}>
                      {row.status}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-[#8ca2c8]">{row.company} • {row.companyStage} • {row.region}</p>
                  <p className="mt-2 text-sm leading-6 text-[#c6d3ea]">{row.lastSignal}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#536887]">Fit</div>
                    <div className="mt-1 font-mono text-[#f1c66d]">{row.thesisFit}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#536887]">Trust</div>
                    <div className="mt-1 font-mono text-[#f4f1eb]">{row.trust}%</div>
                  </div>
                </div>

                <ConfidenceMeter value={row.trust} label="Source confidence" />
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Search note</p>
            <div className="mt-3 space-y-3">
              <EmptyAdjustmentNote text="Tighten attributes if the list drifts too far from repeat-operator founders or buyer-visible pain." />
              <EmptyAdjustmentNote text="Use the same filters for every new sourcing batch to keep comparisons clean." />
            </div>
          </Panel>

          <Panel>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8ca2c8]">Filter logic</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#c6d3ea]">
              <li>• Stronger thesis fit gets priority over sheer inbound volume.</li>
              <li>• Source quality is treated as a confidence layer, not the final decision.</li>
              <li>• Geographic expansion is useful only when buyer urgency remains clear.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
