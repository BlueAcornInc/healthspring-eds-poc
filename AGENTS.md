# AGENTS.md

Edge Delivery Services. Read a block first. Omissions are in the repo or known.

## Avoid
- `scripts/aem.js` is vendored. Never edit.
- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- `buildAutoBlocks` rewrites content before your block runs.
- Authors omit and add cells. Decorate defensively.
- No build step; devDependencies only.
- Scope CSS to `.blockname`; `-wrapper`/`-container` are section classes.
- `fragment/fragment.js` is the only cross-block import. Otherwise use `/scripts/`.

## Outdated
- `fstab.yaml`, `helix-query.yaml`, `paths.json` are retired. Config lives at tools.aem.live.

## Remember
- `npx -y @adobe/aem-cli up`: local code, previewed content.
- Merging `main` ships code; content publishes separately.
- A PR without a `{branch}--{repo}--{owner}.aem.page/{path}` link is rejected.
- All committed files are served. Use `.hlxignore`.
- Skills: `/plugin marketplace add adobe/skills`, then `aem-edge-delivery-services` (24 skills, incl. `docs-search`).

## Delegate
- Routine mechanical work — lint, DOM/computed-style measurements, greps, repetitive edits, curl code-sync/publish, cache-disabled render checks — goes to a fast/light subagent (Haiku via the Agent `model` param), in parallel when steps are independent. This is the DEFAULT, not an ask-each-time.
- Keep on the heavy model only what you'd have to re-verify anyway: root-cause diagnosis and deciding the minimal correct fix. Don't burn the expensive model on go-do-X-and-report-back.

## Debugging (learned the hard way)
- DOM/JS bug? Reproduce on localhost + READ THE BROWSER CONSOLE before deploy/theorize. Local loop = seconds; deploy loop = minutes and lies (caching).
- Section-style classes (`.x-container` from Section Metadata) and block classes (`.blockname`, esp. widgets fetching remote HTML) apply ASYNC. Don't anchor logic on them in `decorateMain`/eager — they may not exist yet. Anchor on authored content (heading text, etc.). Re-run in `loadLazy` after `await loadSections(main)` with an idempotent guard.
- "Live not updating" is almost always browser/CDN cache of the ES module or gzip'd CSS — NOT a bad deploy. Prove server truth with `curl -s --compressed <url>` + grep (compare decompressed bytes, never raw transfer size). Verify render with cache OFF: Playwright CDP `Network.setCacheDisabled` then `goto(url+'?nocache='+Date.now())`. Same illusion hit the footer via stale aemcoder-proxy / DA-source-API reads.
- org = `BlueAcornInc`, site = `blueacorninc` (lowercase in URLs); admin.hlx.page + admin.da.live authorize separately.
