import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { buildModelWorkbook } from "./exportModel";
import { compute } from "@/lib/model/engine";
import { DEFAULT_INPUTS } from "@/lib/model/data";
import { defaultGrowth } from "@/lib/model/store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS } from "@/lib/model/data";

/** The same template the app fetches at /proforma-template.xlsx. */
function templateBuffer(): ArrayBuffer {
  // exceljs accepts a Node Buffer here; cast to satisfy the ArrayBuffer param.
  return readFileSync(
    resolve(__dirname, "../../../public/proforma-template.xlsx"),
  ) as unknown as ArrayBuffer;
}

describe("Excel export — mirrors the proforma with portal values", () => {
  it("keeps all seven proforma sheets and forces recalc on load", async () => {
    const result = compute(DEFAULT_INPUTS);
    const buf = await buildModelWorkbook(
      DEFAULT_INPUTS,
      result,
      {
        investorEmail: "investor@example.com",
        generatedAt: "2026-06-18T00:00:00.000Z",
        eventToggles: Object.fromEntries(EVENT_SHOWS.map((e) => [e.id, true])),
        orgToggles: Object.fromEntries(ORG_MEMBERSHIPS.map((o) => [o.id, true])),
        growth: defaultGrowth(),
      },
      templateBuffer(),
    );

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const names = wb.worksheets.map((w) => w.name);
    for (const s of [
      "Proforma",
      "Monthly Cash Flow",
      "Events",
      "Orgs & Boards",
      "Capital Summary",
      "Seasonality",
      "Story & Notes",
    ]) {
      expect(names, `missing sheet ${s}`).toContain(s);
    }
    // exceljs writes <calcPr fullCalcOnLoad="1"> but doesn't parse it back, so
    // assert against the raw workbook.xml that Excel/Sheets will recalc on open.
    const zip = await JSZip.loadAsync(buf);
    const workbookXml = await zip.file("xl/workbook.xml")!.async("string");
    expect(workbookXml).toContain('fullCalcOnLoad="1"');

    // Formula-driven P&L is preserved (not flattened to static numbers).
    const pf = wb.getWorksheet("Proforma")!;
    const b22 = pf.getCell("B22").value as { formula?: string };
    expect(b22.formula).toContain("SUM"); // total marketing formula preserved
    // ARR (G87) stays a formula cell (master or shared), not a flattened number.
    const g87 = pf.getCell("G87").value as { formula?: string; sharedFormula?: string };
    expect(g87.formula ?? g87.sharedFormula).toBeTruthy();
  });

  it("injects the investor's blue inputs and Y/N toggles", async () => {
    const inputs = structuredClone(DEFAULT_INPUTS);
    // Diverge a few inputs from the default proforma to prove they are written.
    inputs.subscriptionPerYear = 15000;
    inputs.avgGmvPerCustomer = 1000000;
    inputs.customersEOY = [0, 150, 350, 700, 1300, 2100];

    const eventToggles = Object.fromEntries(EVENT_SHOWS.map((e, i) => [e.id, i !== 1])); // drop Farm Progress
    const orgToggles = Object.fromEntries(ORG_MEMBERSHIPS.map((o, i) => [o.id, i !== 0])); // drop CoAAA

    const buf = await buildModelWorkbook(
      inputs,
      compute(inputs),
      {
        investorEmail: "chris@cloudcowboy.us",
        generatedAt: "2026-06-18T00:00:00.000Z",
        eventToggles,
        orgToggles,
        growth: defaultGrowth(),
      },
      templateBuffer(),
    );

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const pf = wb.getWorksheet("Proforma")!;
    expect(pf.getCell("J8").value).toBe(15000); // subscription / yr
    expect(pf.getCell("J7").value).toBe(1000000); // avg GMV
    expect(pf.getCell("C9").value).toBe(150); // customers EOY 2027
    expect(pf.getCell("G9").value).toBe(2100); // customers EOY 2031

    const events = wb.getWorksheet("Events")!;
    expect(events.getCell("B13").value).toBe("Y"); // Nebraska (kept)
    expect(events.getCell("B14").value).toBe("N"); // Farm Progress (dropped)

    const orgs = wb.getWorksheet("Orgs & Boards")!;
    expect(orgs.getCell("B5").value).toBe("N"); // CoAAA (dropped)
    expect(orgs.getCell("B6").value).toBe("Y"); // NAAA (kept)
  });
});
