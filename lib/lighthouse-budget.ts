// The subset of a Lighthouse result and lighthouserc.json assertions that the budget check reads.
export type LighthouseRun = {
  categories: Record<string, { score: number | null } | undefined>;
  audits: Record<string, { numericValue?: number } | undefined>;
};
export type BudgetAssertion = [string, { minScore?: number; maxNumericValue?: number }];

// Each score and metric is judged on its own median, so one noisy run cannot decide every budget.
const median = (values: readonly number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const isNumber = (value: number | null | undefined): value is number => typeof value === "number";

export function medianMetrics(runs: readonly LighthouseRun[]): LighthouseRun {
  if (!runs.length) throw new Error("No Lighthouse runs to evaluate");
  const keys = (pick: (run: LighthouseRun) => object) => [...new Set(runs.flatMap(run => Object.keys(pick(run))))];
  const categories = Object.fromEntries(keys(run => run.categories).map(key =>
    [key, { score: median(runs.map(run => run.categories[key]?.score).filter(isNumber)) ?? null }]));
  const audits = Object.fromEntries(keys(run => run.audits).map(key => {
    const numericValue = median(runs.map(run => run.audits[key]?.numericValue).filter(isNumber));
    return [key, numericValue === undefined ? {} : { numericValue }];
  }));
  return { categories, audits };
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
