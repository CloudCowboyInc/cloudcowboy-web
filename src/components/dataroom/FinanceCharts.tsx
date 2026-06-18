import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { useModel } from "@/lib/model/store";
import { compactUSD, usd } from "@/lib/model/format";
import { cn } from "@/lib/utils";

const COL = {
  arr: "hsl(var(--primary))",
  cash: "hsl(var(--secondary))",
  rev: "hsl(var(--secondary))",
  cost: "hsl(var(--primary))",
  cac: "hsl(var(--primary))",
  target: "hsl(var(--muted-foreground))",
  trough: "hsl(var(--destructive))",
} as const;

type ChartKey = "arr" | "cash" | "revcost" | "cac";
const CHIPS: { key: ChartKey; label: string }[] = [
  { key: "arr", label: "ARR" },
  { key: "cash", label: "Monthly cash" },
  { key: "revcost", label: "Revenue vs cost" },
  { key: "cac", label: "CAC compression" },
];

const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 12,
  tickLine: false,
} as const;

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
} as const;

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="mb-3 text-sm font-medium text-foreground">{title}</div>
      {children}
    </div>
  );
}

/**
 * Recharts panel for the proforma: ARR bars, the monthly cumulative-cash
 * saw-tooth (trough marked), revenue vs cost, and the CAC compression curve.
 * Filter chips show/hide each chart; the slider picks the year range for the
 * annual charts. All series read the live compute() result.
 */
export default function FinanceCharts() {
  const { result: r, inputs } = useModel();
  const targetCac = inputs.targetCac;
  const [visible, setVisible] = useState<Record<ChartKey, boolean>>({
    arr: true,
    cash: true,
    revcost: true,
    cac: true,
  });
  const [range, setRange] = useState<[number, number]>([0, 5]);

  const annualAll = r.annual;
  const [start, end] = range;
  const annual = annualAll.slice(start, end + 1).map((a) => ({
    year: String(a.year),
    arr: a.arr,
    revenue: a.recognizedRev,
    cost: -(a.cogs + a.opexPeople + a.opexAi + a.opexComm + a.opexMkt + a.opexGna),
    cac: a.blendedCac,
  }));

  const cash = r.monthly.map((m) => ({ label: m.label, cumM: m.cumM }));
  const trough = r.monthly[r.metrics.troughIndex];

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Show:</span>
        {CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setVisible((v) => ({ ...v, [c.key]: !v[c.key] }))}
            aria-pressed={visible[c.key]}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              visible[c.key]
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Year range */}
      <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/30 px-4 py-3">
        <span className="whitespace-nowrap text-xs text-muted-foreground">Year range</span>
        <Slider
          value={range}
          min={0}
          max={5}
          step={1}
          onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
          className="max-w-xs"
          aria-label="Year range"
        />
        <span className="whitespace-nowrap font-display text-sm font-semibold">
          {annualAll[start].year} – {annualAll[end].year}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.arr && (
          <ChartCard title="ARR by year">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={annual} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => compactUSD(v)} width={56} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [usd(v), "ARR"]} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                <Bar dataKey="arr" fill={COL.arr} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {visible.revcost && (
          <ChartCard title="Revenue vs cost">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={annual} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => compactUSD(v)} width={56} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [usd(v), n === "revenue" ? "Revenue" : "Cost"]} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                <Bar dataKey="revenue" fill={COL.rev} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="cost" stroke={COL.cost} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {visible.cac && (
          <ChartCard title="CAC compression">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={annual} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} tickFormatter={(v) => compactUSD(v)} width={56} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [usd(v), "Blended CAC"]} />
                <ReferenceLine
                  y={targetCac}
                  stroke={COL.target}
                  strokeDasharray="4 4"
                  label={{ value: `Target ${compactUSD(targetCac)}`, position: "insideTopRight", fill: COL.target, fontSize: 11 }}
                />
                <Line type="monotone" dataKey="cac" stroke={COL.cac} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {visible.cash && (
          <ChartCard title="Monthly cumulative cash (trough marked)">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={cash} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" {...axisProps} interval={11} />
                <YAxis {...axisProps} tickFormatter={(v) => compactUSD(v)} width={56} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [usd(v), "Cumulative cash"]} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="cumM" stroke={COL.cash} strokeWidth={2} dot={false} />
                <ReferenceDot
                  x={trough.label}
                  y={trough.cumM}
                  r={5}
                  fill={COL.trough}
                  stroke="hsl(var(--background))"
                  strokeWidth={1.5}
                  label={{ value: `Trough ${trough.label}`, position: "top", fill: COL.trough, fontSize: 11 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
