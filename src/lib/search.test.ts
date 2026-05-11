import { describe, expect, it } from "vitest";
import { normalizeSearchQuery, searchSite } from "./search";

describe("normalizeSearchQuery", () => {
  it("strips HTML, normalizes whitespace, and limits length", () => {
    expect(normalizeSearchQuery("<b>merge</b>   pdf")).toBe("merge pdf");
    expect(normalizeSearchQuery("x".repeat(100))).toHaveLength(80);
  });
});

describe("searchSite", () => {
  it("returns no results for empty queries", () => {
    expect(searchSite("   ")).toEqual([]);
  });

  it("ranks matching tools for common queries", () => {
    const results = searchSite("merge pdf", 5);
    expect(results[0]?.href).toBe("/merge-pdf");
    expect(searchSite("split pages", 5).some((result) => result.href === "/split-pdf")).toBe(
      true,
    );
  });

  it("expands format aliases", () => {
    const results = searchSite("jpg to pdf", 5);
    expect(results.some((result) => result.href === "/convert-image-to-pdf")).toBe(true);
  });
});
