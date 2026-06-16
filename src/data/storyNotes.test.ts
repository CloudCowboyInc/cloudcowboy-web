import { describe, it, expect } from "vitest";
import { STORY_NOTES, notesForPage } from "./storyNotes";

describe("Story & Notes (LAST_MILE) — the 12 sections", () => {
  it("ports exactly 12 narrative sections", () => {
    expect(STORY_NOTES).toHaveLength(12);
  });

  it("every page has at least one contextual note", () => {
    expect(notesForPage("market").length).toBeGreaterThan(0);
    expect(notesForPage("gtm").length).toBeGreaterThan(0);
    expect(notesForPage("finance").length).toBeGreaterThan(0);
  });

  it("covers the required topics", () => {
    const ids = STORY_NOTES.map((n) => n.id);
    for (const id of [
      "thesis",
      "how-to-read",
      "ramp",
      "recognized-vs-arr",
      "capture",
      "marketing-cac",
      "staffing",
      "gna",
      "unit-economics",
      "seasonality",
      "stress-test",
      "sources",
    ]) {
      expect(ids).toContain(id);
    }
  });

  it("every note has a title and body", () => {
    for (const n of STORY_NOTES) {
      expect(n.title.length).toBeGreaterThan(0);
      expect(n.paragraphs.length).toBeGreaterThan(0);
    }
  });
});
