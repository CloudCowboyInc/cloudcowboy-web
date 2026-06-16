import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BASE_RESULT, useModelResult } from "@/lib/model/store";
import { compactUSD, signedCompactUSD } from "@/lib/model/format";
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: number;
  base: number;
  /** Which direction is good for the investor. */
  goodWhen: "lower" | "higher";
}

function DeltaChip({ delta, goodWhen }: { delta: number; goodWhen: "lower" | "higher" }) {
  if (Math.round(delta) === 0) {
    return <span className="text-xs text-muted-foreground">no change</span>;
  }
  const favorable = goodWhen === "lower" ? delta < 0 : delta > 0;
  const Icon = delta > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        favorable ? "text-secondary" : "text-destructive",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {signedCompactUSD(delta)} vs base
    </span>
  );
}

/**
 * Live finance link, shown on the GTM page so the connection between the
 * Events/Orgs toggles and the proforma is always visible. Reads the memoized
 * compute() result and compares to the all-Y base case.
 */
export default function FinanceImpactReadout({ className }: { className?: string }) {
  const r = useModelResult();
  const metrics: Metric[] = [
    {
      label: "Peak cash need",
      value: r.metrics.peakCashNeed,
      base: BASE_RESULT.metrics.peakCashNeed,
      goodWhen: "lower",
    },
    {
      label: "EBITDA · 2031",
      value: r.annual[5].ebitda,
      base: BASE_RESULT.annual[5].ebitda,
      goodWhen: "higher",
    },
    {
      label: "Exit valuation",
      value: r.metrics.valuation,
      base: BASE_RESULT.metrics.valuation,
      goodWhen: "higher",
    },
  ];

  return (
    <Card className={cn("border-primary/30 bg-primary/5 p-4", className)}>
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">
        Live finance impact
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="font-display text-xl font-bold">{compactUSD(m.value)}</div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {m.label}
            </div>
            <div className="mt-0.5">
              <DeltaChip delta={m.value - m.base} goodWhen={m.goodWhen} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
