// Pure helpers for NavigationController. They take plain values so they can be unit tested
// without a DOM; the controller reads the DOM and applies the results.

export type ReturnTarget = { tag: string; href: string | null; label: string };

// FNV-1a keeps IDs short and deterministic without a crypto dependency.
function hash(value: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// IDs come from what an element is, not where it is, so controls that appear after
// hydration do not shift the IDs that saved focus refers to. Identical targets are
// numbered in document order.
export function returnIds(targets: readonly ReturnTarget[]) {
  const seen = new Map<string, number>();
  return targets.map(({ tag, href, label }) => {
    const key = hash(`${tag}\n${href ?? ""}\n${label}`);
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    return count === 1 ? `return-${key}` : `return-${key}-${count}`;
  });
}

export function fragmentId(hash: string) {
  if (hash.length < 2) return null;
  try { return decodeURIComponent(hash.slice(1)); } catch { return null; }
}

// The hash of a link that stays on the current page, or null for any other link.
export function samePageFragment(href: string, current: string) {
  const url = new URL(href, current);
  const here = new URL(current);
  if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search || !url.hash) return null;
  return url.hash;
}
