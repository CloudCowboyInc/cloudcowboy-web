import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import {
  FinanceTable,
  RaisePanel,
  AssumptionPanel,
} from "@/components/dataroom";
import { modelStore } from "@/lib/model/store";

beforeEach(() => modelStore.resetToBaseCase());
afterEach(cleanup);

describe("Finance (WAR_ROOM) — proforma table reconciles to §3.9", () => {
  it("renders the P&L groups and the $60M ARR for 2031", () => {
    render(<FinanceTable />);
    expect(screen.getByText("Recognized revenue")).toBeInTheDocument();
    expect(screen.getByText("EBITDA")).toBeInTheDocument();
    expect(screen.getByText("Blended CAC")).toBeInTheDocument();
    // 2031 ARR cell = $60,000,000
    expect(screen.getByText("$60,000,000")).toBeInTheDocument();
  });

  it("monthly Excel view lays out line items incl. investor capital", () => {
    render(<FinanceTable />);
    fireEvent.click(screen.getByRole("radio", { name: /monthly \(excel\)/i }));
    expect(screen.getByText("Investor capital in")).toBeInTheDocument();
    expect(screen.getByText("Cash incl. investment")).toBeInTheDocument();
    // months are columns — Mar '27 (the trough month) is a header
    expect(screen.getByText("Mar '27")).toBeInTheDocument();
  });

  it("annual view includes the investor capital line", () => {
    render(<FinanceTable />);
    expect(screen.getByText("Investor capital in")).toBeInTheDocument();
  });
});

describe("Finance (WAR_ROOM) — raise panel", () => {
  it("shows the base deal terms (post $5.0M / pre $4.0M, 240× MOIC)", () => {
    render(<RaisePanel />);
    expect(screen.getAllByText("$5.0M").length).toBeGreaterThan(0); // post-money
    expect(screen.getAllByText("$4.0M").length).toBeGreaterThan(0); // pre-money
    expect(screen.getByText("240×")).toBeInTheDocument(); // MOIC
  });
});

describe("Finance (WAR_ROOM) — assumptions propagate live", () => {
  it("changing the ARR multiple updates the valuation in the raise panel", () => {
    render(
      <>
        <AssumptionPanel />
        <RaisePanel />
      </>,
    );
    // base valuation = $1.2B
    expect(screen.getAllByText("$1.2B").length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText("ARR multiple"), { target: { value: "10" } });
    // 60M ARR × 10 = $600M
    expect(screen.getAllByText("$600M").length).toBeGreaterThan(0);
    expect(modelStore.getResult().metrics.valuation).toBe(600_000_000);
  });

  it("changing transaction capture changes recognized revenue / ARR", () => {
    render(<AssumptionPanel />);
    const before = modelStore.getResult().metrics.arr5;
    fireEvent.change(screen.getByLabelText("Transaction capture"), { target: { value: "50" } });
    const after = modelStore.getResult().metrics.arr5;
    expect(after).toBeLessThan(before);
  });
});

describe("Finance (WAR_ROOM) — growth models (first value + YoY %)", () => {
  it("default is 'follow plan' so the base case is unchanged", () => {
    modelStore.resetToBaseCase();
    expect(modelStore.getState().growth.customersEOY.active).toBe(false);
    expect(modelStore.getState().inputs.customersEOY).toEqual([0, 125, 300, 650, 1250, 2000]);
  });

  it("activating a growth lever regenerates the series geometrically", () => {
    modelStore.resetToBaseCase();
    modelStore.setGrowth("customersEOY", { active: true, first: 200, rate: 0.5 });
    const c = modelStore.getState().inputs.customersEOY;
    expect(c[0]).toBe(0); // 2026 preserved
    expect(c[1]).toBe(200); // 2027 start
    expect(c[2]).toBe(300); // 200 × 1.5
    expect(c[3]).toBe(450); // 200 × 1.5^2
    modelStore.resetToBaseCase();
    expect(modelStore.getState().inputs.customersEOY[1]).toBe(125);
  });
});
