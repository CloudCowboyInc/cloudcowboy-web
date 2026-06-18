import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useModel, type GrowthKey } from "@/lib/model/store";
import { YEARS } from "@/lib/model/data";
import { compactUSD, pct, grouped, parseGrouped } from "@/lib/model/format";
import { cn } from "@/lib/utils";
import type { ModelInputs } from "@/lib/model/types";

function Field({
  label, ariaLabel, value, onChange, step = 1, min = 0, prefix, suffix, disabled, commas,
}: {
  label: string;
  ariaLabel?: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  /** Display whole-dollar values with thousands separators (1,000,000). */
  commas?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative mt-1">
        {prefix && <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{prefix}</span>}
        {commas ? (
          <Input
            type="text"
            inputMode="numeric"
            aria-label={ariaLabel ?? label}
            value={grouped(value)}
            disabled={disabled}
            onChange={(e) => onChange(parseGrouped(e.target.value))}
            className={cn("h-9 tabular-nums", prefix && "pl-6", suffix && "pr-8")}
          />
        ) : (
          <Input
            type="number"
            inputMode="decimal"
            aria-label={ariaLabel ?? label}
            value={Number.isFinite(value) ? value : 0}
            min={min}
            step={step}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            className={cn("h-9 tabular-nums", prefix && "pl-6", suffix && "pr-8")}
          />
        )}
        {suffix && <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}

type Kind = "count" | "percent" | "money";

function fmtSeriesValue(v: number, kind: Kind): string {
  if (kind === "percent") return pct(v);
  if (kind === "money") return compactUSD(v);
  return Math.round(v).toLocaleString("en-US");
}

/** A "first value + YoY %" growth lever that replaces a per-year grid. */
function GrowthControl({
  label, gkey, kind, prefix, suffix,
}: {
  label: string;
  gkey: GrowthKey;
  kind: Kind;
  prefix?: string;
  suffix?: string;
}) {
  const { growth, inputs, actions } = useModel();
  const lever = growth[gkey];
  const series = inputs[gkey] as number[];
  const firstDisplay = kind === "percent" ? Math.round(lever.first * 1000) / 10 : lever.first;

  return (
    <div className={cn("rounded-lg border p-3", lever.active ? "border-primary/40 bg-primary/5" : "border-border/50")}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          {lever.active ? "Growth model" : "Following plan"}
          <Switch
            checked={lever.active}
            onCheckedChange={(v) => actions.setGrowth(gkey, { active: v })}
            aria-label={`Use growth model for ${label}`}
          />
        </label>
      </div>

      {lever.active && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Field
            label="2027 start"
            ariaLabel={`${label} 2027 start`}
            value={firstDisplay}
            step={kind === "percent" ? 0.5 : kind === "money" ? 1000 : 5}
            prefix={prefix}
            suffix={suffix}
            commas={kind === "money"}
            onChange={(n) => actions.setGrowth(gkey, { first: kind === "percent" ? n / 100 : n })}
          />
          <Field
            label="YoY growth"
            ariaLabel={`${label} YoY growth`}
            value={Math.round(lever.rate * 1000) / 10}
            step={1}
            suffix="%"
            min={-100}
            onChange={(n) => actions.setGrowth(gkey, { rate: n / 100 })}
          />
        </div>
      )}

      {/* Resulting series preview */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {series.map((v, i) => (
          <span key={YEARS[i]} className="rounded bg-muted/50 px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">
            {YEARS[i]} {fmtSeriesValue(v, kind)}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Live assumption controls. Scalar levers + "first value + YoY %" growth models
 * for the per-year series (customers, churn, marketing, G&A) and a global salary
 * inflation. Growth models default to "following plan" (the spec base case);
 * flip one on to drive that series geometrically. Every change recomputes the
 * whole proforma instantly.
 */
export default function AssumptionPanel() {
  const { inputs, growth, actions } = useModel();
  const set = <K extends keyof ModelInputs>(k: K) => (n: number) => actions.setAssumption(k, n as ModelInputs[K]);

  return (
    <div className="space-y-6">
      {/* Scalar assumptions */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Unit economics & pricing</div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Field label="Avg GMV / customer" value={inputs.avgGmvPerCustomer} prefix="$" commas onChange={set("avgGmvPerCustomer")} />
          <Field label="Subscription / yr" value={inputs.subscriptionPerYear} prefix="$" commas onChange={set("subscriptionPerYear")} />
          <Field label="Take rate" value={Math.round(inputs.takeRate * 1000) / 10} step={0.5} suffix="%" onChange={(n) => actions.setAssumption("takeRate", n / 100)} />
          <Field label="Transaction capture" value={Math.round(inputs.transactionCapture * 1000) / 10} step={5} suffix="%" onChange={(n) => actions.setAssumption("transactionCapture", n / 100)} />
          <Field label="Jobs / customer / yr" value={inputs.jobsPerCustomerYear} step={5} onChange={set("jobsPerCustomerYear")} />
          <Field label="ACH cost / job" value={inputs.achCostPerJob} step={1} prefix="$" onChange={set("achCostPerJob")} />
          <Field label="Platform COGS / customer" value={inputs.platformCogsPerCustomer} prefix="$" commas onChange={set("platformCogsPerCustomer")} />
          <Field label="Sales commission / new cust" value={inputs.salesCommissionPerNewCustomer} prefix="$" commas onChange={set("salesCommissionPerNewCustomer")} />
          <Field label="Layer-1 AI / FTE / yr" value={inputs.layer1AiPerFtePerYear} prefix="$" commas onChange={set("layer1AiPerFtePerYear")} />
          <Field label="ARR multiple" value={inputs.arrMultiple} step={1} suffix="×" onChange={set("arrMultiple")} />
          <Field label="Target CAC" value={inputs.targetCac} prefix="$" commas onChange={set("targetCac")} />
          <Field label="Presold (2026)" value={inputs.presold[0]} step={5} onChange={(n) => actions.setInputArrayValue("presold", 0, n)} />
        </div>
      </div>

      {/* Growth models */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
          Growth models — set a 2027 start + YoY %, or follow the plan
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <GrowthControl label="Customers (EOY)" gkey="customersEOY" kind="count" />
          <GrowthControl label="Annual churn" gkey="annualChurn" kind="percent" suffix="%" />
          <GrowthControl label="Social marketing" gkey="social" kind="money" prefix="$" />
          <GrowthControl label="Digital marketing" gkey="digital" kind="money" prefix="$" />
          <GrowthControl label="National marketing" gkey="national" kind="money" prefix="$" />
          <GrowthControl label="G&A" gkey="gAndA" kind="money" prefix="$" />
        </div>

        {/* Salary inflation */}
        <div className={cn("mt-3 rounded-lg border p-3", growth.salaryInflation.active ? "border-primary/40 bg-primary/5" : "border-border/50")}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-foreground">Salary inflation (all roles, from 2027)</div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              {growth.salaryInflation.active ? "Custom" : "Following plan"}
              <Switch
                checked={growth.salaryInflation.active}
                onCheckedChange={(v) => actions.setSalaryInflation({ active: v })}
                aria-label="Use salary inflation"
              />
            </label>
          </div>
          {growth.salaryInflation.active && (
            <div className="mt-3 max-w-[200px]">
              <Field
                label="YoY salary growth"
                ariaLabel="Salary inflation YoY"
                value={Math.round(growth.salaryInflation.rate * 1000) / 10}
                step={0.5}
                suffix="%"
                min={-100}
                onChange={(n) => actions.setSalaryInflation({ rate: n / 100 })}
              />
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Edits apply instantly across the table, charts, and raise math. Growth models replace the
        per-year plan values with a geometric ramp from the 2027 start. Use “Reset to base case” to
        return to the build-spec defaults.
      </p>
    </div>
  );
}
