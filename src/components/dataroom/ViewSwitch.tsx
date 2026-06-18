import { Table2, BarChart3, type LucideIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type ViewMode = "table" | "graph";

interface ViewOption {
  value: ViewMode;
  label: string;
  icon: LucideIcon;
}

const DEFAULT_OPTIONS: ViewOption[] = [
  { value: "table", label: "Table", icon: Table2 },
  { value: "graph", label: "Graph", icon: BarChart3 },
];

export interface ViewSwitchProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  options?: ViewOption[];
  className?: string;
}

/**
 * Segmented control for switching a panel between Table and Graph views.
 * Built on the shared ToggleGroup so focus/keyboard behaviour is consistent.
 */
export default function ViewSwitch({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
}: ViewSwitchProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as ViewMode)}
      className={cn("rounded-lg border border-border/60 bg-card/60 p-0.5", className)}
      aria-label="Switch view"
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt.value}
          value={opt.value}
          aria-label={opt.label}
          className="h-8 gap-1.5 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <opt.icon className="h-3.5 w-3.5" />
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
