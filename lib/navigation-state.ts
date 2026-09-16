export type NavigationState = {
  version: 1; id: string; openIds: string[]; scrollY: number; focusId: string | null;
};
type StorageAccess = Pick<Storage, "getItem" | "setItem">;
export const STORAGE_KEY = "portfolio.navigation.v1";
export const HISTORY_KEY = "portfolioNavigation";

export function parseNavigationState(value: unknown, allowed: ReadonlySet<string>): NavigationState | null {
  if (!value || typeof value !== "object") return null;
  const s = value as Partial<NavigationState>;
  if (s.version !== 1 || typeof s.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(s.id)
    || typeof s.scrollY !== "number" || !Number.isFinite(s.scrollY) || s.scrollY < 0
    || !Array.isArray(s.openIds) || s.openIds.length > allowed.size
    || s.openIds.some(id => typeof id !== "string" || !allowed.has(id))
    || new Set(s.openIds).size !== s.openIds.length
    || (s.focusId !== null && (typeof s.focusId !== "string" || !allowed.has(s.focusId)))) return null;
  return { version: 1, id: s.id, openIds: [...s.openIds], scrollY: s.scrollY, focusId: s.focusId };
}

export function withNavigationState(previous: unknown, state: NavigationState) {
  return { ...(previous && typeof previous === "object" ? previous : {}), [HISTORY_KEY]: state };
}

function backups(storage: StorageAccess, allowed: ReadonlySet<string>): NavigationState[] {
  const raw: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
  if (!Array.isArray(raw)) return [];
  return raw.slice(-20).flatMap(value => {
    const state = parseNavigationState(value, allowed);
    return state ? [state] : [];
  });
}
export function readBackup(storage: StorageAccess, id: string, allowed: ReadonlySet<string>) {
  try { return backups(storage, allowed).find(s => s.id === id) ?? null; } catch { return null; }
}
export function writeBackup(storage: StorageAccess, state: NavigationState, allowed: ReadonlySet<string>) {
  try {
    let entries: NavigationState[];
    try { entries = backups(storage, allowed); } catch { entries = []; }
    storage.setItem(STORAGE_KEY, JSON.stringify([...entries.filter(s => s.id !== state.id), state].slice(-20)));
  } catch { /* Storage is optional; history and native disclosures remain usable. */ }
}
