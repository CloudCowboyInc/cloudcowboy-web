import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, CalendarDays, Users, LineChart, BookOpen } from "lucide-react";
import {
  SectionCard,
  WhyThis,
  EventsToggleList,
  OrgsToggleList,
  FinanceImpactReadout,
  StoryNotes,
} from "@/components/dataroom";
import CrmBoard from "@/pages/CRM";

/**
 * Go-To-Market page (ROUNDUP). Three sub-tabs:
 *  - Customer Discovery — the rehomed CRM (map + table + 491 leads + drawers).
 *  - Events — the 18-show circuit, Y/N toggles driving the finance model live.
 *  - Orgs & Boards — the 12 memberships, likewise wired to finance.
 * The live finance-impact readout sits above the tabs so the connection between
 * GTM levers and the proforma is always visible.
 */
export default function GtmPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
          <LineChart className="h-3.5 w-3.5" /> Go-To-Market
        </div>
        <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
          How we reach the market
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A live pipeline of identified targets, plus the event circuit and org
          memberships that build presence. Every spend lever here flows straight into the
          finance model.
        </p>
      </div>

      <FinanceImpactReadout />

      <Tabs defaultValue="discovery" className="w-full">
        <TabsList>
          <TabsTrigger value="discovery" className="gap-1.5">
            <Compass className="h-4 w-4" /> Customer Discovery
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-1.5">
            <CalendarDays className="h-4 w-4" /> Events
          </TabsTrigger>
          <TabsTrigger value="orgs" className="gap-1.5">
            <Users className="h-4 w-4" /> Orgs &amp; Boards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="mt-6">
          <SectionCard
            eyebrow="Customer Discovery"
            title="Identified targets — live pipeline"
            description="Our researched universe of ag-service operators: mapped, filterable, and tracked through the pipeline. This is the bottom-up evidence behind the SOM beachhead."
          >
            <CrmBoard />
          </SectionCard>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <SectionCard
            icon={CalendarDays}
            eyebrow="Events"
            title="The event circuit"
            description="Toggle each show in or out — the included circuit total and the proforma's peak cash need update instantly."
          >
            <EventsToggleList />
            <WhyThis className="mt-5" title="Why the event circuit matters">
              <p>
                Trade shows are where ag operators are won face-to-face. The circuit is a real
                spend line that scales each year (×1.0 in 2027, +10%/yr after). Excluding
                lower-tier shows lowers cash burn; the live readout above shows the trade-off.
              </p>
            </WhyThis>
          </SectionCard>
        </TabsContent>

        <TabsContent value="orgs" className="mt-6">
          <SectionCard
            icon={Users}
            eyebrow="Orgs & Boards"
            title="Memberships & board seats"
            description="Industry credibility and distribution. Dues are modest but every membership is a line in the model — toggle to see the (small) finance impact."
          >
            <OrgsToggleList />
            <WhyThis className="mt-5" title="Why memberships matter">
              <p>
                Board seats and association memberships buy trust and early access to the
                operators we sell to. Total dues are small relative to the circuit, but they
                are applied every year and reconcile into the same proforma.
              </p>
            </WhyThis>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <SectionCard icon={BookOpen} eyebrow="Story &amp; notes" title="How we go to market, in context">
        <StoryNotes page="gtm" />
      </SectionCard>
    </div>
  );
}
