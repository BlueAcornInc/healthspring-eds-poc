/* eslint-disable */
/* global WebImporter */
/**
 * Parser for promo-band. Base: hero.
 * Source: https://www.healthspring.com/medicare/medicare-advantage
 *   - #content > div:nth-of-type(5)  "24/7 Access to your plan" (navy band)
 *   - #content > div:nth-of-type(8)  "When are you eligible..."  (purple band)
 * Generated: 2026-09-03
 *
 * A full-width coloured band containing a single <leaf-promo>: heading, body
 * (paragraphs and/or a bulleted list), and a CTA. CTAs are authored either as a
 * <leaf-button href> (converted to a real anchor) or an inline <a href>. Section
 * background colour is applied separately via Section Metadata.
 *
 * Single content cell holds all elements (1-column, hero-like).
 */
export default function parse(element, { document }) {
  const promo = element.querySelector('leaf-promo') || element;

  const contentCell = [];

  // Heading.
  const heading = promo.querySelector('[slot="heading"], h1, h2, h3, h4, h5, h6');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = (heading.textContent || '').trim();
    contentCell.push(h);
  }

  // Body: paragraphs that sit directly in a content slot (not inside the list).
  const list = promo.querySelector('ul[slot="content"], ul');
  promo.querySelectorAll('div[slot="content"] > p, [slot="content"] p').forEach((p) => {
    if (list && list.contains(p)) return;
    if (!/\S/.test(p.textContent)) return;
    // Skip the CTA paragraph (a lone link) — handled below.
    if (p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim()) return;
    contentCell.push(p);
  });

  // Bulleted list (e.g. eligibility criteria).
  if (list) {
    const ul = document.createElement('ul');
    list.querySelectorAll('li').forEach((li) => {
      const text = (li.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;
      const newLi = document.createElement('li');
      newLi.textContent = text;
      ul.append(newLi);
    });
    if (ul.childElementCount) contentCell.push(ul);
  }

  // CTAs: <leaf-button href> converted to anchors + standalone content links.
  const ctas = [];
  promo.querySelectorAll('leaf-button[href]').forEach((btn) => {
    const a = document.createElement('a');
    a.href = btn.getAttribute('href');
    a.textContent = (btn.textContent || '').replace(/\s+/g, ' ').trim();
    if (a.textContent) ctas.push(a);
  });
  // Inline "Learn more" links that are the sole content of their paragraph.
  promo.querySelectorAll('div[slot="content"] > p > a[href]').forEach((a) => {
    if (a.closest('li')) return;
    if (a.parentElement.textContent.trim() === a.textContent.trim()) {
      ctas.push(a);
    }
  });
  ctas.forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    contentCell.push(p);
  });

  if (contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-band', cells: [[contentCell]] });
  element.replaceWith(block);
}
