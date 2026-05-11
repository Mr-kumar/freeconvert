import { describe, expect, it } from "vitest";
import { clamp, formatBytes, parsePageRange, parsePageRangeGroups } from "./utils";

describe("clamp", () => {
  it("keeps values inside the provided bounds", () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-2, 1, 10)).toBe(1);
    expect(clamp(12, 1, 10)).toBe(10);
  });
});

describe("formatBytes", () => {
  it("formats byte counts with compact units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
  });
});

describe("parsePageRange", () => {
  it("parses individual pages and ranges into sorted unique pages", () => {
    expect(parsePageRange("3, 1-2, 2", 5)).toEqual([1, 2, 3]);
  });

  it("accepts reversed ranges", () => {
    expect(parsePageRange("4-2", 5)).toEqual([2, 3, 4]);
  });

  it("rejects invalid ranges", () => {
    expect(() => parsePageRange("1,a", 5)).toThrow('"a" is not a valid page range.');
    expect(() => parsePageRange("1-9", 5)).toThrow('Page range "1-9" exceeds 5 pages.');
  });
});

describe("parsePageRangeGroups", () => {
  it("keeps the original group labels with parsed pages", () => {
    expect(parsePageRangeGroups("1-2, 4", 5)).toEqual([
      { label: "1-2", pages: [1, 2] },
      { label: "4", pages: [4] },
    ]);
  });
});
