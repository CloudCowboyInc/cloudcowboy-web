import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MarketPage from "./MarketPage";
import GtmPage from "./GtmPage";
import FinancePage from "./FinancePage";
import {
  StatTile,
  SectionCard,
  WhyThis,
  ToggleRow,
  ViewSwitch,
} from "@/components/dataroom";

// The CRM mounts Leaflet (needs a real DOM) — stub it for the shell smoke test.
vi.mock("@/pages/CRM", () => ({ default: () => <div>Customer Discovery CRM</div> }));

afterEach(cleanup);

describe("data room — page smoke", () => {
  it("renders the Market page without throwing", () => {
    render(<MemoryRouter><MarketPage /></MemoryRouter>);
    expect(screen.getByText(/rapidly climbing/i)).toBeInTheDocument();
  });

  it("renders the GTM page without throwing", () => {
    render(<MemoryRouter><GtmPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /How we reach the market/i })).toBeInTheDocument();
  });

  it("renders the Finance page without throwing", () => {
    render(<MemoryRouter><FinancePage /></MemoryRouter>);
    expect(screen.getByText(/interactive proforma/i)).toBeInTheDocument();
  });
});

describe("data room — primitives", () => {
  it("StatTile shows label and value", () => {
    render(<StatTile label="ARR (2031)" value="$60M" />);
    expect(screen.getByText("$60M")).toBeInTheDocument();
    expect(screen.getByText("ARR (2031)")).toBeInTheDocument();
  });

  it("SectionCard renders title and children", () => {
    render(
      <SectionCard title="Test section">
        <p>body content</p>
      </SectionCard>,
    );
    expect(screen.getByText("Test section")).toBeInTheDocument();
    expect(screen.getByText("body content")).toBeInTheDocument();
  });

  it("WhyThis expands on click", () => {
    render(
      <WhyThis title="Why this">
        <p>the explanation</p>
      </WhyThis>,
    );
    const trigger = screen.getByRole("button", { name: /why this/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("the explanation")).toBeInTheDocument();
  });

  it("ToggleRow fires onCheckedChange", () => {
    const onChange = vi.fn();
    render(<ToggleRow label="Farm Progress Show" checked onCheckedChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalled();
  });

  it("ViewSwitch reports the chosen mode", () => {
    const onChange = vi.fn();
    render(<ViewSwitch value="table" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: /graph/i }));
    expect(onChange).toHaveBeenCalledWith("graph");
  });
});
