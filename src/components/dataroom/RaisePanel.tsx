import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import StatTile from "./StatTile";
import { useModel } from "@/lib/model/store";
import { compactUSD, usd, pct, multiple, grouped, parseGrouped } from "@/lib/model/format";

/**
 * The raise & returns panel. Edit the raise amount and either dilution or
 * post-money (the other is derived). Shows pre/post-money, investor %, how the
 * raise covers peak cash need, and returns (investor stake at exit, MOIC) at the
 * live valuation — all from the shared store.
 */
export default function RaisePanel() {
  const { inputs, result, actions } = useModel();
  const { raiseAmount, dilution } = inputs;
  const { metrics } = result;
  const coverage = metrics.raiseCoverage;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs text-muted-foreground">Raise amount</span>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
            <Input
              type="text"
              inputMode="numeric"
              aria-label="Raise amount"
              value={grouped(raiseAmount)}
              onChange={(e) => actions.setRaiseAmount(parseGrouped(e.target.value))}
              className="h-9 pl-6 tabular-nums"
            />
          </div>
        </label>

        <div className="block">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Dilution</span>
            <span className="font-display text-sm font-semibold">{pct(dilution)}</span>
          </div>
          <Slider
            value={[dilution]}
            min={0.05}
            max={0.5}
            step={0.01}
            onValueChange={(v) => actions.setDilution(v[0])}
            className="mt-3"
            aria-label="Dilution"
          />
        </div>

        <label className="block">
          <span className="text-xs text-muted-foreground">Post-money (derives dilution)</span>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
            <Input
              type="text"
              inputMode="numeric"
              aria-label="Post-money valuation"
              value={grouped(metrics.postMoney)}
              onChange={(e) => actions.setPostMoney(Math.max(1, parseGrouped(e.target.value)))}
              className="h-9 pl-6 tabular-nums"
            />
          </div>
        </label>
      </div>

      {/* Deal terms */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Pre-money" value={compactUSD(metrics.preMoney)} hint={usd(metrics.preMoney)} />
        <StatTile label="Post-money" value={compactUSD(metrics.postMoney)} hint={usd(metrics.postMoney)} />
        <StatTile label="Investor stake" value={pct(dilution)} hint="at this round" accent="hsl(var(--secondary))" />
        <StatTile
          label="Raise vs peak cash need"
          value={Number.isFinite(coverage) ? `${multiple(coverage, 1)}` : "—"}
          hint={`peak need ${compactUSD(metrics.peakCashNeed)}`}
          accent={coverage >= 1 ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
        />
      </div>

      {/* Returns */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-primary">
          Returns at the year-5 valuation ({compactUSD(metrics.valuation)})
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatTile label="Year 5 valuation" value={compactUSD(metrics.valuation)} hint={`ARR 2031 × ${inputs.arrMultiple}`} accent="hsl(var(--primary))" />
          <StatTile
            label="Investor stake at year 5"
            value={compactUSD(metrics.investorStakeAtExit)}
            hint="pre future-round dilution"
            accent="hsl(var(--secondary))"
          />
          <StatTile label="MOIC" value={multiple(metrics.moic, 0)} hint="gross, this round" accent="hsl(var(--secondary))" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {coverage >= 1
            ? `The ${compactUSD(raiseAmount)} raise covers the ${compactUSD(metrics.peakCashNeed)} peak cash need ${multiple(coverage, 1)} over — runway through the spring-2027 trough with margin.`
            : `The ${compactUSD(raiseAmount)} raise covers only ${pct(coverage, 0)} of the ${compactUSD(metrics.peakCashNeed)} peak cash need — under-funded through the trough.`}
        </p>
      </div>
    </div>
  );
}
