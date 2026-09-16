import { describe, expect, it } from "vitest";
import { parseNavigationState, readBackup, writeBackup, withNavigationState, STORAGE_KEY } from "../lib/navigation-state";

const allowed = new Set(["more-studies", "note-r10", "study-r10", "more-studies-toggle"]);
const state = { version: 1 as const, id: "entry-1", openIds: ["more-studies"], scrollY: 1200, focusId: "study-r10" };
const memory = () => {
  const values = new Map<string, string>();
  return { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); } };
};

describe("navigation storage boundary", () => {
  it("accepts valid state and rejects corrupt versions, IDs, positions and focus", () => {
    expect(parseNavigationState(state, allowed)).toEqual(state);
    for (const value of [null, "broken", {}, { ...state, version: 2 }, { ...state, id: "" }, { ...state, scrollY: -1 }, { ...state, scrollY: Infinity }, { ...state, openIds: ["unknown"] }, { ...state, openIds: ["more-studies", "more-studies"] }, { ...state, focusId: "unknown" }]) {
      expect(parseNavigationState(value, allowed)).toBeNull();
    }
  });
  it("preserves state owned by the router", () => {
    const previous = { __NA: true, tree: ["router"] };
    expect(withNavigationState(previous, state)).toEqual({ ...previous, portfolioNavigation: state });
    expect(previous).not.toHaveProperty("portfolioNavigation");
  });
  it("keeps only 20 recent entry backups and updates an existing entry", () => {
    const storage = memory();
    for (let i = 0; i < 25; i++) writeBackup(storage, { ...state, id: `entry-${i}` }, allowed);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toHaveLength(20);
    expect(readBackup(storage, "entry-0", allowed)).toBeNull();
    writeBackup(storage, { ...state, id: "entry-24", scrollY: 9 }, allowed);
    expect(readBackup(storage, "entry-24", allowed)?.scrollY).toBe(9);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toHaveLength(20);
  });
  it("ignores storage denial, invalid JSON and malformed entries", () => {
    const denied = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } };
    expect(readBackup(denied, state.id, allowed)).toBeNull();
    expect(() => writeBackup(denied, state, allowed)).not.toThrow();
    const storage = memory();
    for (const value of ["{broken", "null", "{}", '[{"id":"entry-1"}]']) {
      storage.setItem(STORAGE_KEY, value);
      expect(readBackup(storage, state.id, allowed)).toBeNull();
      writeBackup(storage, state, allowed);
      expect(readBackup(storage, state.id, allowed)).toEqual(state);
    }
  });
});
