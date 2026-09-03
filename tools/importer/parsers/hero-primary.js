/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-primary. Base: hero.
 * Source: https://www.healthspring.com/ (#healthspring-index-hero)
 * Generated: 2026-09-03
 *
 * Library convention (Hero): 1 column, 3 rows.
 *  - Row 1: block name
 *  - Row 2: Background Image (optional)
 *  - Row 3: Title (heading) + Subheading + optional CTA
 */
export default function parse(element, { document }) {
  // Row 2: background/hero image. Source keeps the <img> inside a <picture>.
  const image = element.querySelector('.leaf-c-leaf-hero__image-container img, picture img, img');

  // Row 3 content: heading, body copy, and any inline CTA links.
  const heading = element.querySelector(
    '.leaf-c-leaf-hero__heading h1, .leaf-c-leaf-hero__heading h2, h1, h2, [class*="heading"] h1',
  );
  const paragraphs = Array.from(
    element.querySelectorAll('.leaf-c-leaf-hero__content p, [class*="content"] p'),
  );

  // Fallback for a single body paragraph if content wrapper class differs.
  if (paragraphs.length === 0) {
    const p = element.querySelector('p');
    if (p) paragraphs.push(p);
  }

  // Empty-block guard: bail if no meaningful content extracted.
  if (!heading && paragraphs.length === 0 && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (image) cells.push([image]);

  // Row 3: title + subheading(s) + inline CTAs (single cell holding all elements).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-primary', cells });
  element.replaceWith(block);
}
