import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToggleRow from "./ToggleRow";
import StatTile from "./StatTile";
import { ORG_MEMBERSHIPS, MEMBERSHIPS_ANNUAL_DEFAULT } from "@/lib/model/data";
import { useModel } from "@/lib/model/store";
import { usd, signedCompactUSD } from "@/lib/model/format";
import { cn } from "@/lib/utils";
import type { OrgPriority } from "@/lib/model/types";

const PRIORITY_STYLE: Record<OrgPriority, string> = {
  HIGH: "bg-primary/20 text-primary",
  MED: "bg-secondary/20 text-secondary",
  LOW: "bg-muted text-muted-foreground",
};

/**
 * The 12 org / board memberships (§3.7). Each Y/N toggle writes to the shared
 * store; membershipsAnnual recomputes → the proforma updates live.
 */
export default function OrgsToggleList() {
  const { orgToggles, actions } = useModel();
  const included = ORG_MEMBERSHIPS.filter((o) => orgToggles[o.id]);
  const total = included.reduce((s, o) => s + o.dues, 0);
  const deltaToFinance = total - MEMBERSHIPS_ANNUAL_DEFAULT;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile
          label="Memberships included"
          value={`${included.length} / ${ORG_MEMBERSHIPS.length}`}
          icon={Users}
        />
        <StatTile label="Annual memberships total" value={usd(total)} hint="applied every year" />
        <StatTile
          label="Δ to finance vs base"
          value={signedCompactUSD(deltaToFinance)}
          accent={deltaToFinance === 0 ? undefined : deltaToFinance < 0 ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => ORG_MEMBERSHIPS.forEach((o) => actions.toggleOrg(o.id, true))}
        >
          Include all
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => ORG_MEMBERSHIPS.forEach((o) => actions.toggleOrg(o.id, false))}
        >
          Exclude all
        </Button>
      </div>

      <div className="space-y-2">
        {ORG_MEMBERSHIPS.map((o) => (
          <ToggleRow
            key={o.id}
            label={o.name}
            checked={!!orgToggles[o.id]}
            onCheckedChange={(v) => actions.toggleOrg(o.id, v)}
            meta={
              <>
                <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-semibold", PRIORITY_STYLE[o.priority])}>
                  {o.priority}
                </span>
                <span className="w-14 text-right font-medium tabular-nums">{usd(o.dues)}</span>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
