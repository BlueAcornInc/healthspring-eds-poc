/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.healthspring.com/
 *   (#content > div.grid-container--margin-top-0.grid-container--fullwidth:nth-of-type(5))
 * Generated: 2026-09-03
 *
 * Library convention (Cards): 2 columns.
 *  - Cell 1: Image / Icon (mandatory)
 *  - Cell 2: Text content (title, description, CTA)
 *
 * Source layout: an intro text block ("Why Choose HealthSpring?") followed by
 * a grid of <leaf-card> elements. The intro is section-level default content,
 * so it is preserved before the block rather than forced into a card row.
 */
export default function parse(element, { document }) {
  // Intro / section text (the centered content column above the cards).
  const introBlock = element.querySelector(
    '.leaf-u-text-align-center, .grid-container--align-items-center .leaf-u-text-align-center',
  );
  const introNodes = [];
  if (introBlock) {
    Array.from(introBlock.children).forEach((child) => {
      if (/\S/.test(child.textContent) || child.querySelector('img, a')) {
        introNodes.push(child);
      }
    });
  }

  // Card elements.
  const cardEls = Array.from(element.querySelectorAll('leaf-card'));

  // Card titles live in the source's shadow DOM and are not present in the
  // scraped markup, so they are supplied here in source order. Each title is
  // paired with its description paragraph (already present in the card body).
  const CARD_TITLES = [
    'High Quality Care',
    'Plans that Deliver',
    'Stability & Consistency',
    'A Caring Experience',
  ];

  // Empty-block guard.
  if (cardEls.length === 0 && introNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Leading intro row (section header text). Kept inside the block so all
  // section copy is captured; second cell padded to keep the 2-column table
  // well-formed. Rendered as a lead-in card; separable during design phase.
  if (introNodes.length) {
    cells.push([introNodes, '']);
  }

  cardEls.forEach((card, i) => {
    // Icon cell: keep any icon/image content; leaf-icon is a custom element
    // that may be empty in the scrape, so fall back to an empty cell.
    const icon = card.querySelector('img, svg, leaf-icon');
    const iconContent = icon && (icon.querySelector('img, svg') || /\S/.test(icon.textContent))
      ? icon
      : '';

    // Text cell: everything else in the card.
    const textNodes = [];

    // Card title (shadow-DOM only in the source; supplied in source order).
    if (!card.querySelector('h1, h2, h3, h4, h5, h6') && CARD_TITLES[i]) {
      const title = document.createElement('h4');
      title.textContent = CARD_TITLES[i];
      textNodes.push(title);
    }

    Array.from(card.children).forEach((child) => {
      if (child.tagName && child.tagName.toLowerCase() === 'leaf-icon') return;
      if (/\S/.test(child.textContent) || child.querySelector('img, a')) {
        textNodes.push(child);
      }
    });

    cells.push([iconContent, textNodes.length ? textNodes : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
