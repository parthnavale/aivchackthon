import { AccordionSection, MetricCard, PageHeader, Panel, StatusBadge } from "@/components/vc-brain-ui";
import { memoSections } from "@/lib/vc-brain-data";

export default function InvestmentMemoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Decision support"
        title="Investment memo"
        description="Condense the core argument, risks, and decision posture into a clean internal memo that stays readable under pressure."
        actions={<StatusBadge tone="gold">Draft ready</StatusBadge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Conviction" value="78%" detail="Based on current diligence inputs" tone="gold" />
        <MetricCard label="Open questions" value="3" detail="Need stronger evidence on repeatability" tone="blue" />
        <MetricCard label="Reference confidence" value="91%" detail="Most claims have direct verification" tone="green" />
        <MetricCard label="Blocking risks" value="1" detail="One unresolved founder claim" tone="red" />
      </div>

      <Panel>
        <div className="space-y-3">
          {memoSections.map((section, index) => (
            <AccordionSection
              key={section.title}
              title={section.title}
              summary={section.summary}
              defaultOpen={index === 0}
            >
              <ul className="space-y-2">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </AccordionSection>
          ))}
        </div>
      </Panel>
    </div>
  );
}
