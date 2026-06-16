import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MarketPage from "./MarketPage";
import { MARKET_SEGMENTS, MARKET_TIERS } from "@/data/marketData";

afterEach(cleanup);

const renderPage = () => render(<MemoryRouter><MarketPage /></MemoryRouter>);

describe("Market page — US scope & thesis", () => {
  it("makes the US-only scope explicit", () => {
    renderPage();
    expect(screen.getAllByText(/United States market/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/all figures US-specific/i)).toBeInTheDocument();
  });

  it("states the service-instigation thesis and global roadmap", () => {
    renderPage();
    expect(
      screen.getAllByText(/The Ag Catalyst Through Service Instigation/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Built to go global/i)).toBeInTheDocument();
  });
});

describe("Market page — funnel", () => {
  it("renders the exact TAM/SAM/SOM ARR figures", () => {
    renderPage();
    expect(screen.getAllByText(/\$3\.1B ARR/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$2\.0B ARR/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$450M ARR/).length).toBeGreaterThan(0);
  });

  it("renders entity counts and the 8-verticals descriptor", () => {
    renderPage();
    expect(screen.getAllByText(/86,500/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/50,000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/8 separate ag-service verticals/i).length).toBeGreaterThan(0);
  });

  it("shows the derivation incl. the $30K SOM unit and the TAM bridge", () => {
    renderPage();
    expect(screen.getByText(/\$30K each/i)).toBeInTheDocument();
    expect(screen.getByText(/identical to the figure driving the finance model/i)).toBeInTheDocument();
    expect(screen.getByText(/How the US TAM is built/i)).toBeInTheDocument();
  });

  it("marks the SOM tier as the beachhead", () => {
    expect(MARKET_TIERS.find((t) => t.key === "SOM")?.isBeachhead).toBe(true);
  });
});

describe("Market page — underlying segment drill-down", () => {
  it("labels the section as total industry revenue, not ARR, with the $104.3B total", () => {
    renderPage();
    expect(
      screen.getByText(/Underlying US ag-services market — total industry revenue/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/\$104\.3B/).length).toBeGreaterThan(0);
  });

  it("renders all 12 segments", () => {
    renderPage();
    for (const seg of MARKET_SEGMENTS) {
      expect(screen.getAllByText(seg.name).length).toBeGreaterThan(0);
    }
    expect(MARKET_SEGMENTS).toHaveLength(12);
  });

  it("renders the $140.3B 2030 figure", () => {
    renderPage();
    expect(screen.getAllByText(/140\.3B/).length).toBeGreaterThan(0);
  });

  it("now carries the source's CAGR for every segment (incl. soil-prep & fencing)", () => {
    // The source document states CAGRs for all 12 — none are missing.
    for (const s of MARKET_SEGMENTS) {
      expect(s.cagr).toMatch(/%$/);
      expect(s.cagrPct).toBeGreaterThan(0);
    }
    expect(MARKET_SEGMENTS.find((s) => s.rank === 11)?.cagr).toBe("5.2%");
    expect(MARKET_SEGMENTS.find((s) => s.rank === 12)?.cagr).toBe("4.6%");
  });

  it("corrects the chemical-applicator beachhead to 15,000 entities (matches the SOM)", () => {
    const beachhead = MARKET_SEGMENTS.find((s) => s.isBeachhead);
    expect(beachhead?.name).toMatch(/Chemical & Fertilizer Application/);
    expect(beachhead?.entities).toBe(15_000);
  });

  it("drill-down expands a segment's detail and projection", () => {
    renderPage();
    // The beachhead tier is open by default; its description should be visible.
    expect(
      screen.getByText(/the largest service segment/i),
    ).toBeInTheDocument();
    // Open another segment and check its detail appears.
    const aerial = screen.getByRole("button", { name: /Aerial Application Services/i });
    fireEvent.click(aerial);
    expect(screen.getAllByText(/Agricultural aviation/i).length).toBeGreaterThan(0);
  });
});

describe("Market page — sources", () => {
  it("cites the source document and grouped references", () => {
    renderPage();
    expect(screen.getByText(/US Agricultural Service Providers Market Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Government & official statistics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/USDA/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/IBISWorld/i).length).toBeGreaterThan(0);
  });
});
