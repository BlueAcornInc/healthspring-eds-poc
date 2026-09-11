/* eslint-disable */
/* global WebImporter */
/**
 * Parser for promo-card. Base: hero.
 * Source: https://www.healthspring.com/medicare/understanding-medicare/choosing-a-medicare-plan
 *   (#content > div:nth-of-type(3) — the inline "Need Medicare Coverage?" card)
 * Generated: 2026-09-03
 *
 * A single inline <leaf-promo variant="simple" color="dark-blue"> that renders
 * as a NAVY rounded card sitting inside the article measure (NOT a full-bleed
 * band): a decorative stethoscope icon (custom <leaf-icon>, does not scrape) sits
 * above an H3 heading, a body paragraph, and a single "Explore HealthSpring
 * Medicare" CTA link. Text is white on navy.
 *
 * Emitted as a single-cell block (heading + body + CTA link). The navy card
 * treatment + white pill/arrow CTA are supplied by blocks/promo-card/promo-card.css.
 */
export default function parse(element, { document }) {
  const promo = element.querySelector('leaf-promo') || element;

  const contentCell = [];

  // Heading.
  const heading = promo.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
  if (heading) {
    const h = document.createElement('h3');
    h.textContent = (heading.textContent || '').replace(/\s+/g, ' ').trim();
    contentCell.push(h);
  }

  // Body paragraph(s) inside the content slot (not the CTA link).
  promo.querySelectorAll('div[slot="content"] p, [slot="content"] p').forEach((p) => {
    if (!/\S/.test(p.textContent)) return;
    const np = document.createElement('p');
    np.textContent = (p.textContent || '').replace(/\s+/g, ' ').trim();
    contentCell.push(np);
  });

  // CTA link (in the cta slot). Strip the trailing custom <leaf-icon>.
  const cta = promo.querySelector('[slot="cta"] a[href], a[href]');
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href');
    a.textContent = (cta.textContent || '').replace(/\s+/g, ' ').trim();
    if (a.textContent) {
      p.append(a);
      contentCell.push(p);
    }
  }

  if (contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-card', cells: [[contentCell]] });
  element.replaceWith(block);
}
