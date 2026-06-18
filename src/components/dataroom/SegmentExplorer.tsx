import { useState } from "react";
import { PieChart, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MarketWheel from "./MarketWheel";
import SegmentPyramid from "./SegmentPyramid";

type View = "wheel" | "list";

/**
 * The underlying-market explorer: an interactive revenue wheel (hover/click a
 * segment for its full detail + projection) or a ranked list/pyramid drill-down.
 * Same 12-segment data, two ways to explore it.
 */
export default function SegmentExplorer() {
  const [view, setView] = useState<View>("wheel");
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as View)}
          className="rounded-lg border border-border/60 bg-card/60 p-0.5"
          aria-label="Segment view"
        >
          <ToggleGroupItem value="wheel" aria-label="Wheel" className="h-8 gap-1.5 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <PieChart className="h-3.5 w-3.5" /> Wheel
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List" className="h-8 gap-1.5 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            <List className="h-3.5 w-3.5" /> List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view === "wheel" ? <MarketWheel /> : <SegmentPyramid />}
    </div>
  );
}
