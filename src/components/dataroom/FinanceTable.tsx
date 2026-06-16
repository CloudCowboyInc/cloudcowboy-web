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
import { useModelResult } from "@/lib/model/store";
import { usd } from "@/lib/model/format";
import { cn } from "@/lib/utils";
import type { AnnualRow } from "@/lib/model/types";

type Granularity = "annual" | "monthly";

const num = (n: number) => Math.round(n).toLocaleString("en-US");

/** A labelled annual row: value per year, optionally money-formatted. */
function Row({
  label,
  rows,
  pick,
  money = true,
  bold = false,
  indent = false,
  signColor = false,
}: {
  label: string;
  rows: AnnualRow[];
  pick: (r: AnnualRow) => number;
  money?: boolean;
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
          <TableCell
            key={r.year}
            className={cn(
              "text-right tabular-nums",
              signColor && v < 0 && "text-destructive",
              signColor && v > 0 && "text-secondary",
            )}
          >
            {money ? usd(v) : num(v)}
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

/**
 * The interactive proforma table. Annual P&L (customers → revenue → COGS →
 * OpEx → EBITDA → cumulative → key metrics incl. CAC) plus a monthly cash view.
 * Reads the live compute() result; reflects all assumptions + GTM toggles.
 */
export default function FinanceTable() {
  const r = useModelResult();
  const [granularity, setGranularity] = useState<Granularity>("annual");
  const { annual, monthly, metrics } = r;
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
            Monthly cash
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {granularity === "annual" ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">USD</TableHead>
                {annual.map((a) => (
                  <TableHead key={a.year} className="text-right">{a.year}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <GroupHeader label="Customers" span={span} />
              <Row label="Beginning of year" rows={annual} pick={(r) => r.boy} money={false} indent />
              <Row label="Churned" rows={annual} pick={(r) => r.churned} money={false} indent />
              <Row label="Net adds" rows={annual} pick={(r) => r.adds} money={false} indent />
              <Row label="Customers (EOY)" rows={annual} pick={(r) => r.customersEOY} money={false} bold />
              <Row label="Active in season" rows={annual} pick={(r) => r.activeSeason} money={false} indent />

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

              <GroupHeader label="Key metrics" span={span} />
              <Row label="ARR" rows={annual} pick={(r) => r.arr} bold />
              <Row label="New customers" rows={annual} pick={(r) => r.newCust} money={false} indent />
              <Row label="Blended CAC" rows={annual} pick={(r) => r.blendedCac} indent />
              <Row label="Total FTE" rows={annual} pick={(r) => r.totalFTE} money={false} indent />
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="max-h-[560px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Net cash</TableHead>
                <TableHead className="text-right">Cumulative cash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthly.map((m) => {
                const isTrough = m.index === metrics.troughIndex;
                return (
                  <TableRow key={m.index} className={cn(isTrough && "bg-destructive/15")}>
                    <TableCell className="whitespace-nowrap">
                      {m.label}
                      {isTrough && (
                        <span className="ml-2 rounded bg-destructive/30 px-1.5 py-0.5 text-[11px] font-semibold text-destructive">
                          cash trough
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={cn("text-right tabular-nums", m.netM < 0 && "text-destructive")}>
                      {usd(m.netM)}
                    </TableCell>
                    <TableCell className={cn("text-right tabular-nums", m.cumM < 0 && "text-destructive")}>
                      {usd(m.cumM)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
