/* eslint-disable */
/* global WebImporter */
/**
 * Parser for widget. Base: widget (special-purpose LOCAL block — no library convention).
 * Source: https://www.healthspring.com/
 *   (#content > div.grid-container.grid-container--navy...--fullwidth)
 * Generated: 2026-09-03
 *
 * The `widget` block (blocks/widget/widget.js) is authored as a LINK whose href
 * points to a widget under `/widgets/`. At runtime the block fetches that
 * widget's HTML/CSS/JS and REPLACES its own innerHTML. The source here is the
 * dynamically-hydrated Medicare plan-finder (astro-island / zip + county form),
 * which cannot be imported as static content — it is backed by a captured
 * static snapshot at `/widgets/plan-finder.html`.
 *
 * Because the widget block replaces its innerHTML on load, the block table holds
 * ONLY the widget link. The surrounding sticky-banner text (the "Shop and
 * Compare Plans" heading and the phone callout) is section content and is
 * preserved as default content around the block so it still renders — it must
 * NOT go inside the block (it would be wiped at runtime).
 */
export default function parse(element, { document }) {
  const banner = element.querySelector('leaf-sticky-banner') || element;

  // Section heading above the widget (kept as default content).
  const heading = banner.querySelector('h1, h2, h3, h4, h5, h6');

  // Phone / hours callout below the widget (kept as default content).
  // It is the paragraph that is NOT inside the interactive plan-finder form.
  const planFinder = banner.querySelector('.medicare-plan-finder, astro-island');
  const callout = Array.from(banner.querySelectorAll('p')).find(
    (p) => /\S/.test(p.textContent) && !(planFinder && planFinder.contains(p)),
  );

  // Build the authored widget link -> static snapshot of the plan-finder.
  const link = document.createElement('a');
  link.href = '/widgets/plan-finder.html';
  link.textContent = 'Plan Finder';

  // Widget block: single cell containing the link (widget.js reads a[href]).
  const cells = [[link]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'widget', cells });

  // Assemble output: heading (default content) + widget block + callout (default content).
  const output = [];
  if (heading) output.push(heading);
  output.push(block);
  if (callout) output.push(callout);

  element.replaceWith(...output);
}
