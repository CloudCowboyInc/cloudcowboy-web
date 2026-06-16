import { Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MARKET_SEGMENTS,
  MARKET_TOTALS,
  type MarketSegment,
} from "@/data/marketData";
import { cn } from "@/lib/utils";

interface SegmentTableProps {
  segments?: MarketSegment[];
  className?: string;
}

/**
 * The 12-segment underlying-market table (§3.8b). This is total industry
 * revenue, NOT Cloud Cowboy ARR — labelled by the parent SectionCard. Beachhead
 * (Chemical & Fertilizer Application) is highlighted; CAGR shows "—" where the
 * source does not state it (never fabricated).
 */
export default function SegmentTable({
  segments = MARKET_SEGMENTS,
  className,
}: SegmentTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Segment</TableHead>
            <TableHead className="text-right">2025 revenue</TableHead>
            <TableHead className="text-right">CAGR</TableHead>
            <TableHead className="text-right">Entities</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((s) => (
            <TableRow
              key={s.rank}
              className={cn(s.isBeachhead && "bg-primary/10 hover:bg-primary/15")}
            >
              <TableCell className="text-muted-foreground">{s.rank}</TableCell>
              <TableCell className="font-medium">
                <span className="flex items-center gap-2">
                  {s.name}
                  {s.isBeachhead && (
                    <span className="inline-flex items-center gap-1 rounded bg-primary/20 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                      <Star className="h-3 w-3" aria-hidden /> Beachhead
                    </span>
                  )}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">{s.revenue2025}</TableCell>
              <TableCell className="text-right tabular-nums">
                {s.cagr ?? <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {s.entities.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="border-t-2 border-border">
            <TableCell />
            <TableCell className="font-display font-semibold">
              Total US ag-services market
            </TableCell>
            <TableCell className="text-right font-display font-bold tabular-nums">
              {MARKET_TOTALS.total2025}
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {MARKET_TOTALS.compositeCagr}
            </TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">
              → {MARKET_TOTALS.total2030} by 2030
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="mt-2 px-1 text-xs text-muted-foreground">{MARKET_TOTALS.cagrFootnote}</p>
    </div>
  );
}
