import { type ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface ToggleRowProps {
  /** Primary label (e.g. an event or org name). */
  label: ReactNode;
  /** Y/N state. */
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Secondary line under the label. */
  description?: ReactNode;
  /** Right-aligned metadata shown before the switch (cost, month, tier badges…). */
  meta?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * A labelled Y/N switch row — the building block for the Events and Orgs lists
 * that drive the finance model. Whole row is a large click/tap target; the
 * switch carries the accessible name.
 */
export default function ToggleRow({
  label,
  checked,
  onCheckedChange,
  description,
  meta,
  disabled,
  className,
}: ToggleRowProps) {
  const name = typeof label === "string" ? label : undefined;
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card/40 px-4 py-3 transition-colors",
        checked ? "border-primary/30" : "opacity-70",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{label}</div>
        {description && (
          <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      {meta && <div className="flex shrink-0 items-center gap-2 text-xs">{meta}</div>}
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={name ? `Include ${name}` : "Include"}
      />
    </div>
  );
}
