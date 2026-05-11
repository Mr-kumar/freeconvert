import { describe, expect, it } from "vitest";
import { safeBoolean, safeColor, safeEnum, safeNumber, safeString } from "./sanitize";

describe("sanitize helpers", () => {
  it("clamps numeric input and falls back on invalid values", () => {
    expect(safeNumber("15", 5, 1, 10)).toBe(10);
    expect(safeNumber("0", 5, 1, 10)).toBe(1);
    expect(safeNumber("bad", 5, 1, 10)).toBe(5);
  });

  it("parses booleans only from exact true and false strings", () => {
    expect(safeBoolean("true", false)).toBe(true);
    expect(safeBoolean("false", true)).toBe(false);
    expect(safeBoolean("yes", false)).toBe(false);
  });

  it("allows only declared enum values", () => {
    expect(safeEnum("png", ["jpg", "png"] as const, "jpg")).toBe("png");
    expect(safeEnum("gif", ["jpg", "png"] as const, "jpg")).toBe("jpg");
  });

  it("strips HTML and enforces max length for strings", () => {
    expect(safeString("<b>Hello</b> world", "", 8)).toBe("Hello wo");
  });

  it("accepts hex colors and transparent only", () => {
    expect(safeColor("#aabbcc", "#ffffff")).toBe("#aabbcc");
    expect(safeColor("transparent", "#ffffff")).toBe("transparent");
    expect(safeColor("red", "#ffffff")).toBe("#ffffff");
  });
});
