/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta. Base: columns.
 * Source: https://www.healthspring.com/
 *   (#content > div.grid-container--white...--padding-y-48.grid-container--fullwidth)
 * Generated: 2026-09-03
 *
 * Library convention (Columns): first row is block name; subsequent rows hold
 * one cell per visual column. This "questions" CTA row is two columns:
 *  - Left: heading ("Have questions?")
 *  - Right: CTA link
 */
export default function parse(element, { document }) {
  const row =
    element.querySelector('.grid-container--flex-direction-row') || element;

  const heading = row.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');

  // CTA anchor. Strip the trailing custom <leaf-icon> so the link text is clean
  // while preserving the href.
  let cta = null;
  const sourceLink = row.querySelector('a[href]');
  if (sourceLink) {
    cta = document.createElement('a');
    cta.href = sourceLink.getAttribute('href');
    cta.textContent = (sourceLink.textContent || '').trim();
  }

  // Empty-block guard.
  if (!heading && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row, two columns: heading | CTA.
  cells.push([heading || '', cta || '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
