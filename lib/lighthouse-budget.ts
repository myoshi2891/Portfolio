// The subset of a Lighthouse result and lighthouserc.json assertions that the budget check reads.
export type LighthouseRun = {
  categories: Record<string, { score: number | null } | undefined>;
  audits: Record<string, { numericValue?: number } | undefined>;
};
export type BudgetAssertion = [string, { minScore?: number; maxNumericValue?: number }];

// Like Lighthouse CI, judge the run whose performance score is the median.
export function medianRun<T extends LighthouseRun>(runs: readonly T[]): T {
  const sorted = [...runs].sort((a, b) => (a.categories.performance?.score ?? 0) - (b.categories.performance?.score ?? 0));
  const median = sorted[Math.floor(sorted.length / 2)];
  if (!median) throw new Error("No Lighthouse runs to evaluate");
  return median;
}

export function budgetFailures(run: LighthouseRun, assertions: Record<string, BudgetAssertion>): string[] {
  return Object.entries(assertions).flatMap(([key, [, { minScore, maxNumericValue }]]) => {
    const category = key.startsWith("categories:") ? run.categories[key.slice("categories:".length)] : undefined;
    const value = category ? category.score : run.audits[key]?.numericValue;
    if (value === undefined || value === null) return [`${key}: no result`];
    if (minScore !== undefined && value < minScore) return [`${key} ${value} < ${minScore}`];
    if (maxNumericValue !== undefined && value > maxNumericValue) return [`${key} ${value} > ${maxNumericValue}`];
    return [];
  });
}
