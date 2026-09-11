/* eslint-disable */
/* global WebImporter */
/**
 * Parser for plan-select (Explore Our Plans and Policies variant).
 * Base: cards. Reuses the existing blocks/plan-select block + CSS.
 * Source: https://www.healthspring.com/medicare/understanding-medicare/choosing-a-medicare-plan
 *   (#content > div:nth-of-type(7) — "Explore Our Plans and Policies")
 * Generated: 2026-09-03
 *
 * A white section: an H4 section heading, a 3-up grid of <leaf-card variant="image">
 * plan navigator cards (photo above a linked plan title), and a trailing
 * "Back to Understanding Medicare" link.
 *
 * The card title + link render into the source's shadow DOM (only the <img>
 * scrapes in the light DOM), so titles/links are supplied here in source order
 * (confirmed from the live page). Heading + back-link are kept as default content
 * around the block; each card row = [ image | linked title ].
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, h3, h4');

  const cards = Array.from(element.querySelectorAll('leaf-card'));
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const CARD_LINKS = [
    { title: 'Medicare Advantage Plans', href: '/medicare/medicare-advantage' },
    { title: 'Medicare Supplement Policies', href: '/medicare/medicare-supplement' },
    { title: 'Prescription Drug Plans', href: '/medicare/part-d' },
  ];

  const cells = [];
  cards.forEach((card, i) => {
    const image = card.querySelector('picture img, img');

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
    const h = document.createElement('h2');
    h.textContent = (heading.textContent || '').replace(/\s+/g, ' ').trim();
    output.push(h);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'plan-select', cells });
  output.push(block);

  // Trailing "Back to Understanding Medicare" link -> default content below the grid.
  const backLink = element.querySelector('a[href]');
  if (backLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = backLink.getAttribute('href');
    a.textContent = (backLink.textContent || '').replace(/\s+/g, ' ').trim();
    if (a.textContent) {
      p.append(a);
      output.push(p);
    }
  }

  element.replaceWith(...output);
}
