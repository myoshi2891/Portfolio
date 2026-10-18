# Project detail page pattern

Use this reference for rich `/projects/<slug>/` case studies in this portfolio.

## Content model

Follow the source document's information architecture. The shared sequence is:

1. Overview (`overview`)
2. Main features (`features`)
3. Architecture (`architecture`)
4. Structure and constraints (`decisions`)
5. Quality and open issues (`quality`)
6. Basis of the description (`documentation`)

A project may add a section only when its material requires one (Multi Vendor adds `orders`). Do not invent empty sections. The contents navigation must match the rendered section IDs, and Home links into a detail page may only target IDs that the page actually renders (`lib/validate-home-content.ts`).

The overview should include the editorial title, concise lead, technologies, the public-site action when a demo URL exists, and a visible page update date. Keep the source document's own update date in the “説明の基準” section when it differs from the page update date.

## No repository links

Featured detail pages show no GitHub links. Code changes would make line references drift away from the explanation, so each page stays a self-contained description based on its documents. State the document names and the point in time they describe in the “説明の基準” section. GitHub links on Home are out of scope of this rule.

## Technical storytelling

- Use GFM tables for exact function contracts or technology-to-responsibility mappings.
- Use Mermaid flowcharts or sequence diagrams for pipelines with three or more dependent stages, state transitions, and request flows. Each detail page currently has three diagrams.
- Write a one-sentence description for every diagram in `data/project-documentation.ts`; it becomes the alt text and caption.
- Generated SVGs are named `diagram-<hash>.svg` from the trimmed Mermaid source. Regenerate them after any Mermaid change, or rendering fails because the referenced file does not exist.
- Keep implementation limits visible: data freshness, external service behavior, CI omissions, or tests known to be stale.

## Screenshot galleries

Inspect images visually before naming them. Use names that identify the page or feature, for example `cost-calculator-overview.png`, not capture timestamps.

For a supplied multi-image gallery in this portfolio:

- Keep source PNGs under `assets/screens/<gallery-directory>/` and publish generated WebPs under `public/images/<gallery-directory>/`. Use the directory named in `docs/current-specification.md`; it may differ from the slug.
- Keep the central slide large while showing the edges of the previous and next slides on wide and narrow screens.
- Move the whole track horizontally with a transform transition; avoid cross-fading when the requested interaction is spatial sliding.
- If automatic rotation is requested, cycle at a calm interval and loop without a long reverse jump. Pause while hovered, while focus is within the gallery, while the document is hidden, and when reduced motion is preferred.
- An auto-rotating gallery must keep a pause/stop control (WCAG 2.2.2). If all controls are explicitly unwanted, disable automatic rotation and use non-interactive position indicators rather than buttons.
- Render an informative first image without JavaScript. Give the active image a descriptive alt; hide duplicate loop slides from accessibility APIs.
- Keep source dimensions/aspect ratio stable to avoid layout shift. Update screen metadata and path encoding when an existing featured preview moves into a subdirectory.

## Typography and responsive layout

Do not retain arbitrary prose `max-width` values when the containing detail column has usable horizontal space and the requested design should wrap at the column edge. Scope overrides to the relevant project page, for example a `<slug>-detail-page` class.

Keep intentional limits for long-form reading only when they improve readability and match the design request. Verify rather than assume:

- Hero lead uses the available header content width.
- Section introductions use the available detail column width.
- Cards and tables wrap without horizontal page overflow.
- At 200% text size, the document remains within the viewport.

## Verification targets

Add tests for meaningful invariants, not exact decorative wording:

- Server HTML includes the project-specific layout and first gallery image.
- Detail pages contain no GitHub links.
- Section IDs, contents navigation, and diagram counts stay aligned with the Markdown.
- Auto-rotating galleries expose a pause/stop control; a gallery without controls does not rotate automatically.
- Automatic gallery movement changes the active slide and track transform.
- Previous and next slide edges intersect the gallery viewport.
- Full-width intro copy matches its section width at a representative desktop viewport.
- Reduced motion, dark mode, mobile layout, and no-JavaScript output remain usable.

Run the existing broader suite so a project-specific component does not break other featured routes, SEO metadata, content validation, navigation anchors, or shared previews.
