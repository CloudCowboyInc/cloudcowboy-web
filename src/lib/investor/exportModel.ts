/**
 * Excel export that mirrors the canonical CloudCowboy_Proforma workbook exactly
 * — all seven sheets, every formula and style — and overwrites only the "blue"
 * adjustable input cells (and the Events / Orgs Y/N toggle columns) with the
 * values this investor has set in the portal. Because the proforma's Annual
 * P&L, Monthly Cash Flow, Key Metrics and Capital Summary are all formula-driven
 * off those inputs, the exported file recalculates to the investor's exact
 * configuration when opened (we force a full recalc on load).
 *
 * The template lives at /public/proforma-template.xlsx and is fetched at export
 * time; exceljs is imported dynamically so it stays out of the main bundle.
 */
import type { ModelInputs, ModelResult } from "@/lib/model/types";
import type { GrowthState } from "@/lib/model/store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS, STAFF } from "@/lib/model/data";

const TEMPLATE_URL = `${import.meta.env.BASE_URL}proforma-template.xlsx`;

export interface ExportMeta {
  investorEmail?: string | null;
  generatedAt: string; // ISO
  eventToggles: Record<string, boolean>;
  orgToggles: Record<string, boolean>;
  growth: GrowthState;
}

/** Fetch the bundled proforma template as an ArrayBuffer (browser default). */
async function fetchTemplate(): Promise<ArrayBuffer> {
  const res = await fetch(TEMPLATE_URL);
  if (!res.ok) throw new Error(`Could not load proforma template (${res.status})`);
  return res.arrayBuffer();
}

const COLS = ["B", "C", "D", "E", "F", "G"]; // Year 0..5 = 2026..2031

/**
 * Build the workbook from the proforma template, injecting the investor's
 * portal values. Pass `templateBuffer` to supply the template directly (used by
 * tests / server contexts where `fetch` of a public asset is unavailable).
 */
export async function buildModelWorkbook(
  inputs: ModelInputs,
  _result: ModelResult,
  meta: ExportMeta,
  templateBuffer?: ArrayBuffer,
): Promise<ArrayBuffer> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(templateBuffer ?? (await fetchTemplate()));

  const pf = wb.getWorksheet("Proforma");
  if (!pf) throw new Error("Proforma sheet missing from template");

  // Overwrite a value while preserving the template cell's existing style.
  const set = (
    ws: import("exceljs").Worksheet,
    addr: string,
    value: string | number,
  ) => {
    ws.getCell(addr).value = value;
  };
  /** Write a 6-long per-year series across columns B..G of one Proforma row. */
  const series = (row: number, arr: readonly number[]) =>
    COLS.forEach((c, i) => set(pf, `${c}${row}`, arr[i]));

  // ── Proforma · CUSTOMERS & DEMAND (rows 9–13) ───────────────────────────
  series(9, inputs.customersEOY);
  series(10, inputs.presold);
  series(11, inputs.preSeasonCapture);
  series(12, inputs.annualChurn);
  series(13, inputs.gmvGrowth);

  // ── Proforma · MARKETING & CAC (rows 16–21) ─────────────────────────────
  series(16, inputs.social);
  series(17, inputs.digital);
  // Event circuit per year = included-circuit base × that year's factor.
  series(18, inputs.eventYearFactor.map((f) => Math.round(inputs.eventsBaseAnnual * f)));
  series(19, inputs.national);
  // Memberships are applied at the same annual figure every year.
  series(20, new Array(6).fill(inputs.membershipsAnnual));
  series(21, inputs.oneTime);

  // ── Proforma · G&A (row 25) ─────────────────────────────────────────────
  series(25, inputs.gAndA);

  // ── Proforma · STAFFING — FTE (rows 28–34) and salary (rows 37–43) ──────
  STAFF.forEach((_, i) => {
    series(28 + i, inputs.staff[i].fte);
    series(37 + i, inputs.staff[i].sal);
  });

  // ── Proforma · Benefits & payroll load % (row 53) ───────────────────────
  series(53, inputs.benefitsLoad);

  // ── Proforma · KEY ASSUMPTIONS (J7–J17) ─────────────────────────────────
  set(pf, "J7", inputs.avgGmvPerCustomer);
  set(pf, "J8", inputs.subscriptionPerYear);
  set(pf, "J9", inputs.takeRate);
  set(pf, "J10", inputs.transactionCapture);
  set(pf, "J11", inputs.jobsPerCustomerYear);
  set(pf, "J12", inputs.achCostPerJob);
  set(pf, "J13", inputs.layer1AiPerFtePerYear);
  set(pf, "J14", inputs.platformCogsPerCustomer);
  set(pf, "J15", inputs.salesCommissionPerNewCustomer);
  set(pf, "J16", inputs.arrMultiple);
  set(pf, "J17", inputs.targetCac);

  // ── Events sheet · Y/N toggle column B (rows 13–30, in EVENT_SHOWS order) ─
  const events = wb.getWorksheet("Events");
  if (events) {
    EVENT_SHOWS.forEach((e, i) => {
      events.getCell(`B${13 + i}`).value = meta.eventToggles[e.id] ? "Y" : "N";
    });
  }

  // ── Orgs & Boards sheet · Y/N toggle column B (rows 5–16) ────────────────
  const orgs = wb.getWorksheet("Orgs & Boards");
  if (orgs) {
    ORG_MEMBERSHIPS.forEach((o, i) => {
      orgs.getCell(`B${5 + i}`).value = meta.orgToggles[o.id] ? "Y" : "N";
    });
  }

  // Note: we deliberately do NOT stamp investor/date into a header cell. exceljs
  // shares one style record across the sheets' title cells, so re-styling any
  // cell that shares it (e.g. A1) silently recolours every sheet's A2 title —
  // making the titles look "missing". Whose config this is and when it was
  // exported is carried by the filename, the emailed copy, and the saved config.

  // Force Excel / Sheets to recalculate every formula against the new inputs.
  wb.calcProperties.fullCalcOnLoad = true;

  return wb.xlsx.writeBuffer() as Promise<ArrayBuffer>;
}

/** Trigger a browser download of the model workbook. */
export async function downloadModelExcel(
  inputs: ModelInputs,
  result: ModelResult,
  meta: ExportMeta,
): Promise<ArrayBuffer> {
  const buf = await buildModelWorkbook(inputs, result, meta);
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const aEl = document.createElement("a");
  aEl.href = url;
  const stamp = new Date(meta.generatedAt).toISOString().slice(0, 10);
  aEl.download = `cloud-cowboy-proforma-${stamp}.xlsx`;
  document.body.appendChild(aEl);
  aEl.click();
  aEl.remove();
  URL.revokeObjectURL(url);
  return buf;
}
