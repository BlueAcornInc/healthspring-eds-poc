/* eslint-disable */
/* global WebImporter */
/**
 * Parser for about-hero. Base: hero (primary variant, navy band).
 * Source: https://www.healthspring.com/about-us (#healthspring-about-us-hero)
 * Generated: 2026-09-03
 *
 * The About Us hero is a full-bleed "primary" leaf-hero on a NAVY (#1F1647)
 * band: a single baked composition image (navy "spring" loops + lifestyle
 * photo) with the H1 + a one-line subtitle overlaid on the left. It is
 * structurally the same layout as the homepage hero-primary but on navy rather
 * than purple, so it is its own variant (mirrors the medicare-hero precedent).
 *
 * Both the H1 and the subtitle paragraph live in the hero's LIGHT DOM, so they
 * scrape cleanly. The image sits in a .leaf-c-leaf-hero__image-container.
 *
 * Block table (1 column, 2 rows):
 *   Row 1: hero background/composition image.
 *   Row 2: H1 title + subtitle paragraph.
 */
export default function parse(element, { document }) {
  // Row 1: background/hero image.
  const image = element.querySelector('.leaf-c-leaf-hero__image-container img, picture img, img');

  // Row 2 content: heading + subtitle.
  const heading = element.querySelector('h1, .leaf-c-leaf-hero__heading h1, [class*="heading"] h1');
  const subtitle = element.querySelector('.leaf-c-leaf-hero__content p, [class*="content"] p, p');

  // Empty-block guard.
  if (!heading && !subtitle && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (image) cells.push([image]);

  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = (heading.textContent || '').trim();
    contentCell.push(h1);
  }
  if (subtitle && /\S/.test(subtitle.textContent)) {
    const p = document.createElement('p');
    p.textContent = (subtitle.textContent || '').replace(/\s+/g, ' ').trim();
    contentCell.push(p);
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'about-hero', cells });
  element.replaceWith(block);
}
