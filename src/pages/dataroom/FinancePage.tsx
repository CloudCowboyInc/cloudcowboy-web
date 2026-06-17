import { useState } from "react";
import { Coins, RotateCcw, SlidersHorizontal, Banknote, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SectionCard,
  StatTile,
  ViewSwitch,
  FinanceTable,
  FinanceCharts,
  AssumptionPanel,
  RaisePanel,
  WhyThis,
  StoryNotes,
  type ViewMode,
} from "@/components/dataroom";
import { useModel } from "@/lib/model/store";
import { compactUSD, multiple, usd } from "@/lib/model/format";

/**
 * Finance page (WAR_ROOM). The interactive proforma: table/graph views, live
 * assumptions, the raise & returns panel, and a reset. Everything reads the
 * shared store and reflects the GTM Events/Orgs toggles.
 */
export default function FinancePage() {
  const { inputs, result, actions } = useModel();
  const { metrics, annual } = result;
  const [view, setView] = useState<ViewMode>("table");

  return (
    <div className="space-y-6">
      {/* Header + reset */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
            <Coins className="h-3.5 w-3.5" /> Finance
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
            The interactive proforma
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            One tested engine drives every figure. Change an assumption, the raise, or the
            GTM toggles and the whole model recomputes live — no spreadsheet drift.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => actions.resetToBaseCase()}>
          <RotateCcw className="h-4 w-4" /> Reset to base case
        </Button>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile label="ARR · 2031" value={compactUSD(metrics.arr5)} hint={usd(metrics.arr5)} accent="hsl(var(--primary))" />
        <StatTile label="Year 5 valuation" value={compactUSD(metrics.valuation)} hint={`${multiple(inputs.arrMultiple, 0)} ARR`} accent="hsl(var(--primary))" />
        <StatTile label="Peak cash need" value={compactUSD(metrics.peakCashNeed)} hint={metrics.troughMonth} accent="hsl(var(--destructive))" />
        <StatTile label="Cash-flow positive" value={metrics.firstCfPositive ?? "—"} hint="cumulative ≥ 0" accent="hsl(var(--secondary))" />
        <StatTile label="MOIC" value={multiple(metrics.moic, 0)} hint="gross, this round" accent="hsl(var(--secondary))" />
        <StatTile label="Blended CAC · 2031" value={compactUSD(annual[5].blendedCac)} hint="per new customer" />
      </div>

      {/* Proforma — table / graph */}
      <SectionCard
        eyebrow="Proforma"
        title="Six-year model"
        description="Annual P&L and monthly cash, or the same data as charts."
        action={<ViewSwitch value={view} onChange={setView} />}
      >
        {view === "table" ? <FinanceTable /> : <FinanceCharts />}
      </SectionCard>

      {/* Assumptions */}
      <SectionCard
        icon={SlidersHorizontal}
        eyebrow="Assumptions"
        title="Drive the model"
        description="Live controls — every edit recomputes the table, charts, and raise math instantly."
      >
        <AssumptionPanel />
      </SectionCard>

      {/* Raise & returns */}
      <SectionCard
        icon={Banknote}
        eyebrow="The raise"
        title="Raise, dilution & returns"
        description="Defaults: $1.0M at 20% → $5.0M post / $4.0M pre."
      >
        <RaisePanel />
        <WhyThis className="mt-5" title="How to read the raise">
          <p>
            The raise must cover the peak cash need (the spring-2027 trough) with margin.
            Investor stake at year 5 is the round's ownership applied to the year-5 valuation,
            before any future-round dilution; MOIC is that stake over the amount invested.
          </p>
        </WhyThis>
      </SectionCard>

      {/* Story & Notes — the narrative behind the model */}
      <SectionCard
        icon={BookOpen}
        eyebrow="Story &amp; notes"
        title="The narrative behind the model"
        description="The reasoning behind each part of the proforma — open any section for the why."
      >
        <StoryNotes page="finance" />
      </SectionCard>
    </div>
  );
}
