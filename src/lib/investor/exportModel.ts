/**
 * Excel export that is a true copy of the canonical CloudCowboy_Proforma
 * workbook — all seven sheets, every formula, style, the brand logo on each
 * sheet AND the embedded charts — with only the "blue" adjustable input cells
 * (and the Events / Orgs Y/N toggle columns) overwritten with this investor's
 * effective portal values.
 *
 * We deliberately do NOT round-trip the file through exceljs: exceljs drops
 * embedded charts and rewrites drawings/styles (which previously lost the
 * graphs and corrupted the sheet titles). Instead we edit the input-cell values
 * directly inside the xlsx zip with JSZip, leaving every other byte — charts,
 * drawings, media, styles, formulas — exactly as the source proforma. Because
 * the whole model is formula-driven off those inputs, the file recalculates to
 * the investor's configuration on open (we set fullCalcOnLoad).
 *
 * The template lives at /public/proforma-template.xlsx and is fetched at export
 * time; JSZip is imported dynamically so it stays out of the main bundle.
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

/** XML-escape a sheet name for matching against workbook.xml. */
const xmlName = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Match a single cell element `<c r="ADDR" ...>...</c>` (or self-closing). */
const cellRe = (addr: string) =>
  new RegExp(`<c r="${addr}"([^>]*?)(?:/>|>[\\s\\S]*?</c>)`);

/** Preserve the cell's style index (s="N") when rewriting it. */
const styleAttr = (attrs: string) => {
  const m = / s="(\d+)"/.exec(attrs);
  return m ? ` s="${m[1]}"` : "";
};

/** Edits the input-cell values of one worksheet's XML in place. */
class SheetEditor {
  private xml: string;
  constructor(xml: string) {
    this.xml = xml;
  }
  /** Set a numeric value, keeping the cell's style. */
  num(addr: string, value: number): this {
    if (!cellRe(addr).test(this.xml)) throw new Error(`cell ${addr} not found`);
    this.xml = this.xml.replace(cellRe(addr), (_m, attrs: string) => `<c r="${addr}"${styleAttr(attrs)}><v>${value}</v></c>`);
    return this;
  }
  /** Set a short string via an inline string (no shared-string table edits). */
  str(addr: string, value: string): this {
    if (!cellRe(addr).test(this.xml)) throw new Error(`cell ${addr} not found`);
    this.xml = this.xml.replace(
      cellRe(addr),
      (_m, attrs: string) => `<c r="${addr}"${styleAttr(attrs)} t="inlineStr"><is><t>${value}</t></is></c>`,
    );
    return this;
  }
  toString(): string {
    return this.xml;
  }
}

/** Resolve "Sheet name" → "xl/worksheets/sheetN.xml" via the workbook rels. */
function resolveSheetPath(workbookXml: string, relsXml: string, name: string): string {
  const rid = new RegExp(`<sheet name="${xmlName(name)}"[^>]*r:id="(rId\\d+)"`).exec(workbookXml)?.[1];
  if (!rid) throw new Error(`sheet "${name}" not found in workbook`);
  const target = new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"`).exec(relsXml)?.[1];
  if (!target) throw new Error(`relationship for ${rid} not found`);
  return `xl/${target.replace(/^\//, "")}`;
}

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
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(templateBuffer ?? (await fetchTemplate()));

  const workbookXml = await zip.file("xl/workbook.xml")!.async("string");
  const relsXml = await zip.file("xl/_rels/workbook.xml.rels")!.async("string");

  // ── Proforma sheet — the blue adjustable inputs ─────────────────────────
  const pfPath = resolveSheetPath(workbookXml, relsXml, "Proforma");
  const pf = new SheetEditor(await zip.file(pfPath)!.async("string"));
  const series = (row: number, arr: readonly number[]) => COLS.forEach((c, i) => pf.num(`${c}${row}`, arr[i]));

  series(9, inputs.customersEOY);
  series(10, inputs.presold);
  series(11, inputs.preSeasonCapture);
  series(12, inputs.annualChurn);
  series(13, inputs.gmvGrowth);
  series(16, inputs.social);
  series(17, inputs.digital);
  // Event circuit per year = included-circuit base × that year's factor.
  series(18, inputs.eventYearFactor.map((f) => Math.round(inputs.eventsBaseAnnual * f)));
  series(19, inputs.national);
  // Memberships are applied at the same annual figure every year.
  series(20, new Array(6).fill(inputs.membershipsAnnual));
  series(21, inputs.oneTime);
  series(25, inputs.gAndA);
  STAFF.forEach((_, i) => {
    series(28 + i, inputs.staff[i].fte);
    series(37 + i, inputs.staff[i].sal);
  });
  series(53, inputs.benefitsLoad);
  // Key Assumptions (J7–J17)
  pf.num("J7", inputs.avgGmvPerCustomer)
    .num("J8", inputs.subscriptionPerYear)
    .num("J9", inputs.takeRate)
    .num("J10", inputs.transactionCapture)
    .num("J11", inputs.jobsPerCustomerYear)
    .num("J12", inputs.achCostPerJob)
    .num("J13", inputs.layer1AiPerFtePerYear)
    .num("J14", inputs.platformCogsPerCustomer)
    .num("J15", inputs.salesCommissionPerNewCustomer)
    .num("J16", inputs.arrMultiple)
    .num("J17", inputs.targetCac);
  zip.file(pfPath, pf.toString());

  // ── Events sheet — Y/N toggle column B (rows 13–30, EVENT_SHOWS order) ───
  const evPath = resolveSheetPath(workbookXml, relsXml, "Events");
  const ev = new SheetEditor(await zip.file(evPath)!.async("string"));
  EVENT_SHOWS.forEach((e, i) => ev.str(`B${13 + i}`, meta.eventToggles[e.id] ? "Y" : "N"));
  zip.file(evPath, ev.toString());

  // ── Orgs & Boards sheet — Y/N toggle column B (rows 5–16) ────────────────
  const ogPath = resolveSheetPath(workbookXml, relsXml, "Orgs & Boards");
  const og = new SheetEditor(await zip.file(ogPath)!.async("string"));
  ORG_MEMBERSHIPS.forEach((o, i) => og.str(`B${5 + i}`, meta.orgToggles[o.id] ? "Y" : "N"));
  zip.file(ogPath, og.toString());

  // ── Force a full recalc on open so the formulas reflect the new inputs ───
  let wb = workbookXml;
  if (/<calcPr\b/.test(wb)) {
    if (!/fullCalcOnLoad=/.test(wb)) wb = wb.replace(/<calcPr\b/, '<calcPr fullCalcOnLoad="1"');
  } else {
    wb = wb.replace("</workbook>", '<calcPr fullCalcOnLoad="1"/></workbook>');
  }
  zip.file("xl/workbook.xml", wb);

  return zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
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
