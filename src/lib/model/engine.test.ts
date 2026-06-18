import { describe, it, expect } from "vitest";
import { compute } from "./engine";
import { DEFAULT_INPUTS, EVENTS_BASE_ANNUAL_DEFAULT, MEMBERSHIPS_ANNUAL_DEFAULT } from "./data";

const TOL = 50; // ±$50 rounding tolerance (§3.9)
const near = (actual: number, expected: number, tol = TOL) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol);

describe("model engine — §3.9 base-case fixtures (all toggles Y)", () => {
  const r = compute(DEFAULT_INPUTS);

  it("event/org all-Y defaults match §3.6/§3.7", () => {
    expect(EVENTS_BASE_ANNUAL_DEFAULT).toBe(93752);
    expect(MEMBERSHIPS_ANNUAL_DEFAULT).toBe(2325);
  });

  it("ARR[5] = 60,000,000", () => near(r.metrics.arr5, 60_000_000));
  it("valuation (20x) = 1,200,000,000", () => near(r.metrics.valuation, 1_200_000_000));

  it("EBITDA[0] = -631,411", () => near(r.annual[0].ebitda, -631_411));

  it("EBITDA[1..5] match the fixtures", () => {
    near(r.annual[1].ebitda, 238_766);
    near(r.annual[2].ebitda, 1_226_879);
    near(r.annual[3].ebitda, 5_896_555);
    near(r.annual[4].ebitda, 15_700_699);
    near(r.annual[5].ebitda, 31_531_527);
  });

  it("blendedCac[5] ≈ 2,553", () => near(r.metrics.blendedCac5, 2_553, 1));

  it("peakCashNeed ≈ 797,227 at trough Mar 2027", () => {
    near(r.metrics.peakCashNeed, 797_227);
    expect(r.metrics.troughMonth).toBe("Mar 2027");
  });

  it("firstCfPositive = 2028", () => {
    expect(r.metrics.firstCfPositive).toBe(2028);
  });

  it("postMoney / preMoney = 5,000,000 / 4,000,000 (raise 1M @ 20%)", () => {
    near(r.metrics.postMoney, 5_000_000);
    near(r.metrics.preMoney, 4_000_000);
  });

  it("returns: investorStakeAtExit = 20% of valuation, moic = stake / raise", () => {
    near(r.metrics.investorStakeAtExit, 0.2 * 1_200_000_000, 1);
    near(r.metrics.moic, (0.2 * 1_200_000_000) / 1_000_000, 0.01);
  });
});

describe("model engine — Key Metrics parity with CloudCowboy_Proforma.xlsx", () => {
  const r = compute(DEFAULT_INPUTS);
  const a = r.annual;

  it("gross margin is ~91.5% every operating year (proforma R72)", () => {
    for (let y = 1; y <= 5; y++) near(a[y].grossMargin, 0.915, 0.001);
  });
  it("EBITDA margin matches (proforma R83): Y1 ~12.9%, Y5 ~68.5%", () => {
    near(a[1].ebitdaMargin, 0.12867987, 0.0005);
    near(a[5].ebitdaMargin, 0.68500262, 0.0005);
  });
  it("NRR matches (proforma R91): Y0 100%, Y1 96.4%, Y5 103.0%", () => {
    near(a[0].nrr, 1.0, 0.001);
    near(a[1].nrr, 0.96416, 0.0005);
    near(a[5].nrr, 1.0298, 0.0005);
  });
  it("ARR growth Y5 = 60% and net-new ARR Y5 = $22.5M (proforma R88/R90)", () => {
    near(a[5].arrGrowth, 0.6, 0.001);
    near(a[5].netNewArr, 22_500_000);
  });
  it("revenue/FTE Y5 ≈ $979,388 and marketing % rev Y5 ≈ 2.39% (proforma R89/R96)", () => {
    near(a[5].revenuePerFte, 979388.3, 1);
    near(a[5].marketingPctRev, 0.0238878, 0.0005);
  });
});

describe("model engine — monthly→annual reconciliation invariant (§3.5b)", () => {
  const r = compute(DEFAULT_INPUTS);

  it("Σ of the 12 monthly netM equals annual EBITDA for every year", () => {
    for (let y = 0; y < 6; y++) {
      const sum = r.monthly
        .filter((m) => m.yearIndex === y)
        .reduce((s, m) => s + m.netM, 0);
      near(sum, r.annual[y].ebitda, 0.01);
    }
  });

  it("produces exactly 72 months and 6 annual rows", () => {
    expect(r.monthly).toHaveLength(72);
    expect(r.annual).toHaveLength(6);
  });

  it("cumM is a running sum ending at cumulative EBITDA", () => {
    const lastCum = r.monthly[r.monthly.length - 1].cumM;
    near(lastCum, r.annual[5].cumCash, 0.01);
  });
});
