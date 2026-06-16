import { SectionCard, WhyThis } from "@/components/dataroom";

/**
 * Go-To-Market page — placeholder shell (SADDLE_UP). Customer Discovery (CRM),
 * Events, and Orgs sub-tabs arrive in ROUNDUP.
 */
export default function GtmPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Go-To-Market"
        title="Customer Discovery · Events · Orgs"
        description="How we reach the market — and how each lever flows straight into the finance model."
      >
        <p className="text-sm text-muted-foreground">
          Customer Discovery (lead map + table), the event circuit, and org memberships
          arrive in the ROUNDUP sprint.
        </p>
        <WhyThis className="mt-4" title="Why this matters">
          <p>
            The events and memberships you toggle here are real spend lines. ROUNDUP wires
            them live into the proforma so the cost of presence is always visible.
          </p>
        </WhyThis>
      </SectionCard>
    </div>
  );
}
