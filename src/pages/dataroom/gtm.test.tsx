import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import {
  EventsToggleList,
  OrgsToggleList,
  FinanceImpactReadout,
} from "@/components/dataroom";
import { modelStore } from "@/lib/model/store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS } from "@/lib/model/data";

beforeEach(() => modelStore.resetToBaseCase());
afterEach(cleanup);

describe("GTM (ROUNDUP) — Events drive finance live", () => {
  it("starts at the full circuit (18/18) and base totals", () => {
    render(<EventsToggleList />);
    expect(screen.getByText(`${EVENT_SHOWS.length} / ${EVENT_SHOWS.length}`)).toBeInTheDocument();
    expect(modelStore.getState().inputs.eventsBaseAnnual).toBe(93752);
  });

  it("toggling a show off updates the store and lowers peak cash need", () => {
    render(
      <>
        <EventsToggleList />
        <FinanceImpactReadout />
      </>,
    );
    const before = modelStore.getResult().metrics.peakCashNeed;
    // Exclude all shows via the bulk button.
    fireEvent.click(screen.getByRole("button", { name: /exclude all/i }));
    const after = modelStore.getResult().metrics.peakCashNeed;
    expect(modelStore.getState().inputs.eventsBaseAnnual).toBe(0);
    expect(after).toBeLessThan(before);
  });
});

describe("GTM (ROUNDUP) — Orgs drive finance live", () => {
  it("starts at 12/12 memberships and base total", () => {
    render(<OrgsToggleList />);
    expect(screen.getByText(`${ORG_MEMBERSHIPS.length} / ${ORG_MEMBERSHIPS.length}`)).toBeInTheDocument();
    expect(modelStore.getState().inputs.membershipsAnnual).toBe(2325);
  });

  it("excluding all memberships zeroes membershipsAnnual", () => {
    render(<OrgsToggleList />);
    fireEvent.click(screen.getByRole("button", { name: /exclude all/i }));
    expect(modelStore.getState().inputs.membershipsAnnual).toBe(0);
  });
});

describe("GTM (ROUNDUP) — FinanceImpactReadout", () => {
  it("renders the live finance link metrics", () => {
    render(<FinanceImpactReadout />);
    expect(screen.getByText(/Live finance impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Peak cash need/i)).toBeInTheDocument();
    expect(screen.getByText(/Year 5 valuation/i)).toBeInTheDocument();
  });
});
