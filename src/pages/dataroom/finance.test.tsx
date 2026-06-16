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

  it("monthly view marks the spring-2027 cash trough", () => {
    render(<FinanceTable />);
    fireEvent.click(screen.getByRole("radio", { name: /monthly cash/i }));
    expect(screen.getByText(/cash trough/i)).toBeInTheDocument();
    expect(screen.getByText("Mar 2027")).toBeInTheDocument();
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
