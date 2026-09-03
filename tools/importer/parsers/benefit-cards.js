/* eslint-disable */
/* global WebImporter */
/**
 * Parser for benefit-cards. Base: cards.
 * Source: https://www.healthspring.com/medicare/medicare-advantage
 *   (#content > div:nth-of-type(3) — the value-prop grid)
 * Generated: 2026-09-03
 *
 * The source is a 3-column grid of <leaf-card variant="value-prop"> elements.
 * Each card has: a heading (light-DOM <h3 slot="heading">), a description
 * paragraph (<div slot="content">), and optionally a CTA link (<div slot="cta">).
 * There are no icons/images.
 *
 * Emitted as a single-column cards block: each card row = one cell holding the
 * heading + description (+ CTA). cards-feature-style decoration is not reused
 * because that variant forces an icon column; benefit-cards is text-only.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('leaf-card'));

  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Card headings render into the source's shadow DOM, so the rendered snapshot
  // used by the importer lacks the light-DOM <h3 slot="heading">. They are
  // supplied here in source order (confirmed from the live page).
  const CARD_TITLES = [
    'All-in-one coverage',
    'Team-based support',
    'Low—or no—monthly premiums',
    'Flexible plan options',
    'Extra benefits included',
    'Part B Giveback',
  ];

  const cells = [];
  cards.forEach((card, i) => {
    const cellContent = [];

    // Heading (slot="heading" if present, else supplied by source order).
    const heading = card.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
    const titleText = heading ? (heading.textContent || '').trim() : CARD_TITLES[i];
    if (titleText) {
      const h = document.createElement('h3');
      h.textContent = titleText;
      cellContent.push(h);
    }

    // Description paragraph(s) (slot="content").
    card.querySelectorAll('[slot="content"]').forEach((sc) => {
      sc.querySelectorAll('p').forEach((p) => {
        if (/\S/.test(p.textContent)) cellContent.push(p);
      });
    });

    // CTA link(s) (slot="cta" or inline links inside a cta container).
    card.querySelectorAll('[slot="cta"] a[href]').forEach((a) => {
      const p = document.createElement('p');
      p.append(a);
      cellContent.push(p);
    });

    if (cellContent.length) cells.push([cellContent]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'benefit-cards', cells });
  element.replaceWith(block);
}
