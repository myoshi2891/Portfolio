export type HeaderRule = { source: string; headers: { key: string; value: string }[] };

// Supports the literal and "(.*)" wildcard subset of Vercel's path-to-regexp sources.
function matches(source: string, path: string) {
  const pattern = source.split("(.*)").map(part => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${pattern}$`).test(path);
}

export function headersFor(path: string, rules: HeaderRule[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const rule of rules) if (matches(rule.source, path)) for (const { key, value } of rule.headers) result[key] = value;
  return result;
}
