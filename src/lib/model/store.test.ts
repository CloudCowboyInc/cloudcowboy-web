import { describe, it, expect, beforeEach } from "vitest";
import { modelStore } from "./store";
import { EVENT_SHOWS, ORG_MEMBERSHIPS } from "./data";

describe("model store — dynamic connection (toggles → finance)", () => {
  beforeEach(() => modelStore.resetToBaseCase());

  it("base case derives the all-Y totals", () => {
    expect(modelStore.getState().inputs.eventsBaseAnnual).toBe(93752);
    expect(modelStore.getState().inputs.membershipsAnnual).toBe(2325);
  });

  it("turning off an event reduces eventsBaseAnnual by its cost", () => {
    const xpo = EVENT_SHOWS.find((e) => e.name.startsWith("XPONENTIAL"))!;
    modelStore.toggleEvent(xpo.id, false);
    expect(modelStore.getState().inputs.eventsBaseAnnual).toBe(93752 - xpo.cost);
  });

  it("turning off events lowers peak cash need (finance reacts live)", () => {
    const before = modelStore.getResult().metrics.peakCashNeed;
    // drop the whole circuit
    EVENT_SHOWS.forEach((e) => modelStore.toggleEvent(e.id, false));
    const after = modelStore.getResult().metrics.peakCashNeed;
    expect(after).toBeLessThan(before);
  });

  it("turning off an org reduces membershipsAnnual by its dues", () => {
    const cda = ORG_MEMBERSHIPS.find((o) => o.name.startsWith("Commercial Drone"))!;
    modelStore.toggleOrg(cda.id, false);
    expect(modelStore.getState().inputs.membershipsAnnual).toBe(2325 - cda.dues);
  });

  it("editing the raise updates post/pre money", () => {
    modelStore.setRaiseAmount(2_000_000);
    modelStore.setDilution(0.25);
    const m = modelStore.getResult().metrics;
    expect(m.postMoney).toBeCloseTo(8_000_000, 0);
    expect(m.preMoney).toBeCloseTo(6_000_000, 0);
  });

  it("setPostMoney derives dilution consistently", () => {
    modelStore.setRaiseAmount(1_000_000);
    modelStore.setPostMoney(5_000_000);
    expect(modelStore.getState().inputs.dilution).toBeCloseTo(0.2, 6);
  });

  it("reset restores the base case", () => {
    modelStore.setRaiseAmount(9_999_999);
    modelStore.resetToBaseCase();
    expect(modelStore.getState().inputs.raiseAmount).toBe(1_000_000);
  });
});
