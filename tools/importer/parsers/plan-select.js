/* eslint-disable */
/* global WebImporter */
/**
 * Parser for plan-select. Base: cards.
 * Source: https://www.healthspring.com/about-us
 *   (#content > div:nth-of-type(3) — the "Explore Our Plans" navigator)
 * Generated: 2026-09-03
 *
 * A white section with a section heading ("Explore Our Plans") + intro
 * paragraph, followed by a 4-up grid of <leaf-card variant="image"> plan
 * navigator cards. Each card is a photo above a linked plan title.
 *
 * The card title + link render into the source's shadow DOM, so the scraped
 * markup only has the <img>. Titles/links are supplied here in source order
 * (confirmed from the live page). The heading + intro are kept as default
 * content ahead of the block; each card row = [ image | linked title ].
 */
export default function parse(element, { document }) {
  // Section heading + intro (kept as default content ahead of the block).
  const heading = element.querySelector('h1, h2, h3');
  const intro = element.querySelector('p');

  const cards = Array.from(element.querySelectorAll('leaf-card'));
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const CARD_LINKS = [
    { title: 'Medicare Advantage (Medicare Part C)', href: '/medicare/medicare-advantage' },
    { title: 'Prescription Drug Plans (Medicare Part D)', href: '/medicare/part-d' },
    { title: 'Medicare Supplement Plans', href: '/medicare/medicare-supplement' },
    { title: 'Supplemental Health Plans', href: '/supplemental' },
  ];

  const cells = [];
  cards.forEach((card, i) => {
    const image = card.querySelector('picture img, img');

    // Linked title: light-DOM <a> if present, else supplied in source order.
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
    h.textContent = (heading.textContent || '').trim();
    output.push(h);
  }
  if (intro && /\S/.test(intro.textContent)) {
    const p = document.createElement('p');
    p.textContent = (intro.textContent || '').replace(/\s+/g, ' ').trim();
    output.push(p);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'plan-select', cells });
  output.push(block);

  element.replaceWith(...output);
}
