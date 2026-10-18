---
name: portfolio-project-detail
description: Reconstruct or refine evidence-backed project detail pages in this engineering portfolio from project documentation, repository evidence, and supplied screenshots. Use for work on /projects/[slug] pages that needs richer editorial structure, Markdown body and Mermaid diagrams, image galleries, responsive copy, or end-to-end verification; do not use for unrelated generic frontend changes.
---

# Portfolio Project Detail

Turn the project's source documentation into a readable case study without losing technical accuracy or the portfolio's established visual language.

## Start from evidence

1. Read the requested source document completely. Treat its update date, tested results, limitations, paths, and architecture descriptions as the content baseline.
2. Inspect the current route, shared detail components, project/evidence data, styles, tests, and image metadata before editing. Preserve unrelated project behavior.
3. Read `docs/current-specification.md` before editing. It is the display contract and overrides this skill when they differ.
4. If screenshots are supplied, inspect every image before naming or placing it. Use descriptive lowercase kebab-case file names. Keep source PNGs under `assets/screens/<gallery-directory>/` and generated WebPs under `public/images/<gallery-directory>/`; the gallery directory is listed in the specification and does not always match the slug. Update all references after moves.
5. Distinguish document-provided facts from repository-audited evidence.

## Choose the smallest suitable implementation

- Write the body as Markdown in `data/<project>-detail.md` and render it with the shared `DocumentedProjectDetail` and its entry in `data/project-documentation.ts`. Keep the `##` section count, the contents navigation IDs, and the diagram descriptions aligned.
- Express tables as GFM tables and flows or sequences as Mermaid. Do not use ASCII diagrams. Mermaid is rendered to SVG at development time (`bun run diagrams:generate`); never load the Mermaid runtime in the browser.
- Do not add a project-specific body renderer. Extend the shared renderer or its registry instead.
- Scope project-specific CSS with a page class. Do not weaken the layout of other project pages.
- Preserve server-rendered initial content; client components should be limited to interactions such as galleries.

Read [references/detail-page-pattern.md](references/detail-page-pattern.md) before implementing a rich project page or screenshot gallery. It contains the reusable content, reference, media, typography, and verification pattern established for this portfolio.

## Content integrity

- Lead with what the project does and why its structure matters.
- Keep limitations adjacent to positive quality claims. Test counts must include their measurement date and must not imply broader guarantees.
- Show a visible page update date separately from repository audit dates.
- Do not add GitHub links to featured detail pages: no overview CTA, no code references or line links in the body, no audited-commit field, and no trailing profile link. The final “説明の基準” section names the source documents and their point in time instead.
- Do not hardcode another project's names, dates, metrics, technologies, or image captions when reusing the pattern.

## Finish with observable verification

Run the repository's content validation, typecheck, lint, unit tests, and production build in proportion to the change. For layout or interaction changes, also run browser checks covering the affected route, narrow and wide viewports, enlarged text, reduced motion, dark mode, and JavaScript-disabled initial content where applicable.

When a sandbox-only Turbopack process or port restriction blocks the normal build, verify with the repository-supported webpack build and report the environment limitation accurately. Revert generated incidental changes such as `next-env.d.ts`; keep generated font/image artifacts only when the changed content requires them.
