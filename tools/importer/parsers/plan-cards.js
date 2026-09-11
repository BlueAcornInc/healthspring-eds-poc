/* eslint-disable */
/* global WebImporter */
/**
 * Parser for plan-cards. Base: cards.
 * Source: https://www.healthspring.com/medicare/medicare-advantage
 *   (#content > div:nth-of-type(11) — "Let's keep shopping..." dark band)
 * Generated: 2026-09-03
 *
 * A dark band with a section heading and a grid of interactive image cards
 * (<leaf-card variant="image">). Each card is a large photo with a linked title
 * overlaid. The heading is kept as leading default content before the block;
 * each card row = [ image | linked title ].
 */
export default function parse(element, { document }) {
  // Section heading (kept as default content ahead of the block).
  const heading = element.querySelector(':scope > div > h1, :scope > div > h2, :scope > div > h3, h3');

  const cards = Array.from(element.querySelectorAll('leaf-card'));
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // The card title + link render into the source's shadow DOM, so the rendered
  // snapshot lacks them. Supplied here in source order (confirmed from the live
  // page): the single "keep shopping" card links to Medicare Part D.
  const CARD_LINKS = [
    { title: 'Medicare Part D', href: '/medicare/part-d' },
  ];

  const cells = [];
  cards.forEach((card, i) => {
    const image = card.querySelector('picture img, img');

    // Linked title (light-DOM <h3 slot="heading"><a href> if present, else supplied).
    const titleLink = card.querySelector('[slot="heading"] a[href], h1 a, h2 a, h3 a, a[href]');
    const fallback = CARD_LINKS[i];
    const textNodes = [];
    if (titleLink || fallback) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.href = titleLink ? titleLink.getAttribute('href') : fallback.href;
      a.textContent = titleLink
        ? (titleLink.textContent || '').replace(/\s+/g, ' ').trim()
        : fallback.title;
      h.append(a);
      textNodes.push(h);
    }

    cells.push([image || '', textNodes.length ? textNodes : '']);
  });

  const output = [];
  if (heading) {
    const h = document.createElement('h3');
    h.textContent = (heading.textContent || '').trim();
    output.push(h);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'plan-cards', cells });
  output.push(block);

  element.replaceWith(...output);
}
