# Healthspring.com EDS POC Migration Plan

## Goal
Migrate representative pages of **https://www.healthspring.com/** into this Edge Delivery Services repo (`sean-flynn-baici / healthspring-eds-poc`) as a proof of concept — matching the original design closely across desktop and mobile, with a fully instrumented navigation and footer, published live.

## Scope (confirmed)
- **Pages:** Homepage + three interior pages:
  1. **Medicare plans page** (product/plans — cards, tables, CTAs)
  2. **About / Company page** (content-heavy — text, columns, imagery)
  3. **Article / Blog page** (long-form editorial)
- **Nav/Footer:** Full, instrumented header (including any mega-menu) and footer matching the source structure and behavior.
- **Design:** Match the original closely — extract design tokens and per-block computed styles, visually verify against the source.
- **Viewports:** Match **desktop and mobile** (including mobile hamburger nav behavior).
- **Fonts/Icons:** Match brand fonts and icons where licensing allows; substitute close web-safe fallbacks otherwise.
- **Images:** Download source images and import them as EDS-optimized assets served from the project.
- **Dynamic/gated content:** Capture a **static snapshot** of dynamically-loaded sections where feasible; login-gated portals and live quote tools are out of scope.
- **Priority under constraints:** **Design fidelity first** — a smaller number of visually accurate pages beats broad-but-rough coverage.
- **Definition of done:** Content **published live** to the `.aem.live` site (plus preview and a PR with preview links).
- **Plugins:** None — proceed with the core migration skills only.

## Approach
Use the EDS migration skills in sequence: discover site structure → catalog templates → migrate the homepage end-to-end (analysis → infrastructure → import → design) → instrument nav & footer → migrate the three interior pages against known templates → validate the whole set against the original → publish live. Because design fidelity is the priority, each page passes through a visual-critique/iterate loop (desktop + mobile) before being considered done.

## Checklist

### Phase 0 — Setup & discovery
- [ ] Confirm the local dev server renders the boilerplate (`aem-cli up`, preview at the local server)
- [ ] Discover the site's URLs (sitemap/crawl of healthspring.com)
- [ ] Catalog page templates and group URLs into template types
- [ ] Confirm exact source URLs for the homepage, Medicare plans, About/Company, and Article/Blog pages
- [ ] Establish site-wide design tokens (colors, typography, spacing) from the source
- [ ] Identify brand fonts/icons and select web-safe fallbacks where licensing blocks reuse

### Phase 1 — Homepage migration
- [ ] Scrape the homepage (content, metadata, images, cleaned HTML); take static snapshots of any dynamic sections
- [ ] Download and optimize source images as project-served EDS assets
- [ ] Analyze homepage structure — sections, content sequences, block variants
- [ ] Map blocks / create needed block variants
- [ ] Generate import infrastructure (parsers, transformers, page template)
- [ ] Run the import via the bundled import script to produce content
- [ ] Preview and verify the homepage renders correctly (desktop + mobile)

### Phase 2 — Navigation & footer
- [ ] Instrument the header/navigation (including mega-menu + mobile hamburger behavior) from the source
- [ ] Migrate the footer structure and content
- [ ] Self-host/configure brand fonts and icons (with fallbacks)
- [ ] Verify nav and footer rendering and behavior in preview (desktop + mobile)

### Phase 3 — Design matching (homepage)
- [ ] Apply site-level design (tokens, base styles, fonts)
- [ ] Style each block to match the original's computed styles
- [ ] Visual critique of the homepage against healthspring.com on desktop **and** mobile; iterate until close match

### Phase 4 — Interior pages (design-fidelity loop per page, desktop + mobile)
- [ ] **Medicare plans page:** scrape (+ snapshot dynamic parts, download images) → analyze → reuse/create variants → import → preview → visual critique & iterate
- [ ] **About / Company page:** scrape (+ download images) → analyze → reuse/create variants → import → preview → visual critique & iterate
- [ ] **Article / Blog page:** scrape (+ download images) → analyze → reuse/create variants → import → preview → visual critique & iterate

### Phase 5 — Validation & delivery
- [ ] Run post-import validation across all migrated pages (content completeness + visual, desktop + mobile)
- [ ] Fix flagged issues (design fidelity prioritized)
- [ ] Lint / test code changes
- [ ] Commit code and open a PR with `{branch}--{repo}--{owner}.aem.page/{path}` preview links
- [ ] Merge code to `main` to ship
- [ ] Publish all content live to the `.aem.live` site and verify

## Notes
- `scripts/aem.js` is vendored — never edit it. CSS is scoped to `.blockname`.
- Content HTML is generated **only** via the bundled import script, never hand-authored.
- Code ships by merging `main`; content publishes separately (preview → live).
- Gated/login content is out of scope; dynamic sections are captured as static snapshots only.
- Under time pressure, prioritize visual fidelity of completed pages over adding more pages.
- Credentials for git / `admin.hlx.page` / Document Authoring are injected automatically when the matching Settings opt-ins are enabled — no tokens needed in chat. Publishing live requires those opt-ins to be on.

> Execution requires **Execute mode** — approve this plan (or tell me what to adjust) and I'll begin with Phase 0.
