import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectionCardProps {
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Optional icon shown beside the title. */
  icon?: LucideIcon;
  /** Right-aligned controls in the header (e.g. a ViewSwitch). */
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Drop inner padding on the body (useful for tables/maps that manage their own). */
  bodyClassName?: string;
}

/**
 * A titled content panel used across the data room. Wraps the shared Card
 * with a consistent header (eyebrow / title / description / action slot).
 */
export default function SectionCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  const hasHeader = eyebrow || title || description || action;
  return (
    <Card className={cn("border-border/60 bg-card/50", className)}>
      {hasHeader && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/50 p-5">
          <div className="min-w-0">
            {eyebrow && (
              <div className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold md:text-xl">
                {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden />}
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </Card>
  );
}
