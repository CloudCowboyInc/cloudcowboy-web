import { useId, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WhyThisProps {
  /** Trigger label. Defaults to "Why this matters". */
  title?: string;
  children: ReactNode;
  /** Start expanded. */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Collapsible narrative expander — the data room's contextual storytelling
 * device. Investors can open it for the "why" behind a number without the page
 * shouting. Animated with Framer Motion to match existing pages; keyboard- and
 * screen-reader-accessible (button toggles aria-expanded over the region).
 */
export default function WhyThis({
  title = "Why this matters",
  children,
  defaultOpen = false,
  className,
}: WhyThisProps) {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <div
      className={cn(
        "rounded-lg border border-primary/25 bg-primary/5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={regionId}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Lightbulb className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={regionId}
            role="region"
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
