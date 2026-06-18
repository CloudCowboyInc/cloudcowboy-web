import {
  Area,
  ComposedChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MARKET_TREND } from "@/data/marketData";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
} as const;

const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 12,
  tickLine: false,
} as const;

/**
 * Total US ag-services market, 2018 actuals → 2030 forecast ($B). Actuals and
 * the forecast are split at 2025 so the projection reads clearly. Data from the
 * source doc's historical (§5) and forecast (§6) tables.
 */
export default function MarketGrowthChart() {
  // Two series so the forecast renders in a distinct style; overlap at 2025.
  const data = MARKET_TREND.map((p) => ({
    year: p.year,
    actual: p.kind === "actual" ? p.size : p.year === "2025" ? p.size : null,
    forecast: p.kind === "forecast" || p.year === "2025" ? p.size : null,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="mkt-actual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="mkt-forecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="year" {...axisProps} />
          <YAxis {...axisProps} tickFormatter={(v) => `$${v}B`} width={48} domain={[60, 150]} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number, n) => [`$${v}B`, n === "actual" ? "Actual" : "Forecast"]}
          />
          <ReferenceLine x="2025" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "today", position: "top", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <Area type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} fill="url(#mkt-actual)" connectNulls dot={false} />
          <Area type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 4" fill="url(#mkt-forecast)" connectNulls dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm" style={{ background: "hsl(var(--secondary))" }} /> Actual (2018–2025)</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm" style={{ background: "hsl(var(--primary))" }} /> Forecast (2025–2030, 5.8% CAGR)</span>
      </div>
    </div>
  );
}
