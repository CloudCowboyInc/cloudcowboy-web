import { type ReactNode } from "react";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatTileProps {
  label: string;
  value: ReactNode;
  /** Small caption under the value (e.g. "2031" or "ARR"). */
  hint?: string;
  /** Optional leading icon. */
  icon?: LucideIcon;
  /** Optional accent color (CSS color) applied to the value + icon. */
  accent?: string;
  /** Optional period-over-period delta; positive renders green/up, negative red/down. */
  delta?: { value: string; direction: "up" | "down" | "flat" };
  className?: string;
}

/**
 * Compact KPI tile — the data-room's atomic metric display. Matches the
 * existing CRM `Stat` card styling (dark card, display font, uppercase label).
 */
export default function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  accent,
  delta,
  className,
}: StatTileProps) {
  return (
    <Card className={cn("border-border/60 bg-card/60 p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className="truncate font-display text-2xl font-bold leading-tight"
            style={accent ? { color: accent } : undefined}
          >
            {value}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          {hint && <div className="mt-0.5 text-[11px] text-muted-foreground/70">{hint}</div>}
        </div>
        {Icon && (
          <Icon
            className="h-5 w-5 shrink-0 text-primary"
            style={accent ? { color: accent } : undefined}
            aria-hidden
          />
        )}
      </div>
      {delta && delta.direction !== "flat" && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            delta.direction === "up" ? "text-secondary" : "text-destructive",
          )}
        >
          {delta.direction === "up" ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {delta.value}
        </div>
      )}
    </Card>
  );
}
