import { useState } from "react";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { useModel } from "@/lib/model/store";
import { compactUSD, usd } from "@/lib/model/format";
import { cn } from "@/lib/utils";

type Gran = "monthly" | "annual";

interface Series {
  key: string;
  label: string;
  color: string;
  /** cost = stackable outflow magnitude; others are signed lines. */
  kind: "cost" | "revenue" | "cash" | "capital";
  /** Which Y axis: per-period line items (left) vs cumulative totals (right). */
  axis: "left" | "right";
  defaultOn: boolean;
}

const SERIES: Series[] = [
  { key: "revenue", label: "Revenue", color: "hsl(145 50% 50%)", kind: "revenue", axis: "left", defaultOn: true },
  { key: "payroll", label: "Payroll", color: "hsl(25 80% 56%)", kind: "cost", axis: "left", defaultOn: true },
  { key: "marketing", label: "Marketing", color: "hsl(202 60% 56%)", kind: "cost", axis: "left", defaultOn: true },
  { key: "events", label: "Event costs", color: "hsl(45 70% 58%)", kind: "cost", axis: "left", defaultOn: false },
  { key: "gna", label: "G&A", color: "hsl(8 60% 55%)", kind: "cost", axis: "left", defaultOn: false },
  { key: "ai", label: "Layer-1 AI", color: "hsl(174 40% 50%)", kind: "cost", axis: "left", defaultOn: false },
  { key: "commissions", label: "Commissions", color: "hsl(280 40% 62%)", kind: "cost", axis: "left", defaultOn: false },
  { key: "netCash", label: "Net cash flow", color: "hsl(var(--muted-foreground))", kind: "cash", axis: "left", defaultOn: false },
  { key: "cumCash", label: "Cumulative cash", color: "hsl(var(--primary))", kind: "cash", axis: "left", defaultOn: true },
  { key: "opCash", label: "Operating cash (excl. raise)", color: "hsl(var(--accent))", kind: "cash", axis: "left", defaultOn: false },
  { key: "capital", label: "Investor capital", color: "hsl(0 0% 72%)", kind: "capital", axis: "left", defaultOn: true },
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
} as const;
const axisProps = { stroke: "hsl(var(--muted-foreground))", fontSize: 11, tickLine: false } as const;

/**
 * Master, filterable line/area graph of every major line item over time —
 * revenue, payroll, marketing, event costs, G&A, AI, commissions, cash flow,
 * cumulative cash, and investor capital. Toggle series, stack the cost lines,
 * switch monthly/annual, and set a window with the dual-ended range slider
 * (defaults to the full model window shown in the table).
 */
export default function MasterChart() {
  const { result, inputs } = useModel();
  const raise = inputs.raiseAmount;
  const [gran, setGran] = useState<Gran>("monthly");
  const [stacked, setStacked] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>(
    Object.fromEntries(SERIES.map((s) => [s.key, s.defaultOn])),
  );

  const full =
    gran === "monthly"
      ? result.monthly.map((m) => ({
          label: `${m.label.split(" ")[0]} '${m.label.split(" ")[1].slice(2)}`,
          revenue: m.subM + m.txnM,
          payroll: -m.peopleM,
          marketing: -(m.mktOtherM + m.eventsM + m.oneTimeM),
          events: -m.eventsM,
          gna: -m.gnaM,
          ai: -m.aiM,
          commissions: -m.commM,
          netCash: m.netM,
          // Cumulative cash = cash on hand: starts at the raise and burns.
          cumCash: m.cumM + raise,
          opCash: m.cumM,
          capital: raise,
        }))
      : result.annual.map((r) => ({
          label: String(r.year),
          revenue: r.recognizedRev,
          payroll: -r.opexPeople,
          marketing: -r.opexMkt,
          events: r.events,
          gna: -r.opexGna,
          ai: -r.opexAi,
          commissions: -r.opexComm,
          netCash: r.ebitda,
          // Cumulative cash = cash on hand: starts at the raise and burns.
          cumCash: r.cumCash + raise,
          opCash: r.cumCash,
          capital: raise,
        }));

  const maxIdx = full.length - 1;
  const [range, setRange] = useState<[number, number]>([0, maxIdx]);
  // Clamp range if granularity changed the length.
  const start = Math.min(range[0], maxIdx);
  const end = Math.min(range[1], maxIdx);
  const data = full.slice(start, end + 1);

  const shown = SERIES.filter((s) => visible[s.key]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup type="single" value={gran} onValueChange={(v) => { if (v) { setGran(v as Gran); setRange([0, v === "monthly" ? 71 : 5]); } }} className="rounded-lg border border-border/60 bg-card/60 p-0.5" aria-label="Granularity">
            <ToggleGroupItem value="monthly" className="h-8 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="annual" className="h-8 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Annual</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" value={stacked ? "stacked" : "lines"} onValueChange={(v) => v && setStacked(v === "stacked")} className="rounded-lg border border-border/60 bg-card/60 p-0.5" aria-label="Stack mode">
            <ToggleGroupItem value="lines" className="h-8 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Lines</ToggleGroupItem>
            <ToggleGroupItem value="stacked" className="h-8 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Stacked</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Series legend / toggles */}
      <div className="flex flex-wrap gap-1.5">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setVisible((v) => ({ ...v, [s.key]: !v[s.key] }))}
            aria-pressed={visible[s.key]}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              visible[s.key] ? "border-border bg-card/80 text-foreground" : "border-border/50 text-muted-foreground opacity-60 hover:opacity-100",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="label" {...axisProps} interval={gran === "monthly" ? 5 : 0} />
          <YAxis yAxisId="left" {...axisProps} tickFormatter={(v) => compactUSD(v)} width={56} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number, n) => [usd(v), SERIES.find((s) => s.key === n)?.label ?? n]}
          />
          <ReferenceLine yAxisId="left" y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
          {shown.map((s) => {
            if (stacked && s.kind === "cost") {
              return <Area key={s.key} yAxisId={s.axis} type="monotone" dataKey={s.key} stackId="cost" stroke={s.color} fill={s.color} fillOpacity={0.55} />;
            }
            return (
              <Line
                key={s.key}
                yAxisId={s.axis}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={s.kind === "cash" ? 2.5 : 1.8}
                strokeDasharray={s.kind === "capital" ? "5 4" : undefined}
                dot={false}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Time-window range */}
      <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/30 px-4 py-3">
        <span className="whitespace-nowrap text-xs text-muted-foreground">Window</span>
        <Slider
          value={[start, end]}
          min={0}
          max={maxIdx}
          step={1}
          onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
          className="max-w-md"
          aria-label="Time window"
        />
        <span className="whitespace-nowrap font-display text-sm font-semibold">
          {full[start].label} – {full[end].label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        One shared dollar axis: every series is to the same scale. Per-period line items show costs as
        outflow magnitude; cumulative cash is cash on hand — it starts at the investor capital raised
        and burns down, alongside the flat investor-capital reference. Toggle series or drag the window
        to focus; stack the cost series to see spend composition.
      </p>
    </div>
  );
}
