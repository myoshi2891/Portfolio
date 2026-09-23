# Project detail page pattern

Use this reference for rich `/projects/<slug>/` case studies in this portfolio.

## Content model

Prefer the source document's information architecture. A common six-part sequence is:

1. Overview
2. Main features
3. Architecture
4. Structure and constraints
5. Quality and unverified boundaries
6. Reference code

The sequence is a starting point, not a reason to invent empty sections. The page contents navigation must match the rendered section IDs.

The overview should include the editorial title, concise lead, technologies, primary actions, and a visible page update date. Keep the source document's own update date in the reference area when it differs from the page update date.

## Repository references

Each section may show up to three curated links. For every link, provide:

- A short role label, such as “calculation logic” or “validation boundary”.
- The repository-relative path, with line numbers when a fixed audit supplies them.
- “Why selected”: why this file is representative for the section.
- “What can be verified”: the exact behavior, data flow, constraint, or decision visible in the linked code.

Enforce the three-link ceiling in the renderer as well as the data. Avoid dumping every evidence URL at the bottom of a section. In the final reference section, select the three files that best represent the project rather than repeating a complete audit inventory.

## Technical storytelling

- Use compact cards for two or more project roles or deliverables.
- Use a table for exact function contracts or technology-to-responsibility mappings.
- Use a flow for pipelines with three or more dependent stages.
- Explain fallback and source-of-truth decisions visually when they affect several consumers.
- Keep implementation limits visible: data freshness, external service behavior, CI omissions, or tests known to be stale.

Diagrams should be semantic HTML/CSS when small. Reuse an existing shared diagram component when the repository already defines one; do not recreate its layout rules locally.

## Screenshot galleries

Inspect images visually before naming them. Use names that identify the page or feature, for example `cost-calculator-overview.png`, not capture timestamps.

For a supplied multi-image gallery in this portfolio:

- Store images under `public/images/<slug>/`.
- Keep the central slide large while showing the edges of the previous and next slides on wide and narrow screens.
- Move the whole track horizontally with a transform transition; avoid cross-fading when the requested interaction is spatial sliding.
- If automatic rotation is requested, cycle at a calm interval and loop without a long reverse jump. Pause while hovered, while focus is within the gallery, while the document is hidden, and when reduced motion is preferred.
- If controls are explicitly unwanted, use non-interactive position indicators rather than buttons.
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
- Curated references never exceed three per section.
- Gallery has no controls when the design calls for automatic display only.
- Automatic gallery movement changes the active slide and track transform.
- Previous and next slide edges intersect the gallery viewport.
- Full-width intro copy matches its section width at a representative desktop viewport.
- Reduced motion, dark mode, mobile layout, and no-JavaScript output remain usable.

Run the existing broader suite so a project-specific component does not break other featured routes, SEO metadata, content validation, navigation anchors, or shared previews.
