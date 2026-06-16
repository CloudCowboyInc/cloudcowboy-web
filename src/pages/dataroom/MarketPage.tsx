import { SectionCard, WhyThis } from "@/components/dataroom";

/**
 * Market page — placeholder shell (SADDLE_UP). The TAM/SAM/SOM funnel and
 * segment table land in TERRITORY.
 */
export default function MarketPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Market"
        title="Market is rapidly climbing — over $4B by 2030"
        description="The opportunity: TAM → SAM → SOM, anchored on the chemical-application beachhead."
      >
        <p className="text-sm text-muted-foreground">
          Market funnel and underlying segment analysis arrive in the TERRITORY sprint.
        </p>
        <WhyThis className="mt-4" title="Why this matters">
          <p>
            Investors want to see a large, growing market and a credible wedge into it.
            This page will show both — the monetizable TAM and the beachhead we win first.
          </p>
        </WhyThis>
      </SectionCard>
    </div>
  );
}
