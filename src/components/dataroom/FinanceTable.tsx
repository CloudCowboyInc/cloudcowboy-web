import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useModel } from "@/lib/model/store";
import { usd, compactUSD, pct, multiple } from "@/lib/model/format";
import { cn } from "@/lib/utils";
import type { AnnualRow, MonthlyRow } from "@/lib/model/types";

type Granularity = "annual" | "monthly";
type Fmt = "money" | "num" | "pct" | "mult";

const num = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtVal = (v: number, fmt: Fmt) =>
  fmt === "money" ? usd(v) : fmt === "pct" ? pct(v) : fmt === "mult" ? multiple(v, 2) : num(v);

function Row({
  label, rows, pick, fmt = "money", bold = false, indent = false, signColor = false,
}: {
  label: string;
  rows: AnnualRow[];
  pick: (r: AnnualRow) => number;
  fmt?: Fmt;
  bold?: boolean;
  indent?: boolean;
  signColor?: boolean;
}) {
  return (
    <TableRow className={cn(bold && "font-semibold")}>
      <TableCell className={cn("whitespace-nowrap", indent && "pl-6 text-muted-foreground", bold && "font-display")}>
        {label}
      </TableCell>
      {rows.map((r) => {
        const v = pick(r);
        return (
          <TableCell key={r.year} className={cn("text-right tabular-nums", signColor && v < 0 && "text-destructive", signColor && v > 0 && "text-secondary")}>
            {fmtVal(v, fmt)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function GroupHeader({ label, span }: { label: string; span: number }) {
  return (
    <TableRow className="bg-muted/40">
      <TableCell colSpan={span} className="py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        {label}
      </TableCell>
    </TableRow>
  );
}

/** Excel-style monthly P&L — line items as rows, 72 months as columns, scrolls horizontally. */
function MonthlyMatrix({ monthly, raise, troughIndex }: { monthly: MonthlyRow[]; raise: number; troughIndex: number }) {
  type Def = { label: string; get?: (m: MonthlyRow) => number; group?: boolean; bold?: boolean; indent?: boolean; sign?: boolean };
  const defs: Def[] = [
    { label: "Revenue", group: true },
    { label: "Subscription", get: (m) => m.subM, indent: true },
    { label: "Transaction (2% take)", get: (m) => m.txnM, indent: true },
    { label: "Recognized revenue", get: (m) => m.subM + m.txnM, bold: true },
    { label: "COGS", group: true },
    { label: "ACH / job costs", get: (m) => m.achM, indent: true },
    { label: "Platform COGS", get: (m) => m.platM, indent: true },
    { label: "Gross profit", get: (m) => m.subM + m.txnM + m.achM + m.platM, bold: true, sign: true },
    { label: "Operating expenses", group: true },
    { label: "People", get: (m) => m.peopleM, indent: true },
    { label: "Layer-1 AI", get: (m) => m.aiM, indent: true },
    { label: "Sales commission", get: (m) => m.commM, indent: true },
    { label: "Marketing", get: (m) => m.mktOtherM + m.eventsM + m.oneTimeM, indent: true },
    { label: "G&A", get: (m) => m.gnaM, indent: true },
    { label: "Bottom line", group: true },
    { label: "Net cash flow (EBITDA)", get: (m) => m.netM, bold: true, sign: true },
    { label: "Cumulative cash", get: (m) => m.cumM, bold: true, sign: true },
    { label: "Financing", group: true },
    { label: "Investor capital in", get: (m) => (m.index === 0 ? raise : 0), indent: true },
    { label: "Cash incl. investment", get: (m) => m.cumM + raise, bold: true, sign: true },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-max border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-20 border-b border-border/60 bg-card px-3 py-2 text-left font-medium">
              USD
            </th>
            {monthly.map((m) => (
              <th
                key={m.index}
                className={cn(
                  "min-w-[68px] border-b border-l border-border/40 bg-card px-2 py-2 text-right font-medium tabular-nums",
                  m.index === troughIndex && "bg-destructive/15 text-destructive",
                  m.month === 1 && "border-l-2 border-l-border",
                )}
              >
                {`${m.label.split(" ")[0]} '${m.label.split(" ")[1].slice(2)}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defs.map((d) =>
            d.group ? (
              <tr key={d.label} className="bg-muted/40">
                <td className="sticky left-0 z-10 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary" colSpan={1}>
                  {d.label}
                </td>
                <td colSpan={monthly.length} />
              </tr>
            ) : (
              <tr key={d.label} className={cn(d.bold && "font-semibold")}>
                <td className={cn("sticky left-0 z-10 whitespace-nowrap bg-card px-3 py-1", d.indent && "pl-6 text-muted-foreground", d.bold && "font-display")}>
                  {d.label}
                </td>
                {monthly.map((m) => {
                  const v = d.get!(m);
                  return (
                    <td
                      key={m.index}
                      title={usd(v)}
                      className={cn(
                        "border-l border-border/30 px-2 py-1 text-right tabular-nums",
                        m.index === troughIndex && "bg-destructive/10",
                        m.month === 1 && "border-l-2 border-l-border",
                        d.sign && v < 0 && "text-destructive",
                        d.sign && v > 0 && "text-secondary",
                      )}
                    >
                      {Math.abs(v) < 1 ? "—" : compactUSD(v)}
                    </td>
                  );
                })}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The interactive proforma table. Annual P&L (customers → revenue → COGS →
 * OpEx → EBITDA → cumulative → financing → key metrics incl. CAC) plus an
 * Excel-style monthly matrix that scrolls horizontally. Includes the investor
 * capital line. Reads the live compute() result + raise.
 */
export default function FinanceTable() {
  const { result, inputs } = useModel();
  const [granularity, setGranularity] = useState<Granularity>("annual");
  const { annual, monthly, metrics } = result;
  const raise = inputs.raiseAmount;
  const span = annual.length + 1;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={granularity}
          onValueChange={(v) => v && setGranularity(v as Granularity)}
          className="rounded-lg border border-border/60 bg-card/60 p-0.5"
          aria-label="Table granularity"
        >
          <ToggleGroupItem value="annual" className="h-8 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Annual
          </ToggleGroupItem>
          <ToggleGroupItem value="monthly" className="h-8 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Monthly (Excel)
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {granularity === "annual" ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[170px]">USD</TableHead>
                {annual.map((a) => (
                  <TableHead key={a.year} className="text-right">{a.year}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <GroupHeader label="Customers" span={span} />
              <Row label="Beginning of year" rows={annual} pick={(r) => r.boy} fmt="num" indent />
              <Row label="Churned" rows={annual} pick={(r) => r.churned} fmt="num" indent />
              <Row label="Net adds" rows={annual} pick={(r) => r.adds} fmt="num" indent />
              <Row label="Customers (EOY)" rows={annual} pick={(r) => r.customersEOY} fmt="num" bold />
              <Row label="Active in season" rows={annual} pick={(r) => r.activeSeason} fmt="num" indent />

              <GroupHeader label="Revenue" span={span} />
              <Row label="Subscription" rows={annual} pick={(r) => r.subRev} indent />
              <Row label="Transaction (2% take)" rows={annual} pick={(r) => r.txnRev} indent />
              <Row label="Recognized revenue" rows={annual} pick={(r) => r.recognizedRev} bold />

              <GroupHeader label="COGS" span={span} />
              <Row label="ACH / job costs" rows={annual} pick={(r) => r.ach} indent />
              <Row label="Platform COGS" rows={annual} pick={(r) => r.platform} indent />
              <Row label="Gross profit" rows={annual} pick={(r) => r.grossProfit} bold signColor />

              <GroupHeader label="Operating expenses" span={span} />
              <Row label="People" rows={annual} pick={(r) => r.opexPeople} indent />
              <Row label="Layer-1 AI" rows={annual} pick={(r) => r.opexAi} indent />
              <Row label="Sales commission" rows={annual} pick={(r) => r.opexComm} indent />
              <Row label="Marketing" rows={annual} pick={(r) => r.opexMkt} indent />
              <Row label="G&A" rows={annual} pick={(r) => r.opexGna} indent />

              <GroupHeader label="Bottom line" span={span} />
              <Row label="EBITDA" rows={annual} pick={(r) => r.ebitda} bold signColor />
              <Row label="Cumulative cash" rows={annual} pick={(r) => r.cumCash} bold signColor />

              <GroupHeader label="Financing" span={span} />
              <Row label="Investor capital in" rows={annual} pick={(r) => (r.yearIndex === 0 ? raise : 0)} indent />
              <Row label="Cash incl. investment" rows={annual} pick={(r) => r.cumCash + raise} bold signColor />

              <GroupHeader label="Key metrics" span={span} />
              <Row label="ARR" rows={annual} pick={(r) => r.arr} bold />
              <Row label="ARR growth" rows={annual} pick={(r) => r.arrGrowth} fmt="pct" indent />
              <Row label="Net new ARR" rows={annual} pick={(r) => r.netNewArr} indent />
              <Row label="Gross margin" rows={annual} pick={(r) => r.grossMargin} fmt="pct" indent />
              <Row label="EBITDA margin" rows={annual} pick={(r) => r.ebitdaMargin} fmt="pct" indent />
              <Row label="Net revenue retention (NRR)" rows={annual} pick={(r) => r.nrr} fmt="pct" indent />
              <Row label="Burn multiple" rows={annual} pick={(r) => r.burnMultiple} fmt="mult" indent />
              <Row label="New customers" rows={annual} pick={(r) => r.newCust} fmt="num" indent />
              <Row label="Blended CAC" rows={annual} pick={(r) => r.blendedCac} indent />
              <Row label="Customer-acquisition spend" rows={annual} pick={(r) => r.acqSpend} indent />
              <Row label="Marketing % of revenue" rows={annual} pick={(r) => r.marketingPctRev} fmt="pct" indent />
              <Row label="Revenue / FTE" rows={annual} pick={(r) => r.revenuePerFte} indent />
              <Row label="Total FTE" rows={annual} pick={(r) => r.totalFTE} fmt="num" indent />
            </TableBody>
          </Table>
        </div>
      ) : (
        <MonthlyMatrix monthly={monthly} raise={raise} troughIndex={metrics.troughIndex} />
      )}
      <p className="text-xs text-muted-foreground">
        {granularity === "monthly"
          ? "Monthly P&L — scroll horizontally; year boundaries are ruled, the spring-2027 cash trough is highlighted. Hover a cell for the exact figure."
          : "Full six-year P&L incl. the investor capital line and cash-including-investment."}
      </p>
    </div>
  );
}
