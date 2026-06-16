import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModel } from "@/lib/model/store";
import { YEARS } from "@/lib/model/data";
import { cn } from "@/lib/utils";

type ArrayKey = "customersEOY" | "annualChurn" | "social" | "digital" | "national" | "gAndA";

function Field({
  label,
  ariaLabel,
  value,
  onChange,
  step = 1,
  min = 0,
  prefix,
  suffix,
}: {
  label: string;
  ariaLabel?: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative mt-1">
        {prefix && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          inputMode="decimal"
          aria-label={ariaLabel ?? label}
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={cn("h-9 tabular-nums", prefix && "pl-6", suffix && "pr-8")}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

/** A 6-year row of number fields for an array input (raw or percent). */
function YearRow({
  label,
  arrayKey,
  percent = false,
}: {
  label: string;
  arrayKey: ArrayKey;
  percent?: boolean;
}) {
  const { inputs, actions } = useModel();
  const arr = inputs[arrayKey] as number[];
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-foreground">{label}</div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {YEARS.map((y, i) => (
          <Field
            key={y}
            label={String(y)}
            ariaLabel={`${label} ${y}`}
            value={percent ? Math.round(arr[i] * 1000) / 10 : arr[i]}
            step={percent ? 0.5 : 1}
            suffix={percent ? "%" : undefined}
            onChange={(n) => actions.setInputArrayValue(arrayKey, i, percent ? n / 100 : n)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Live assumption controls. Every change writes to the shared store and the
 * whole proforma (table + charts + raise) recomputes. Covers customersEOY (per
 * year), transactionCapture, churn, targetCac, avgGmv, arrMultiple, and the
 * marketing scalars.
 */
export default function AssumptionPanel() {
  const { inputs, actions } = useModel();
  const [showMarketing, setShowMarketing] = useState(false);

  return (
    <div className="space-y-5">
      {/* Headline scalar assumptions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Field
          label="Avg GMV / customer"
          value={inputs.avgGmvPerCustomer}
          step={50000}
          prefix="$"
          onChange={(n) => actions.setAssumption("avgGmvPerCustomer", n)}
        />
        <Field
          label="Subscription / yr"
          value={inputs.subscriptionPerYear}
          step={1000}
          prefix="$"
          onChange={(n) => actions.setAssumption("subscriptionPerYear", n)}
        />
        <Field
          label="Transaction capture"
          value={Math.round(inputs.transactionCapture * 1000) / 10}
          step={5}
          suffix="%"
          onChange={(n) => actions.setAssumption("transactionCapture", n / 100)}
        />
        <Field
          label="ARR multiple"
          value={inputs.arrMultiple}
          step={1}
          suffix="×"
          onChange={(n) => actions.setAssumption("arrMultiple", n)}
        />
        <Field
          label="Target CAC"
          value={inputs.targetCac}
          step={100}
          prefix="$"
          onChange={(n) => actions.setAssumption("targetCac", n)}
        />
        <Field
          label="Take rate"
          value={Math.round(inputs.takeRate * 1000) / 10}
          step={0.5}
          suffix="%"
          onChange={(n) => actions.setAssumption("takeRate", n / 100)}
        />
      </div>

      <YearRow label="Customers (end of year)" arrayKey="customersEOY" />
      <YearRow label="Annual churn" arrayKey="annualChurn" percent />

      {/* Marketing scalars (collapsible) */}
      <div className="rounded-lg border border-border/50">
        <button
          type="button"
          onClick={() => setShowMarketing((s) => !s)}
          aria-expanded={showMarketing}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium hover:bg-muted/30"
        >
          <span className="flex-1">Marketing scalars (per year)</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", showMarketing && "rotate-180")} />
        </button>
        {showMarketing && (
          <div className="space-y-4 border-t border-border/50 p-3">
            <YearRow label="Social" arrayKey="social" />
            <YearRow label="Digital" arrayKey="digital" />
            <YearRow label="National" arrayKey="national" />
            <YearRow label="G&A" arrayKey="gAndA" />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Edits apply instantly across the table, charts, and raise math. Use “Reset to base
        case” to return to the spec defaults.
      </p>
    </div>
  );
}
