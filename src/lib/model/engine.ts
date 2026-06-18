/**
 * Pure financial-model engine. Implements §3.5 (annual) and §3.5b (monthly)
 * of docs/DATAROOM_BUILD_SPEC.md exactly. No UI, no I/O — given inputs, returns
 * a fully-derived ModelResult. The UI must never duplicate these formulas.
 */
import { MONTH_NAMES, YEARS } from "./data";
import type {
  AnnualRow,
  ModelInputs,
  ModelMetrics,
  ModelResult,
  MonthlyRow,
} from "./types";

const NY = 6; // number of years (0..5)

export function compute(inputs: ModelInputs): ModelResult {
  const {
    avgGmvPerCustomer,
    subscriptionPerYear,
    takeRate,
    transactionCapture,
    jobsPerCustomerYear,
    achCostPerJob,
    layer1AiPerFtePerYear,
    platformCogsPerCustomer,
    salesCommissionPerNewCustomer,
    arrMultiple,
    raiseAmount,
    dilution,
    customersEOY,
    presold,
    preSeasonCapture,
    annualChurn,
    gmvGrowth,
    social,
    digital,
    national,
    oneTime,
    gAndA,
    eventYearFactor,
    eventsBaseAnnual,
    membershipsAnnual,
    staff,
    benefitsLoad,
    seasonal,
    eventTiming,
    fall2026,
  } = inputs;

  // events[y] = eventsBaseAnnual * eventYearFactor[y]; memberships[y] flat.
  const events = eventYearFactor.map((f) => eventsBaseAnnual * f);
  const memberships = Array.from({ length: NY }, () => membershipsAnnual);

  const annual: AnnualRow[] = [];
  let cumCash = 0;

  for (let y = 0; y < NY; y++) {
    const boy = y === 0 ? 0 : customersEOY[y - 1] + presold[y - 1];
    const churned = -boy * annualChurn[y];
    const adds = customersEOY[y] - boy - churned;
    const activeSeason = boy + preSeasonCapture[y] * adds;

    const subRev = activeSeason * subscriptionPerYear;
    const txnRev = activeSeason * avgGmvPerCustomer * takeRate * transactionCapture;
    const recognizedRev = subRev + txnRev;

    const ach = -activeSeason * jobsPerCustomerYear * achCostPerJob;
    const platform = -activeSeason * platformCogsPerCustomer;
    const cogs = ach + platform;
    const grossProfit = recognizedRev + cogs;

    let baseSalaries = 0;
    let totalFTE = 0;
    for (const cat of staff) {
      baseSalaries += cat.fte[y] * cat.sal[y];
      totalFTE += cat.fte[y];
    }
    const benefits = baseSalaries * benefitsLoad[y];
    const peopleCost = baseSalaries + benefits;

    const opexPeople = -peopleCost;
    const opexAi = -totalFTE * layer1AiPerFtePerYear;
    const opexComm = -(adds + presold[y]) * salesCommissionPerNewCustomer;
    const marketing =
      social[y] + digital[y] + events[y] + national[y] + memberships[y] + oneTime[y];
    const opexMkt = -marketing;
    const opexGna = -gAndA[y];

    const ebitda = grossProfit + opexPeople + opexAi + opexComm + opexMkt + opexGna;
    cumCash = y === 0 ? ebitda : cumCash + ebitda;

    const arr =
      customersEOY[y] *
      (subscriptionPerYear + avgGmvPerCustomer * takeRate * transactionCapture);
    const newCust = adds + presold[y];
    const acqSpend = marketing + newCust * salesCommissionPerNewCustomer;
    const blendedCac = newCust <= 0 ? 0 : acqSpend / newCust;

    // Key metrics (proforma Key Metrics block)
    const prevArr = y === 0 ? 0 : annual[y - 1].arr;
    const grossMargin = recognizedRev === 0 ? 0 : grossProfit / recognizedRev;
    const ebitdaMargin = recognizedRev === 0 ? 0 : ebitda / recognizedRev;
    const arrGrowth = y === 0 || prevArr === 0 ? 0 : arr / prevArr - 1;
    const netNewArr = y === 0 ? arr : arr - prevArr;
    const nrr =
      (1 - annualChurn[y]) *
      ((subscriptionPerYear + avgGmvPerCustomer * (1 + gmvGrowth[y]) * takeRate) /
        (subscriptionPerYear + avgGmvPerCustomer * takeRate));
    const burnMultiple = netNewArr <= 0 ? 0 : Math.max(0, -ebitda) / netNewArr;
    const revenuePerFte = totalFTE === 0 ? 0 : recognizedRev / totalFTE;
    const marketingPctRev = recognizedRev === 0 ? 0 : marketing / recognizedRev;

    annual.push({
      year: YEARS[y],
      yearIndex: y,
      boy,
      churned,
      adds,
      customersEOY: customersEOY[y],
      activeSeason,
      subRev,
      txnRev,
      recognizedRev,
      ach,
      platform,
      cogs,
      grossProfit,
      baseSalaries,
      benefits,
      peopleCost,
      totalFTE,
      events: events[y],
      memberships: memberships[y],
      marketing,
      opexPeople,
      opexAi,
      opexComm,
      opexMkt,
      opexGna,
      ebitda,
      cumCash,
      arr,
      newCust,
      acqSpend,
      blendedCac,
      grossMargin,
      ebitdaMargin,
      arrGrowth,
      netNewArr,
      nrr,
      burnMultiple,
      revenuePerFte,
      marketingPctRev,
    });
  }

  // ── §3.5b monthly engine (seasonalized; 72 months) ────────────────────────
  const monthly: MonthlyRow[] = [];
  let cumM = 0;
  for (let y = 0; y < NY; y++) {
    const row = annual[y];
    const div = y > 0 ? 12 : 5; // 2026 fixed cost spread over Aug–Dec
    for (let m = 1; m <= 12; m++) {
      const s = seasonal[m - 1];
      const isLaunchMonth = y > 0 || m >= 8; // 2026 spends nothing before Aug

      const subM = y > 0 ? row.subRev / 12 : 0;
      const txnM = y > 0 ? (row.txnRev * s) / 12 : 0;
      const achM = (row.ach * s) / 12; // ach already negative
      const platM = row.platform / 12;
      const jobsM = y > 0 ? (row.activeSeason * jobsPerCustomerYear * s) / 12 : 0;

      const eventsM =
        y > 0
          ? -row.events * eventTiming[m - 1]
          : fall2026[m] != null
            ? -row.events * fall2026[m]
            : 0;
      const oneTimeM = y === 0 && (m === 8 || m === 9 || m === 10) ? -oneTime[0] / 3 : 0;

      let peopleM = 0;
      let aiM = 0;
      let commM = 0;
      let gnaM = 0;
      let mktOtherM = 0;
      if (isLaunchMonth) {
        peopleM = -row.peopleCost / div;
        aiM = (-row.totalFTE * layer1AiPerFtePerYear) / div;
        commM = row.opexComm / div;
        gnaM = -gAndA[y] / div;
        mktOtherM =
          y > 0
            ? -(social[y] + digital[y] + national[y]) / 12 - (m === 1 ? memberships[y] : 0)
            : -(social[0] + digital[0] + national[0]) / 5 - (m === 8 ? memberships[0] : 0);
      }

      const netM =
        subM + txnM + achM + platM + peopleM + aiM + commM + gnaM + eventsM + mktOtherM + oneTimeM;
      cumM += netM;

      const index = y * 12 + (m - 1);
      monthly.push({
        index,
        yearIndex: y,
        month: m,
        label: `${MONTH_NAMES[m - 1]} ${YEARS[y]}`,
        subM,
        txnM,
        achM,
        platM,
        jobsM,
        peopleM,
        aiM,
        commM,
        gnaM,
        eventsM,
        mktOtherM,
        oneTimeM,
        netM,
        cumM,
      });
    }
  }

  // peakCashNeed = -min(cumM); troughMonth = argmin(cumM)
  let troughIndex = 0;
  for (let i = 1; i < monthly.length; i++) {
    if (monthly[i].cumM < monthly[troughIndex].cumM) troughIndex = i;
  }
  const peakCashNeed = -monthly[troughIndex].cumM;
  const troughMonth = monthly[troughIndex].label;

  // First year cumulative cash turns non-negative.
  const firstPositiveRow = annual.find((r) => r.cumCash >= 0);
  const firstCfPositive = firstPositiveRow ? firstPositiveRow.year : null;

  // §3.5 financing & returns
  const arr5 = annual[5].arr;
  const valuation = arr5 * arrMultiple;
  const postMoney = raiseAmount / dilution;
  const preMoney = postMoney - raiseAmount;
  const investorStakeAtExit = dilution * valuation;
  const moic = raiseAmount === 0 ? 0 : investorStakeAtExit / raiseAmount;
  const raiseCoverage = peakCashNeed === 0 ? Infinity : raiseAmount / peakCashNeed;

  const metrics: ModelMetrics = {
    arr5,
    valuation,
    peakCashNeed,
    troughIndex,
    troughMonth,
    firstCfPositive,
    postMoney,
    preMoney,
    investorStakeAtExit,
    moic,
    blendedCac5: annual[5].blendedCac,
    eventsBaseAnnual,
    membershipsAnnual,
    raiseCoverage,
  };

  return { annual, monthly, metrics };
}
