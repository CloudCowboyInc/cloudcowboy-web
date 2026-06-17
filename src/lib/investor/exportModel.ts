/**
 * Branded Excel export of a full model configuration: an Assumptions sheet, an
 * Annual P&L sheet, and a detailed Monthly sheet. exceljs is imported
 * dynamically so it stays out of the main bundle.
 */
import type { ModelInputs, ModelResult } from "@/lib/model/types";
import type { GrowthState } from "@/lib/model/store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS, YEARS } from "@/lib/model/data";

const BRAND = "FFD4782F"; // Cloud Cowboy orange
const DARK = "FF1A1E2B";
const LIGHT = "FFF3EEE7";

export interface ExportMeta {
  investorEmail?: string | null;
  generatedAt: string; // ISO
  eventToggles: Record<string, boolean>;
  orgToggles: Record<string, boolean>;
  growth: GrowthState;
}

/** Build the workbook; returns an xlsx ArrayBuffer. */
export async function buildModelWorkbook(
  inputs: ModelInputs,
  result: ModelResult,
  meta: ExportMeta,
): Promise<ArrayBuffer> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "Cloud Cowboy";
  wb.created = new Date(meta.generatedAt);

  const money = "$#,##0";
  const pctFmt = "0.0%";

  // Generic header styler.
  const titleBlock = (ws: import("exceljs").Worksheet, subtitle: string) => {
    ws.mergeCells("A1:D1");
    const t = ws.getCell("A1");
    t.value = "Cloud Cowboy — Investor Data Room";
    t.font = { name: "Calibri", size: 16, bold: true, color: { argb: BRAND } };
    ws.mergeCells("A2:D2");
    const s = ws.getCell("A2");
    s.value = subtitle;
    s.font = { italic: true, color: { argb: "FF888888" } };
    ws.mergeCells("A3:D3");
    ws.getCell("A3").value = `Configuration for ${meta.investorEmail ?? "—"} · generated ${new Date(meta.generatedAt).toLocaleString("en-US")}`;
    ws.getCell("A3").font = { size: 9, color: { argb: "FF888888" } };
  };

  const headerRow = (ws: import("exceljs").Worksheet, row: number, cols: number) => {
    const r = ws.getRow(row);
    for (let c = 1; c <= cols; c++) {
      const cell = r.getCell(c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND } };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.border = { bottom: { style: "thin", color: { argb: DARK } } };
    }
  };

  // ── Sheet 1: Assumptions ────────────────────────────────────────────────
  const a = wb.addWorksheet("Assumptions", { properties: { tabColor: { argb: BRAND } } });
  a.columns = [{ width: 34 }, { width: 18 }, { width: 18 }, { width: 18 }];
  titleBlock(a, "Assumptions & configuration");
  let row = 5;
  const kv = (label: string, value: string | number, fmt?: string) => {
    const r = a.getRow(row++);
    r.getCell(1).value = label;
    r.getCell(1).font = { color: { argb: "FF555555" } };
    const v = r.getCell(2);
    v.value = value;
    if (fmt) v.numFmt = fmt;
    v.font = { bold: true };
  };
  const section = (label: string) => {
    const r = a.getRow(row);
    r.getCell(1).value = label;
    r.getCell(1).font = { bold: true, color: { argb: BRAND } };
    headerRow(a, row, 4);
    r.getCell(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    row++;
  };

  section("Unit economics & pricing");
  kv("Avg GMV / customer", inputs.avgGmvPerCustomer, money);
  kv("Subscription / yr", inputs.subscriptionPerYear, money);
  kv("Take rate", inputs.takeRate, pctFmt);
  kv("Transaction capture", inputs.transactionCapture, pctFmt);
  kv("Jobs / customer / yr", inputs.jobsPerCustomerYear);
  kv("ACH cost / job", inputs.achCostPerJob, money);
  kv("Platform COGS / customer", inputs.platformCogsPerCustomer, money);
  kv("Sales commission / new cust", inputs.salesCommissionPerNewCustomer, money);
  kv("Layer-1 AI / FTE / yr", inputs.layer1AiPerFtePerYear, money);
  kv("ARR multiple", inputs.arrMultiple);
  kv("Target CAC", inputs.targetCac, money);
  row++;

  section("Raise & returns");
  kv("Raise amount", inputs.raiseAmount, money);
  kv("Dilution", inputs.dilution, pctFmt);
  kv("Post-money", result.metrics.postMoney, money);
  kv("Pre-money", result.metrics.preMoney, money);
  kv("Year-5 valuation", result.metrics.valuation, money);
  kv("Investor stake at year 5", result.metrics.investorStakeAtExit, money);
  kv("MOIC", result.metrics.moic);
  kv("Peak cash need", result.metrics.peakCashNeed, money);
  kv("Trough month", result.metrics.troughMonth);
  row++;

  section("Per-year series");
  const yearHeader = a.getRow(row);
  yearHeader.getCell(1).value = "Series";
  YEARS.forEach((y, i) => (yearHeader.getCell(2 + i).value = y));
  headerRow(a, row, 1 + YEARS.length);
  row++;
  const seriesRow = (label: string, arr: number[], fmt?: string) => {
    const r = a.getRow(row++);
    r.getCell(1).value = label;
    arr.forEach((v, i) => {
      const c = r.getCell(2 + i);
      c.value = v;
      if (fmt) c.numFmt = fmt;
    });
  };
  // widen for 6 years
  for (let i = 0; i < YEARS.length; i++) a.getColumn(2 + i).width = 14;
  seriesRow("Customers (EOY)", inputs.customersEOY);
  seriesRow("Annual churn", inputs.annualChurn, pctFmt);
  seriesRow("Social marketing", inputs.social, money);
  seriesRow("Digital marketing", inputs.digital, money);
  seriesRow("National marketing", inputs.national, money);
  seriesRow("G&A", inputs.gAndA, money);
  row++;

  section("Growth models");
  (Object.keys(meta.growth) as (keyof GrowthState)[]).forEach((k) => {
    if (k === "salaryInflation") {
      const g = meta.growth.salaryInflation;
      kv("Salary inflation", g.active ? `${(g.rate * 100).toFixed(1)}% YoY` : "Following plan");
    } else {
      const g = meta.growth[k];
      kv(String(k), g.active ? `2027 ${g.first} · ${(g.rate * 100).toFixed(1)}% YoY` : "Following plan");
    }
  });
  row++;

  section("Event circuit");
  const incEvents = EVENT_SHOWS.filter((e) => meta.eventToggles[e.id]);
  kv("Shows included", `${incEvents.length} / ${EVENT_SHOWS.length}`);
  kv("Circuit total", inputs.eventsBaseAnnual, money);
  incEvents.forEach((e) => kv(`  ${e.name}`, e.cost, money));
  row++;
  section("Org memberships");
  const incOrgs = ORG_MEMBERSHIPS.filter((o) => meta.orgToggles[o.id]);
  kv("Memberships included", `${incOrgs.length} / ${ORG_MEMBERSHIPS.length}`);
  kv("Memberships total", inputs.membershipsAnnual, money);

  // ── Sheet 2: Annual P&L ─────────────────────────────────────────────────
  const an = wb.addWorksheet("Annual P&L", { properties: { tabColor: { argb: BRAND } } });
  an.columns = [{ width: 28 }, ...YEARS.map(() => ({ width: 16 }))];
  titleBlock(an, "Annual P&L (2026–2031)");
  let ar = 5;
  const annHeader = an.getRow(ar);
  annHeader.getCell(1).value = "USD";
  YEARS.forEach((y, i) => (annHeader.getCell(2 + i).value = y));
  headerRow(an, ar, 1 + YEARS.length);
  ar++;
  const annRow = (label: string, get: (i: number) => number, fmt = money, bold = false) => {
    const r = an.getRow(ar++);
    r.getCell(1).value = label;
    if (bold) r.getCell(1).font = { bold: true };
    result.annual.forEach((_, i) => {
      const c = r.getCell(2 + i);
      c.value = get(i);
      c.numFmt = fmt;
      if (bold) c.font = { bold: true };
    });
  };
  const A = result.annual;
  annRow("Beginning of year", (i) => A[i].boy, "#,##0");
  annRow("Churned", (i) => A[i].churned, "#,##0");
  annRow("Net adds", (i) => A[i].adds, "#,##0");
  annRow("Customers (EOY)", (i) => A[i].customersEOY, "#,##0", true);
  annRow("Active in season", (i) => A[i].activeSeason, "#,##0");
  annRow("Subscription revenue", (i) => A[i].subRev);
  annRow("Transaction revenue", (i) => A[i].txnRev);
  annRow("Recognized revenue", (i) => A[i].recognizedRev, money, true);
  annRow("ACH / job costs", (i) => A[i].ach);
  annRow("Platform COGS", (i) => A[i].platform);
  annRow("Gross profit", (i) => A[i].grossProfit, money, true);
  annRow("People", (i) => A[i].opexPeople);
  annRow("Layer-1 AI", (i) => A[i].opexAi);
  annRow("Sales commission", (i) => A[i].opexComm);
  annRow("Marketing", (i) => A[i].opexMkt);
  annRow("G&A", (i) => A[i].opexGna);
  annRow("EBITDA", (i) => A[i].ebitda, money, true);
  annRow("Cumulative cash", (i) => A[i].cumCash, money, true);
  annRow("Investor capital in", (i) => (i === 0 ? inputs.raiseAmount : 0));
  annRow("Cash incl. investment", (i) => A[i].cumCash + inputs.raiseAmount, money, true);
  annRow("ARR", (i) => A[i].arr, money, true);
  annRow("New customers", (i) => A[i].newCust, "#,##0");
  annRow("Blended CAC", (i) => A[i].blendedCac);
  annRow("Total FTE", (i) => A[i].totalFTE, "0.0");
  an.views = [{ state: "frozen", xSplit: 1, ySplit: 5 }];

  // ── Sheet 3: Monthly ────────────────────────────────────────────────────
  const m = wb.addWorksheet("Monthly", { properties: { tabColor: { argb: BRAND } } });
  m.columns = [{ width: 26 }, ...result.monthly.map(() => ({ width: 11 }))];
  titleBlock(m, "Monthly P&L (72 months, seasonalized)");
  let mr = 5;
  const mh = m.getRow(mr);
  mh.getCell(1).value = "USD";
  result.monthly.forEach((mm, i) => (mh.getCell(2 + i).value = mm.label));
  headerRow(m, mr, 1 + result.monthly.length);
  mr++;
  const monRow = (label: string, get: (i: number) => number, bold = false) => {
    const r = m.getRow(mr++);
    r.getCell(1).value = label;
    if (bold) r.getCell(1).font = { bold: true };
    result.monthly.forEach((_, i) => {
      const c = r.getCell(2 + i);
      c.value = Math.round(get(i));
      c.numFmt = money;
      if (bold) c.font = { bold: true };
    });
  };
  const M = result.monthly;
  monRow("Subscription", (i) => M[i].subM);
  monRow("Transaction", (i) => M[i].txnM);
  monRow("Recognized revenue", (i) => M[i].subM + M[i].txnM, true);
  monRow("ACH / job costs", (i) => M[i].achM);
  monRow("Platform COGS", (i) => M[i].platM);
  monRow("People", (i) => M[i].peopleM);
  monRow("Layer-1 AI", (i) => M[i].aiM);
  monRow("Sales commission", (i) => M[i].commM);
  monRow("Marketing", (i) => M[i].mktOtherM + M[i].eventsM + M[i].oneTimeM);
  monRow("G&A", (i) => M[i].gnaM);
  monRow("Net cash flow", (i) => M[i].netM, true);
  monRow("Cumulative cash", (i) => M[i].cumM, true);
  monRow("Investor capital in", (i) => (i === 0 ? inputs.raiseAmount : 0));
  monRow("Cash incl. investment", (i) => M[i].cumM + inputs.raiseAmount, true);
  m.views = [{ state: "frozen", xSplit: 1, ySplit: 5 }];

  return wb.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}

/** Trigger a browser download of the model workbook. */
export async function downloadModelExcel(
  inputs: ModelInputs,
  result: ModelResult,
  meta: ExportMeta,
): Promise<ArrayBuffer> {
  const buf = await buildModelWorkbook(inputs, result, meta);
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const aEl = document.createElement("a");
  aEl.href = url;
  const stamp = new Date(meta.generatedAt).toISOString().slice(0, 10);
  aEl.download = `cloud-cowboy-model-${stamp}.xlsx`;
  document.body.appendChild(aEl);
  aEl.click();
  aEl.remove();
  URL.revokeObjectURL(url);
  return buf;
}
