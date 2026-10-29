import { describe, it, expect } from "vitest";
import { hasOverlap, localToUtc, getSlots } from "./scheduler";
describe("booking interval rules", () => {
  it("uses half-open interval overlap semantics", () => {
    expect(hasOverlap("10:00", "11:00", "11:00", "12:00")).toBe(false);
    expect(hasOverlap("10:30", "11:30", "11:00", "12:00")).toBe(true);
    expect(hasOverlap("11:00", "12:00", "10:00", "11:00")).toBe(false);
  });
  it("converts Vienna winter and summer appointments to distinct instants", () => {
    expect(localToUtc("2026-01-15", "10:00")).toBe("2026-01-15T09:00:00.000Z");
    expect(localToUtc("2026-07-15", "10:00")).toBe("2026-07-15T08:00:00.000Z");
  });
  it("rejects nonexistent spring daylight-saving time and impossible calendar dates", () => {
    expect(() => localToUtc("2026-03-29", "02:30")).toThrow(
      "invalid_local_time",
    );
    expect(() => localToUtc("2026-02-31", "10:00")).toThrow(
      "invalid_local_date",
    );
  });
  it("respects weekly opening days and duration-aware Saturday closing", () => {
    expect(getSlots("2026-11-01", "classic", "otto")).toEqual([]);
    expect(getSlots("2026-11-02", "classic", "otto")).toEqual([]);
    const saturday = getSlots("2026-10-31", "grooming", "otto").map(
      (x) => x.time,
    );
    expect(saturday).toContain("14:30");
    expect(saturday).not.toContain("15:00");
  });
});
