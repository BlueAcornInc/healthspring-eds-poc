/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://www.healthspring.com/
 *   (#content > div.grid-container--navy...:nth-of-type(3))
 * Generated: 2026-09-03
 *
 * Library convention (Columns): first row is block name; subsequent rows
 * hold one cell per visual column. Here the layout is two columns:
 *  - Left: text block (heading, copy, sub-headings, links)
 *  - Right: media (image)
 */
export default function parse(element, { document }) {
  // The inner flex row holds the column sub-containers.
  const row =
    element.querySelector('.grid-container--flex-direction-row') || element;

  // Text column: the wider content column (col-md-7). Fall back to the first
  // grid column that actually contains a heading.
  let textCol = row.querySelector(':scope > .col-md-7');
  // Media column: the column whose only meaningful content is an image.
  let mediaCol = row.querySelector(':scope > .col-md-4');

  if (!textCol || !mediaCol) {
    const cols = Array.from(row.querySelectorAll(':scope > div'));
    cols.forEach((col) => {
      const hasImg = col.querySelector('picture, img');
      const hasText = col.querySelector('h1, h2, h3, h4, h5, h6, p');
      if (!mediaCol && hasImg && !hasText) mediaCol = col;
      else if (!textCol && hasText) textCol = col;
    });
  }

  // Extract the image element itself so nested empty picture wrappers are kept.
  const image = mediaCol ? mediaCol.querySelector('picture, img') : null;

  // Gather the text column's meaningful content nodes (exclude empty spacer divs).
  const textNodes = [];
  if (textCol) {
    Array.from(textCol.children).forEach((child) => {
      const hasContent =
        child.querySelector('h1,h2,h3,h4,h5,h6,p,a,hr,img') ||
        /\S/.test(child.textContent) ||
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'HR'].includes(child.tagName);
      if (hasContent) textNodes.push(child);
    });
  }

  // Empty-block guard.
  if (textNodes.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row with two columns: text | media.
  cells.push([textNodes.length ? textNodes : '', image || '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
