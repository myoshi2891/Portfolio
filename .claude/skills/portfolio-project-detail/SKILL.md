---
name: portfolio-project-detail
description: Reconstruct or refine evidence-backed project detail pages in this engineering portfolio from project documentation, repository evidence, and supplied screenshots. Use for work on /projects/[slug] pages that needs richer editorial structure, curated code references, image galleries, responsive copy, or end-to-end verification; do not use for unrelated generic frontend changes.
---

# Portfolio Project Detail

Turn the project's source documentation into a readable case study without losing technical accuracy or the portfolio's established visual language.

## Start from evidence

1. Read the requested source document completely. Treat its update date, tested results, limitations, paths, and architecture descriptions as the content baseline.
2. Inspect the current route, shared detail components, project/evidence data, styles, tests, and image metadata before editing. Preserve unrelated project behavior.
3. If screenshots are supplied, inspect every image before naming or placing it. Use descriptive lowercase kebab-case names under `public/images/<slug>/`; update all references after moves.
4. Distinguish document-provided facts from repository-audited evidence. Do not present current branch links as fixed-commit verification.

## Choose the smallest suitable implementation

- Keep the shared detail renderer when the existing schema can express the material clearly.
- Add a project-specific detail component when the document contains richer tables, diagrams, metrics, constraints, or reference explanations that would distort the generic schema.
- Scope project-specific CSS with a page class. Do not weaken the layout of other project pages.
- Preserve server-rendered initial content; client components should be limited to interactions such as galleries.

Read [references/detail-page-pattern.md](references/detail-page-pattern.md) before implementing a rich project page or screenshot gallery. It contains the reusable content, reference, media, typography, and verification pattern established for this portfolio.

## Content integrity

- Lead with what the project does and why its structure matters.
- Keep limitations adjacent to positive quality claims. Test counts must include their measurement date and must not imply broader guarantees.
- Show a visible page update date separately from repository audit dates.
- Curate at most three repository links per section. Each link must state both why it was selected and what concrete behavior or decision the reader can verify there.
- Prefer fixed-commit links for audited claims. Use a default-branch link only for an explicitly current or navigational reference, and label it accordingly.
- Do not hardcode another project's names, dates, metrics, technologies, or image captions when reusing the pattern.

## Finish with observable verification

Run the repository's content validation, typecheck, lint, unit tests, and production build in proportion to the change. For layout or interaction changes, also run browser checks covering the affected route, narrow and wide viewports, enlarged text, reduced motion, dark mode, and JavaScript-disabled initial content where applicable.

When a sandbox-only Turbopack process or port restriction blocks the normal build, verify with the repository-supported webpack build and report the environment limitation accurately. Revert generated incidental changes such as `next-env.d.ts`; keep generated font/image artifacts only when the changed content requires them.
