import { describe, it, expect } from "vitest";
import ExcelJS from "exceljs";
import { buildModelWorkbook } from "./exportModel";
import { compute } from "@/lib/model/engine";
import { DEFAULT_INPUTS } from "@/lib/model/data";
import { defaultGrowth } from "@/lib/model/store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS } from "@/lib/model/data";

describe("Excel export", () => {
  it("builds a 3-sheet branded workbook (Assumptions / Annual / Monthly)", async () => {
    const result = compute(DEFAULT_INPUTS);
    const buf = await buildModelWorkbook(DEFAULT_INPUTS, result, {
      investorEmail: "investor@example.com",
      generatedAt: "2026-06-16T00:00:00.000Z",
      eventToggles: Object.fromEntries(EVENT_SHOWS.map((e) => [e.id, true])),
      orgToggles: Object.fromEntries(ORG_MEMBERSHIPS.map((o) => [o.id, true])),
      growth: defaultGrowth(),
    });

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const names = wb.worksheets.map((w) => w.name);
    expect(names).toContain("Assumptions");
    expect(names).toContain("Annual P&L");
    expect(names).toContain("Monthly");

    // Annual sheet has 6 year columns + the ARR figure ($60M) somewhere.
    const annual = wb.getWorksheet("Annual P&L")!;
    const monthly = wb.getWorksheet("Monthly")!;
    expect(annual.actualColumnCount).toBeGreaterThanOrEqual(7); // label + 6 years
    expect(monthly.actualColumnCount).toBeGreaterThanOrEqual(73); // label + 72 months
  });
});
