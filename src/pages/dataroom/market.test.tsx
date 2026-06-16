import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MarketPage from "./MarketPage";
import { MARKET_SEGMENTS, MARKET_TIERS } from "@/data/marketData";

afterEach(cleanup);

const renderPage = () => render(<MemoryRouter><MarketPage /></MemoryRouter>);

describe("Market page (TERRITORY) — funnel", () => {
  it("renders the exact TAM/SAM/SOM ARR figures", () => {
    renderPage();
    // ARR labels appear (stat tiles + funnel legend) — at least once each.
    expect(screen.getAllByText(/\$3\.1B ARR/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$2\.0B ARR/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$450M ARR/).length).toBeGreaterThan(0);
  });

  it("renders the entity counts and 8-verticals descriptor", () => {
    renderPage();
    expect(screen.getAllByText(/86,500/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/50,000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/15,000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/8 separate ag-service verticals/i).length).toBeGreaterThan(0);
  });

  it("shows the plain-language derivation including the $30K SOM unit", () => {
    renderPage();
    expect(screen.getByText(/\$30K each/i)).toBeInTheDocument();
    expect(screen.getByText(/identical to the figure driving the finance model/i)).toBeInTheDocument();
  });

  it("marks the SOM tier as the beachhead", () => {
    const som = MARKET_TIERS.find((t) => t.key === "SOM");
    expect(som?.isBeachhead).toBe(true);
  });
});

describe("Market page (TERRITORY) — underlying segment table", () => {
  it("labels the table as total industry revenue, not ARR", () => {
    renderPage();
    expect(
      screen.getByText(/Underlying US ag-services market — total industry revenue/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/\$104\.3B/).length).toBeGreaterThan(0);
  });

  it("renders all 12 segments", () => {
    renderPage();
    for (const seg of MARKET_SEGMENTS) {
      expect(screen.getByText(seg.name)).toBeInTheDocument();
    }
    expect(MARKET_SEGMENTS).toHaveLength(12);
  });

  it("renders the $140.3B 2030 figure", () => {
    renderPage();
    expect(screen.getByText(/140\.3B/)).toBeInTheDocument();
  });

  it("never fabricates CAGR for segments 11–12 (shows em dash)", () => {
    renderPage();
    const seg11 = MARKET_SEGMENTS.find((s) => s.rank === 11);
    const seg12 = MARKET_SEGMENTS.find((s) => s.rank === 12);
    expect(seg11?.cagr).toBeNull();
    expect(seg12?.cagr).toBeNull();
    // and the rendered table shows the dash
    const row = screen.getByText("Soil Preparation & Planting").closest("tr")!;
    expect(within(row).getByText("—")).toBeInTheDocument();
  });

  it("highlights the chemical-applicator beachhead in the table", () => {
    renderPage();
    const beachhead = MARKET_SEGMENTS.find((s) => s.isBeachhead);
    expect(beachhead?.name).toMatch(/Chemical & Fertilizer Application/);
    const row = screen.getByText("Chemical & Fertilizer Application").closest("tr")!;
    expect(within(row).getByText(/Beachhead/i)).toBeInTheDocument();
  });
});
