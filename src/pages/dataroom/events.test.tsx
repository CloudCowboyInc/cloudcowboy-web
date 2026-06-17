import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { EventsToggleList, EventsCalendar } from "@/components/dataroom";
import { modelStore } from "@/lib/model/store";
import { EVENT_SHOWS } from "@/lib/model/data";
import { EVENT_DETAILS, priceBreakdown } from "@/data/eventsData";

beforeEach(() => modelStore.resetToBaseCase());
afterEach(cleanup);

describe("Events (list) — dates & detail", () => {
  it("shows exact dates and locations in the list", () => {
    render(<EventsToggleList />);
    // Farm Progress Show — confirmed Sep 1–3, 2026 in Boone, IA
    expect(screen.getAllByText(/Sep 1–3, 2026/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Boone, IA/).length).toBeGreaterThan(0);
  });

  it("opens an event's detail with price breakdown and a sign-up link", () => {
    render(<EventsToggleList />);
    fireEvent.click(screen.getByRole("button", { name: /Farm Progress Show/i }));
    expect(screen.getByText(/Cost breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Booth \/ registration/i)).toBeInTheDocument();
    // real build-up: mileage line shows the miles
    expect(screen.getByText(/Mileage \(1,300 mi/i)).toBeInTheDocument();
    const signup = screen.getByRole("link", { name: /Sign up \/ register/i });
    expect(signup).toHaveAttribute("href", expect.stringContaining("farmprogressshow.com"));
    expect(signup).toHaveAttribute("target", "_blank");
  });
});

describe("Events (calendar)", () => {
  const all = Object.fromEntries(EVENT_SHOWS.map((e) => [e.id, true]));

  it("shows one month at a time with a priority legend", () => {
    render(<EventsCalendar includedIds={all} />);
    // Defaults to the first circuit month (Aug 2026).
    expect(screen.getByText(/Aug 2026/)).toBeInTheDocument();
    expect(screen.queryByText(/Sep 2026/)).not.toBeInTheDocument();
    expect(screen.getByText(/Top priority/i)).toBeInTheDocument();
    expect(screen.getByText(/Travel day/i)).toBeInTheDocument();
    // The month's events are listed.
    expect(screen.getByText(/Events this month/i)).toBeInTheDocument();
  });

  it("navigates to the next month with the Next button", () => {
    render(<EventsCalendar includedIds={all} />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/Sep 2026/)).toBeInTheDocument();
    expect(screen.queryByText(/Aug 2026/)).not.toBeInTheDocument();
    // Sep has Farm Progress Show in the list — clickable for full detail.
    expect(screen.getAllByText(/Farm Progress Show/i).length).toBeGreaterThan(0);
  });
});

describe("Events data integrity", () => {
  it("every event has scheduling detail", () => {
    for (const e of EVENT_SHOWS) {
      expect(EVENT_DETAILS[e.id], `missing detail for ${e.id}`).toBeTruthy();
    }
  });

  it("the proforma cost build-up sums to each event's budgeted cost", () => {
    for (const e of EVENT_SHOWS) {
      const d = EVENT_DETAILS[e.id];
      const sum = priceBreakdown(d).reduce((s, b) => s + b.amount, 0);
      expect(sum, `breakdown mismatch for ${e.name}`).toBe(e.cost);
    }
  });
});
