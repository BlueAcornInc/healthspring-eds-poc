/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base: hero.
 * Source: https://www.healthspring.com/ (#content > div.grid-container:nth-of-type(7))
 * Generated: 2026-09-03
 *
 * Library convention (Hero): 1 column, 3 rows (name / bg image / content).
 * This promo has no background image, so only the content row is emitted.
 * Content: heading, body paragraphs, and CTAs. Source CTAs use a custom
 * <leaf-button href> element which must be converted to a real anchor so the
 * link is preserved in the block table.
 */
export default function parse(element, { document }) {
  const promo = element.querySelector('leaf-promo') || element;

  const heading = promo.querySelector('h1, h2, h3, h4, [class*="heading"]');

  // Body paragraphs (skip empty ones).
  const paragraphs = Array.from(promo.querySelectorAll('p')).filter(
    (p) => /\S/.test(p.textContent),
  );

  // CTAs: real anchors + custom <leaf-button href> converted to anchors.
  const ctas = [];
  promo.querySelectorAll('leaf-button[href]').forEach((btn) => {
    const a = document.createElement('a');
    a.href = btn.getAttribute('href');
    a.textContent = (btn.textContent || '').trim();
    if (a.textContent) ctas.push(a);
  });
  Array.from(promo.querySelectorAll('a[href]')).forEach((a) => {
    if (/\S/.test(a.textContent)) ctas.push(a);
  });

  // Empty-block guard.
  if (!heading && paragraphs.length === 0 && ctas.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content cell holding all elements (hero is 1-column).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  contentCell.push(...ctas);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
