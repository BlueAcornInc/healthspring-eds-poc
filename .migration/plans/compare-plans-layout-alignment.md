# Shop and Compare Plans — White Floating Card: Haiku-Executable Work Plan

## Model note
You asked which class I am: I'm a **large/frontier-class model (Opus 4.8)**, not Haiku. Each work item below is written so a **Haiku-class model can execute it** unambiguously: exact file, exact selector, exact values, explicit **Blocks / Blocked by**, and a copy-paste verification with a pass/fail threshold.

## Plan-mode constraint on item 4 (creating GitHub issues)
Creating GitHub issues is a **write action** (`POST admin`/`api.github.com`), which plan mode forbids. This artifact defines the issues **ready to file verbatim** (title + body per work item in the "GitHub issue payloads" section). **Filing them requires Execute mode** — the first execution step (W0) does exactly that, one issue per work item, and records the returned issue numbers.

## Target treatment (confirmed)
**White floating card** — white, rounded, drop-shadowed card straddling the purple→navy seam; dark text; horizontal 3-column layout (heading · ZIP+button · divider+contact); stacks on mobile.

## Files in scope
- `blocks/hero-primary/hero-primary.css` — plan-finder is default content inside the `.plan-finder-container` navy hero section (W1 confirms whether the owning rule lives here or in `styles/styles.css`).
- `blocks/hero-primary/hero-primary.js` — only if the button icon / column grouping needs DOM.
- No content (DA/`nav.html`) edits; never edit `scripts/aem.js`.

## Ground-truth reference values (measured from source @1440px)
- Card: `#fff`, `border-radius:16px`, shadow `0 8px 24px rgb(0 0 0 / 12%)`, max-width ~1200px, bridges seam via negative top margin.
- Heading: navy `rgb(31,22,71)`, ~32px, weight 500.
- Button: purple `#9e28b5` (`rgb(158,40,181)`), white text, pill radius (~999px), trailing icon.
- ZIP input: white, 1px border, ~172–260px wide (not full-width).
- Divider: 1px vertical rule between button group and contact.
- Contact text: navy on the white card.

## Shared constraints (every work item)
- Scope CSS under `.plan-finder-container` / `.hero-primary`; never touch global `-wrapper`/`-container`.
- `npm run lint` must exit 0 after each change (build fails otherwise → nothing deploys).
- Served CSS is gzipped — compare DECOMPRESSED bytes / grep a rule, never raw transfer size.
- Verify against a **freshly-fetched** stylesheet (`?b=<ts>` or swap `<link>` href); section CSS caches ~2h.
- One commit per work item (or per parallel group); end each commit message with the `Co-Authored-By: Claude Opus 4.8 (1M context)` trailer.

## Dependency graph
```
W0 ─▶ W1 ─┬─▶ W2 ─┬─────────────▶ W6 ─┐
          ├─▶ W3 ─┼─▶ W5 ──────────────┼─▶ W7 ─▶ W8
          └─▶ W4 ─┘                    │
                    (W6 needs W2+W3) ───┘
```

## Checklist

### W0 — File the work-item issues, then enter Execute mode
- **Blocks:** W1–W8 · **Blocked by:** nothing
- [ ] Switch to Execute mode (all items below write files/call admin)
- [ ] Create one GitHub issue per work item W1–W8 using the payloads in "GitHub issue payloads" below (`POST api.github.com/repos/BlueAcornInc/healthspring-eds-poc/issues`)
- [ ] Record each returned issue number and replace `#Wn` cross-refs in issue bodies with the real numbers
- [ ] **Verify:** `GET issues?state=open` lists 8 new issues

### W1 — Locate the authoritative rule + confirm DOM (BLOCKING)
- **Blocks:** W2, W3, W4 · **Blocked by:** W0
- [ ] `grep -n "plan-finder" styles/styles.css blocks/hero-primary/*.css` — record which file/selector sets the section background and any existing button rule (issue #16 added a purple button rule; note its selector)
- [ ] `curl -s <preview>/index.plain.html` — record the exact wrapper nesting: which element holds the `h4` heading, which holds the ZIP `<input>`+`<button>`, which `<p>` holds the contact block
- [ ] Decide the single owning file for the card CSS (prefer `styles/styles.css` `.plan-finder-container` block if the section style already lives there)
- [ ] **Verify:** commit/PR note states the owning file + the 3 content wrappers' selectors (single source of truth for W2–W5)

### W2 — White floating card container
- **Blocks:** W6 · **Blocked by:** W1 · **Parallel with:** W3, W4
- [ ] In the owning file, add a card rule on the plan-finder inner wrapper: `background:#fff; border-radius:16px; box-shadow:0 8px 24px rgb(0 0 0 / 12%); max-width:1200px; margin-inline:auto; padding:28px 40px; box-sizing:border-box`
- [ ] Add `margin-top:-56px; position:relative; z-index:1` so the card bridges the purple→navy seam; ensure the section keeps enough bottom padding that the card doesn't clip the next section
- [ ] Override inherited white text inside the card: heading + contact `color:rgb(31,22,71)`
- [ ] **Verify (uncached):** card wrapper computed `backgroundColor === "rgb(255, 255, 255)"` AND `borderTopLeftRadius === "16px"` AND heading `color === "rgb(31, 22, 71)"`

### W3 — Horizontal 3-column layout (desktop ≥900px)
- **Blocks:** W5, W6 · **Blocked by:** W1 · **Parallel with:** W2, W4
- [ ] At `@media (width >= 900px)`, make the card inner `display:flex; align-items:center; gap:40px; justify-content:space-between` with three children: heading (col 1), ZIP+button group (col 2), contact (col 3)
- [ ] If heading/zip/contact aren't already three sibling wrappers (per W1), group them in `hero-primary.js` so flex has exactly 3 children
- [ ] **Verify:** heading, ZIP input, contact share the same top within 20px (`Math.abs(topA-topB)<20` for all pairs → `oneRow:true`)

### W4 — Control styling: button pill + ZIP width
- **Blocks:** (none) · **Blocked by:** W1 · **Parallel with:** W2, W3
- [ ] Button: `border-radius:999px; padding:12px 24px`, keep purple `#9e28b5` bg + white text; add a trailing arrow/→ SVG (reuse an existing icon or inject in `hero-primary.js`)
- [ ] ZIP input: `max-width:240px; width:100%`, keep white bg + `1px solid` border, `border-radius:6px`
- [ ] **Verify:** button computed `borderTopLeftRadius >= 20` (pill) AND ZIP input rendered width `<= 280`
- **Conflict note:** W4 and W2/W3 may edit adjacent lines in the same file — land W2/W3 first or rebase to avoid a merge conflict.

### W5 — Vertical divider between button group and contact
- **Blocks:** (none) · **Blocked by:** W3 (columns must exist)
- [ ] Add a 1px full-height rule between col 2 and col 3: `border-left:1px solid rgb(31 22 71 / 15%); padding-left:32px` on the contact column (desktop only)
- [ ] **Verify:** contact column computed `borderLeftWidth >= 1px` at ≥900px; absent/hidden at <900px

### W6 — Mobile stacking (<900px)
- **Blocks:** W7 · **Blocked by:** W2, W3
- [ ] Below 900px: card `max-width:none; margin-inline:16px; padding:20px; margin-top:-32px`; inner columns stack vertically (`flex-direction:column; align-items:flex-start`); heading/contact stay navy on white
- [ ] **Verify @390px:** card `backgroundColor` white; heading top < ZIP top < contact top; no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth + 1`)

### W7 — Lint + preview validation
- **Blocks:** W8 · **Blocked by:** W2, W3, W4, W5, W6
- [ ] `npm run lint` → exit 0
- [ ] Commit + push; confirm GitHub check-run `build` conclusion `success`
- [ ] Force code sync; confirm decompressed live CSS == `origin/main`
- [ ] Load preview at 1440px AND ~390px on a **freshly-fetched** stylesheet; screenshot-compare to source
- [ ] **Verify:** all pass on uncached preview — white bg, 16px radius, `oneRow` desktop, pill button, divider present, mobile stacks

### W8 — Publish + close issues
- **Blocks:** (none) · **Blocked by:** W7
- [ ] Publish `index` to live (`admin.hlx.page/live/...`)
- [ ] Re-confirm on live via a **no-store** fetch (avoid the cache traps hit earlier this project)
- [ ] Comment results on each W1–W8 issue and close them

## GitHub issue payloads (file these in W0 — one per work item)
Each issue: title as shown; body = the item's **Blocks/Blocked by + steps + Verify** from the checklist, plus the "Shared constraints" and "Ground-truth reference values" sections appended. Labels: `plan-finder`, `design-fidelity` (+ `mobile` for W6). Cross-references (`#W2` etc.) get rewritten to real issue numbers after creation.

- [ ] **#W1** — "[Plan-finder] Locate owning CSS rule + confirm DOM structure"
- [ ] **#W2** — "[Plan-finder] White floating card container"
- [ ] **#W3** — "[Plan-finder] Horizontal 3-column desktop layout"
- [ ] **#W4** — "[Plan-finder] Button pill + ZIP input width"
- [ ] **#W5** — "[Plan-finder] Vertical divider between button and contact"
- [ ] **#W6** — "[Plan-finder] Mobile stacking (<900px)"
- [ ] **#W7** — "[Plan-finder] Lint + preview validation"
- [ ] **#W8** — "[Plan-finder] Publish + close"

> **Note:** This plan is analysis-only. Filing the issues (W0) and executing W1–W8 (CSS/JS edits, lint, push, publish) all require **Execute mode** — plan mode cannot POST to GitHub or modify files.
